import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Ingredient } from '../../../create/src/shared/types/recipe';
import type { Unit } from '../../../create/src/shared/types/units.ts';
import type { Recipe } from '../../../list/src/shared/types.ts';
import {
  type EditRecipePayload,
  updateRecipe,
} from '../service/editRecipeApiService';

export const useEditRecipeStore = defineStore('editRecipe', () => {
  const recipeId = ref<number | null>(null);

  const recipeName = ref('');
  const servings = ref(1);
  const ingredients = ref<Ingredient[]>([]);

  const instructions = ref('');
  const cookingTime = ref(0);

  const categoryIds = ref<number[]>([]);
  const rawCategoryNames = ref<string[]>([]);

  const recipeImage = ref<File | null>(null);
  const existingImageUrl = ref<string | null>(null);
  const totalPrice = ref<number | null>(null);

  const isSubmitting = ref(false);
  const submitError = ref<string | null>(null);
  const originalSnapshot = ref<string | null>(null);

  let nextId = 1;

  function fillWithRecipe(recipe: Recipe) {
    $reset();

    recipeId.value = Number(recipe.id);
    recipeName.value = recipe.title || '';
    instructions.value = recipe.description || '';

    const parsedTime = Number.parseInt(recipe.duration);
    cookingTime.value = Number.isNaN(parsedTime) ? 0 : parsedTime;

    const parsedPrice = Number.parseFloat(recipe.cost.replace(/[^0-9.]/g, ''));
    totalPrice.value = Number.isNaN(parsedPrice) ? null : parsedPrice;

    rawCategoryNames.value = recipe.categories || [];
    categoryIds.value = [];

    existingImageUrl.value = (recipe as { imageUrl?: string }).imageUrl || null;

    if (recipe.ingredients && recipe.ingredients.length > 0) {
      ingredients.value = recipe.ingredients.map((ing, index) => ({
        id: index + 1,
        amount: ing.quantity,
        unit: (ing.unit as Unit) || 'GRAM',
        name: ing.ingredientName || ''
      }));
      nextId = recipe.ingredients.length + 1;
    } else {
      ingredients.value = [
        { id: 1, amount: null, unit: 'GRAM', name: '' },
        { id: 2, amount: null, unit: 'GRAM', name: '' },
        { id: 3, amount: null, unit: 'GRAM', name: '' },
      ];
      nextId = 4;
    }
    originalSnapshot.value = createSnapshotString();
  }

  function setRecipeImage(file: File | null) {
    recipeImage.value = file;
    if (file) {
      existingImageUrl.value = null;
    }
  }

  const ingredientCount = computed(() => ingredients.value.length);

  const isIngredientsStepValid = computed(() => {
    return (
      recipeName.value.trim().length > 0 &&
      servings.value >= 1 &&
      ingredients.value.length > 0 &&
      ingredients.value.every(
        (i) => i.name.trim().length > 0 && i.amount !== null && i.amount > 0,
      )
    );
  });

  const pricePerPerson = computed(() => {
    if (totalPrice.value === null || totalPrice.value <= 0) return null;
    return Math.round((totalPrice.value / servings.value) * 100) / 100;
  });

  const isDirty = computed(() => {
    if (!originalSnapshot.value) return false;
    return originalSnapshot.value !== createSnapshotString();
  });

  function createSnapshotString(): string {
    return JSON.stringify({
      recipeName: recipeName.value,
      servings: servings.value,
      // IDs ignorieren wir beim Vergleich, falls sich interne IDs verschieben
      ingredients: ingredients.value.map(i => ({ name: i.name, amount: i.amount, unit: i.unit })),
      instructions: instructions.value,
      cookingTime: cookingTime.value,
      categoryIds: [...categoryIds.value].sort((a, b) => a - b),
      totalPrice: totalPrice.value,
      hasNewImage: recipeImage.value !== null
    });
  }

  function setRecipeName(name: string) {
    recipeName.value = name;
  }

  function setServings(value: number) {
    servings.value = Math.max(1, value);
  }

  function setTotalPrice(value: number | null) {
    totalPrice.value = value;
  }

  function addIngredient() {
    ingredients.value.push({
      id: nextId++,
      amount: null,
      unit: 'GRAM',
      name: '',
    });
  }

  function setCategoryIds(ids: number[]) {
    categoryIds.value = ids;
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

  async function submitUpdatedRecipe() {
    if (recipeId.value === null) {
      throw new Error('Keine Rezept-ID zum Updaten vorhanden');
    }

    submitError.value = null;
    isSubmitting.value = true;

    try {
      const updateData: EditRecipePayload = {
        recipeName: recipeName.value,
        servings: servings.value,
        ingredients: ingredients.value,
        instructions: instructions.value,
        cookingTime: cookingTime.value,
        categoryIds: categoryIds.value,
        pricePerPerson: pricePerPerson.value !== null && pricePerPerson.value > 0
          ? Math.round(pricePerPerson.value * 100)
          : null,
      };

      const response = await updateRecipe(recipeId.value, updateData, recipeImage.value);

      $reset();
      return response;
    } catch (error) {
      submitError.value = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    } finally {
      isSubmitting.value = false;
    }
  }

  function $reset() {
    recipeId.value = null;
    recipeName.value = '';
    servings.value = 1;
    ingredients.value = [];
    instructions.value = '';
    cookingTime.value = 0;
    categoryIds.value = [];
    rawCategoryNames.value = [];
    recipeImage.value = null;
    existingImageUrl.value = null;
    totalPrice.value = null;
    submitError.value = null;
    isSubmitting.value = false;
    nextId = 1;
    originalSnapshot.value = null;
  }

  return {
    recipeId,
    recipeName,
    servings,
    ingredients,
    instructions,
    cookingTime,
    categoryIds,
    rawCategoryNames,
    isSubmitting,
    submitError,
    recipeImage,
    existingImageUrl,
    totalPrice,

    ingredientCount,
    isIngredientsStepValid,
    pricePerPerson,

    isDirty,

    fillWithRecipe,
    setRecipeName,
    setServings,
    setTotalPrice,
    setCategoryIds,
    addIngredient,
    removeIngredient,
    updateIngredientAmount,
    updateIngredientUnit,
    updateIngredientName,
    moveIngredientUp,
    moveIngredientDown,
    setRecipeImage,
    submitUpdatedRecipe,
    $reset,
  };
});