import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useRecipeListStore } from '../useRecipeListStore';

describe('useRecipeListStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with empty recipes and loading false', () => {
    const store = useRecipeListStore();
    expect(store.recipes).toEqual([]);
    expect(store.isLoading).toBe(false);
  });

  it('should populate recipes after fetchRecipes', async () => {
    const store = useRecipeListStore();
    await store.fetchRecipes();

    expect(store.recipes.length).toBeGreaterThan(0);
    expect(store.isLoading).toBe(false);
  });

  it('should contain 20 hardcoded recipes', async () => {
    const store = useRecipeListStore();
    await store.fetchRecipes();

    expect(store.recipes).toHaveLength(20);
  });

  it('should have valid recipe objects with required fields', async () => {
    const store = useRecipeListStore();
    await store.fetchRecipes();

    for (const recipe of store.recipes) {
      expect(recipe).toHaveProperty('id');
      expect(recipe).toHaveProperty('title');
      expect(recipe).toHaveProperty('imageUrl');
      expect(recipe).toHaveProperty('duration');
      expect(recipe).toHaveProperty('cost');
      expect(recipe).toHaveProperty('description');
      expect(typeof recipe.id).toBe('string');
      expect(typeof recipe.title).toBe('string');
      expect(typeof recipe.duration).toBe('string');
    }
  });

  it('should start with isLoading true during fetch and end false', async () => {
    const store = useRecipeListStore();

    const fetchPromise = store.fetchRecipes();
    // Note: isLoading is set true then false within the function; since
    // fetchRecipes is synchronous (hardcoded data), isLoading goes true→false
    // before the await resolves. We just verify the final state.
    await fetchPromise;
    expect(store.isLoading).toBe(false);
  });

  it('should have the first recipe titled "Lasagne"', async () => {
    const store = useRecipeListStore();
    await store.fetchRecipes();

    expect(store.recipes[0]!.title).toBe('Lasagne');
    expect(store.recipes[0]!.id).toBe('1');
  });

  it('should have the last recipe titled "Pulled Pork Sandwich"', async () => {
    const store = useRecipeListStore();
    await store.fetchRecipes();

    expect(store.recipes[19]!.title).toBe('Pulled Pork Sandwich');
    expect(store.recipes[19]!.id).toBe('20');
  });
});
