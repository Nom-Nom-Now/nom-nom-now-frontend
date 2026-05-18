import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import {
  resolveBackendResourceUrl,
  useRecipeListStore,
} from '../stores/useRecipeListStore';

describe('useRecipeListStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.restoreAllMocks();
  });

  it('should load the first backend page and map recipes', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(pageResponse(0, false)));

    const store = useRecipeListStore();

    await store.fetchRecipes();

    expect(fetch).toHaveBeenCalledWith('/recipes?page=0&size=20', {
      credentials: 'include',
    });
    expect(store.recipes).toEqual([
      {
        id: '42',
        title: 'Pizza',
        imageUrl: '/recipes/42/image',
        duration: '60min',
        cost: '12.34 EUR',
        description: 'Bake it.',
      },
    ]);
    expect(store.canLoadMore).toBe(true);
  });

  it('should append the next page and stop on the last page', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn()
        .mockResolvedValueOnce(pageResponse(0, false))
        .mockResolvedValueOnce(pageResponse(1, true, '43')),
    );

    const store = useRecipeListStore();

    await store.fetchRecipes();
    await store.fetchNextPage();

    expect(store.recipes.map((recipe) => recipe.id)).toEqual(['42', '43']);
    expect(fetch).toHaveBeenLastCalledWith('/recipes?page=1&size=20', {
      credentials: 'include',
    });
    expect(store.canLoadMore).toBe(false);
  });

  it('should keep existing recipes and expose an error when the next page fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn()
        .mockResolvedValueOnce(pageResponse(0, false))
        .mockResolvedValueOnce({ ok: false, status: 500 }),
    );

    const store = useRecipeListStore();

    await store.fetchRecipes();
    await store.fetchNextPage();

    expect(store.recipes).toHaveLength(1);
    expect(store.error).toBe('GET /recipes failed (500)');
  });

  it('should resolve relative image urls against the backend base url', () => {
    expect(
      resolveBackendResourceUrl(
        '/recipes/42/image',
        'https://api.nomnomnow.example',
      ),
    ).toBe('https://api.nomnomnow.example/recipes/42/image');
  });
});

function pageResponse(page: number, last: boolean, id = '42') {
  return {
    ok: true,
    json: () =>
      Promise.resolve({
        content: [
          {
            id,
            name: id === '42' ? 'Pizza' : 'Pasta',
            instructions: id === '42' ? 'Bake it.' : null,
            cookingTime: id === '42' ? 60 : null,
            pricePerPerson: id === '42' ? 1234 : null,
            imageUrl: id === '42' ? '/recipes/42/image' : null,
          },
        ],
        number: page,
        last,
      }),
  };
}
