import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ShoppingListsPage from '../pages/ShoppingListsPage.vue';
import {
  deleteShoppingList,
  fetchShoppingList,
  fetchShoppingLists,
} from '../services/ShoppingListService';

const routeMock = vi.hoisted(() => ({
  params: {
    id: '7' as string | undefined,
  },
}));
const pushMock = vi.hoisted(() => vi.fn());

vi.mock('vue-router', () => ({
  useRoute: () => routeMock,
  useRouter: () => ({
    push: pushMock,
  }),
  RouterLink: {
    props: ['to'],
    template: '<a><slot /></a>',
  },
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: { value: 'de-DE' },
    t: (key: string, values?: Record<string, unknown>) => {
      const count = values?.count;
      return typeof count === 'number' || typeof count === 'string'
        ? `${count} Zutaten`
        : key;
    },
  }),
}));

vi.mock('../services/ShoppingListService', () => ({
  deleteShoppingList: vi.fn(),
  fetchShoppingList: vi.fn(),
  fetchShoppingLists: vi.fn(),
}));

describe('ShoppingListsPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    routeMock.params.id = '7';
    pushMock.mockReset();
    vi.mocked(deleteShoppingList).mockReset();
    vi.mocked(fetchShoppingList).mockReset();
    vi.mocked(fetchShoppingLists).mockReset();
    vi.mocked(fetchShoppingLists).mockResolvedValue([
      {
        id: 7,
        weekStart: '2026-05-25',
        createdAt: '2026-05-31T12:00:00Z',
        itemCount: 1,
      },
    ]);
    vi.mocked(fetchShoppingList).mockResolvedValue({
      id: 7,
      weekStart: '2026-05-25',
      createdAt: '2026-05-31T12:00:00Z',
      items: [{ ingredientName: 'Tomato', quantity: 4, unit: 'PIECE' }],
    });
    vi.mocked(deleteShoppingList).mockResolvedValue(undefined);
  });

  it('should open the delete dialog and delete the selected shopping list', async () => {
    const wrapper = mount(ShoppingListsPage);
    await flushPromises();

    await wrapper.find('.delete-list-button').trigger('click');

    expect(wrapper.text()).toContain(
      'feature.shoppingLists.deleteDialogTitle',
    );

    await wrapper.find('.confirm-delete-button').trigger('click');
    await flushPromises();

    expect(deleteShoppingList).toHaveBeenCalledWith('7');
    expect(pushMock).toHaveBeenCalledWith('/shopping-lists');
    expect(fetchShoppingLists).toHaveBeenCalledTimes(2);
    expect(wrapper.text()).toContain('feature.shoppingLists.selectList');
  });
});
