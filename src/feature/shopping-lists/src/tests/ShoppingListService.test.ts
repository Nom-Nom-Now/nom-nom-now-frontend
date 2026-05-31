import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchShoppingList,
  fetchShoppingLists,
  generateShoppingList,
} from '../services/ShoppingListService';

describe('ShoppingListService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should generate a shopping list for a week', async () => {
    stubFetch({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 7,
          weekStart: '2026-05-25',
          createdAt: '2026-05-31T12:00:00Z',
          items: [],
        }),
    });

    const response = await generateShoppingList(new Date(2026, 4, 25));

    expect(fetch).toHaveBeenCalledWith('/api/shopping-lists', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ weekStart: '2026-05-25' }),
    });
    expect(response.id).toBe(7);
  });

  it('should fetch shopping list summaries', async () => {
    stubFetch({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: 7,
            weekStart: '2026-05-25',
            createdAt: '2026-05-31T12:00:00Z',
            itemCount: 3,
          },
        ]),
    });

    const response = await fetchShoppingLists();

    expect(fetch).toHaveBeenCalledWith('/api/shopping-lists', {
      credentials: 'include',
    });
    expect(response).toHaveLength(1);
  });

  it('should fetch one shopping list by id', async () => {
    stubFetch({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 7,
          weekStart: '2026-05-25',
          createdAt: '2026-05-31T12:00:00Z',
          items: [{ ingredientName: 'Tomato', quantity: 4, unit: 'PIECE' }],
        }),
    });

    const response = await fetchShoppingList(7);

    expect(fetch).toHaveBeenCalledWith('/api/shopping-lists/7', {
      credentials: 'include',
    });
    expect(response.items[0]?.ingredientName).toBe('Tomato');
  });
});

function stubFetch(response: unknown) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
}
