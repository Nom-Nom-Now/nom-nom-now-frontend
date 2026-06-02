import { apiFetch } from '../../../../services/apiFetch';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '';

export type ShoppingListSummaryDto = {
  id: number | string;
  weekStart: string;
  createdAt: string;
  itemCount: number;
};

export type ShoppingListDto = {
  id: number | string;
  weekStart: string;
  createdAt: string;
  items: ShoppingListItemDto[];
};

export type ShoppingListItemDto = {
  ingredientName: string;
  quantity: number;
  unit: string;
};

export async function generateShoppingList(
  weekStart: Date,
): Promise<ShoppingListDto> {
  const url = new URL(
    `${API_BASE_URL}/api/shopping-lists`,
    globalThis.location.origin,
  );

  const response = await apiFetch(toRequestUrl(url), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      weekStart: formatDateOnly(weekStart),
    }),
  });

  if (!response.ok) {
    throw new Error(`POST /api/shopping-lists failed (${response.status})`);
  }

  return (await response.json()) as ShoppingListDto;
}

export async function fetchShoppingLists(): Promise<ShoppingListSummaryDto[]> {
  const url = new URL(
    `${API_BASE_URL}/api/shopping-lists`,
    globalThis.location.origin,
  );

  const response = await apiFetch(toRequestUrl(url), {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`GET /api/shopping-lists failed (${response.status})`);
  }

  return (await response.json()) as ShoppingListSummaryDto[];
}

export async function fetchShoppingList(
  id: number | string,
): Promise<ShoppingListDto> {
  const normalizedId = String(id).trim();
  if (!normalizedId) {
    throw new Error('Shopping list id is required.');
  }

  const url = new URL(
    `${API_BASE_URL}/api/shopping-lists/${normalizedId}`,
    globalThis.location.origin,
  );

  const response = await apiFetch(toRequestUrl(url), {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(
      `GET /api/shopping-lists/${normalizedId} failed (${response.status})`,
    );
  }

  return (await response.json()) as ShoppingListDto;
}

export async function deleteShoppingList(id: number | string): Promise<void> {
  const normalizedId = String(id).trim();
  if (!normalizedId) {
    throw new Error('Shopping list id is required.');
  }

  const url = new URL(
    `${API_BASE_URL}/api/shopping-lists/${normalizedId}`,
    globalThis.location.origin,
  );

  const response = await apiFetch(toRequestUrl(url), {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(
      `DELETE /api/shopping-lists/${normalizedId} failed (${response.status})`,
    );
  }
}

function formatDateOnly(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function toRequestUrl(url: URL) {
  return API_BASE_URL ? url.toString() : `${url.pathname}${url.search}`;
}
