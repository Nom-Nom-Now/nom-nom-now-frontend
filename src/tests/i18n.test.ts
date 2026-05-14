import { describe, it, expect } from 'vitest';
import de from '../locales/de.json';
import en from '../locales/en.json';

const sortKeys = (keys: string[]) =>
  [...keys].sort((left, right) => left.localeCompare(right));
const getNestedValue = (obj: Record<string, unknown>, path: string) =>
  path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
const expectSortedKeysEqual = (left: string[], right: string[]) => {
  expect(sortKeys(left)).toEqual(sortKeys(right));
};
const expectDefinedForLocales = (path: string) => {
  const deVal = getNestedValue(de as Record<string, unknown>, path);
  const enVal = getNestedValue(en as Record<string, unknown>, path);
  expect(deVal, `de.json missing key: ${path}`).toBeDefined();
  expect(enVal, `en.json missing key: ${path}`).toBeDefined();
};

describe('i18n locale files', () => {
  it('should have the same top-level keys', () => {
    const deKeys = Object.keys(de);
    const enKeys = Object.keys(en);
    expectSortedKeysEqual(deKeys, enKeys);
  });

  it('should have required keys in both locales', () => {
    const requiredPaths = [
      'navigation',
      'navigation.home',
      'navigation.recipes',
      'feature',
      'feature.recipes.title',
      'feature.recipes.createRecipe.title',
      'feature.recipes.editRecipe.title',
      'feature.recipes.list.createButton',
      'feature.recipes.createRecipe.ingredients.name',
      'feature.recipes.createRecipe.preparation.title',
      'feature.recipes.createRecipe.categories.title',
      'feature.recipes.createRecipe.preview.heading',
    ];

    for (const path of requiredPaths) {
      expectDefinedForLocales(path);
    }
  });

  it('should have matching nested keys for feature.recipes', () => {
    const deRecipes = (de as Record<string, unknown>).feature as Record<string, unknown>;
    const enRecipes = (en as Record<string, unknown>).feature as Record<string, unknown>;
    const deRecipesKeys = Object.keys(deRecipes.recipes as Record<string, unknown>);
    const enRecipesKeys = Object.keys(enRecipes.recipes as Record<string, unknown>);

    expectSortedKeysEqual(deRecipesKeys, enRecipesKeys);
  });

  it('should have matching nested keys for feature.recipes.createRecipe', () => {
    const deFeature = de['feature'] as Record<string, unknown>;
    const enFeature = en['feature'] as Record<string, unknown>;
    const deCreate = (deFeature['recipes'] as Record<string, unknown>)?.['createRecipe'] as Record<string, unknown>;
    const enCreate = (enFeature['recipes'] as Record<string, unknown>)?.['createRecipe'] as Record<string, unknown>;

    expectSortedKeysEqual(Object.keys(deCreate), Object.keys(enCreate));
  });

  it('should have matching keys for navigation', () => {
    const deNav = de['navigation'] as Record<string, unknown>;
    const enNav = en['navigation'] as Record<string, unknown>;

    expectSortedKeysEqual(Object.keys(deNav), Object.keys(enNav));
  });
});
