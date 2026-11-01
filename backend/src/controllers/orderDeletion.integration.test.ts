import { randomUUID } from 'node:crypto';
import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { config } from '../config';
import { prisma } from '../config/database';
import { authenticate, loadUser, requireRole } from '../middleware/auth';
import { errorHandler } from '../middleware/errorHandler';
import { validateParams } from '../middleware/validation';
import { sharedTenantContext } from '../platform/tenant/sharedTenantContext';
import { DEFAULT_TENANT_SETTINGS, type TenantContextData } from '../platform/tenant/types';
import { orderService } from '../services/orderService';
import { realtimeSyncService } from '../services/realtimeSyncService';
import { orderExportService } from '../services/orderExportService';
import { emitOrderDeleted } from '../socket';
import { idParamSchema } from '../validation/schemas';
import { orderController } from './orderController';
import { paymentRepository } from '../../modules/payment/repositories/paymentRepository';

// Require an explicitly selected test database, never the application's database.
vi.mock('../config/database', async () => {
  const { PrismaClient } = await import('@prisma/client');
  const { PrismaPg } = await import('@prisma/adapter-pg');
  return {
    prisma: new PrismaClient({
      adapter: new PrismaPg({ connectionString: process.env.ORDER_DELETE_TEST_DATABASE_URL }),
    }),
  };
});

vi.mock('../socket', () => ({ emitOrderDeleted: vi.fn(), emitOrderUpdate: vi.fn(), emitOrderCreated: vi.fn() }));
vi.mock('../platform/bootstrap', () => ({
  hookSystem: { emitAsync: vi.fn() },
  settingsService: { getDecryptedValues: vi.fn().mockResolvedValue({}) },
}));

