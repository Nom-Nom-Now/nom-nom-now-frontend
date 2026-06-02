import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import HomePage from '../pages/HomePage.vue';
import { fetchWeeklyRecipePlan } from '../../../plan/src/services/WeeklyRecipePlanService';
import { fetchShoppingLists } from '../../../shopping-lists/src/services/ShoppingListService';

const pushMock = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: { value: 'de-DE' },
    t: (key: string, values?: Record<string, unknown>) => {
      const count = values?.count;

      if (typeof count === 'number' || typeof count === 'string') {
        return `${count} Zutaten`;
      }

      return key;
    },
  }),
}));

vi.mock('../../../plan/src/services/WeeklyRecipePlanService', async () => {
  const actual = await vi.importActual<
    typeof import('../../../plan/src/services/WeeklyRecipePlanService')
  >('../../../plan/src/services/WeeklyRecipePlanService');

  return {
    ...actual,
    fetchWeeklyRecipePlan: vi.fn(),
  };
});

vi.mock('../../../shopping-lists/src/services/ShoppingListService', () => ({
  fetchShoppingLists: vi.fn(),
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 31, 10, 0, 0));
    vi.mocked(fetchWeeklyRecipePlan).mockReset();
    vi.mocked(fetchShoppingLists).mockReset();
    vi.mocked(fetchWeeklyRecipePlan).mockResolvedValue([
      recipePlan('2026-05-31', 'Sunday Pasta'),
      recipePlan('2026-05-25', 'Monday Soup'),
    ]);
    vi.mocked(fetchShoppingLists).mockResolvedValue([
      {
        id: 9,
        weekStart: '2026-05-25',
        createdAt: '2026-05-31T12:00:00Z',
        itemCount: 4,
      },
    ]);
    pushMock.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should load the current weekly plan and render todays recipe', async () => {
    const wrapper = mount(HomePage);

    await flushPromises();

    const requestedWeekStart = vi.mocked(fetchWeeklyRecipePlan).mock
      .calls[0]?.[0];
    expect(requestedWeekStart?.getFullYear()).toBe(2026);
    expect(requestedWeekStart?.getMonth()).toBe(4);
    expect(requestedWeekStart?.getDate()).toBe(25);
    expect(wrapper.text()).toContain('Sunday Pasta');
    expect(wrapper.text()).toContain('45min');
    expect(wrapper.text()).toContain('4.50 EUR');
  });

  it('should render the weekly strip sorted by plan date', async () => {
    const wrapper = mount(HomePage);

    await flushPromises();

    expect(wrapper.text()).toContain('Monday Soup');
    expect(wrapper.text()).toContain('Sunday Pasta');
    expect(wrapper.text()).toContain('feature.home.noRecipe');
  });

  it('should show the latest shopping list summary', async () => {
    const wrapper = mount(HomePage);

    await flushPromises();

    expect(fetchShoppingLists).toHaveBeenCalledOnce();
    expect(wrapper.text()).toContain('4 Zutaten');
    expect(wrapper.text()).toContain('25.05.2026');
    expect(wrapper.text()).toContain('31.05.2026');
  });

  it('should keep the dashboard visible when backend calls fail', async () => {
    vi.mocked(fetchWeeklyRecipePlan).mockRejectedValue(
      new Error('Plan failed'),
    );
    vi.mocked(fetchShoppingLists).mockRejectedValue(new Error('Lists failed'));

    const wrapper = mount(HomePage);

    await flushPromises();

    expect(wrapper.text()).toContain('Plan failed');
    expect(wrapper.text()).toContain('Lists failed');
    expect(wrapper.text()).toContain('feature.home.actionsTitle');
  });
});

function recipePlan(planDate: string, name: string) {
  return {
    id: `${planDate}-plan`,
    planDate,
    recipe: {
      id: `${planDate}-recipe`,
      name,
      instructions: 'Cook it.',
      cookingTime: 45,
      servings: 1,
      pricePerPerson: 450,
      imageUrl: null,
      ownerName: 'Chef',
      categories: null,
      components: [],
    },
  };
}
