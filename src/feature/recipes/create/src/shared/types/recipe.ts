import type { Unit } from './units';

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
}
