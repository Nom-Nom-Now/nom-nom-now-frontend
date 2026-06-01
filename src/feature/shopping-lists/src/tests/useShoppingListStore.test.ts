import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  deleteShoppingList,
  fetchShoppingList,
  fetchShoppingLists,
} from '../services/ShoppingListService';
import { useShoppingListStore } from '../stores/useShoppingListStore';

vi.mock('../services/ShoppingListService', () => ({
  deleteShoppingList: vi.fn(),
  fetchShoppingList: vi.fn(),
  fetchShoppingLists: vi.fn(),
}));

describe('useShoppingListStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.mocked(deleteShoppingList).mockReset();
    vi.mocked(fetchShoppingList).mockReset();
    vi.mocked(fetchShoppingLists).mockReset();
  });

  it('should not request a detail endpoint for an empty selected id', async () => {
    const store = useShoppingListStore();

    await store.loadShoppingList('');

    expect(fetchShoppingList).not.toHaveBeenCalled();
    expect(store.selectedShoppingList).toBeNull();
    expect(store.error).toBeNull();
    expect(store.isDetailLoading).toBe(false);
  });

  it('should delete a shopping list, clear selection, and reload summaries', async () => {
    const store = useShoppingListStore();
    store.selectedShoppingList = {
      id: '7',
      weekStart: '2026-05-25',
      createdAt: '2026-05-31T12:00:00Z',
      items: [],
    };
    vi.mocked(deleteShoppingList).mockResolvedValue(undefined);
    vi.mocked(fetchShoppingLists).mockResolvedValue([
      {
        id: 8,
        weekStart: '2026-06-01',
        createdAt: '2026-06-01T12:00:00Z',
        itemCount: 2,
      },
    ]);

    await store.deleteShoppingList('7');

    expect(deleteShoppingList).toHaveBeenCalledWith('7');
    expect(fetchShoppingLists).toHaveBeenCalledOnce();
    expect(store.selectedShoppingList).toBeNull();
    expect(store.shoppingLists).toEqual([
      {
        id: '8',
        weekStart: '2026-06-01',
        createdAt: '2026-06-01T12:00:00Z',
        itemCount: 2,
      },
    ]);
    expect(store.isDeleting).toBe(false);
  });
});
