import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import PlanFrame from '../components/PlanFrame.vue';
import { generateShoppingList } from '../../../shopping-lists/src/services/ShoppingListService';

const pushMock = vi.fn();
const fetchRecipesMock = vi.fn();

const storeMock = {
  recipes: [],
  isLoading: false,
  error: null as string | null,
  refreshingDayKeys: [],
  fetchRecipes: fetchRecipesMock,
  refreshDay: vi.fn(),
};

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../stores/useRecipePlanStore.ts', () => ({
  useRecipePlanStore: () => storeMock,
}));

vi.mock('../services/authService.ts', () => ({
  fetchAccountCreatedAt: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../../shopping-lists/src/services/ShoppingListService', () => ({
  generateShoppingList: vi.fn(),
}));

describe('PlanFrame', () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);

    pushMock.mockReset();
    fetchRecipesMock.mockResolvedValue(undefined);
    storeMock.error = null;
    vi.mocked(generateShoppingList).mockReset();
  });

  it('should generate a shopping list for the visible week and navigate to it', async () => {
    vi.mocked(generateShoppingList).mockResolvedValue({
      id: 7,
      weekStart: '2026-05-25',
      createdAt: '2026-05-31T12:00:00Z',
      items: [],
    });

    const wrapper = mount(PlanFrame, {
      global: {
        plugins: [createPinia()],
        stubs: {
          PlanGridContent: true,
          RecipeDetailFull: true,
        },
        provide: {
          currentUsername: undefined,
        },
      },
    });

    await nextTick();
    await wrapper.find('md-filled-tonal-button').trigger('click');
    await nextTick();

    expect(generateShoppingList).toHaveBeenCalledOnce();
    expect(pushMock).toHaveBeenCalledWith('/shopping-lists/7');
  });
});
