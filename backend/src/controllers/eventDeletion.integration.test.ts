import { randomUUID } from 'node:crypto';
import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { config } from '../config';
import { prisma } from '../config/database';
import { authenticate, loadUser, requirePermissionKey } from '../middleware/auth';
import { errorHandler } from '../middleware/errorHandler';
import { validateParams } from '../middleware/validation';
import { sharedTenantContext } from '../platform/tenant/sharedTenantContext';
import { DEFAULT_TENANT_SETTINGS, type TenantContextData } from '../platform/tenant/types';
import { emitEventUpdate } from '../socket';
import { idParamSchema } from '../validation/schemas';
import { eventController } from './eventController';

// Use an explicitly selected test database, never the application's database.
vi.mock('../config/database', async () => {
  const { PrismaClient } = await import('@prisma/client');
  const { PrismaPg } = await import('@prisma/adapter-pg');
  return {
    prisma: new PrismaClient({
      adapter: new PrismaPg({
        connectionString: process.env.EVENT_DELETE_TEST_DATABASE_URL,
      }),
    }),
  };
});

vi.mock('../socket', () => ({ emitEventUpdate: vi.fn() }));
vi.mock('../platform/bootstrap', () => ({ hookSystem: { emitAsync: vi.fn() } }));

describe.skipIf(!process.env.EVENT_DELETE_TEST_DATABASE_URL)('event deletion with PostgreSQL', () => {
  const tenantId = randomUUID();
  const otherTenantId = randomUUID();
  const tenantIds = [tenantId, otherTenantId];
  const app = express();
  let adminToken: string;
  let staffToken: string;
  let viewerToken: string;
  let otherAdminToken: string;
  let platformToken: string;
  let eventId: string;
  let otherEventId: string;
  let foreignEventId: string;
  let customerId: string;
  let foodItemId: string;
  let orderIds: string[];
  let retainedOrderIds: string[];

  app.use((req, _res, next) => {
    const id = req.headers['x-test-tenant'] === otherTenantId ? otherTenantId : tenantId;
    sharedTenantContext.run({
      id,
      name: 'Deletion test',
      slug: id,
      subdomain: id,
      status: 'ACTIVE',
      settings: DEFAULT_TENANT_SETTINGS,
    } as TenantContextData, next);
  });
  app.delete(
    '/api/staff/events/:id',
    authenticate,
    loadUser,
    requirePermissionKey('events.manage'),
    validateParams(idParamSchema),
    eventController.delete
  );
  app.use(errorHandler);

  const deleteEvent = (id: string, token?: string, tenant = tenantId) => {
    const req = request(app).delete(`/api/staff/events/${id}`).set('x-test-tenant', tenant);
    return token ? req.set('Authorization', `Bearer ${token}`) : req;
  };

  beforeAll(async () => {
    await prisma.tenant.createMany({
      data: tenantIds.map((id) => ({ id, name: 'Deletion test', slug: id, subdomain: id })),
    });
    const adminRole = await prisma.role.upsert({
      where: { name: 'ADMIN' }, create: { name: 'ADMIN' }, update: {},
    });
    const staffRole = await prisma.role.upsert({
      where: { name: 'STAFF' }, create: { name: 'STAFF' }, update: {},
    });
    const createToken = async (id: string, roleId: string, permissions: string[] = []) => {
      const user = await prisma.user.create({
        data: { tenantId: id, firstName: 'Test', lastName: 'Admin', roleId, permissions },
      });
      // loadUser must use the persisted role, even if a token claims ADMIN.
      return jwt.sign({ userId: user.id, tenantId: id, role: 'ADMIN', scope: 'tenant' }, config.jwt.secret);
    };
    adminToken = await createToken(tenantId, adminRole.id);
    staffToken = await createToken(tenantId, staffRole.id, ['events.manage']);
    viewerToken = await createToken(tenantId, staffRole.id, ['orders.view']);
    otherAdminToken = await createToken(otherTenantId, adminRole.id);
    platformToken = jwt.sign({ userId: randomUUID(), role: 'ADMIN', scope: 'platform' }, config.jwt.secret);
    const customer = await prisma.customer.create({
      data: { tenantId, firstName: 'Shared', lastName: 'Customer' },
    });
    customerId = customer.id;
    const foodItem = await prisma.foodItem.create({
      data: { tenantId, name: 'Shared catalog item', price: 5 },
    });
    foodItemId = foodItem.id;
  });

  beforeEach(async () => {
    vi.clearAllMocks();
    const createEvent = (id: string) => prisma.event.create({
      data: {
        tenantId: id, name: 'Test event', date: new Date('2030-07-01'),
        startTime: '10:00', endTime: '22:00', isActive: true,
      },
    });
    eventId = (await createEvent(tenantId)).id;
    otherEventId = (await createEvent(tenantId)).id;
    foreignEventId = (await createEvent(otherTenantId)).id;
    const createOrder = (id: string, owner: string, number: number, pickedUp = false) => prisma.order.create({
      data: {
        tenantId: owner, eventId: id, customerId: owner === tenantId ? customerId : undefined,
        lookupToken: randomUUID(), orderNumber: number, orderDate: new Date('2030-07-01'),
        source: number === 1 ? 'ONLINE' : 'CASHIER',
        status: pickedUp ? 'PICKED_UP' : 'NEW', totalPrice: 5,
        items: owner === tenantId
          ? { create: { foodItemId, quantity: 1, unitPrice: 5, lineTotal: 5 } }
          : undefined,
        statusHistory: { create: { status: pickedUp ? 'PICKED_UP' : 'NEW' } },
      },
    });
    orderIds = [
      (await createOrder(eventId, tenantId, 1)).id,
      (await createOrder(eventId, tenantId, 2, true)).id,
    ];
    retainedOrderIds = [
      (await createOrder(otherEventId, tenantId, 1)).id,
      (await createOrder(foreignEventId, otherTenantId, 1)).id,
    ];
    await prisma.eventFoodItem.createMany({
      data: [eventId, otherEventId].map((id) => ({ tenantId, eventId: id, foodItemId })),
    });
    await prisma.dailyOrderCounter.createMany({
      data: [eventId, otherEventId].map((id) => ({
        tenantId, eventId: id, date: new Date('2030-07-01'), counter: 2,
      })),
    });
  });

  afterEach(async () => {
    await prisma.order.deleteMany({ where: { tenantId: { in: tenantIds } } });
    await prisma.event.deleteMany({ where: { tenantId: { in: tenantIds } } });
  });

  afterAll(async () => {
    await prisma.tenant.deleteMany({ where: { id: { in: tenantIds } } });
    await prisma.$disconnect();
  });

  it('lets a tenant admin delete an event and its complete order graph without deleting shared data', async () => {
    expect((await deleteEvent(eventId, adminToken)).status).toBe(204);

    expect(await prisma.event.findUnique({ where: { id: eventId } })).toBeNull();
    expect(await prisma.order.count({ where: { id: { in: orderIds } } })).toBe(0);
    expect(await prisma.orderItem.count({ where: { orderId: { in: orderIds } } })).toBe(0);
    expect(await prisma.orderStatus.count({ where: { orderId: { in: orderIds } } })).toBe(0);
    expect(await prisma.eventFoodItem.count({ where: { eventId } })).toBe(0);
    expect(await prisma.dailyOrderCounter.count({ where: { eventId } })).toBe(0);
    expect(await prisma.customer.findUnique({ where: { id: customerId } })).not.toBeNull();
    expect(await prisma.foodItem.findUnique({ where: { id: foodItemId } })).not.toBeNull();
    expect(await prisma.event.count({ where: { id: { in: [otherEventId, foreignEventId] } } })).toBe(2);
    expect(await prisma.order.count({ where: { id: { in: retainedOrderIds } } })).toBe(2);
    expect(await prisma.orderItem.count({ where: { orderId: retainedOrderIds[0] } })).toBe(1);
    expect(await prisma.orderStatus.count({ where: { orderId: { in: retainedOrderIds } } })).toBe(2);
    expect(await prisma.eventFoodItem.count({ where: { eventId: otherEventId } })).toBe(1);
    expect(await prisma.dailyOrderCounter.count({ where: { eventId: otherEventId } })).toBe(1);
    expect(emitEventUpdate).toHaveBeenCalledWith({ id: eventId, deleted: true });
  });

  it('preserves the staff restriction for events with orders, even with an ADMIN claim in the token', async () => {
    const res = await deleteEvent(eventId, staffToken);
    expect(res.status).toBe(409);
    expect(res.body.code).toBe('EVENT_HAS_ORDERS');
    expect(await prisma.order.count({ where: { eventId } })).toBe(2);
    expect(await prisma.event.findUnique({ where: { id: eventId } })).not.toBeNull();
    expect(emitEventUpdate).not.toHaveBeenCalled();
  });

  it('still lets authorized staff delete an empty event', async () => {
    await prisma.order.deleteMany({ where: { eventId } });
    expect((await deleteEvent(eventId, staffToken)).status).toBe(204);
    expect(await prisma.event.findUnique({ where: { id: eventId } })).toBeNull();
  });

  it('blocks anonymous users, staff without event permissions, and platform tokens', async () => {
    expect((await deleteEvent(eventId)).status).toBe(401);
    expect((await deleteEvent(eventId, viewerToken)).status).toBe(403);
    expect((await deleteEvent(eventId, platformToken)).status).toBe(403);
    expect(await prisma.order.count({ where: { eventId } })).toBe(2);
    expect(emitEventUpdate).not.toHaveBeenCalled();
  });

  it('blocks cross-tenant tokens and cross-tenant event IDs', async () => {
    expect((await deleteEvent(eventId, otherAdminToken)).status).toBe(403);
    expect((await deleteEvent(foreignEventId, adminToken)).status).toBe(404);
    expect((await deleteEvent(eventId, otherAdminToken, otherTenantId)).status).toBe(404);
    expect(await prisma.order.count({ where: { eventId } })).toBe(2);
    expect(await prisma.order.count({ where: { eventId: foreignEventId } })).toBe(1);
    expect(emitEventUpdate).not.toHaveBeenCalled();
  });

  it('returns 404 for an unknown event without deleting any orders', async () => {
    expect((await deleteEvent(randomUUID(), adminToken)).status).toBe(404);
    expect(await prisma.order.count({ where: { eventId } })).toBe(2);
    expect(emitEventUpdate).not.toHaveBeenCalled();
  });

  it('rolls back order deletion if a foreign-tenant reference prevents event deletion', async () => {
    await prisma.order.create({
      data: {
        tenantId: otherTenantId, eventId, lookupToken: randomUUID(),
        orderNumber: 3, orderDate: new Date('2030-07-01'), source: 'ONLINE', totalPrice: 0,
      },
    });
    expect((await deleteEvent(eventId, adminToken)).status).toBe(409);
    expect(await prisma.event.findUnique({ where: { id: eventId } })).not.toBeNull();
    expect(await prisma.order.count({ where: { id: { in: orderIds } } })).toBe(2);
    expect(await prisma.orderItem.count({ where: { orderId: { in: orderIds } } })).toBe(2);
    expect(await prisma.orderStatus.count({ where: { orderId: { in: orderIds } } })).toBe(2);
    expect(await prisma.order.count({ where: { eventId, tenantId: otherTenantId } })).toBe(1);
    expect(emitEventUpdate).not.toHaveBeenCalled();
  });
});
