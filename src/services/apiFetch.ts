import { redirectToLogin } from './authRedirect';

export class UnauthorizedError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`Request is not authenticated (${status})`);
    this.name = 'UnauthorizedError';
    this.status = status;
  }
}

let unauthorizedHandler: () => void = redirectToLogin;

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler;
}

export function resetUnauthorizedHandler() {
  unauthorizedHandler = redirectToLogin;
}

export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
) {
  const response = await fetch(input, {
    ...init,
    credentials: init.credentials ?? 'include',
  });

  if (response.status === 401 || response.status === 403) {
    unauthorizedHandler();
    throw new UnauthorizedError(response.status);
  }

  return response;
}
