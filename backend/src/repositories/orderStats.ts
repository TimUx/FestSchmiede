import { StatusCode } from '@prisma/client';
import { prisma } from '../config/database';
import { requireTenantId, tenantWhere } from '../platform/tenant/tenantScope';

export interface OrderEventStats {
  totalOrders: number;
  openOrders: number;
  readyOrders: number;
  pickedUpOrders: number;
  revenue: number;
  popularDishes: { name: string; count: number }[];
  avgProcessingMinutes: number;
  dishQuantities: DishQuantity[];
}

export interface DishQuantity {
  foodItemId: string;
  name: string;
  totalQuantity: number;
  outstandingQuantity: number;
}

export function buildOrderEventStats(input: {
  statusCounts: Partial<Record<StatusCode, number>>;
  revenue: number;
  popularDishes: { name: string; count: number }[];
  avgProcessingMinutes: number;
  dishQuantities: DishQuantity[];
}): OrderEventStats {
  const totalOrders = Object.values(input.statusCounts).reduce((sum, n) => sum + n, 0);
  const openOrders =
    (input.statusCounts.NEW ?? 0) + (input.statusCounts.IN_PROGRESS ?? 0);

  return {
    totalOrders,
    openOrders,
    readyOrders: input.statusCounts.READY ?? 0,
    pickedUpOrders: input.statusCounts.PICKED_UP ?? 0,
    revenue: input.revenue,
    popularDishes: input.popularDishes,
    avgProcessingMinutes: input.avgProcessingMinutes,
    dishQuantities: input.dishQuantities,
  };
}

/**
 * Event dashboard stats via DB aggregations — bounded payload, no full order load.
 */
export async function getOrderEventStats(eventId: string): Promise<OrderEventStats> {
  const baseWhere = tenantWhere({ eventId, status: { not: StatusCode.CANCELLED } });
  const tenantId = requireTenantId();

  const [statusGroups, revenueAgg, itemGroups, outstandingGroups, assignments, avgRow] = await Promise.all([
    prisma.order.groupBy({
      by: ['status'],
      where: baseWhere,
      _count: { _all: true },
    }),
    prisma.order.aggregate({
      where: baseWhere,
      _sum: { totalPrice: true },
    }),
    prisma.orderItem.groupBy({
      by: ['foodItemId'],
      where: { order: baseWhere },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
    }),
    prisma.orderItem.groupBy({
      by: ['foodItemId'],
      where: { order: tenantWhere({ eventId, status: { in: [StatusCode.NEW, StatusCode.IN_PROGRESS, StatusCode.READY] } }) },
      _sum: { quantity: true },
    }),
    prisma.eventFoodItem.findMany({
      where: tenantWhere({ eventId }),
      select: { foodItem: { select: { id: true, name: true } } },
      orderBy: [{ sortOrder: 'asc' }, { foodItemId: 'asc' }],
    }),
    prisma.$queryRaw<[{ avg_minutes: number | null }]>`
      SELECT AVG(EXTRACT(EPOCH FROM ("readyAt" - "createdAt")) / 60.0)::float AS avg_minutes
      FROM "Order"
      WHERE "tenant_id" = ${tenantId}
        AND "eventId" = ${eventId}
        AND "status"::text != 'CANCELLED'
        AND "readyAt" IS NOT NULL
    `,
  ]);

  const statusCounts: Partial<Record<StatusCode, number>> = {};
  for (const group of statusGroups) {
    statusCounts[group.status] = group._count._all;
  }

  const menu = new Map(assignments.map(({ foodItem }) => [foodItem.id, foodItem.name]));
  if (itemGroups.length > 0) {
    const foodItems = await prisma.foodItem.findMany({
      where: tenantWhere({ id: { in: itemGroups.map((g) => g.foodItemId) } }),
      select: { id: true, name: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
    for (const foodItem of foodItems) menu.set(foodItem.id, foodItem.name);
  }
  const totalByItem = new Map(itemGroups.map((g) => [g.foodItemId, g._sum.quantity ?? 0]));
  const outstandingByItem = new Map(outstandingGroups.map((g) => [g.foodItemId, g._sum.quantity ?? 0]));
  const dishQuantities = assignments.map(({ foodItem }) => ({
    foodItemId: foodItem.id,
    name: foodItem.name,
    totalQuantity: totalByItem.get(foodItem.id) ?? 0,
    outstandingQuantity: outstandingByItem.get(foodItem.id) ?? 0,
  }));
  const popularDishes = itemGroups.slice(0, 5).map((g) => ({
    name: menu.get(g.foodItemId) ?? 'Unbekannt',
    count: g._sum.quantity ?? 0,
  }));

  return buildOrderEventStats({
    statusCounts,
    revenue: Number(revenueAgg._sum.totalPrice ?? 0),
    popularDishes,
    avgProcessingMinutes: Math.round(avgRow[0]?.avg_minutes ?? 0),
    dishQuantities,
  });
}
