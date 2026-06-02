import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import PlanGridContent from '../components/PlanGridContent.vue';
import type { Recipe } from '../shared/types';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.weekdays.monday': 'Montag',
        'common.weekdays.tuesday': 'Dienstag',
        'common.weekdays.wednesday': 'Mittwoch',
        'common.weekdays.thursday': 'Donnerstag',
        'common.weekdays.friday': 'Freitag',
        'common.weekdays.saturday': 'Samstag',
        'common.weekdays.sunday': 'Sonntag',
        'feature.plan.addRecipe': 'Rezept hinzufügen',
        'feature.plan.emptyDayCopy': 'Für diesen Tag neu generieren',
        'feature.plan.loading': 'Lädt...',
      };

      return translations[key] ?? key;
    },
  }),
}));

function createRecipe(id: string, title: string): Recipe {
  return {
    id,
    title,
    imageUrl: null,
    duration: '30 min',
    servings: 2,
    cost: '€',
    description: 'Beschreibung',
    categories: [],
    owner: 'rft',
    ingredients: [],
  };
}

describe('PlanGridContent', () => {
  it('keeps recipes pinned to their weekday when a saved plan has empty slots', () => {
    const wrapper = mount(PlanGridContent, {
      props: {
        recipes: [
          createRecipe('1', 'Montag Rezept'),
          null,
          createRecipe('3', 'Mittwoch Rezept'),
          null,
          null,
          null,
          null,
        ],
        isLoading: false,
        error: null,
        currentWeek: new Date('2026-06-01T00:00:00'),
        refreshingDayKeys: [],
        peopleCountsByDate: {},
      },
      global: {
        stubs: {
          PlanRecipeBox: {
            props: ['recipe'],
            emits: ['select'],
            template:
              '<button class="recipe-box-stub" type="button">{{ recipe.title }}</button>',
          },
          RecipeDetailPage: true,
          'md-icon': true,
          'md-icon-button': true,
        },
      },
    });

    const columns = wrapper.findAll('.day-column');

    expect(columns).toHaveLength(7);
    expect(columns[0]!.find('.recipe-box-stub').text()).toBe('Montag Rezept');
    expect(columns[1]!.find('.empty-day-card').exists()).toBe(true);
    expect(columns[2]!.find('.recipe-box-stub').text()).toBe(
      'Mittwoch Rezept',
    );
  });

  it('regenerates the clicked empty weekday slot', async () => {
    const wrapper = mount(PlanGridContent, {
      props: {
        recipes: [null, null, null, null, null, null, null],
        isLoading: false,
        error: null,
        currentWeek: new Date('2026-06-01T00:00:00'),
        refreshingDayKeys: [],
        peopleCountsByDate: {},
      },
      global: {
        stubs: {
          PlanRecipeBox: true,
          RecipeDetailPage: true,
          'md-icon': true,
          'md-icon-button': true,
        },
      },
    });

    const emptyCards = wrapper.findAll('.empty-day-card');

    expect(emptyCards).toHaveLength(7);
    await emptyCards[1]!.trigger('click');

    expect(wrapper.emitted('refresh-day')).toEqual([[1]]);
  });
});
