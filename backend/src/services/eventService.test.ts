import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppError } from '../middleware/errorHandler';

const mockFindById = vi.fn();
const mockCountOrders = vi.fn();
const mockDelete = vi.fn();
const mockFindOnlineOrderableEvents = vi.fn();
const mockFindPickupEvents = vi.fn();
const mockFindPublicPickupEvents = vi.fn();
const mockFindPublicActiveEvents = vi.fn();
const mockHasPendingCheckoutForEvent = vi.fn();

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

vi.mock('../core/extensionPoints', () => ({
  getPaymentServiceRegistry: () => ({
    hasPendingCheckoutForEvent: (...args: unknown[]) => mockHasPendingCheckoutForEvent(...args),
  }),
}));

vi.mock('../platform/bootstrap', () => ({
  hookSystem: { emitAsync: vi.fn() },
}));

import { eventService } from './eventService';
import { emitEventUpdate } from '../socket';

describe('eventService.delete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindById.mockResolvedValue({
      id: 'event-1',
      name: 'Sommerfest',
      isActive: false,
    });

    mockDelete.mockResolvedValue(undefined);
    mockHasPendingCheckoutForEvent.mockResolvedValue(false);
  });

  it('löscht Veranstaltungen ohne Bestellungen', async () => {
    mockCountOrders.mockResolvedValue(0);

    await eventService.delete('event-1');

    expect(mockDelete).toHaveBeenCalledWith('event-1', { includeOrders: false });
  });

  it('verweigert Löschen bei vorhandenen Bestellungen ohne Admin-Freigabe', async () => {
    mockCountOrders.mockResolvedValue(2);

    await expect(eventService.delete('event-1')).rejects.toEqual(
      new AppError(
        409,
        'Die Veranstaltung kann nicht gelöscht werden, weil bereits Bestellungen existieren. Deaktivieren Sie sie stattdessen oder schließen Sie die Bestellungen.',
        'EVENT_HAS_ORDERS'
      )
    );
    expect(mockDelete).not.toHaveBeenCalled();
    expect(emitEventUpdate).not.toHaveBeenCalled();
  });

  it('löscht mit Admin-Freigabe auch Veranstaltungen mit Bestellungen', async () => {
    mockCountOrders.mockResolvedValue(2);

    await eventService.delete('event-1', { includeOrders: true });

    expect(mockDelete).toHaveBeenCalledWith('event-1', { includeOrders: true });
    expect(emitEventUpdate).toHaveBeenCalledWith({ id: 'event-1', deleted: true });
  });

  it('verweigert das Löschen bei einer offenen Zahlungssession', async () => {
    mockCountOrders.mockResolvedValue(2);
    mockHasPendingCheckoutForEvent.mockResolvedValue(true);

    await expect(eventService.delete('event-1', { includeOrders: true }))
      .rejects.toEqual(new AppError(
        409,
        'Die Veranstaltung kann nicht gelöscht werden, solange eine offene Zahlung für eine zugehörige Bestellung besteht. Schließen oder stornieren Sie zuerst den Checkout.',
        'EVENT_HAS_PENDING_PAYMENT'
      ));
    expect(mockHasPendingCheckoutForEvent).toHaveBeenCalledWith('event-1');
    expect(mockDelete).not.toHaveBeenCalled();
    expect(emitEventUpdate).not.toHaveBeenCalled();
  });

  it('verweigert Löschen einer unbekannten oder fremden Veranstaltung', async () => {
    mockFindById.mockResolvedValue(null);

    await expect(eventService.delete('event-1', { includeOrders: true }))
      .rejects.toMatchObject({ statusCode: 404 });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('sendet bei fehlgeschlagener Löschung kein Update', async () => {
    mockDelete.mockRejectedValueOnce(new Error('Transaktion fehlgeschlagen'));

    await expect(eventService.delete('event-1', { includeOrders: true }))
      .rejects.toThrow('Transaktion fehlgeschlagen');
    expect(emitEventUpdate).not.toHaveBeenCalled();
  });
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
