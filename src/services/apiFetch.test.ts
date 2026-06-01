import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  apiFetch,
  resetUnauthorizedHandler,
  setUnauthorizedHandler,
  UnauthorizedError,
} from './apiFetch';
import { buildLoginRedirectUrl } from './authRedirect';

describe('apiFetch', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    resetUnauthorizedHandler();
  });

  it('adds credentials by default', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 200 }));

    await apiFetch('/api/test', { method: 'POST' });

    expect(fetch).toHaveBeenCalledWith('/api/test', {
      method: 'POST',
      credentials: 'include',
    });
  });

  it('redirects once an authenticated request is rejected', async () => {
    const onUnauthorized = vi.fn();
    setUnauthorizedHandler(onUnauthorized);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 401 }));

    await expect(apiFetch('/api/test')).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });
});

describe('authRedirect', () => {
  it('keeps the current route as redirect target', () => {
    expect(buildLoginRedirectUrl('/plan?week=2026-06-01')).toBe(
      '/?sessionExpired=1&redirect=%2Fplan%3Fweek%3D2026-06-01',
    );
  });
});
