import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Recipe } from '../shared/types';
import {
  resolveBackendResourceUrl,
  useRecipeListStore,
} from '../../../recipes/list/src/stores/useRecipeListStore';
import {
  formatDateOnly,
  fetchWeeklyRecipePlan,
  refreshRecipePlanDay,
  saveWeeklyRecipePlan,
  type RecipePlanResponseDto,
  type RecipeResponseDto,
} from '../services/WeeklyRecipePlanService.ts';

export const useRecipePlanStore = defineStore('recipePlan', () => {
  const recipes = ref<Recipe[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const refreshingDayKeys = ref<string[]>([]);

  function getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setHours(0, 0, 0, 0);
    return new Date(d.setDate(diff));
  }

  function isWeekBeforeAccountCreation(
    weekStart: Date | undefined,
    accountCreatedAt: Date | undefined,
  ): boolean {
    if (!weekStart || !accountCreatedAt) {
      return false;
    }

    return (
      getStartOfWeek(weekStart).getTime() <
      getStartOfWeek(accountCreatedAt).getTime()
    );
  }

  async function fetchRecipes(
    weekStart?: Date,
    accountCreatedAt?: Date,
    forceRandom = false,
  ) {
    if (isWeekBeforeAccountCreation(weekStart, accountCreatedAt)) {
      recipes.value = [];
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      if (weekStart && !forceRandom) {
        const savedPlan = await fetchWeeklyRecipePlan(weekStart);

        if (savedPlan.length > 0) {
          recipes.value = savedPlan
            .sort((left, right) => left.planDate.localeCompare(right.planDate))
            .map(mapPlannedRecipe);
          return;
        }
      }

      const recipeListStore = useRecipeListStore();
      await recipeListStore.fetchRecipes();

      if (recipeListStore.error) {
        throw new Error(recipeListStore.error);
      }

      const generatedRecipes = shuffleRecipesForWeek(
        recipeListStore.recipes,
        weekStart,
        forceRandom,
      );

      if (generatedRecipes.length === 0) {
        throw new Error('No recipes available for creating a weekly plan.');
      }

      if (weekStart) {
        const savedPlan = await saveWeeklyRecipePlan(
          weekStart,
          generatedRecipes.map((recipe) => recipe.id),
        );

        if (savedPlan.length === 0) {
          throw new Error('Meal plan could not be created.');
        }

        recipes.value = savedPlan
          .sort((left, right) => left.planDate.localeCompare(right.planDate))
          .map(mapPlannedRecipe);
        return;
      }

      recipes.value = generatedRecipes;
    } catch (fetchError) {
      error.value =
        fetchError instanceof Error
          ? fetchError.message
          : 'Meal plan could not be loaded.';
      recipes.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function refreshDay(
    weekStart: Date,
    dayIndex: number,
    accountCreatedAt?: Date,
  ) {
    const planDate = new Date(weekStart);
    planDate.setDate(planDate.getDate() + dayIndex);

    if (isWeekBeforeAccountCreation(planDate, accountCreatedAt)) {
      return;
    }

    const dayKey = formatDateOnly(planDate);
    setDayRefreshing(dayKey, true);
    error.value = null;

    try {
      const refreshedPlan = await refreshRecipePlanDay(planDate);
      const nextRecipes = [...recipes.value];

      nextRecipes[dayIndex] = mapPlannedRecipe(refreshedPlan);
      recipes.value = nextRecipes;
    } catch (refreshError) {
      error.value =
        refreshError instanceof Error
          ? refreshError.message
          : 'Meal plan day could not be refreshed.';
    } finally {
      setDayRefreshing(dayKey, false);
    }
  }

  function setDayRefreshing(dayKey: string, isRefreshing: boolean) {
    refreshingDayKeys.value = isRefreshing
      ? [...new Set([...refreshingDayKeys.value, dayKey])]
      : refreshingDayKeys.value.filter(
          (refreshingKey) => refreshingKey !== dayKey,
        );
  }

  return {
    recipes,
    isLoading,
    error,
    refreshingDayKeys,
    fetchRecipes,
    refreshDay,
  };
});

function shuffleRecipesForWeek(
  availableRecipes: Recipe[],
  weekStart?: Date,
  forceRandom = false,
): Recipe[] {
  const recipesToShuffle = [...availableRecipes];

  const random =
    forceRandom || !weekStart
      ? Math.random
      : createSeededRandom(getWeekSeed(weekStart));

  for (let index = recipesToShuffle.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    const currentRecipe = recipesToShuffle[index]!;

    recipesToShuffle[index] = recipesToShuffle[randomIndex]!;
    recipesToShuffle[randomIndex] = currentRecipe;
  }

  return recipesToShuffle.slice(0, 7);
}

function getWeekSeed(weekStart: Date): number {
  const startOfWeek = new Date(weekStart);
  startOfWeek.setHours(0, 0, 0, 0);

  return Math.floor(startOfWeek.getTime() / 86_400_000);
}

function createSeededRandom(seed: number): () => number {
  let currentSeed = seed;

  return () => {
    currentSeed = (currentSeed * 16_807) % 2_147_483_647;
    return (currentSeed - 1) / 2_147_483_646;
  };
}

function mapPlannedRecipe(plan: RecipePlanResponseDto): Recipe {
  return mapRecipeResponse(plan.recipe);
}

function mapRecipeResponse(recipe: RecipeResponseDto): Recipe {
  return {
    id: String(recipe.id),
    title: recipe.name,
    imageUrl: resolveBackendResourceUrl(recipe.imageUrl),
    duration: formatPlanDuration(recipe.cookingTime),
    servings: recipe.servings ?? 1,
    cost: formatPlanCost(recipe.pricePerPerson),
    description: recipe.instructions?.trim() || 'Keine Beschreibung vorhanden.',
    owner: recipe.ownerName || 'Unbekannter Koch',
    ingredients: (recipe.components || []).map((comp) => ({
      ingredientName: comp.ingredientName,
      quantity: comp.quantity,
      unit: comp.unit,
    })),
    categories: parseCategories(recipe.categories),
  };
}

function parseCategories(categoryNamesString: string | null): string[] {
  if (!categoryNamesString || categoryNamesString.trim() === '') {
    return [];
  }

  return categoryNamesString
    .split(',')
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
}

function formatPlanDuration(cookingTime: number | null) {
  if (cookingTime === null) {
    return '-';
  }

  return `${cookingTime}min`;
}

function formatPlanCost(pricePerPerson: number | null) {
  if (pricePerPerson === null) {
    return '-';
  }

  return `${(pricePerPerson / 100).toFixed(2)} EUR`;
}
