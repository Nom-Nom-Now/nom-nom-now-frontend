import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import RecipesGridContent from '../components/RecipesGridContent.vue';
import type { Recipe } from '../shared/types';

describe('RecipesGridContent', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads another page when the rendered recipes do not fill the scroll area', async () => {
    const wrapper = mountGrid({
      recipes: [],
      isLoading: true,
      canLoadMore: false,
    });

    setScrollSize(wrapper.element, {
      clientHeight: 1000,
      scrollHeight: 900,
    });

    await wrapper.setProps({
      recipes: createRecipes(20),
      isLoading: false,
      canLoadMore: true,
    });
    await nextTick();

    expect(wrapper.emitted('loadMore')).toHaveLength(1);
  });

  it('does not load another page when the rendered recipes already overflow', async () => {
    const wrapper = mountGrid({
      recipes: [],
      isLoading: true,
      canLoadMore: false,
    });

    setScrollSize(wrapper.element, {
      clientHeight: 600,
      scrollHeight: 1200,
    });

    await wrapper.setProps({
      recipes: createRecipes(20),
      isLoading: false,
      canLoadMore: true,
    });
    await nextTick();

    expect(wrapper.emitted('loadMore')).toBeUndefined();
  });
});

class MockIntersectionObserver {
  disconnect = vi.fn();
  observe = vi.fn();
}

class MockResizeObserver {
  disconnect = vi.fn();
  observe = vi.fn();
}

function mountGrid(
  props: Partial<{
    recipes: Recipe[];
    isLoading: boolean;
    error: string | null;
    canLoadMore: boolean;
    searchQuery?: string;
  }> = {},
) {
  return mount(RecipesGridContent, {
    props: {
      recipes: [],
      isLoading: false,
      error: null,
      canLoadMore: false,
      ...props,
    },
    global: {
      stubs: {
        RecipeBox: {
          props: ['recipe'],
          emits: ['select'],
          template:
            '<button class="recipe-box-stub" type="button">{{ recipe.title }}</button>',
        },
        RecipeDetailPage: true,
        'md-icon': true,
      },
    },
  });
}

function setScrollSize(
  element: Element,
  size: { clientHeight: number; scrollHeight: number },
) {
  Object.defineProperty(element, 'clientHeight', {
    configurable: true,
    value: size.clientHeight,
  });
  Object.defineProperty(element, 'scrollHeight', {
    configurable: true,
    value: size.scrollHeight,
  });
}

function createRecipes(count: number): Recipe[] {
  return Array.from({ length: count }, (_, index) => ({
    id: String(index + 1),
    title: `Rezept ${index + 1}`,
    imageUrl: null,
    duration: '30min',
    servings: 2,
    cost: '-',
    description: 'Beschreibung',
    owner: 'Local Dev',
    ingredients: [],
    categories: [],
  }));
}
