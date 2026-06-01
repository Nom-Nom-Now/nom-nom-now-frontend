import type { Ingredient } from '../../../create/src/shared/types/recipe';
import type {
  CreateRecipeRequestDto,
  CreateRecipeResponseDto,
  CreateRecipeComponentDto,
} from '../../../create/src/services/createRecipeApi.ts';
import { apiFetch } from '../../../../../services/apiFetch';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '';

export interface EditRecipePayload {
  recipeName: string;
  servings: number;
  ingredients: Ingredient[];
  instructions: string;
  cookingTime: number;
  categoryIds: number[];
  pricePerPerson: number | null;
}

function mapIngredientToComponent(
  ingredient: Ingredient,
): CreateRecipeComponentDto {
  return {
    name: ingredient.name.trim(),
    quantity: ingredient.amount ?? 0,
    unit: ingredient.unit,
  };
}

function mapPayloadToRequestDto(
  payload: EditRecipePayload,
): CreateRecipeRequestDto {
  return {
    name: payload.recipeName.trim(),
    instructions: payload.instructions?.trim() ?? '',
    cookingTime: payload.cookingTime ?? 0,
    pricePerPerson: payload.pricePerPerson ?? undefined,
    categoryIds: payload.categoryIds ?? [],
    components: payload.ingredients
      .filter(
        (i) => i.name.trim().length > 0 && i.amount !== null && i.amount > 0,
      )
      .map(mapIngredientToComponent),
  };
}

async function putJson<TReq, TRes>(path: string, body: TReq): Promise<TRes> {
  const response = await apiFetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  if (!response.ok)
    throw new Error(`PUT ${path} failed (${response.status}): ${text}`);
  return text ? (JSON.parse(text) as TRes) : ({} as TRes);
}

async function putMultipart<TRes>(
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

  const response = await apiFetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    credentials: 'include',
    body: formData,
  });

  const text = await response.text();
  if (!response.ok)
    throw new Error(`PUT ${path} failed (${response.status}): ${text}`);
  return text ? (JSON.parse(text) as TRes) : ({} as TRes);
}

export async function updateRecipe(
  id: number,
  payload: EditRecipePayload,
  image: File | null,
): Promise<CreateRecipeResponseDto> {
  const dto = mapPayloadToRequestDto(payload);

  if (image) {
    return putMultipart<CreateRecipeResponseDto>(`/recipes/${id}`, dto, image);
  }

  return putJson<CreateRecipeRequestDto, CreateRecipeResponseDto>(
    `/recipes/${id}`,
    dto,
  );
}
