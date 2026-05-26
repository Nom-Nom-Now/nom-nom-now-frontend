import type { CreateRecipeState, Ingredient } from '../shared/types/recipe';
import type {
  CreateRecipeRequestDto,
  CreateRecipeComponentDto,
  CreateRecipeResponseDto,
} from './createRecipeApi.ts';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '';

type ApiErrorResponse = {
  error?: unknown;
  message?: unknown;
};

// ---------------------------------------------------------------------------
// Mapping: Frontend domain model → Backend DTO
// ---------------------------------------------------------------------------

function mapIngredientToComponent(
  ingredient: Ingredient,
): CreateRecipeComponentDto {
  return {
    name: ingredient.name.trim(),
    quantity: ingredient.amount ?? 0,
    unit: ingredient.unit,
  };
}

function mapStateToRequestDto(
  state: CreateRecipeState,
): CreateRecipeRequestDto {
  return {
    name: state.recipeName.trim(),
    instructions: state.instructions?.trim() ?? '',
    cookingTime: state.cookingTime ?? 0,
    pricePerPerson: state.pricePerPerson ?? undefined,
    categoryIds: state.categoryIds ?? [],
    components: state.ingredients
      .filter(
        (i) => i.name.trim().length > 0 && i.amount !== null && i.amount > 0,
      )
      .map(mapIngredientToComponent),
  };
}

// ---------------------------------------------------------------------------
// HTTP helper
// ---------------------------------------------------------------------------

async function postJson<TReq, TRes>(path: string, body: TReq): Promise<TRes> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(formatPostError(path, response.status, text));
  }

  return text ? (JSON.parse(text) as TRes) : ({} as TRes);
}

async function postMultipart<TRes>(
  path: string,
  recipe: CreateRecipeRequestDto,
  image: File,
): Promise<TRes> {
  const formData = new FormData();
  formData.append(
    'recipe',
    new Blob([JSON.stringify(recipe)], { type: 'application/json' }),
  );
  formData.append('image', image, image.name);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(formatPostError(path, response.status, text));
  }

  return text ? (JSON.parse(text) as TRes) : ({} as TRes);
}

function formatPostError(path: string, status: number, text: string): string {
  if (status >= 500) {
    return `POST ${path} failed (${status}). Please try again.`;
  }

  const apiError = parseApiError(text);
  if (apiError) {
    if (typeof apiError.message === 'string' && apiError.message.length > 0) {
      return apiError.message;
    }

    if (typeof apiError.error === 'string' && apiError.error.length > 0) {
      return `POST ${path} failed (${status}): ${apiError.error}`;
    }
  }

  return text
    ? `POST ${path} failed (${status}): ${text}`
    : `POST ${path} failed (${status})`;
}

function parseApiError(text: string): ApiErrorResponse | null {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as ApiErrorResponse;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function createRecipe(
  state: CreateRecipeState,
): Promise<CreateRecipeResponseDto> {
  const dto = mapStateToRequestDto(state);
  if (state.recipeImage) {
    return postMultipart<CreateRecipeResponseDto>(
      '/recipes',
      dto,
      state.recipeImage,
    );
  }

  return postJson<CreateRecipeRequestDto, CreateRecipeResponseDto>(
    '/recipes',
    dto,
  );
}
