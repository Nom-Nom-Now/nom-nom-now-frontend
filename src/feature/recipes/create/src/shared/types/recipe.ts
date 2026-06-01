import type { Unit } from './units';
import type { Ref, ComputedRef } from 'vue';

export interface Ingredient {
  id: number;
  amount: number | null;
  unit: Unit;
  name: string;
}

/**
 * Vollständiges Objekt für die Rezepterstellung.
 * Felder die noch nicht im UI existieren sind optional und
 * werden mit Defaults befüllt, wenn sie ans Backend gesendet werden.
 */
export interface CreateRecipeState {
  recipeName: string;
  servings: number;
  ingredients: Ingredient[];

  // kommt später (dann Fragezeichen weg machen)
  instructions?: string;
  cookingTime?: number;
  categoryIds?: number[];
  recipeImage?: File | null;
  pricePerPerson?: number | null;
}

export interface RecipeFormStore {
  recipeName: Ref<string>;
  servings: Ref<number>;
  ingredients: Ref<Ingredient[]>;
  instructions: Ref<string>;
  cookingTime: Ref<number>;
  categoryIds: Ref<number[]>;
  recipeImage: Ref<File | null>;
  totalPrice: Ref<number | null>;

  ingredientCount: ComputedRef<number>;
  isIngredientsStepValid: ComputedRef<boolean>;
  pricePerPerson: ComputedRef<number | null>;

  addIngredient: () => void;
  removeIngredient: (id: number) => void;
  updateIngredientAmount: (id: number, amount: number | null) => void;
  updateIngredientUnit: (id: number, unit: Unit) => void;
  updateIngredientName: (id: number, name: string) => void;
}
