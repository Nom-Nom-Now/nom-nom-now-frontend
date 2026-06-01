import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRecipeIngredients } from '../../../../../composables/useRecipeIngredients';
import { updateRecipe } from '../service/editRecipeApiService';
import type { Recipe } from '../../../list/src/shared/types.ts';

export const useEditRecipeStore = defineStore('editRecipe', () => {
  const ingModule = useRecipeIngredients();

  const recipeId = ref<number | null>(null);
  const recipeName = ref('');
  const instructions = ref('');
  const cookingTime = ref(0);
  const categoryIds = ref<number[]>([]);
  const rawCategoryNames = ref<string[]>([]);
  const recipeImage = ref<File | null>(null);
  const existingImageUrl = ref<string | null>(null);

  const isSubmitting = ref(false);
  const submitError = ref<string | null>(null);
  const originalSnapshot = ref<string | null>(null);

  const isIngredientsStepValid = computed(() => {
    return (
      recipeName.value.trim().length > 0 &&
      ingModule.servings.value >= 1 &&
      ingModule.ingredients.value.length > 0 &&
      ingModule.ingredients.value.every(
        (i) => i.name.trim().length > 0 && i.amount !== null && i.amount > 0,
      )
    );
  });

  const clearRawCategoryNames = () => {
    rawCategoryNames.value = [];
  };

  const isDirty = computed(() => {
    if (!originalSnapshot.value) return false;
    return originalSnapshot.value !== createSnapshotString();
  });

  function createSnapshotString(): string {
    return JSON.stringify({
      recipeName: recipeName.value,
      servings: ingModule.servings.value,
      ingredients: ingModule.ingredients.value.map((i) => ({
        name: i.name,
        amount: i.amount,
        unit: i.unit,
      })),
      instructions: instructions.value,
      cookingTime: cookingTime.value,
      categoryIds: [...categoryIds.value].sort((a, b) => a - b),
      totalPrice: ingModule.totalPrice.value,
      hasNewImage: recipeImage.value !== null,
    });
  }

  function fillWithRecipe(recipe: Recipe) {
    $reset();
    recipeId.value = Number(recipe.id);
    recipeName.value = recipe.title || '';
    instructions.value = recipe.description || '';

    const parsedTime = Number.parseInt(recipe.duration);
    cookingTime.value = Number.isNaN(parsedTime) ? 0 : parsedTime;

    const parsedPrice = Number.parseFloat(recipe.cost.replace(/[^0-9.]/g, ''));
    ingModule.totalPrice.value = Number.isNaN(parsedPrice) ? null : parsedPrice;

    rawCategoryNames.value = recipe.categories || [];
    existingImageUrl.value = (recipe as { imageUrl?: string }).imageUrl || null;

    if (recipe.ingredients && recipe.ingredients.length > 0) {
      ingModule.setIngredientsFromRecipe(recipe.ingredients);
    } else {
      ingModule.setInitialIngredients();
    }
    originalSnapshot.value = createSnapshotString();
  }

  async function submitUpdatedRecipe() {
    if (recipeId.value === null) throw new Error('Keine Rezept-ID vorhanden');
    submitError.value = null;
    isSubmitting.value = true;

    try {
      const updateData = {
        recipeName: recipeName.value,
        servings: ingModule.servings.value,
        ingredients: ingModule.ingredients.value,
        instructions: instructions.value,
        cookingTime: cookingTime.value,
        categoryIds: categoryIds.value,
        pricePerPerson: ingModule.calculatedPricePerPersonCents.value,
      };

      const response = await updateRecipe(
        recipeId.value,
        updateData,
        recipeImage.value,
      );
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
    recipeId.value = null;
    recipeName.value = '';
    instructions.value = '';
    cookingTime.value = 0;
    categoryIds.value = [];
    rawCategoryNames.value = [];
    recipeImage.value = null;
    existingImageUrl.value = null;
    submitError.value = null;
    isSubmitting.value = false;
    originalSnapshot.value = null;
    ingModule.servings.value = 1;
    ingModule.totalPrice.value = null;
    ingModule.ingredients.value = [];
  }

  return {
    recipeId,
    recipeName,
    instructions,
    cookingTime,
    categoryIds,
    rawCategoryNames,
    clearRawCategoryNames,
    recipeImage,
    existingImageUrl,
    isSubmitting,
    submitError,
    isIngredientsStepValid,
    isDirty,

    // Aus dem Composable gemappt
    ...ingModule,

    fillWithRecipe,
    submitUpdatedRecipe,
    $reset,
    setRecipeName: (name: string) => (recipeName.value = name),
    setCategoryIds: (ids: number[]) => (categoryIds.value = ids),
    setServings: (val: number) => (ingModule.servings.value = Math.max(1, val)),
    setTotalPrice: (val: number | null) => (ingModule.totalPrice.value = val),
    setRecipeImage: (file: File | null) => {
      recipeImage.value = file;
      if (file) existingImageUrl.value = null;
    },
  };
});
