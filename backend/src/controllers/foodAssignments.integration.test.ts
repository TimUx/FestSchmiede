import { randomUUID } from 'node:crypto';
import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { Prisma, StatusCode } from '@prisma/client';
import { config } from '../config';
import { prisma } from '../config/database';
import { authenticate, loadUser, requireStaffPermission } from '../middleware/auth';
import { errorHandler } from '../middleware/errorHandler';
import { validateBody } from '../middleware/validation';
import { sharedTenantContext } from '../platform/tenant/sharedTenantContext';
import { DEFAULT_TENANT_SETTINGS, type TenantContextData } from '../platform/tenant/types';
import { foodItemRepository, orderRepository } from '../repositories';
import { setEventFoodAssignmentsSchema } from '../validation/schemas';
import { foodItemController } from './foodItemController';
import { emitOrderUpdate } from '../socket';
import { hookSystem } from '../platform/bootstrap';
import { CORE_HOOKS } from '../platform/types';
import { realtimeSyncService } from '../services/realtimeSyncService';
import { foodItemService } from '../services/foodItemService';
import { orderService } from '../services/orderService';

vi.mock('../config/database', async () => {
  const { PrismaClient } = await import('@prisma/client');
  const { PrismaPg } = await import('@prisma/adapter-pg');
  return {
    prisma: new PrismaClient({
      adapter: new PrismaPg({ connectionString: process.env.FOOD_ASSIGNMENT_TEST_DATABASE_URL }),
    }),
  };
});
vi.mock('../socket', () => ({
  emitFoodItemsUpdate: vi.fn(), emitOrderUpdate: vi.fn(),
}));
vi.mock('../platform/bootstrap', () => ({
  hookSystem: { emitAsync: vi.fn() },
  settingsService: { getDecryptedValues: vi.fn().mockResolvedValue({}) },
}));
vi.mock('../../modules/payment/repositories/paymentRepository', () => ({
  paymentRepository: {
    findByResource: vi.fn().mockResolvedValue(null),
    findLatestByResources: vi.fn().mockResolvedValue(new Map()),
  },
}));

