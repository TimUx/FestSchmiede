import { describe, it, expect, vi } from 'vitest';
import { createHash } from 'crypto';
import { realtimeSyncService } from './realtimeSyncService';
import { orderService } from './orderService';
import type { OrderEventStats } from '../repositories/orderStats';

vi.mock('./orderService', () => ({ orderService: { getStats: vi.fn() } }));
vi.mock('../config/database', () => ({ prisma: {} }));
vi.mock('./eventService', () => ({ eventService: {} }));
vi.mock('./clubService', () => ({ clubService: {} }));
vi.mock('../core/extensionPoints', () => ({ getPaymentServiceRegistry: vi.fn() }));
vi.mock('../platform/metrics/performanceMetrics', () => ({
  performanceMetrics: { recordRealtimePoll: vi.fn() },
}));

function buildEtag(parts: (string | number | null | undefined)[]): string {
  return createHash('sha256')
    .update(parts.map((p) => String(p ?? '')).join('|'))
    .digest('hex')
    .slice(0, 16);
}

describe('realtime etag', () => {
  it('produces stable etag for same inputs', () => {
    const a = buildEtag(['orders', 'evt-1', 'NEW', 5, '2026-07-09T10:00:00.000Z']);
    const b = buildEtag(['orders', 'evt-1', 'NEW', 5, '2026-07-09T10:00:00.000Z']);
    expect(a).toBe(b);
  });

  describe('event statistics synchronization', () => {
    it('invalidates the etag when only an item outside the top five changes', async () => {
      const stats: OrderEventStats = {
        totalOrders: 3, openOrders: 1, readyOrders: 1, pickedUpOrders: 1,
        revenue: 100, popularDishes: [{ name: 'Bratwurst', count: 40 }], avgProcessingMinutes: 4,
        dishQuantities: [{ foodItemId: 'water', name: 'Wasser', totalQuantity: 3, outstandingQuantity: 2 }],
      };
      vi.mocked(orderService.getStats).mockResolvedValue(stats);
      const first = await realtimeSyncService.syncEventStats('event-1');
      expect(await realtimeSyncService.syncEventStats('event-1', first.etag)).toMatchObject({ changed: false });

      vi.mocked(orderService.getStats).mockResolvedValue({
        ...stats,
        dishQuantities: [{ ...stats.dishQuantities[0], outstandingQuantity: 1 }],
      });
      const next = await realtimeSyncService.syncEventStats('event-1', first.etag);
      expect(next.changed).toBe(true);
      expect(next.data?.dishQuantities[0].outstandingQuantity).toBe(1);
    });

    it('invalidates the etag for menu changes without any order changes', async () => {
      const stats: OrderEventStats = {
        totalOrders: 0, openOrders: 0, readyOrders: 0, pickedUpOrders: 0,
        revenue: 0, popularDishes: [], avgProcessingMinutes: 0, dishQuantities: [],
      };
      vi.mocked(orderService.getStats).mockResolvedValue(stats);
      const first = await realtimeSyncService.syncEventStats('event-1');
      vi.mocked(orderService.getStats).mockResolvedValue({
        ...stats,
        dishQuantities: [{ foodItemId: 'new-food', name: 'Neues Gericht', totalQuantity: 0, outstandingQuantity: 0 }],
      });
      expect((await realtimeSyncService.syncEventStats('event-1', first.etag)).changed).toBe(true);
    });
  });

  it('changes when count changes', () => {
    const a = buildEtag(['orders', 'evt-1', '', 5, '2026-07-09T10:00:00.000Z']);
    const b = buildEtag(['orders', 'evt-1', '', 6, '2026-07-09T10:00:00.000Z']);
    expect(a).not.toBe(b);
  });
});
