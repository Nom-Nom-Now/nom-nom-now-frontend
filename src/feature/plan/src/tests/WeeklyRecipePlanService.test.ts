import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  formatDateOnly,
  refreshRecipePlanDay,
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
            recipe: { id: 42, name: 'Pasta', components: [] },
          }),
      }),
    );

    const response = await refreshRecipePlanDay(new Date(2026, 4, 27));

    expect(fetch).toHaveBeenCalledWith('/api/recipe-plans/2026-05-27/refresh', {
      method: 'PATCH',
      credentials: 'include',
    });
    expect(response.planDate).toBe('2026-05-27');
  });
});
