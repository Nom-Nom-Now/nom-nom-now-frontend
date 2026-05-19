const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '';

type CurrentUserResponseDto = {
  createdAt?: string | null;
};

export async function fetchAccountCreatedAt(): Promise<Date | undefined> {
  const url = new URL(`${API_BASE_URL}/auth/me`, window.location.origin);

  const response = await fetch(toRequestUrl(url), {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`GET /auth/me failed (${response.status})`);
  }

  const currentUser = (await response.json()) as CurrentUserResponseDto;
  return parseBackendDate(currentUser.createdAt);
}

export function parseBackendDate(value: string | null | undefined) {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function toRequestUrl(url: URL) {
  return API_BASE_URL ? url.toString() : `${url.pathname}${url.search}`;
}
