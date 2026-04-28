import type { GetCategoriesResponseDto } from './categoryApiTypes.ts';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '';

async function getJson<TRes>(path: string): Promise<TRes> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`GET ${path} failed (${response.status}): ${text}`);
  }

  return text ? (JSON.parse(text) as TRes) : ({} as TRes);
}

export async function getCategories(): Promise<GetCategoriesResponseDto> {
  return getJson<GetCategoriesResponseDto>('/categories');
}
