import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Prisma, StatusCode } from '@prisma/client';
import { foodItemRepository, orderRepository } from './index';
import { sharedTenantContext } from '../platform/tenant/sharedTenantContext';

const db = vi.hoisted(() => ({
  $transaction: vi.fn(),
  $queryRaw: vi.fn(),
  eventFoodItem: { findMany: vi.fn(), deleteMany: vi.fn(), create: vi.fn() },
  foodItem: { findMany: vi.fn() },
  order: { findMany: vi.fn(), findFirst: vi.fn(), update: vi.fn(), create: vi.fn() },
  orderItem: { deleteMany: vi.fn(), createMany: vi.fn() },
  orderStatus: { create: vi.fn() },
}));
vi.mock('../config/database', () => ({ prisma: db }));

const decimal = (n: number) => new Prisma.Decimal(n);
const assignment = (id: string) => ({
  foodItemId: id, foodItem: { id, name: id, sortOrder: 0, active: true }, soldOut: false,
});
const line = (foodItemId: string, lineTotal: number) => ({
  foodItemId, quantity: 2, unitPrice: decimal(lineTotal / 2), lineTotal: decimal(lineTotal),
});

describe('event food assignment protection', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(sharedTenantContext, 'id').mockReturnValue('tenant-1');
    db.$transaction.mockImplementation((fn) => fn(db));
    db.$queryRaw.mockResolvedValue([]);
    db.eventFoodItem.findMany.mockResolvedValue([assignment('removed'), assignment('kept')]);
    db.foodItem.findMany.mockResolvedValue([{ id: 'kept', sortOrder: 0 }]);
    db.order.findMany.mockResolvedValue([]);
    db.order.update.mockImplementation(async ({ where, data }) => ({ id: where.id, ...data }));
  });

  it.each(Object.values(StatusCode))('requires confirmation even when the reference is a %s order', async (status) => {
    db.order.findMany.mockResolvedValue([{ id: 'order-1', status, items: [line('removed', 5)] }]);
    await expect(foodItemRepository.setEventAssignments('event-1', ['kept'])).rejects.toMatchObject({
      statusCode: 409, code: 'FOOD_ASSIGNMENT_CONFIRMATION_REQUIRED',
    });
    expect(db.orderItem.deleteMany).not.toHaveBeenCalled();
    expect(db.order.update).not.toHaveBeenCalled();
    expect(db.eventFoodItem.deleteMany).not.toHaveBeenCalled();
  });

  it('allows removal without orders and preserves existing assignment properties', async () => {
    await expect(foodItemRepository.setEventAssignments('event-1', ['kept'])).resolves.toEqual([]);
    expect(db.eventFoodItem.deleteMany).toHaveBeenCalledWith({
      where: { tenantId: 'tenant-1', eventId: 'event-1', foodItemId: { in: ['removed'] } },
    });
    expect(db.eventFoodItem.create).not.toHaveBeenCalled();
  });

  it.each(['NEW', 'IN_PROGRESS', 'READY'])('removes only affected positions from %s orders using original line totals', async (status) => {
    const items = [line('removed', 9.9), line('kept', 3.3), line('also-kept', 1.1)];
    db.order.findMany.mockResolvedValue([{ id: 'order-1', status, totalPrice: decimal(14.3), items }]);
    const changes = await foodItemRepository.setEventAssignments('event-1', ['kept'], 'admin-1');

    expect(db.orderItem.deleteMany).toHaveBeenCalledWith({
      where: { orderId: 'order-1', foodItemId: { in: ['removed'] } },
    });
    expect(db.order.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'order-1' }, data: { totalPrice: decimal(4.4) },
    }));
    expect(db.orderStatus.create).not.toHaveBeenCalled();
    expect(changes[0].removedItems).toEqual([items[0]]);
    expect(changes[0].previousTotal).toEqual(decimal(14.3));
  });

  it('cancels empty orders and records the confirming admin in status history', async () => {
    db.order.findMany.mockResolvedValue([{
      id: 'order-1', status: 'READY', totalPrice: decimal(5), items: [line('removed', 5)],
    }]);
    await foodItemRepository.setEventAssignments('event-1', ['kept'], 'admin-1');
    expect(db.order.update).toHaveBeenCalledWith(expect.objectContaining({
      data: { totalPrice: decimal(0), status: 'CANCELLED', cancelledAt: expect.any(Date) },
    }));
    expect(db.orderStatus.create).toHaveBeenCalledWith({
      data: { orderId: 'order-1', status: 'CANCELLED', changedBy: 'admin-1' },
    });
  });

  it.each(['PICKED_UP', 'CANCELLED'])('preserves %s orders and their prices and positions', async (status) => {
    db.order.findMany.mockResolvedValue([{ id: 'order-1', status, items: [line('removed', 5)] }]);
    expect(await foodItemRepository.setEventAssignments('event-1', ['kept'], 'admin-1')).toEqual([]);
    expect(db.orderItem.deleteMany).not.toHaveBeenCalled();
    expect(db.order.update).not.toHaveBeenCalled();
    expect(db.orderStatus.create).not.toHaveBeenCalled();
  });

  it('scopes affected orders and assignment reads to the selected event and tenant', async () => {
    await foodItemRepository.setEventAssignments('event-1', ['kept'], 'admin-1');
    expect(db.order.findMany).toHaveBeenCalledWith({
      where: { tenantId: 'tenant-1', eventId: 'event-1', items: { some: { foodItemId: { in: ['removed'] } } } },
      include: { items: true },
    });
    expect(db.eventFoodItem.findMany).toHaveBeenCalledWith({
      where: { tenantId: 'tenant-1', eventId: 'event-1' }, include: { foodItem: true },
    });
    expect(db.$transaction).toHaveBeenCalledOnce();
    expect(db.$queryRaw.mock.calls[0][0].join(' ')).toContain('FOR UPDATE');
  });

  it('aborts assignment removal if correcting an order fails', async () => {
    db.order.findMany.mockResolvedValue([{
      id: 'order-1', status: 'NEW', totalPrice: decimal(5), items: [line('removed', 5)],
    }]);
    db.order.update.mockRejectedValue(new Error('Write failed'));
    await expect(foodItemRepository.setEventAssignments('event-1', ['kept'], 'admin-1')).rejects.toThrow('Write failed');
    expect(db.eventFoodItem.deleteMany).not.toHaveBeenCalled();
  });

  it('rejects stale new orders after an assignment was removed', async () => {
    db.eventFoodItem.findMany.mockResolvedValue([]);
    await expect(orderRepository.create({
      eventId: 'event-1', orderDate: new Date(), orderNumber: 1, source: 'CASHIER',
      totalPrice: decimal(5), items: { create: [line('removed', 5)] },
    })).rejects.toMatchObject({ statusCode: 409 });
    expect(db.order.create).not.toHaveBeenCalled();
    expect(db.$queryRaw.mock.calls[0][0].join(' ')).toContain('FOR SHARE');
  });

  it('rejects stale item edits which would reintroduce a removed article', async () => {
    db.order.findFirst.mockResolvedValue({ id: 'order-1', eventId: 'event-1', status: 'NEW' });
    db.eventFoodItem.findMany.mockResolvedValue([]);
    await expect(orderRepository.replaceItems('order-1', [line('removed', 5)], decimal(5)))
      .rejects.toMatchObject({ statusCode: 409 });
    expect(db.orderItem.deleteMany).not.toHaveBeenCalled();
  });

  it('does not resurrect an order cancelled by item removal with a stale status change', async () => {
    db.order.findFirst.mockResolvedValue({ id: 'order-1', status: 'CANCELLED' });
    await expect(orderRepository.updateStatus('order-1', 'IN_PROGRESS', 'staff-1'))
      .rejects.toMatchObject({ statusCode: 409 });
    expect(db.order.update).not.toHaveBeenCalled();
  });
});
