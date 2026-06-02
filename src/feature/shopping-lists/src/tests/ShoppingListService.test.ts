import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  deleteShoppingList,
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

    const [, init] = vi.mocked(fetch).mock.calls[0] ?? [];
    expect(init).toMatchObject({
      method: 'POST',
      credentials: 'include',
      redirect: 'manual',
      body: JSON.stringify({ weekStart: '2026-05-25' }),
    });
    expect(init?.headers).toBeInstanceOf(Headers);
    expect((init?.headers as Headers).get('Content-Type')).toBe(
      'application/json',
    );
    expect((init?.headers as Headers).get('X-Requested-With')).toBe(
      'XMLHttpRequest',
    );
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

    const [, init] = vi.mocked(fetch).mock.calls[0] ?? [];
    expect(init).toMatchObject({
      credentials: 'include',
      redirect: 'manual',
    });
    expect(init?.headers).toBeInstanceOf(Headers);
    expect((init?.headers as Headers).get('X-Requested-With')).toBe(
      'XMLHttpRequest',
    );
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

    const [, init] = vi.mocked(fetch).mock.calls[0] ?? [];
    expect(init).toMatchObject({
      credentials: 'include',
      redirect: 'manual',
    });
    expect(init?.headers).toBeInstanceOf(Headers);
    expect((init?.headers as Headers).get('X-Requested-With')).toBe(
      'XMLHttpRequest',
    );
    expect(response.items[0]?.ingredientName).toBe('Tomato');
  });

  it('should reject empty shopping list ids before fetching', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchShoppingList('')).rejects.toThrow(
      'Shopping list id is required.',
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should delete one shopping list by id', async () => {
    stubFetch({
      ok: true,
    });

    await deleteShoppingList(7);

    const [, init] = vi.mocked(fetch).mock.calls[0] ?? [];
    expect(init).toMatchObject({
      method: 'DELETE',
      credentials: 'include',
      redirect: 'manual',
    });
    expect(init?.headers).toBeInstanceOf(Headers);
    expect((init?.headers as Headers).get('X-Requested-With')).toBe(
      'XMLHttpRequest',
    );
  });

  it('should reject empty shopping list ids before deleting', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(deleteShoppingList('')).rejects.toThrow(
      'Shopping list id is required.',
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });
});

function stubFetch(response: unknown) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
}
