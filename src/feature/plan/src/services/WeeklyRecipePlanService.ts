import type { RecipeComponent } from '../shared/types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '';

export type RecipePlanResponseDto = {
  id: number | string;
  planDate: string;
  recipe: RecipeResponseDto;
};

export type RecipePlanRequestDto = {
  weekStart: string;
  recipeIds: Array<number | string>;
};

export type RecipeResponseDto = {
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

export async function fetchWeeklyRecipePlan(
  weekStart: Date,
): Promise<RecipePlanResponseDto[]> {
  const url = new URL(
    `${API_BASE_URL}/api/recipe-plans`,
    globalThis.location.origin,
  );
  url.searchParams.set('weekStart', formatDateOnly(weekStart));

  const response = await fetch(toRequestUrl(url), {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`GET /api/recipe-plans failed (${response.status})`);
  }

  return (await response.json()) as RecipePlanResponseDto[];
}

export async function saveWeeklyRecipePlan(
  weekStart: Date,
  recipeIds: Array<number | string>,
): Promise<RecipePlanResponseDto[]> {
  const url = new URL(
    `${API_BASE_URL}/api/recipe-plans`,
    globalThis.location.origin,
  );

  const response = await fetch(toRequestUrl(url), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      weekStart: formatDateOnly(weekStart),
      recipeIds,
    } satisfies RecipePlanRequestDto),
  });

  if (!response.ok) {
    throw new Error(`POST /api/recipe-plans failed (${response.status})`);
  }

  return (await response.json()) as RecipePlanResponseDto[];
}

export async function refreshRecipePlanDay(
  planDate: Date,
): Promise<RecipePlanResponseDto> {
  const dateKey = formatDateOnly(planDate);
  const url = new URL(
    `${API_BASE_URL}/api/recipe-plans/${dateKey}/refresh`,
    globalThis.location.origin,
  );

  const response = await fetch(toRequestUrl(url), {
    method: 'PATCH',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(
      `PATCH /api/recipe-plans/${dateKey}/refresh failed (${response.status})`,
    );
  }

  return (await response.json()) as RecipePlanResponseDto;
}

export function formatDateOnly(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function toRequestUrl(url: URL) {
  return API_BASE_URL ? url.toString() : `${url.pathname}${url.search}`;
}
