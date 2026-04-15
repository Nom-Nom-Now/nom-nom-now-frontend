import type { CreateRecipeState, Ingredient } from '../shared/types/recipe';
import type {
  CreateRecipeRequestDto,
  CreateRecipeComponentDto,
  CreateRecipeResponseDto,
} from './createRecipeApi.ts';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '';

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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`POST ${path} failed (${response.status}): ${text}`);
  }

  return text ? (JSON.parse(text) as TRes) : ({} as TRes);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function createRecipe(
  state: CreateRecipeState,
): Promise<CreateRecipeResponseDto> {
  const dto = mapStateToRequestDto(state);
  return postJson<CreateRecipeRequestDto, CreateRecipeResponseDto>(
    '/recipes',
    dto,
  );
}
