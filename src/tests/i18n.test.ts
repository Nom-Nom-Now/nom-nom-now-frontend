import { describe, it, expect } from 'vitest';
import de from '../locales/de.json';
import en from '../locales/en.json';

describe('i18n locale files', () => {
  it('should have the same top-level keys', () => {
    const deKeys = Object.keys(de);
    const enKeys = Object.keys(en);
    expect(deKeys.sort()).toEqual(enKeys.sort());
  });

  it('should have "navigation" key', () => {
    expect(de).toHaveProperty('navigation');
    expect(en).toHaveProperty('navigation');
  });

  it('should have "navigation.home" key', () => {
    expect(de).toHaveProperty('navigation.home');
    expect(en).toHaveProperty('navigation.home');
  });

  it('should have "navigation.recipes" key', () => {
    expect(de).toHaveProperty('navigation.recipes');
    expect(en).toHaveProperty('navigation.recipes');
  });

  it('should have "feature" key', () => {
    expect(de).toHaveProperty('feature');
    expect(en).toHaveProperty('feature');
  });

  it('should have recipe-related keys in both locales', () => {
    const requiredKeys = [
      'feature.recipes.title',
      'feature.recipes.createRecipe.title',
      'feature.recipes.editRecipe.title',
      'feature.recipes.list.createButton',
      'feature.recipes.createRecipe.ingredients.name',
      'feature.recipes.createRecipe.preparation.title',
      'feature.recipes.createRecipe.categories.title',
      'feature.recipes.createRecipe.preview.heading',
    ];

    for (const key of requiredKeys) {
      const parts = key.split('.');
      let deVal: unknown = de;
      let enVal: unknown = en;
      for (const part of parts) {
        deVal = (deVal as Record<string, unknown>)?.[part];
        enVal = (enVal as Record<string, unknown>)?.[part];
      }
      expect(deVal, `de.json missing key: ${key}`).toBeDefined();
      expect(enVal, `en.json missing key: ${key}`).toBeDefined();
    }
  });

  it('should have matching nested keys for feature.recipes', () => {
    const deRecipes = (de as Record<string, unknown>).feature as Record<string, unknown>;
    const enRecipes = (en as Record<string, unknown>).feature as Record<string, unknown>;
    const deRecipesKeys = Object.keys(deRecipes.recipes as Record<string, unknown>);
    const enRecipesKeys = Object.keys(enRecipes.recipes as Record<string, unknown>);

    expect(deRecipesKeys.sort()).toEqual(enRecipesKeys.sort());
  });

  it('should have matching nested keys for feature.recipes.createRecipe', () => {
    const deCreate = ((de as Record<string, unknown>).feature as Record<string, Record<string, unknown>>).recipes.createRecipe;
    const enCreate = ((en as Record<string, unknown>).feature as Record<string, Record<string, unknown>>).recipes.createRecipe;

    expect(Object.keys(deCreate).sort()).toEqual(Object.keys(enCreate).sort());
  });

  it('should have matching keys for navigation', () => {
    const deNav = (de as Record<string, Record<string, unknown>>).navigation;
    const enNav = (en as Record<string, Record<string, unknown>>).navigation;

    expect(Object.keys(deNav).sort()).toEqual(Object.keys(enNav).sort());
  });
});
