import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppError } from '../middleware/errorHandler';

const mockFindById = vi.fn();
const mockCountOrderReferences = vi.fn();
const mockFindEventIdsForFoodItem = vi.fn();
const mockDelete = vi.fn();
const mockFindByEvent = vi.fn();
const mockFindCatalog = vi.fn();
const mockSetAssignments = vi.fn();

vi.mock('../repositories', () => ({
  foodItemRepository: {
    findCatalog: (...args: unknown[]) => mockFindCatalog(...args),
    setEventAssignments: (...args: unknown[]) => mockSetAssignments(...args),
    findById: (...args: unknown[]) => mockFindById(...args),
    countOrderReferences: (...args: unknown[]) => mockCountOrderReferences(...args),
    findEventIdsForFoodItem: (...args: unknown[]) => mockFindEventIdsForFoodItem(...args),
    delete: (...args: unknown[]) => mockDelete(...args),
    findByEvent: (...args: unknown[]) => mockFindByEvent(...args),
  },
}));

vi.mock('../socket', () => ({
  emitFoodItemsUpdate: vi.fn(),
}));
vi.mock('./eventService', () => ({ eventService: { getById: vi.fn().mockResolvedValue({ id: 'event-1' }) } }));
vi.mock('./orderService', () => ({ orderService: { notifyRemovedItems: vi.fn().mockResolvedValue(undefined) } }));
vi.mock('../utils/logger', () => ({ logger: { warn: vi.fn() } }));

import { foodItemService } from './foodItemService';
import { orderService } from './orderService';
import { emitFoodItemsUpdate } from '../socket';

describe('foodItemService.delete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindById.mockResolvedValue({
      id: 'food-1',
      name: 'Bratwurst',
      description: null,
      price: 4.5,
      imageUrl: null,
      sortOrder: 0,
      active: true,
      maxQuantity: null,
    });

    mockFindEventIdsForFoodItem.mockResolvedValue(['event-1']);
    mockFindByEvent.mockResolvedValue([]);
    mockDelete.mockResolvedValue({ count: 1 });
  });

  it('löscht Gerichte ohne Bestellbezug', async () => {
    mockCountOrderReferences.mockResolvedValue(0);

    await foodItemService.delete('food-1');

    expect(mockDelete).toHaveBeenCalledWith('food-1');
  });

  it('verweigert Löschen bei Bestellbezug mit verständlicher Meldung', async () => {
    mockCountOrderReferences.mockResolvedValue(3);

    await expect(foodItemService.delete('food-1')).rejects.toEqual(
      new AppError(
        409,
        'Der Katalogeintrag kann nicht gelöscht werden, weil er bereits in Bestellungen vorkommt. Deaktivieren Sie ihn stattdessen.',
        'FOOD_ITEM_IN_USE'
      )
    );
    expect(mockDelete).not.toHaveBeenCalled();
  });
});

describe('foodItemService.setEventAssignments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindCatalog.mockResolvedValue([{ id: 'food-1' }, { id: 'food-2' }]);
    mockFindByEvent.mockResolvedValue([]);
    mockSetAssignments.mockResolvedValue([]);
  });

  it('rejects forced removal by staff even if they can edit the catalog', async () => {
    await expect(foodItemService.setEventAssignments('event-1', [], {
      confirmRemoval: true, actor: { role: 'STAFF', userId: 'staff-1' },
    })).rejects.toMatchObject({ statusCode: 403 });
    expect(mockSetAssignments).not.toHaveBeenCalled();
  });

  it('rejects confirmation without an authenticated admin', async () => {
    await expect(foodItemService.setEventAssignments('event-1', [], {
      confirmRemoval: true,
    })).rejects.toMatchObject({ statusCode: 403 });
    expect(mockSetAssignments).not.toHaveBeenCalled();
  });

  it('does not implicitly confirm removal even for an admin', async () => {
    mockSetAssignments.mockRejectedValue(new AppError(409, 'Bestätigung erforderlich', 'FOOD_ASSIGNMENT_CONFIRMATION_REQUIRED'));
    await expect(foodItemService.setEventAssignments('event-1', [], {
      actor: { role: 'ADMIN', userId: 'admin-1' },
    })).rejects.toMatchObject({ statusCode: 409, code: 'FOOD_ASSIGNMENT_CONFIRMATION_REQUIRED' });
    expect(mockSetAssignments).toHaveBeenCalledWith('event-1', [], undefined);
    expect(emitFoodItemsUpdate).not.toHaveBeenCalled();
  });

  it('passes an explicit admin confirmation and publishes corrected orders after commit', async () => {
    const order = { id: 'order-1', status: 'NEW', totalPrice: 3 };
    mockSetAssignments.mockResolvedValue([{ order, removedItems: [], previousTotal: 7 }]);
    await foodItemService.setEventAssignments('event-1', ['food-2'], {
      confirmRemoval: true, actor: { role: 'ADMIN', userId: 'admin-1' },
    });
    expect(mockSetAssignments).toHaveBeenCalledWith('event-1', ['food-2'], 'admin-1');
    expect(orderService.notifyRemovedItems).toHaveBeenCalledWith(order);
    expect(emitFoodItemsUpdate).toHaveBeenCalledWith('event-1', []);
  });

  it('allows ordinary assignment changes without confirmation and rejects foreign catalog ids', async () => {
    await foodItemService.setEventAssignments('event-1', ['food-1']);
    expect(mockSetAssignments).toHaveBeenCalledWith('event-1', ['food-1'], undefined);
    mockSetAssignments.mockClear();
    await expect(foodItemService.setEventAssignments('event-1', ['foreign-food'])).rejects.toMatchObject({ statusCode: 400 });
    expect(mockSetAssignments).not.toHaveBeenCalled();
  });
});
