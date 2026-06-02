import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useRecipePlanStore } from '../stores/useRecipePlanStore';
import type {
  RecipePlanResponseDto,
  RecipeResponseDto,
} from '../services/WeeklyRecipePlanService';

const serviceMocks = vi.hoisted(() => ({
  fetchWeeklyRecipePlan: vi.fn(),
  refreshRecipePlanDay: vi.fn(),
  saveWeeklyRecipePlan: vi.fn(),
}));

vi.mock('../services/WeeklyRecipePlanService.ts', () => ({
  ...serviceMocks,
  formatDateOnly: (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
  },
}));

vi.mock('../../../recipes/list/src/stores/useRecipeListStore', () => ({
  resolveBackendResourceUrl: (imageUrl: string | null) => imageUrl,
  useRecipeListStore: () => ({
    recipes: [],
    error: null,
    fetchRecipes: vi.fn(),
  }),
}));

function createRecipeResponse(
  id: number,
  name: string,
): RecipeResponseDto {
  return {
    id,
    name,
    instructions: 'Beschreibung',
    cookingTime: 30,
    servings: 2,
    pricePerPerson: 4.2,
    imageUrl: null,
    ownerName: 'Chef',
    categories: null,
    components: [],
  };
}

function createPlannedRecipe(
  planDate: string,
  recipe: RecipeResponseDto,
): RecipePlanResponseDto {
  return {
    id: `${planDate}-${recipe.id}`,
    planDate,
    recipe,
  };
}

describe('useRecipePlanStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    serviceMocks.fetchWeeklyRecipePlan.mockReset();
    serviceMocks.refreshRecipePlanDay.mockReset();
    serviceMocks.saveWeeklyRecipePlan.mockReset();
  });

  it('maps saved plans to fixed weekday slots instead of compacting recipes', async () => {
    serviceMocks.fetchWeeklyRecipePlan.mockResolvedValue([
      createPlannedRecipe(
        '2026-06-01',
        createRecipeResponse(1, 'Montag Rezept'),
      ),
      createPlannedRecipe(
        '2026-06-03',
        createRecipeResponse(3, 'Mittwoch Rezept'),
      ),
    ]);

    const store = useRecipePlanStore();

    await store.fetchRecipes(new Date('2026-06-01T00:00:00'));

    expect(store.recipes).toHaveLength(7);
    expect(store.recipes.map((recipe) => recipe?.title ?? null)).toEqual([
      'Montag Rezept',
      null,
      'Mittwoch Rezept',
      null,
      null,
      null,
      null,
    ]);
  });
});
