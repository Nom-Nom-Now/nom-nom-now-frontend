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
    headers: buildApiHeaders(init.headers),
    redirect: init.redirect ?? 'manual',
  });

  if (isUnauthorizedResponse(response)) {
    unauthorizedHandler();
    throw new UnauthorizedError(normalizeUnauthorizedStatus(response));
  }

  return response;
}

function buildApiHeaders(headers: HeadersInit | undefined) {
  const apiHeaders = new Headers(headers);
  if (!apiHeaders.has('X-Requested-With')) {
    apiHeaders.set('X-Requested-With', 'XMLHttpRequest');
  }

  return apiHeaders;
}

function isUnauthorizedResponse(response: Response) {
  return (
    response.status === 401 ||
    response.status === 403 ||
    response.type === 'opaqueredirect'
  );
}

function normalizeUnauthorizedStatus(response: Response) {
  return response.status === 403 ? 403 : 401;
}
