import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Ingredient, CreateRecipeState } from '../shared/types/recipe';
import type { Unit } from '../shared/types/units';
import { createRecipe } from '../services/createRecipeService';

export const useCreateRecipeStore = defineStore('createRecipe', () => {
  const recipeName = ref('');
  const servings = ref(1);
  const ingredients = ref<Ingredient[]>([
    { id: 1, amount: null, unit: 'GRAM', name: '' },
    { id: 2, amount: null, unit: 'GRAM', name: '' },
    { id: 3, amount: null, unit: 'GRAM', name: '' },
  ]);

  // Felder die später im UI befüllt werden
  const instructions = ref('');
  const cookingTime = ref(0);
  const categoryIds = ref<number[]>([]);

  // Submit-Status
  const isSubmitting = ref(false);
  const submitError = ref<string | null>(null);

  let nextId = 4;

  // --- Getters ---
  const ingredientCount = computed(() => ingredients.value.length);

  const isIngredientsStepValid = computed(() => {
    return (
      recipeName.value.trim().length > 0 &&
      servings.value >= 1 &&
      ingredients.value.length > 0 &&
      ingredients.value.every(
        (i) =>
          i.name.trim().length > 0 && i.amount !== null && i.amount > 0,
      )
    );
  });

  // --- Actions ---
  function setRecipeName(name: string) {
    recipeName.value = name;
  }

  function setServings(value: number) {
    servings.value = Math.max(1, value);
  }

  function addIngredient() {
    ingredients.value.push({
      id: nextId++,
      amount: null,
      unit: 'GRAM',
      name: '',
    });
  }

  function removeIngredient(id: number) {
    ingredients.value = ingredients.value.filter((i) => i.id !== id);
  }

  function updateIngredientAmount(id: number, amount: number | null) {
    const ingredient = ingredients.value.find((i) => i.id === id);
    if (ingredient) ingredient.amount = amount;
  }

  function updateIngredientUnit(id: number, unit: Unit) {
    const ingredient = ingredients.value.find((i) => i.id === id);
    if (ingredient) ingredient.unit = unit;
  }

  function updateIngredientName(id: number, name: string) {
    const ingredient = ingredients.value.find((i) => i.id === id);
    if (ingredient) ingredient.name = name;
  }

  function moveIngredientUp(index: number) {
    if (index <= 0) return;
    const arr = ingredients.value;
    const temp = arr[index]!;
    arr[index] = arr[index - 1]!;
    arr[index - 1] = temp;
  }

  function moveIngredientDown(index: number) {
    if (index >= ingredients.value.length - 1) return;
    const arr = ingredients.value;
    const temp = arr[index]!;
    arr[index] = arr[index + 1]!;
    arr[index + 1] = temp;
  }

  // --- API ---
  async function submitRecipe() {
    submitError.value = null;
    isSubmitting.value = true;

    try {
      const state: CreateRecipeState = {
        recipeName: recipeName.value,
        servings: servings.value,
        ingredients: ingredients.value,
        instructions: instructions.value,
        cookingTime: cookingTime.value,
        categoryIds: categoryIds.value,
      };

      const response = await createRecipe(state);
      $reset();
      return response;
    } catch (error) {
      submitError.value =
        error instanceof Error ? error.message : 'Unknown error';
      throw error;
    } finally {
      isSubmitting.value = false;
    }
  }

  function $reset() {
    recipeName.value = '';
    servings.value = 1;
    ingredients.value = [
      { id: 1, amount: null, unit: 'GRAM', name: '' },
      { id: 2, amount: null, unit: 'GRAM', name: '' },
      { id: 3, amount: null, unit: 'GRAM', name: '' },
    ];
    instructions.value = '';
    cookingTime.value = 0;
    categoryIds.value = [];
    submitError.value = null;
    isSubmitting.value = false;
    nextId = 4;
  }

  return {
    // State
    recipeName,
    servings,
    ingredients,
    instructions,
    cookingTime,
    categoryIds,
    isSubmitting,
    submitError,

    // Getters
    ingredientCount,
    isIngredientsStepValid,

    // Actions
    setRecipeName,
    setServings,
    addIngredient,
    removeIngredient,
    updateIngredientAmount,
    updateIngredientUnit,
    updateIngredientName,
    moveIngredientUp,
    moveIngredientDown,
    submitRecipe,
    $reset,
  };
});
