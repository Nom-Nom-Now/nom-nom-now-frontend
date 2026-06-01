import { defineStore } from 'pinia';
import { ref, computed, toRefs } from 'vue';
import { useRecipeIngredients } from '../../../../../composables/useRecipeIngredients';
import { createRecipe } from '../services/createRecipeService.ts';

export const useCreateRecipeStore = defineStore('createRecipe', () => {
  const ingModule = useRecipeIngredients();

  const recipeName = ref('');
  const instructions = ref('');
  const cookingTime = ref(0);
  const categoryIds = ref<number[]>([]);
  const recipeImage = ref<File | null>(null);

  const isSubmitting = ref(false);
  const submitError = ref<string | null>(null);

  // Initialisierung
  ingModule.setInitialIngredients();

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

  async function submitRecipe() {
    submitError.value = null;
    isSubmitting.value = true;
    try {
      const state = {
        recipeName: recipeName.value,
        servings: ingModule.servings.value,
        ingredients: ingModule.ingredients.value,
        instructions: instructions.value,
        cookingTime: cookingTime.value,
        categoryIds: categoryIds.value,
        recipeImage: recipeImage.value,
        pricePerPerson: ingModule.calculatedPricePerPersonCents.value,
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
    instructions.value = '';
    cookingTime.value = 0;
    categoryIds.value = [];
    recipeImage.value = null;
    submitError.value = null;
    isSubmitting.value = false;
    ingModule.servings.value = 1;
    ingModule.totalPrice.value = null;
    ingModule.setInitialIngredients();
  }

  return {
    recipeName,
    instructions,
    cookingTime,
    categoryIds,
    recipeImage,
    isSubmitting,
    submitError,
    isIngredientsStepValid,

    ...toRefs(ingModule),

    addIngredient: ingModule.addIngredient,
    removeIngredient: ingModule.removeIngredient,
    updateIngredientAmount: ingModule.updateIngredientAmount,
    updateIngredientUnit: ingModule.updateIngredientUnit,
    updateIngredientName: ingModule.updateIngredientName,
    moveIngredientUp: ingModule.moveIngredientUp,
    moveIngredientDown: ingModule.moveIngredientDown,

    submitRecipe,
    $reset,
    setRecipeName: (val: string) => (recipeName.value = val),
    setRecipeImage: (file: File | null) => (recipeImage.value = file),
    setCategoryIds: (ids: number[]) => (categoryIds.value = ids),
    setServings: (val: number) => (ingModule.servings.value = Math.max(1, val)),
    setTotalPrice: (val: number | null) => (ingModule.totalPrice.value = val),
  };
});
