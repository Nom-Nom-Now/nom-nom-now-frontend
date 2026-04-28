import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRecipe } from '../services/createRecipeService';
import type { CreateRecipeState } from '../shared/types/recipe';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildValidState(
  overrides?: Partial<CreateRecipeState>,
): CreateRecipeState {
  return {
    recipeName: 'Pasta Bolognese',
    servings: 4,
    ingredients: [
      { id: 1, amount: 500, unit: 'GRAM', name: 'Hackfleisch' },
      { id: 2, amount: 200, unit: 'MILLILITER', name: 'Tomatensauce' },
    ],
    instructions: 'Alles kochen.',
    cookingTime: 30,
    categoryIds: [1, 3],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('createRecipeService', () => {
  const fakeResponse = {
    id: 42,
    name: 'Pasta Bolognese',
    instructions: 'Alles kochen.',
    cookingTime: 30,
    ownerName: 'chef',
    categories: 'Italienisch',
    components: [],
  };

  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(fakeResponse)),
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should map state to correct request DTO and call fetch', async () => {
    await createRecipe(buildValidState());

    expect(fetch).toHaveBeenCalledOnce();

    const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]!;
    expect(url).toContain('/recipes');
    expect(options.method).toBe('POST');

    const body = JSON.parse(options.body as string);
    expect(body.name).toBe('Pasta Bolognese');
    expect(body.cookingTime).toBe(30);
    expect(body.categoryIds).toEqual([1, 3]);
    expect(body.components).toHaveLength(2);
    expect(body.components[0]).toEqual({
      name: 'Hackfleisch',
      quantity: 500,
      unit: 'GRAM',
    });
  });

  it('should filter out empty / invalid ingredients', async () => {
    const state = buildValidState({
      ingredients: [
        { id: 1, amount: 500, unit: 'GRAM', name: 'Mehl' },
        { id: 2, amount: null, unit: 'GRAM', name: '' }, // leer
        { id: 3, amount: 0, unit: 'PIECE', name: 'Ei' }, // amount 0
      ],
    });

    await createRecipe(state);

    const body = JSON.parse(
      ((fetch as ReturnType<typeof vi.fn>).mock.calls[0]![1] as RequestInit)
        .body as string,
    );
    expect(body.components).toHaveLength(1);
    expect(body.components[0].name).toBe('Mehl');
  });

  it('should trim whitespace from name and instructions', async () => {
    const state = buildValidState({
      recipeName: '  Salat  ',
      instructions: '  Waschen und schneiden.  ',
    });

    await createRecipe(state);

    const body = JSON.parse(
      ((fetch as ReturnType<typeof vi.fn>).mock.calls[0]![1] as RequestInit)
        .body as string,
    );
    expect(body.name).toBe('Salat');
    expect(body.instructions).toBe('Waschen und schneiden.');
  });

  it('should throw on non-ok response', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: () => Promise.resolve('Bad Request'),
    });

    await expect(createRecipe(buildValidState())).rejects.toThrow(
      /failed.*400/i,
    );
  });
});
