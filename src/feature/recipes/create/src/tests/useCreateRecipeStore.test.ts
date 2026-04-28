import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCreateRecipeStore } from '../stores/useCreateRecipeStore';

describe('useCreateRecipeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with default values', () => {
    const store = useCreateRecipeStore();
    expect(store.recipeName).toBe('');
    expect(store.servings).toBe(1);
    expect(store.ingredients).toHaveLength(3);
    expect(store.instructions).toBe('');
    expect(store.cookingTime).toBe(0);
    expect(store.categoryIds).toEqual([]);
  });

  it('should set recipe name', () => {
    const store = useCreateRecipeStore();
    store.setRecipeName('Pasta');
    expect(store.recipeName).toBe('Pasta');
  });

  it('should not allow servings below 1', () => {
    const store = useCreateRecipeStore();
    store.setServings(0);
    expect(store.servings).toBe(1);
  });

  it('should add an ingredient', () => {
    const store = useCreateRecipeStore();
    store.addIngredient();
    expect(store.ingredients).toHaveLength(4);
  });

  it('should remove an ingredient', () => {
    const store = useCreateRecipeStore();
    store.removeIngredient(1);
    expect(store.ingredients).toHaveLength(2);
  });

  it('should update ingredient name', () => {
    const store = useCreateRecipeStore();
    store.updateIngredientName(1, 'Tomato');
    expect(store.ingredients[0]!.name).toBe('Tomato');
  });

  it('should update ingredient amount', () => {
    const store = useCreateRecipeStore();
    store.updateIngredientAmount(1, 500);
    expect(store.ingredients[0]!.amount).toBe(500);
  });

  it('should validate ingredients step correctly', () => {
    const store = useCreateRecipeStore();
    expect(store.isIngredientsStepValid).toBe(false);

    store.setRecipeName('Test');
    store.updateIngredientName(1, 'A');
    store.updateIngredientAmount(1, 1);
    store.updateIngredientName(2, 'B');
    store.updateIngredientAmount(2, 2);
    store.updateIngredientName(3, 'C');
    store.updateIngredientAmount(3, 3);

    expect(store.isIngredientsStepValid).toBe(true);
  });

  it('should reset store', () => {
    const store = useCreateRecipeStore();
    store.setRecipeName('Test');
    store.setServings(5);
    store.$reset();
    expect(store.recipeName).toBe('');
    expect(store.servings).toBe(1);
    expect(store.ingredients).toHaveLength(3);
  });
});
