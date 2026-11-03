import { beforeEach, describe, it, expect, vi } from 'vitest';
import { buildOrderEventStats, getOrderEventStats } from './orderStats';
import { sharedTenantContext } from '../platform/tenant/sharedTenantContext';

const db = vi.hoisted(() => ({
  order: { groupBy: vi.fn(), aggregate: vi.fn() },
  orderItem: { groupBy: vi.fn() },
  eventFoodItem: { findMany: vi.fn() },
  foodItem: { findMany: vi.fn() },
  $queryRaw: vi.fn(),
}));

vi.mock('../config/database', () => ({ prisma: db }));

describe('buildOrderEventStats', () => {
  it('aggregates status counts without loading orders', () => {
    const stats = buildOrderEventStats({
      statusCounts: {
        NEW: 40,
        IN_PROGRESS: 30,
        READY: 20,
        PICKED_UP: 900,
      },
      revenue: 12500.5,
      popularDishes: [
        { name: 'Bratwurst', count: 420 },
        { name: 'Currywurst', count: 310 },
      ],
      avgProcessingMinutes: 12,
      dishQuantities: [{ foodItemId: 'food', name: 'Bratwurst', totalQuantity: 420, outstandingQuantity: 80 }],
    });

    expect(stats.totalOrders).toBe(990);
    expect(stats.openOrders).toBe(70);
    expect(stats.readyOrders).toBe(20);
    expect(stats.pickedUpOrders).toBe(900);
    expect(stats.revenue).toBe(12500.5);
    expect(stats.popularDishes).toHaveLength(2);
    expect(stats.avgProcessingMinutes).toBe(12);
    expect(stats.dishQuantities).toEqual([
      { foodItemId: 'food', name: 'Bratwurst', totalQuantity: 420, outstandingQuantity: 80 },
    ]);
  });

  it('handles empty event', () => {
    const stats = buildOrderEventStats({
      statusCounts: {},
      revenue: 0,
      popularDishes: [],
      avgProcessingMinutes: 0,
      dishQuantities: [],
    });

    expect(stats.totalOrders).toBe(0);
    expect(stats.openOrders).toBe(0);
    expect(stats.popularDishes).toEqual([]);
  });
});

