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
    stubFetch(pageResponse(0, false), categoriesResponse());

    const store = useRecipeListStore();
    await store.fetchRecipes();

    expectFetchCalledWith('/recipes?page=0&size=20');
    expect(store.recipes).toEqual([
      {
        id: '42',
        title: 'Pizza',
        imageUrl: '/recipes/42/image',
        duration: '60min',
        cost: '12.34 EUR',
        description: 'Bake it.',
        owner: 'Unbekannter Koch',
        ingredients: [],
        categories: ['italian', 'dinner'],
      },
    ]);
    expect(store.canLoadMore).toBe(true);
  });

  it('should append the next page and stop on the last page', async () => {
    stubFetch(pageResponse(0, false), categoriesResponse(), pageResponse(1, true, '43'));

    const store = useRecipeListStore();
    await store.fetchRecipes();
    await store.fetchNextPage();

    expect(store.recipes.map((recipe) => recipe.id)).toEqual(['42', '43']);
    expect(fetch).toHaveBeenLastCalledWith('/recipes?page=1&size=20', expect.objectContaining({
      credentials: 'include',
    }));
    expect(store.canLoadMore).toBe(false);
  });

  it('should keep existing recipes and expose an error when the next page fails', async () => {
    stubFetch(pageResponse(0, false), categoriesResponse(), { ok: false, status: 500 });

    const store = useRecipeListStore();
    await store.fetchRecipes();
    await store.fetchNextPage();

    expect(store.recipes).toHaveLength(1);
    expect(store.error).toBe('GET /recipes failed (500)');
  });

  it('should resolve relative image urls against the backend base url', () => {
    expect(
      resolveBackendResourceUrl('/recipes/42/image', 'https://nomnom-now.com/api'),
    ).toBe('https://nomnom-now.com/api/recipes/42/image');
  });

  it('should resolve relative image urls against a relative api base url', () => {
    expect(resolveBackendResourceUrl('/recipes/42/image', '/api')).toBe(
      '/api/recipes/42/image',
    );
  });

  it('should keep absolute image urls unchanged', () => {
    expect(
      resolveBackendResourceUrl(
        'https://cdn.nomnom-now.com/recipes/42/image',
        'https://nomnom-now.com/api',
      ),
    ).toBe('https://cdn.nomnom-now.com/recipes/42/image');
  });

  it('should fetch all recipes when no ownerId is provided', async () => {
    stubFetch(pageResponse(0, true), categoriesResponse());

    const store = useRecipeListStore();
    await store.fetchRecipes();

    expectFetchCalledWith('/recipes?page=0&size=20');
  });

  it('should fetch user recipes when ownerId is provided', async () => {
    stubFetch(pageResponse(0, true), categoriesResponse());

    const store = useRecipeListStore();
    await store.fetchRecipes('42');

    expectFetchCalledWith('/recipes/user/42?page=0&size=20');
  });

  it('should fetch recipes with search query parameter', async () => {
    stubFetch(pageResponse(0, true), categoriesResponse());

    const store = useRecipeListStore();
    await store.fetchRecipes(undefined, 'pizza');

    expectFetchCalledWith('/recipes?page=0&size=20&q=pizza');
  });

  it('should not add q parameter when search query is undefined', async () => {
    stubFetch(pageResponse(0, true), categoriesResponse());

    const store = useRecipeListStore();
    await store.fetchRecipes();

    expectFetchCalledWith('/recipes?page=0&size=20');
  });

  it('should fetch user recipes with search query', async () => {
    stubFetch(pageResponse(0, true), categoriesResponse());

    const store = useRecipeListStore();
    await store.fetchRecipes('42', 'pasta');

    expectFetchCalledWith('/recipes/user/42?page=0&size=20&q=pasta');
  });

  it('should not set error when fetch is aborted', async () => {
    stubFetch(new DOMException('aborted', 'AbortError'), categoriesResponse());

    const store = useRecipeListStore();
    await store.fetchRecipes(undefined, 'test');

    expect(store.error).toBeNull();
  });
});

function stubFetch(...responses: unknown[]) {
  const mock = vi.fn();
  for (const response of responses) {
    if (response instanceof Error || response instanceof DOMException) {
      mock.mockRejectedValueOnce(response);
    } else {
      mock.mockResolvedValueOnce(response);
    }
  }
  vi.stubGlobal('fetch', mock);
}

function expectFetchCalledWith(url: string) {
  expect(fetch).toHaveBeenCalledWith(url, expect.objectContaining({
    credentials: 'include',
  }));
}

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
            ownerName: null,
            categories: id === '42' ? '16,29' : null,
            components: [],
          },
        ],
        number: page,
        last,
      }),
  };
}

function categoriesResponse() {
  return {
    ok: true,
    json: () =>
      Promise.resolve({
        categories: [
          { id: 16, name: 'italian' },
          { id: 29, name: 'dinner' },
        ],
      }),
  };
}
