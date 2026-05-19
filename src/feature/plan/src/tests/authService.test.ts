import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchAccountCreatedAt, parseBackendDate } from '../services/authService';

describe('authService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch the current account creation date', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            createdAt: '2026-05-01T12:30:00Z',
          }),
      }),
    );

    const createdAt = await fetchAccountCreatedAt();

    expect(fetch).toHaveBeenCalledWith('/auth/me', {
      credentials: 'include',
    });
    expect(createdAt?.toISOString()).toBe('2026-05-01T12:30:00.000Z');
  });

  it('should ignore missing or invalid backend dates', () => {
    expect(parseBackendDate(null)).toBeUndefined();
    expect(parseBackendDate('not-a-date')).toBeUndefined();
  });
});
