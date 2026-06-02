import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  formatDateOnly,
  refreshRecipePlanDay,
  refreshWeeklyRecipePlan,
} from '../services/WeeklyRecipePlanService';

describe('WeeklyRecipePlanService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should format dates without timezone shifts', () => {
    expect(formatDateOnly(new Date(2026, 4, 27, 23, 30))).toBe('2026-05-27');
  });

  it('should refresh one plan day through the day refresh endpoint', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 10,
            planDate: '2026-05-27',
            recipe: {
              id: 42,
              name: 'Pasta',
              instructions: null,
              cookingTime: null,
              servings: 1,
              pricePerPerson: null,
              imageUrl: null,
              ownerName: 'Chef',
              categories: null,
              components: [],
            },
          }),
      }),
    );

    const response = await refreshRecipePlanDay(new Date(2026, 4, 27));

    const [, init] = vi.mocked(fetch).mock.calls[0] ?? [];
    expect(init).toMatchObject({
      method: 'PATCH',
      credentials: 'include',
      redirect: 'manual',
    });
    expect(init?.headers).toBeInstanceOf(Headers);
    expect((init?.headers as Headers).get('X-Requested-With')).toBe(
      'XMLHttpRequest',
    );
    expect(response.planDate).toBe('2026-05-27');
  });

  it('should refresh a whole plan week through the week refresh endpoint', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 10,
              planDate: '2026-06-01',
              recipe: {
                id: 42,
                name: 'Pasta',
                instructions: null,
                cookingTime: null,
                servings: 1,
                pricePerPerson: null,
                imageUrl: null,
                ownerName: 'Chef',
                categories: null,
                components: [],
              },
            },
          ]),
      }),
    );

    const response = await refreshWeeklyRecipePlan(new Date(2026, 5, 1));

    const [url, init] = vi.mocked(fetch).mock.calls[0] ?? [];
    expect(url).toBe('/api/recipe-plans/refresh?weekStart=2026-06-01');
    expect(init).toMatchObject({
      method: 'PATCH',
      credentials: 'include',
      redirect: 'manual',
    });
    expect(init?.headers).toBeInstanceOf(Headers);
    expect((init?.headers as Headers).get('X-Requested-With')).toBe(
      'XMLHttpRequest',
    );
    expect(response[0]?.planDate).toBe('2026-06-01');
  });
});
