import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import RecipesGridContent from '../components/RecipesGridContent.vue';
import type { Recipe } from '../shared/types';

describe('RecipesGridContent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
    MockResizeObserver.instances = [];
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
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

  it('keeps loading pages while additional recipes still do not fill the scroll area', async () => {
    const wrapper = mountGrid({
      recipes: [],
      isLoading: true,
      canLoadMore: false,
    });

    setScrollSize(wrapper.element, {
      clientHeight: 2000,
      scrollHeight: 900,
    });

    await wrapper.setProps({
      recipes: createRecipes(20),
      isLoading: false,
      canLoadMore: true,
    });
    await nextTick();

    expect(wrapper.emitted('loadMore')).toHaveLength(1);

    await wrapper.setProps({ isLoading: true });
    await vi.advanceTimersByTimeAsync(250);

    expect(wrapper.emitted('loadMore')).toHaveLength(1);

    await wrapper.setProps({
      recipes: createRecipes(40),
      isLoading: false,
      canLoadMore: true,
    });
    await nextTick();

    expect(wrapper.emitted('loadMore')).toHaveLength(2);
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

  it('loads another page when the user scrolls close to the end', async () => {
    const wrapper = mountGrid({
      recipes: createRecipes(20),
      isLoading: false,
      canLoadMore: true,
    });

    setScrollSize(wrapper.element, {
      clientHeight: 600,
      scrollHeight: 1400,
    });
    setScrollTop(wrapper.element, 780);

    await nextTick();

    expect(wrapper.emitted('loadMore')).toBeUndefined();

    await wrapper.trigger('scroll');

    expect(wrapper.emitted('loadMore')).toHaveLength(1);
  });

  it('rechecks underfilled content when the recipe grid is resized', async () => {
    const wrapper = mountGrid({
      recipes: createRecipes(20),
      isLoading: false,
      canLoadMore: true,
    });

    setScrollSize(wrapper.element, {
      clientHeight: 1200,
      scrollHeight: 1000,
    });

    await nextTick();
    MockResizeObserver.instances[0]?.trigger();
    await nextTick();

    expect(wrapper.emitted('loadMore')).toHaveLength(1);
  });
});

class MockIntersectionObserver {
  disconnect = vi.fn();
  observe = vi.fn();
}

class MockResizeObserver {
  static instances: MockResizeObserver[] = [];

  private readonly callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    MockResizeObserver.instances.push(this);
  }

  disconnect = vi.fn();
  observe = vi.fn();

  trigger() {
    this.callback([], this as unknown as ResizeObserver);
  }
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

function setScrollTop(element: Element, scrollTop: number) {
  Object.defineProperty(element, 'scrollTop', {
    configurable: true,
    value: scrollTop,
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
