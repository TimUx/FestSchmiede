import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppError } from '../middleware/errorHandler';

const mockFindById = vi.fn();
const mockCountOrders = vi.fn();
const mockDelete = vi.fn();
const mockFindOnlineOrderableEvents = vi.fn();
const mockFindPickupEvents = vi.fn();
const mockFindPublicPickupEvents = vi.fn();
const mockFindPublicActiveEvents = vi.fn();

vi.mock('../repositories', () => ({
  eventRepository: {
    findById: (...args: unknown[]) => mockFindById(...args),
    countOrders: (...args: unknown[]) => mockCountOrders(...args),
    delete: (...args: unknown[]) => mockDelete(...args),
    findOnlineOrderableEvents: (...args: unknown[]) => mockFindOnlineOrderableEvents(...args),
    findPickupEvents: (...args: unknown[]) => mockFindPickupEvents(...args),
    findPublicPickupEvents: (...args: unknown[]) => mockFindPublicPickupEvents(...args),
    findPublicActiveEvents: (...args: unknown[]) => mockFindPublicActiveEvents(...args),
  },
}));

vi.mock('../socket', () => ({
  emitEventUpdate: vi.fn(),
}));

vi.mock('../platform/bootstrap', () => ({
  hookSystem: { emitAsync: vi.fn() },
}));

import { eventService } from './eventService';

describe('eventService.delete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindById.mockResolvedValue({
      id: 'event-1',
      name: 'Sommerfest',
      isActive: false,
    });

    describe('public event queries', () => {
      const publicEvent = {
        id: 'event-1',
        name: 'Sommerfest',
        description: null,
        date: new Date('2030-07-01'),
        startTime: '10:00',
        endTime: '22:00',
      };

      beforeEach(() => {
        vi.clearAllMocks();
      });

      it('uses the date-filtered repository query for online events', async () => {
        mockFindOnlineOrderableEvents.mockResolvedValue([publicEvent]);

        await expect(eventService.getPublicOnlineEvents()).resolves.toEqual([
          expect.objectContaining({ id: publicEvent.id }),
        ]);
        expect(mockFindOnlineOrderableEvents).toHaveBeenCalledOnce();
      });

      it('uses the date-filtered repository query for public pickup events', async () => {
        mockFindPublicPickupEvents.mockResolvedValue([publicEvent]);

        await expect(eventService.getPublicPickupEvents()).resolves.toEqual([
          expect.objectContaining({ id: publicEvent.id }),
        ]);
        expect(mockFindPublicPickupEvents).toHaveBeenCalledOnce();
        expect(mockFindPickupEvents).not.toHaveBeenCalled();
      });

      it('chooses the public active event from the date-filtered repository query', async () => {
        mockFindPublicActiveEvents.mockResolvedValue([publicEvent]);
        mockFindById.mockResolvedValue(publicEvent);

        await expect(eventService.getPublicActive()).resolves.toEqual(publicEvent);
        expect(mockFindPublicActiveEvents).toHaveBeenCalledOnce();
        expect(mockFindById).toHaveBeenCalledWith(publicEvent.id);
      });
    });
    mockDelete.mockResolvedValue(undefined);
  });

  it('löscht Veranstaltungen ohne Bestellungen', async () => {
    mockCountOrders.mockResolvedValue(0);

    await eventService.delete('event-1');

    expect(mockDelete).toHaveBeenCalledWith('event-1');
  });

  it('verweigert Löschen bei vorhandenen Bestellungen', async () => {
    mockCountOrders.mockResolvedValue(2);

    await expect(eventService.delete('event-1')).rejects.toEqual(
      new AppError(
        409,
        'Die Veranstaltung kann nicht gelöscht werden, weil bereits Bestellungen existieren. Deaktivieren Sie sie stattdessen oder schließen Sie die Bestellungen.',
        'EVENT_HAS_ORDERS'
      )
    );
    expect(mockDelete).not.toHaveBeenCalled();
  });
});