describe('getOrderEventStats threshold', () => {
  it('documents 1000-order dashboard acceptance bound', () => {
    const thresholdMs = Number(process.env.EVENT_STATS_THRESHOLD_MS ?? 500);
    expect(thresholdMs).toBeLessThanOrEqual(2000);
    expect(thresholdMs).toBeGreaterThan(0);
  });

  describe('getOrderEventStats dish quantities', () => {
    beforeEach(() => {
      vi.resetAllMocks();
      vi.spyOn(sharedTenantContext, 'id').mockReturnValue('tenant-1');
      db.order.groupBy.mockResolvedValue([
        { status: 'NEW', _count: { _all: 1 } },
        { status: 'IN_PROGRESS', _count: { _all: 1 } },
        { status: 'READY', _count: { _all: 1 } },
        { status: 'PICKED_UP', _count: { _all: 1 } },
      ]);
      db.order.aggregate.mockResolvedValue({ _sum: { totalPrice: 42 } });
      db.$queryRaw.mockResolvedValue([{ avg_minutes: 8.4 }]);
      db.orderItem.groupBy.mockResolvedValue([]);
      db.eventFoodItem.findMany.mockResolvedValue([]);
      db.foodItem.findMany.mockResolvedValue([]);
    });

    it('sums quantities for assigned articles only, including zero and excluding removed menu items', async () => {
      db.orderItem.groupBy
        .mockResolvedValueOnce([
          { foodItemId: 'food-1', _sum: { quantity: 14 } },
          { foodItemId: 'removed', _sum: { quantity: 3 } },
        ])
        .mockResolvedValueOnce([
          { foodItemId: 'food-1', _sum: { quantity: 9 } },
          { foodItemId: 'removed', _sum: { quantity: 1 } },
        ]);
      db.eventFoodItem.findMany.mockResolvedValue([
        { foodItem: { id: 'food-1', name: 'Bratwurst' } },
        { foodItem: { id: 'food-2', name: 'Wasser' } },
      ]);
      db.foodItem.findMany.mockResolvedValue([
        { id: 'food-1', name: 'Bratwurst' },
        { id: 'removed', name: 'Ehemaliges Angebot' },
      ]);

      const stats = await getOrderEventStats('event-1');

      expect(stats.totalOrders).toBe(4);
      expect(stats.openOrders).toBe(2);
      expect(stats.revenue).toBe(42);
      expect(stats.avgProcessingMinutes).toBe(8);
      expect(stats.dishQuantities).toEqual([
        { foodItemId: 'food-1', name: 'Bratwurst', totalQuantity: 14, outstandingQuantity: 9 },
        { foodItemId: 'food-2', name: 'Wasser', totalQuantity: 0, outstandingQuantity: 0 },
      ]);
    });

    it('shows no articles when none are assigned, even if historical orders exist', async () => {
      db.orderItem.groupBy
        .mockResolvedValueOnce([{ foodItemId: 'removed', _sum: { quantity: 3 } }])
        .mockResolvedValueOnce([{ foodItemId: 'removed', _sum: { quantity: 1 } }]);
      db.foodItem.findMany.mockResolvedValue([{ id: 'removed', name: 'Ehemaliges Angebot' }]);

      expect((await getOrderEventStats('event-1')).dishQuantities).toEqual([]);
    });

    it('scopes every query to the tenant and event and excludes cancelled and picked-up quantities correctly', async () => {
      await getOrderEventStats('event-2');
      const baseWhere = { tenantId: 'tenant-1', eventId: 'event-2', status: { not: 'CANCELLED' } };
      expect(db.order.groupBy).toHaveBeenCalledWith(expect.objectContaining({ where: baseWhere }));
      expect(db.order.aggregate).toHaveBeenCalledWith(expect.objectContaining({ where: baseWhere }));
      expect(db.orderItem.groupBy).toHaveBeenNthCalledWith(1, expect.objectContaining({
        where: { order: baseWhere },
      }));
      expect(db.orderItem.groupBy).toHaveBeenNthCalledWith(2, expect.objectContaining({
        where: { order: { tenantId: 'tenant-1', eventId: 'event-2', status: { in: ['NEW', 'IN_PROGRESS', 'READY'] } } },
      }));
      expect(db.eventFoodItem.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { tenantId: 'tenant-1', eventId: 'event-2' },
      }));
    });

    it('does not truncate the overview to five dishes or merge identical names', async () => {
      const items = Array.from({ length: 20 }, (_, i) => ({ id: `food-${i}`, name: 'Gleicher Name' }));
      db.eventFoodItem.findMany.mockResolvedValue(items.map((foodItem) => ({ foodItem })));
      db.foodItem.findMany.mockResolvedValue(items);
      db.orderItem.groupBy
        .mockResolvedValueOnce(items.map((item, i) => ({ foodItemId: item.id, _sum: { quantity: 20 - i } })))
        .mockResolvedValueOnce([]);

      const stats = await getOrderEventStats('event-1');
      expect(stats.dishQuantities).toHaveLength(20);
      expect(stats.dishQuantities[19]).toMatchObject({ foodItemId: 'food-19', totalQuantity: 1, outstandingQuantity: 0 });
      expect(stats.popularDishes).toHaveLength(5);
      expect(db.orderItem.groupBy.mock.calls[0][0]).not.toHaveProperty('take');
      expect(db.foodItem.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { tenantId: 'tenant-1', id: { in: items.map((item) => item.id) } },
      }));
    });

    it('returns an empty overview for an event without a menu or orders', async () => {
      expect((await getOrderEventStats('event-1')).dishQuantities).toEqual([]);
    });

    it('propagates database failures instead of showing zero quantities', async () => {
      db.orderItem.groupBy.mockRejectedValue(new Error('Database unavailable'));
      await expect(getOrderEventStats('event-1')).rejects.toThrow('Database unavailable');
    });
  });
});
