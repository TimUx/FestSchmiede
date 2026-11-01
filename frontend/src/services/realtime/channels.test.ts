import { beforeEach, describe, expect, it, vi } from 'vitest';
import { realtimeService } from './RealtimeService';
import { subscribeEventOrders, subscribeEventStats, subscribeOrderStatus, subscribePickupBoard } from './channels';
import type { RealtimeHandler, SubscribeOptions } from './types';

vi.mock('./RealtimeService', () => ({
  realtimeService: {
    joinEvent: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
  },
}));

describe('order deletion subscriptions', () => {
  beforeEach(() => vi.clearAllMocks());

  it.each([
    () => subscribeEventOrders('token', 'event', '', vi.fn()),
    () => subscribeEventStats('token', 'event', vi.fn()),
    () => subscribePickupBoard('event', vi.fn()),
  ])('refreshes lists, statistics and pickup boards on deletion', (subscribe) => {
    subscribe();

    expect(realtimeService.subscribe).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Function),
      expect.objectContaining({ wsEvents: expect.arrayContaining(['order:deleted']) })
    );
  });

  it('clears public order status on websocket deletion and polling absence', () => {
    const onData = vi.fn();
    subscribeOrderStatus('lookup-token', 'Test', onData, 'order');
    const [, handler, options] = vi.mocked(realtimeService.subscribe).mock.calls[0] as [
      string, RealtimeHandler, SubscribeOptions<unknown>
    ];

    handler({ type: 'order:deleted', payload: { id: 'order' }, channel: 'order:lookup-token' });
    expect(onData).toHaveBeenLastCalledWith(null);

    onData.mockClear();
    handler({ type: 'order:deleted', payload: { id: 'another-order' }, channel: 'order:lookup-token' });
    expect(onData).not.toHaveBeenCalled();

    options.onPollData?.(null);
    expect(onData).toHaveBeenLastCalledWith(null);
  });
});
