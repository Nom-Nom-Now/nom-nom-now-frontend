import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Recipe } from '../shared/types';
import { useRecipeListStore } from '../../../recipes/list/src/stores/useRecipeListStore';

export const useRecipePlanStore = defineStore('recipePlan', () => {
  const recipes = ref<Recipe[]>([]);
  const isLoading = ref(false);

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

    return getStartOfWeek(weekStart).getTime() < getStartOfWeek(accountCreatedAt).getTime();
  }

  function getWeekSeed(weekStart?: Date, forceRandom = false): number {
    if (!weekStart || forceRandom) {
      return Date.now();
    }

    return Math.floor(weekStart.getTime() / (1000 * 60 * 60 * 24 * 7));
  }

  function shuffleRecipesForWeek(allRecipes: Recipe[], weekStart?: Date, forceRandom = false): Recipe[] {
    const shuffledRecipes = [...allRecipes];
    let seed = getWeekSeed(weekStart, forceRandom);

    for (let index = shuffledRecipes.length - 1; index > 0; index -= 1) {
      seed = (seed * 9301 + 49297) % 233280;
      const swapIndex = seed % (index + 1);

      const currentRecipe = shuffledRecipes[index]!;
      shuffledRecipes[index] = shuffledRecipes[swapIndex]!;
      shuffledRecipes[swapIndex] = currentRecipe;
    }

    return shuffledRecipes.slice(0, 7);
  }

  async function fetchRecipes(weekStart?: Date, accountCreatedAt?: Date, forceRandom = false) {
    if (isWeekBeforeAccountCreation(weekStart, accountCreatedAt)) {
      recipes.value = [];
      return;
    }

    isLoading.value = true;
    try {
      const recipeListStore = useRecipeListStore();
      await recipeListStore.fetchRecipes();
      recipes.value = shuffleRecipesForWeek(recipeListStore.recipes, weekStart, forceRandom);
    } finally {
      isLoading.value = false;
    }
  }

  return { recipes, isLoading, fetchRecipes };
});