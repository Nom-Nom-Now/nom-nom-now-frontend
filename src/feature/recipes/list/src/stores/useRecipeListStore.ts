import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Recipe } from '../shared/types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '';
const PAGE_SIZE = 20;

type RecipeResponseDto = {
  id: number | string;
  name: string;
  instructions: string | null;
  cookingTime: number | null;
  pricePerPerson: number | null;
  imageUrl: string | null;
};

type RecipePageDto = {
  content: RecipeResponseDto[];
  number: number;
  last: boolean;
};

export const useRecipeListStore = defineStore('recipeList', () => {
  const recipes = ref<Recipe[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const currentPage = ref(-1);
  const isLastPage = ref(false);

  const canLoadMore = computed(() => !isLoading.value && !isLastPage.value);

  async function fetchRecipes() {
    recipes.value = [];
    currentPage.value = -1;
    isLastPage.value = false;
    error.value = null;

    await fetchNextPage();
  }

  async function fetchNextPage() {
    if (!canLoadMore.value) {
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const nextPage = currentPage.value + 1;
      const page = await fetchRecipePage(nextPage);
      const nextRecipes = page.content.map(mapRecipe);
      const knownRecipeIds = new Set(recipes.value.map((recipe) => recipe.id));

      recipes.value = [
        ...recipes.value,
        ...nextRecipes.filter((recipe) => !knownRecipeIds.has(recipe.id)),
      ];
      currentPage.value = page.number;
      isLastPage.value = page.last;
    } catch (fetchError) {
      error.value =
        fetchError instanceof Error
          ? fetchError.message
          : 'Recipes could not be loaded.';
    } finally {
      isLoading.value = false;
    }
  }

  return {
    recipes,
    isLoading,
    error,
    canLoadMore,
    fetchRecipes,
    fetchNextPage,
  };
});

async function fetchRecipePage(page: number): Promise<RecipePageDto> {
  const url = new URL(`${API_BASE_URL}/recipes`, window.location.origin);
  url.searchParams.set('page', String(page));
  url.searchParams.set('size', String(PAGE_SIZE));

  const response = await fetch(toRequestUrl(url), {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`GET /recipes failed (${response.status})`);
  }

  return (await response.json()) as RecipePageDto;
}

function toRequestUrl(url: URL) {
  return API_BASE_URL ? url.toString() : `${url.pathname}${url.search}`;
}

function mapRecipe(recipe: RecipeResponseDto): Recipe {
  return {
    id: String(recipe.id),
    title: recipe.name,
    imageUrl: resolveBackendResourceUrl(recipe.imageUrl),
    duration: formatDuration(recipe.cookingTime),
    cost: formatCost(recipe.pricePerPerson),
    description: recipe.instructions?.trim() || 'Keine Beschreibung vorhanden.',
  };
}

export function resolveBackendResourceUrl(
  path: string | null,
  baseUrl = API_BASE_URL,
) {
  if (!path) {
    return null;
  }

  if (!baseUrl) {
    return path;
  }

  try {
    return new URL(path).toString();
  } catch {
    return joinUrlPath(baseUrl, path);
  }
}

function joinUrlPath(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

function formatDuration(cookingTime: number | null) {
  if (cookingTime === null) {
    return '-';
  }

  return `${cookingTime}min`;
}

function formatCost(pricePerPerson: number | null) {
  if (pricePerPerson === null) {
    return '-';
  }

  return `${(pricePerPerson / 100).toFixed(2)} EUR`;
}