describe.skipIf(!process.env.ORDER_DELETE_TEST_DATABASE_URL)('order deletion with PostgreSQL', () => {
  const tenantId = randomUUID();
  const otherTenantId = randomUUID();
  const tenantIds = [tenantId, otherTenantId];
  const app = express();
  const run = <T>(fn: () => T) => sharedTenantContext.run({
    id: tenantId, name: 'Deletion test', slug: tenantId, subdomain: tenantId,
    status: 'ACTIVE', settings: DEFAULT_TENANT_SETTINGS,
  } as TenantContextData, fn);
  let adminToken: string;
  let staffToken: string;
  let otherAdminToken: string;
  let platformToken: string;
  let eventId: string;
  let foreignEventId: string;
  let customerId: string;
  let foodItemId: string;
  let orderId: string;
  let foreignOrderId: string;
  let retainedOrderId: string;
  let lookupToken: string;

  app.use((_req, _res, next) => run(next));
  app.delete('/api/staff/orders/:id', authenticate, loadUser, requireRole('ADMIN'),
    validateParams(idParamSchema), orderController.delete);
  app.use(errorHandler);

  const deleteOrder = (id: string, token?: string) => {
    const req = request(app).delete(`/api/staff/orders/${id}`);
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
    const tokenFor = async (id: string, roleId: string, permissions: string[] = []) => {
      const user = await prisma.user.create({
        data: { tenantId: id, firstName: 'Test', lastName: 'Admin', roleId, permissions },
      });
      // Persisted roles must win over the token's ADMIN claim.
      return jwt.sign({ userId: user.id, tenantId: id, role: 'ADMIN', scope: 'tenant' }, config.jwt.secret);
    };
    adminToken = await tokenFor(tenantId, adminRole.id);
    staffToken = await tokenFor(tenantId, staffRole.id, ['orders.manage', 'orders.kitchen', 'orders.view']);
    otherAdminToken = await tokenFor(otherTenantId, adminRole.id);
    platformToken = jwt.sign({ userId: randomUUID(), role: 'ADMIN', scope: 'platform' }, config.jwt.secret);
    customerId = (await prisma.customer.create({
      data: { tenantId, firstName: 'Shared', lastName: 'Customer' },
    })).id;
    foodItemId = (await prisma.foodItem.create({
      data: { tenantId, name: 'Shared catalog item', price: 5 },
    })).id;
    const createEvent = (id: string) => prisma.event.create({
      data: {
        tenantId: id, name: 'Test event', date: new Date('2030-07-01'),
        startTime: '10:00', endTime: '22:00', isActive: true,
      },
    });
    eventId = (await createEvent(tenantId)).id;
    foreignEventId = (await createEvent(otherTenantId)).id;
  });

  beforeEach(async () => {
    vi.clearAllMocks();
    lookupToken = randomUUID().replaceAll('-', '').repeat(2);
    const createOrder = (owner: string, number: number) => prisma.order.create({
      data: {
        tenantId: owner, eventId: owner === tenantId ? eventId : foreignEventId,
        customerId: owner === tenantId ? customerId : undefined,
        lookupToken: number === 1 && owner === tenantId ? lookupToken : randomUUID(),
        orderNumber: number, orderDate: new Date('2030-07-01'),
        source: 'ONLINE', status: 'READY', totalPrice: 5,
        readyAt: new Date(number === 1 ? '2030-07-01T10:15:00Z' : '2030-07-01T10:05:00Z'),
        createdAt: new Date('2030-07-01T10:00:00Z'),
        items: owner === tenantId
          ? { create: { foodItemId, quantity: 1, unitPrice: 5, lineTotal: 5 } } : undefined,
        statusHistory: { create: { status: 'READY' } },
      },
    });
    orderId = (await createOrder(tenantId, 1)).id;
    retainedOrderId = (await createOrder(tenantId, 2)).id;
    foreignOrderId = (await createOrder(otherTenantId, 1)).id;
    await prisma.dailyOrderCounter.create({
      data: { tenantId, eventId, date: new Date('2030-07-01'), counter: 2 },
    });
  });

  afterEach(async () => {
    await prisma.order.deleteMany({ where: { tenantId: { in: tenantIds } } });
    await prisma.dailyOrderCounter.deleteMany({ where: { tenantId: { in: tenantIds } } });
  });

  afterAll(async () => {
    await prisma.order.deleteMany({ where: { tenantId: { in: tenantIds } } });
    await prisma.event.deleteMany({ where: { tenantId: { in: tenantIds } } });
    await prisma.tenant.deleteMany({ where: { id: { in: tenantIds } } });
    await prisma.$disconnect();
  });

  it('deletes the order graph while retaining shared records and order numbering', async () => {
    expect((await deleteOrder(orderId, adminToken)).status).toBe(204);
    expect(await prisma.order.findUnique({ where: { id: orderId } })).toBeNull();
    expect(await prisma.orderItem.count({ where: { orderId } })).toBe(0);
    expect(await prisma.orderStatus.count({ where: { orderId } })).toBe(0);
    expect(await prisma.customer.findUnique({ where: { id: customerId } })).not.toBeNull();
    expect(await prisma.foodItem.findUnique({ where: { id: foodItemId } })).not.toBeNull();
    expect(await prisma.event.findUnique({ where: { id: eventId } })).not.toBeNull();
    expect(await prisma.order.count({ where: { id: { in: [retainedOrderId, foreignOrderId] } } })).toBe(2);
    expect((await prisma.dailyOrderCounter.findFirst({ where: { tenantId, eventId } }))?.counter).toBe(2);
    expect(emitOrderDeleted).toHaveBeenCalledWith(eventId, orderId);
  });

  it('removes deleted orders from statistics, exports, public lookup and realtime snapshots', async () => {
    const statsBefore = await run(() => orderService.getStats(eventId));
    const ordersBefore = await run(() => realtimeSyncService.syncEventOrders(eventId, undefined, false));
    const publicBefore = await run(() => realtimeSyncService.syncOrderByToken(lookupToken, 'Customer'));
    expect(statsBefore.totalOrders).toBe(2);
    expect(statsBefore.avgProcessingMinutes).toBe(10);
    expect((await deleteOrder(orderId, adminToken)).status).toBe(204);

    const stats = await run(() => orderService.getStats(eventId));
    expect(stats.totalOrders).toBe(1);
    expect(stats.revenue).toBe(5);
    expect(stats.avgProcessingMinutes).toBe(5);
    expect(stats.popularDishes).toEqual([{ name: 'Shared catalog item', count: 1 }]);
    const exported = await run(() => orderExportService.getEventExport(eventId));
    expect(exported.orderCount).toBe(1);
    expect(exported.orders.map((order) => order.orderNumber)).toEqual(['002']);
    await expect(run(() => orderService.getByLookupToken(lookupToken, 'Customer')))
      .rejects.toMatchObject({ statusCode: 404 });
    const ordersAfter = await run(() => realtimeSyncService.syncEventOrders(eventId, undefined, false, ordersBefore.etag));
    expect(ordersAfter.changed).toBe(true);
    expect(ordersAfter.data?.map((order) => order.id)).toEqual([retainedOrderId]);
    expect(await run(() => realtimeSyncService.syncOrderByToken(lookupToken, 'Customer', publicBefore.etag)))
      .toMatchObject({ changed: true, data: null });
  });

  it('rejects anonymous users, staff, platform tokens and cross-tenant access', async () => {
    expect((await deleteOrder(orderId)).status).toBe(401);
    expect((await deleteOrder(orderId, staffToken)).status).toBe(403);
    expect((await deleteOrder(orderId, platformToken)).status).toBe(403);
    expect((await deleteOrder(orderId, otherAdminToken)).status).toBe(403);
    expect((await deleteOrder(foreignOrderId, adminToken)).status).toBe(404);
    expect(await prisma.order.count({ where: { id: { in: [orderId, foreignOrderId] } } })).toBe(2);
    expect(emitOrderDeleted).not.toHaveBeenCalled();
  });

  it('retains payment evidence when the optional payment schema is installed', async ({ skip }) => {
    const [schema] = await prisma.$queryRaw<{ table: string | null }[]>`
      SELECT to_regclass('public.payments')::text AS "table"
    `;
    if (!schema?.table) skip();
    const paymentId = await run(() => paymentRepository.createPayment({
      resourceType: 'order', resourceId: orderId, providerId: 'stripe', amountCents: 500, currency: 'EUR',
    }));
    try {
      await run(() => paymentRepository.updatePayment(paymentId, {
        status: 'completed', paymentStatus: 'PAYMENT_PAID', paidAt: new Date(),
      }));
      const transactionId = randomUUID();
      const auditId = randomUUID();
      await prisma.$executeRaw`
        INSERT INTO payment_transactions (id, payment_id, type, status, amount_cents)
        VALUES (${transactionId}::uuid, ${paymentId}::uuid, 'charge', 'completed', 500)
      `;
      await prisma.$executeRaw`
        INSERT INTO payment_audit (id, tenant_id, payment_id, action)
        VALUES (${auditId}::uuid, ${tenantId}, ${paymentId}::uuid, 'payment.completed')
      `;
      const before = await run(() => paymentRepository.findById(paymentId));

      expect((await deleteOrder(orderId, adminToken)).status).toBe(204);

      expect(await run(() => paymentRepository.findById(paymentId))).toEqual(before);
      expect(await prisma.$queryRaw`SELECT id FROM payment_transactions WHERE id = ${transactionId}::uuid`)
        .toEqual([{ id: transactionId }]);
      expect(await prisma.$queryRaw`SELECT id FROM payment_audit WHERE id = ${auditId}::uuid`)
        .toEqual([{ id: auditId }]);
    } finally {
      await prisma.$executeRaw`DELETE FROM payment_audit WHERE payment_id = ${paymentId}::uuid AND tenant_id = ${tenantId}`;
      await prisma.$executeRaw`DELETE FROM payments WHERE id = ${paymentId}::uuid AND tenant_id = ${tenantId}`;
    }
  });

  it('rejects invalid IDs, unknown IDs and repeated deletion', async () => {
    expect((await deleteOrder('not-a-uuid', adminToken)).status).toBe(400);
    expect((await deleteOrder(randomUUID(), adminToken)).status).toBe(404);
    expect((await deleteOrder(orderId, adminToken)).status).toBe(204);
    expect((await deleteOrder(orderId, adminToken)).status).toBe(404);
    expect(emitOrderDeleted).toHaveBeenCalledTimes(1);
  });
});