describe.skipIf(!process.env.FOOD_ASSIGNMENT_TEST_DATABASE_URL)('food assignment removal with PostgreSQL', () => {
  const tenantId = randomUUID();
  const otherTenantId = randomUUID();
  const tenantIds = [tenantId, otherTenantId];
  const context = {
    id: tenantId, name: 'Assignment test', slug: tenantId, subdomain: tenantId,
    status: 'ACTIVE', settings: DEFAULT_TENANT_SETTINGS,
  } as TenantContextData;
  const run = <T>(fn: () => T) => sharedTenantContext.run(context, fn);
  const app = express();
  let eventId: string;
  let otherEventId: string;
  let foreignEventId: string;
  let foodId: string;
  let keptId: string;
  let adminToken: string;
  let staffToken: string;
  let foreignToken: string;
  let adminId: string;
  let sequence = 0;

  app.use(express.json());
  app.use((_req, _res, next) => run(next));
  app.put('/api/staff/events/:eventId/food-item-assignments',
    authenticate, loadUser, requireStaffPermission('food.edit'),
    validateBody(setEventFoodAssignmentsSchema), foodItemController.setEventAssignments);
  app.use(errorHandler);

  const save = (ids: string[], token = adminToken, confirmRemoval = false, targetEvent = eventId) =>
    request(app).put(`/api/staff/events/${targetEvent}/food-item-assignments`)
      .set('Authorization', `Bearer ${token}`).send({ foodItemIds: ids, confirmRemoval });

  const createOrder = (status: StatusCode, withKeptItem = true, targetEvent = eventId) => prisma.order.create({
    data: {
      tenantId, eventId: targetEvent, source: 'CASHIER', status, totalPrice: withKeptItem ? 14.3 : 9.9,
      lookupToken: randomUUID(), orderNumber: ++sequence, orderDate: new Date('2030-07-01'),
      items: {
        create: [
          { foodItemId: foodId, quantity: 2, unitPrice: 4.95, lineTotal: 9.9 },
          ...(withKeptItem ? [{ foodItemId: keptId, quantity: 2, unitPrice: 2.2, lineTotal: 4.4 }] : []),
        ],
      },
    },
  });

  beforeAll(async () => {
    await prisma.tenant.createMany({
      data: tenantIds.map((id) => ({ id, name: 'Assignment test', slug: id, subdomain: id })),
    });
    const makeEvent = (owner: string) => prisma.event.create({
      data: { tenantId: owner, name: 'Test event', date: new Date('2030-07-01'), startTime: '10:00', endTime: '22:00' },
    });
    eventId = (await makeEvent(tenantId)).id;
    otherEventId = (await makeEvent(tenantId)).id;
    foreignEventId = (await makeEvent(otherTenantId)).id;
    foodId = (await prisma.foodItem.create({ data: { tenantId, name: 'Bratwurst', price: 99 } })).id;
    keptId = (await prisma.foodItem.create({ data: { tenantId, name: 'Wasser', price: 88 } })).id;
    const makeUser = async (owner: string, roleName: 'ADMIN' | 'STAFF') => {
      const role = await prisma.role.upsert({ where: { name: roleName }, create: { name: roleName }, update: {} });
      const user = await prisma.user.create({
        data: { tenantId: owner, firstName: 'Test', lastName: roleName, roleId: role.id, permissions: ['food.edit'] },
      });
      // The persisted role must override a forged ADMIN claim.
      const token = jwt.sign({ userId: user.id, tenantId: owner, role: 'ADMIN', scope: 'tenant' }, config.jwt.secret);
      return { user, token };
    };
    const admin = await makeUser(tenantId, 'ADMIN');
    adminId = admin.user.id;
    adminToken = admin.token;
    staffToken = (await makeUser(tenantId, 'STAFF')).token;
    foreignToken = (await makeUser(otherTenantId, 'ADMIN')).token;
  });

  beforeEach(async () => {
    vi.clearAllMocks();
    await prisma.order.deleteMany({ where: { tenantId: { in: tenantIds } } });
    await prisma.eventFoodItem.deleteMany({ where: { tenantId: { in: tenantIds } } });
    await prisma.eventFoodItem.createMany({
      data: [eventId, otherEventId].flatMap((id) => [foodId, keptId].map((foodItemId) => ({
        tenantId, eventId: id, foodItemId,
      }))),
    });
  });

  afterAll(async () => {
    await prisma.order.deleteMany({ where: { tenantId: { in: tenantIds } } });
    await prisma.event.deleteMany({ where: { tenantId: { in: tenantIds } } });
    await prisma.tenant.deleteMany({ where: { id: { in: tenantIds } } });
    await prisma.$disconnect();
  });

  it('requires explicit admin confirmation and leaves every record intact on refusal', async () => {
    const order = await createOrder('NEW');
    expect((await save([keptId])).status).toBe(409);
    expect((await save([keptId], staffToken, true)).status).toBe(403);
    expect(await prisma.orderItem.count({ where: { orderId: order.id } })).toBe(2);
    expect(await prisma.eventFoodItem.count({ where: { eventId, foodItemId: foodId } })).toBe(1);
    expect(emitOrderUpdate).not.toHaveBeenCalled();
  });

  it('removes only matching open positions, preserves historical orders, and scopes corrections to one event', async () => {
    const orders = await Promise.all(['NEW', 'IN_PROGRESS', 'READY', 'PICKED_UP', 'CANCELLED'].map(
      (status) => createOrder(status as StatusCode)
    ));
    const otherOrder = await createOrder('NEW', true, otherEventId);
    const snapshot = await run(() => realtimeSyncService.syncEventOrders(eventId, undefined, false));
    expect((await save([keptId], adminToken, true)).status).toBe(200);
    const refreshed = await run(() => realtimeSyncService.syncEventOrders(eventId, undefined, false, snapshot.etag));
    expect(refreshed.changed).toBe(true);
    expect(refreshed.data?.find((order) => order.id === orders[0].id)?.totalPrice).toBe(4.4);
    for (const [index, order] of orders.entries()) {
      const updated = await prisma.order.findUniqueOrThrow({ where: { id: order.id }, include: { items: true } });
      expect(updated.status).toBe(order.status);
      expect(Number(updated.totalPrice)).toBe(index < 3 ? 4.4 : 14.3);
      expect(updated.items.map((item) => item.foodItemId).sort())
        .toEqual(index < 3 ? [keptId] : [foodId, keptId].sort());
    }
    expect(Number((await prisma.order.findUniqueOrThrow({ where: { id: otherOrder.id } })).totalPrice)).toBe(14.3);
    expect(await prisma.eventFoodItem.count({ where: { eventId: otherEventId, foodItemId: foodId } })).toBe(1);
    expect(emitOrderUpdate).toHaveBeenCalledTimes(3);
  });

  it('cancels empty orders atomically and emits the existing cancellation hooks', async () => {
    const order = await createOrder('READY', false);
    expect((await save([keptId], adminToken, true)).status).toBe(200);
    const updated = await prisma.order.findUniqueOrThrow({
      where: { id: order.id }, include: { items: true, statusHistory: true },
    });
    expect(updated.status).toBe('CANCELLED');
    expect(updated.cancelledAt).toBeInstanceOf(Date);
    expect(Number(updated.totalPrice)).toBe(0);
    expect(updated.items).toEqual([]);
    expect(updated.statusHistory).toEqual([expect.objectContaining({ status: 'CANCELLED', changedBy: adminId })]);
    expect(hookSystem.emitAsync).toHaveBeenCalledWith(
      CORE_HOOKS.ORDER_CANCELLED, expect.objectContaining({ id: order.id, initiatedByStaff: true })
    );
  });

  it('requires confirmation even when only picked-up or cancelled orders reference the article', async () => {
    await createOrder('PICKED_UP');
    await createOrder('CANCELLED');
    expect((await save([keptId])).status).toBe(409);
  });

  it('permits staff to remove unused assignments but rejects cross-tenant access', async () => {
    expect((await save([keptId], staffToken)).status).toBe(200);
    expect((await save([], foreignToken, true)).status).toBe(403);
    expect((await save([], adminToken, true, foreignEventId)).status).toBe(404);
  });

  it('rolls back position and amount changes if the assignment transaction fails', async () => {
    const order = await createOrder('NEW', false);
    await expect(run(() => foodItemRepository.setEventAssignments(eventId, [randomUUID()], adminId)))
      .rejects.toMatchObject({ statusCode: 400 });
    const retained = await prisma.order.findUniqueOrThrow({ where: { id: order.id }, include: { items: true } });
    expect(retained.status).toBe('NEW');
    expect(Number(retained.totalPrice)).toBe(9.9);
    expect(retained.items).toHaveLength(1);
    expect(await prisma.eventFoodItem.count({ where: { eventId, foodItemId: foodId } })).toBe(1);
  });

  it('serializes concurrent new orders against removal so no open positions survive unassignment', async () => {
    await createOrder('NEW', false);
    const results = await run(() => Promise.allSettled([
      orderRepository.create({
        eventId, orderNumber: ++sequence, orderDate: new Date('2030-07-01'), source: 'CASHIER',
        totalPrice: new Prisma.Decimal(9.9),
        items: { create: [{ foodItemId: foodId, quantity: 2, unitPrice: 4.95, lineTotal: 9.9 }] },
      }),
      foodItemRepository.setEventAssignments(eventId, [keptId], adminId),
    ]));
    expect(results[1].status).toBe('fulfilled');
    expect(await prisma.orderItem.count({
      where: { foodItemId: foodId, order: { tenantId, eventId, status: { notIn: ['CANCELLED', 'PICKED_UP'] } } },
    })).toBe(0);
    expect(await prisma.eventFoodItem.count({ where: { eventId, foodItemId: foodId } })).toBe(0);
  });

  it('marks sold-out articles unavailable without removing assignments or changing existing orders', async () => {
    const order = await createOrder('NEW');
    await run(() => foodItemService.setSoldOut(foodId, true, eventId));
    const assignment = await prisma.eventFoodItem.findFirstOrThrow({ where: { eventId, foodItemId: foodId } });
    expect(assignment.soldOut).toBe(true);
    expect(await prisma.orderItem.count({ where: { orderId: order.id } })).toBe(2);
    const stats = await run(() => orderService.getStats(eventId));
    expect(stats.dishQuantities.find((item) => item.foodItemId === foodId))
      .toMatchObject({ totalQuantity: 2, outstandingQuantity: 2 });
    await expect(run(() => orderRepository.create({
      eventId, orderNumber: ++sequence, orderDate: new Date('2030-07-01'), source: 'CASHIER',
      totalPrice: new Prisma.Decimal(9.9),
      items: { create: [{ foodItemId: foodId, quantity: 2, unitPrice: 4.95, lineTotal: 9.9 }] },
    }))).rejects.toMatchObject({ statusCode: 409 });
  });
});
