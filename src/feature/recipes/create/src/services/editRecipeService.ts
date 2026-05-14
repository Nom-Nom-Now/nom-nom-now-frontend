/**
 * Service for fetching and updating existing recipes (edit flow).
 * Uses the same DTO shapes as the create flow.
 */

import type { CreateRecipeState } from '../shared/types/recipe';
import type { Unit } from '../shared/types/units';
import type {
  CreateRecipeRequestDto,
  CreateRecipeResponseDto,
} from './createRecipeApi.ts';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '';

// --- Response type for single recipe fetch ---

export interface RecipeDetailResponseDto {
  id: number;
  name: string;
  instructions: string;
  cookingTime: number;
  pricePerPerson: number | null;
  ownerName: string;
  categories: string;
  components: {
    ingredientId: number;
    ingredientName: string;
    quantity: number;
    unit: string;
  }[];
}

// --- Mapping: Backend response → Frontend state ---

export function mapResponseToState(
  response: RecipeDetailResponseDto,
): CreateRecipeState {
  return {
    recipeName: response.name,
    servings: 1,
    instructions: response.instructions,
    cookingTime: response.cookingTime,
    categoryIds: response.categories
      ? response.categories.split(',').map((id) => Number(id.trim())).filter(Boolean)
      : [],
    ingredients: response.components.map((c, idx) => ({
      id: idx + 1,
      amount: c.quantity,
      unit: c.unit as Unit,
      name: c.ingredientName,
    })),
  };
}

// --- Mapping: Frontend state → Backend DTO (same as create) ---

function mapStateToRequestDto(state: CreateRecipeState): CreateRecipeRequestDto {
  return {
    name: state.recipeName.trim(),
    instructions: state.instructions?.trim() ?? '',
    cookingTime: state.cookingTime ?? 0,
    categoryIds: state.categoryIds ?? [],
    components: state.ingredients
      .filter(
        (i) => i.name.trim().length > 0 && i.amount !== null && i.amount > 0,
      )
      .map((i) => ({
        name: i.name.trim(),
        quantity: i.amount ?? 0,
        unit: i.unit,
      })),
  };
}

// --- HTTP helpers ---

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GET ${path} failed (${response.status}): ${text}`);
  }
  return response.json() as Promise<T>;
}

async function putJson<TReq, TRes>(path: string, body: TReq): Promise<TRes> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`PUT ${path} failed (${response.status}): ${text}`);
  }
  return text ? (JSON.parse(text) as TRes) : ({} as TRes);
}

// --- Public API ---

export async function getRecipe(id: number): Promise<RecipeDetailResponseDto> {
  return getJson<RecipeDetailResponseDto>(`/recipes/${id}`);
}

export async function updateRecipe(
  id: number,
  state: CreateRecipeState,
): Promise<CreateRecipeResponseDto> {
  const dto = mapStateToRequestDto(state);
  return putJson<CreateRecipeRequestDto, CreateRecipeResponseDto>(
    `/recipes/${id}`,
    dto,
  );
}
