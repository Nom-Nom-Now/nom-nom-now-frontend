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

    const [, init] = vi.mocked(fetch).mock.calls[0] ?? [];
    expect(init).toMatchObject({
      method: 'POST',
      credentials: 'include',
      redirect: 'manual',
    });
    expect(init?.headers).toBeInstanceOf(Headers);
    expect((init?.headers as Headers).get('X-Requested-With')).toBe(
      'XMLHttpRequest',
    );
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

  it('redirects when an auth request becomes an opaque OAuth redirect', async () => {
    const onUnauthorized = vi.fn();
    setUnauthorizedHandler(onUnauthorized);
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ status: 0, type: 'opaqueredirect' }),
    );

    await expect(apiFetch('/api/test')).rejects.toMatchObject({
      status: 401,
    });
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
