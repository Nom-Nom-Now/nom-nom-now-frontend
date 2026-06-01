import type {
  GetCategoriesResponseDto,
  CategoryResponseDto,
  SuperCategoryResponseDto,
} from '../../../create/src/services/categoryApiTypes.ts';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '';

export type { GetCategoriesResponseDto, CategoryResponseDto, SuperCategoryResponseDto };

export async function fetchCategories(): Promise<GetCategoriesResponseDto> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`GET /categories failed (${response.status}): ${text}`);
  }

  return text ? (JSON.parse(text) as GetCategoriesResponseDto) : { superCategories: [], categories: [] };
}

export interface FilterByCategoriesResponseDto {
  content: Array<{
    id: number | string;
    name: string;
    instructions: string | null;
    cookingTime: number | null;
    pricePerPerson: number | null;
    imageUrl: string | null;
    ownerName: string;
    categories: string | null;
    components: Array<{
      ingredientName: string;
      quantity: number | null;
      unit: string | null;
    }>;
  }>;
  number: number;
  last: boolean;
}

export async function filterRecipesByCategories(
  categoryIds: number[],
  page: number = 0,
  size: number = 20,
  signal?: AbortSignal,
): Promise<FilterByCategoriesResponseDto> {
  const url = new URL(`${API_BASE_URL}/recipes/filter/categories`, window.location.origin);
  url.searchParams.set('page', String(page));
  url.searchParams.set('size', String(size));

  const requestUrl = API_BASE_URL ? url.toString() : `${url.pathname}${url.search}`;

  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ categoryIds }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`POST /recipes/filter/categories failed (${response.status})`);
  }

  return (await response.json()) as FilterByCategoriesResponseDto;
}

