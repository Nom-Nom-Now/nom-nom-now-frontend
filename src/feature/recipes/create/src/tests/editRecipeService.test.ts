import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  mapResponseToState,
  getRecipe,
  updateRecipe,
  type RecipeDetailResponseDto,
} from '../services/editRecipeService';
import type { CreateRecipeState } from '../shared/types/recipe';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildFakeRecipeDetailResponse(
  overrides?: Partial<RecipeDetailResponseDto>,
): RecipeDetailResponseDto {
  return {
    id: 42,
    name: 'Pasta Bolognese',
    instructions: 'Alles kochen.',
    cookingTime: 30,
    pricePerPerson: null,
    ownerName: 'chef',
    categories: '1, 3, 5',
    components: [
      { ingredientId: 10, ingredientName: 'Hackfleisch', quantity: 500, unit: 'GRAM' },
      { ingredientId: 11, ingredientName: 'Tomatensauce', quantity: 200, unit: 'MILLILITER' },
    ],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests – mapResponseToState
// ---------------------------------------------------------------------------

describe('editRecipeService – mapResponseToState', () => {
  it('should map a response DTO to CreateRecipeState', () => {
    const response = buildFakeRecipeDetailResponse();
    const state: CreateRecipeState = mapResponseToState(response);

    expect(state.recipeName).toBe('Pasta Bolognese');
    expect(state.instructions).toBe('Alles kochen.');
    expect(state.cookingTime).toBe(30);
    expect(state.categoryIds).toEqual([1, 3, 5]);
    expect(state.servings).toBe(1);
  });

  it('should map components to ingredients with sequential ids', () => {
    const response = buildFakeRecipeDetailResponse();
    const state = mapResponseToState(response);

    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[0]).toEqual({
      id: 1,
      amount: 500,
      unit: 'GRAM',
      name: 'Hackfleisch',
    });
    expect(state.ingredients[1]).toEqual({
      id: 2,
      amount: 200,
      unit: 'MILLILITER',
      name: 'Tomatensauce',
    });
  });

  it('should handle empty components', () => {
    const response = buildFakeRecipeDetailResponse({ components: [] });
    const state = mapResponseToState(response);

    expect(state.ingredients).toEqual([]);
  });

  it('should return empty categoryIds when categories is empty string', () => {
    const response = buildFakeRecipeDetailResponse({ categories: '' });
    const state = mapResponseToState(response);

    expect(state.categoryIds).toEqual([]);
  });

  it('should handle categories string with extra whitespace', () => {
    const response = buildFakeRecipeDetailResponse({ categories: ' 1 , 3 , 5 ' });
    const state = mapResponseToState(response);

    expect(state.categoryIds).toEqual([1, 3, 5]);
  });
});

// ---------------------------------------------------------------------------
// Tests – getRecipe
// ---------------------------------------------------------------------------

describe('editRecipeService – getRecipe', () => {
  const fakeResponse = buildFakeRecipeDetailResponse();

  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(fakeResponse),
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call GET /recipes/:id', async () => {
    const result = await getRecipe(42);

    expect(fetch).toHaveBeenCalledOnce();
    const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]!;
    expect(url).toContain('/recipes/42');
    expect(options).toBeUndefined();
    expect(result).toEqual(fakeResponse);
  });

  it('should throw on non-ok response', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: () => Promise.resolve('Not Found'),
    });

    await expect(getRecipe(999)).rejects.toThrow(/failed.*404/i);
  });
});

// ---------------------------------------------------------------------------
// Tests – updateRecipe
// ---------------------------------------------------------------------------

describe('editRecipeService – updateRecipe', () => {
  const updateResponse = {
    id: 42,
    name: 'Pasta Bolognese',
    instructions: 'Alles kochen.',
    cookingTime: 30,
    ownerName: 'chef',
    categories: '1, 3, 5',
    components: [],
  };

  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(updateResponse)),
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call PUT /recipes/:id with correct body', async () => {
    const state: CreateRecipeState = {
      recipeName: 'Pasta Bolognese',
      servings: 4,
      ingredients: [
        { id: 1, amount: 500, unit: 'GRAM', name: 'Hackfleisch' },
      ],
      instructions: 'Alles kochen.',
      cookingTime: 30,
      categoryIds: [1, 3],
    };

    const result = await updateRecipe(42, state);

    expect(fetch).toHaveBeenCalledOnce();
    const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]!;
    expect(url).toContain('/recipes/42');
    expect(options.method).toBe('PUT');

    const body = JSON.parse(options.body as string);
    expect(body.name).toBe('Pasta Bolognese');
    expect(body.cookingTime).toBe(30);
    expect(body.categoryIds).toEqual([1, 3]);
    expect(body.components).toHaveLength(1);
    expect(body.components[0]).toEqual({
      name: 'Hackfleisch',
      quantity: 500,
      unit: 'GRAM',
    });
    expect(result).toEqual(updateResponse);
  });

  it('should filter out empty ingredients', async () => {
    const state: CreateRecipeState = {
      recipeName: 'Test',
      servings: 1,
      ingredients: [
        { id: 1, amount: 100, unit: 'GRAM', name: 'Mehl' },
        { id: 2, amount: null, unit: 'GRAM', name: '' },
        { id: 3, amount: 0, unit: 'PIECE', name: 'Ei' },
      ],
      instructions: 'Kochen.',
      cookingTime: 10,
      categoryIds: [],
    };

    await updateRecipe(1, state);

    const body = JSON.parse(
      ((fetch as ReturnType<typeof vi.fn>).mock.calls[0]![1] as RequestInit)
        .body as string,
    );
    expect(body.components).toHaveLength(1);
    expect(body.components[0].name).toBe('Mehl');
  });

  it('should throw on non-ok response', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: () => Promise.resolve('Bad Request'),
    });

    const state: CreateRecipeState = {
      recipeName: 'X',
      servings: 1,
      ingredients: [],
    };

    await expect(updateRecipe(1, state)).rejects.toThrow(/failed.*400/i);
  });
});
