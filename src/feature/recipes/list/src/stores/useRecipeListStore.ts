import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Recipe, RecipeComponent } from '../shared/types';
import { apiFetch } from '../../../../../services/apiFetch';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '';
const PAGE_SIZE = 20;

type RecipeResponseDto = {
  id: number | string;
  name: string;
  instructions: string | null;
  cookingTime: number | null;
  pricePerPerson: number | null;
  imageUrl: string | null;
  ownerName: string;
  categories: string | null;
  components: RecipeComponent[];
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
  const currentOwnerId = ref<string | undefined>(undefined);
  const searchQuery = ref<string | undefined>(undefined);

  const canLoadMore = computed(() => !isLoading.value && !isLastPage.value);

  let abortController: AbortController | null = null;

  async function fetchRecipes(ownerId?: string, newSearchQuery?: string) {
    abortController?.abort();
    abortController = new AbortController();

    recipes.value = [];
    currentPage.value = -1;
    isLastPage.value = false;
    error.value = null;
    isLoading.value = false;
    currentOwnerId.value = ownerId;
    searchQuery.value = newSearchQuery;

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
      const signal = abortController?.signal;

      const page = await fetchRecipePage(
        nextPage,
        currentOwnerId.value,
        searchQuery.value,
        signal,
      );

      const nextRecipes = page.content.map((recipe) => mapRecipe(recipe));
      const knownRecipeIds = new Set(recipes.value.map((recipe) => recipe.id));

      recipes.value = [
        ...recipes.value,
        ...nextRecipes.filter((recipe) => !knownRecipeIds.has(recipe.id)),
      ];
      currentPage.value = page.number;
      isLastPage.value = page.last;
    } catch (fetchError) {
      if (
        fetchError instanceof DOMException &&
        fetchError.name === 'AbortError'
      ) {
        return;
      }
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
    searchQuery,
    fetchRecipes,
    fetchNextPage,
  };
});

async function fetchRecipePage(
  page: number,
  ownerId?: string,
  searchQuery?: string,
  signal?: AbortSignal,
): Promise<RecipePageDto> {
  const basePath = ownerId ? `/recipes/user/${ownerId}` : '/recipes';
  const url = new URL(`${API_BASE_URL}${basePath}`, window.location.origin);
  url.searchParams.set('page', String(page));
  url.searchParams.set('size', String(PAGE_SIZE));

  if (searchQuery) {
    url.searchParams.set('q', searchQuery);
  }

  const response = await apiFetch(toRequestUrl(url), {
    credentials: 'include',
    signal,
  });

  if (!response.ok) {
    throw new Error(`GET ${basePath} failed (${response.status})`);
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
    owner: recipe.ownerName || 'Unbekannter Koch',
    ingredients: (recipe.components || []).map((comp) => ({
      ingredientName: comp.ingredientName,
      quantity: comp.quantity,
      unit: comp.unit,
    })),
    categories: parseCategoryNames(recipe.categories),
  };
}

function parseCategoryNames(categoryNamesString: string | null): string[] {
  if (!categoryNamesString || categoryNamesString.trim() === '') {
    return [];
  }

  return categoryNamesString
    .split(',')
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
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
  return `${trimTrailingSlashes(baseUrl)}/${trimLeadingSlashes(path)}`;
}

function trimTrailingSlashes(value: string) {
  let end = value.length;
  while (end > 0 && value[end - 1] === '/') {
    end -= 1;
  }

  return value.slice(0, end);
}

function trimLeadingSlashes(value: string) {
  let start = 0;
  while (start < value.length && value[start] === '/') {
    start += 1;
  }

  return value.slice(start);
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
