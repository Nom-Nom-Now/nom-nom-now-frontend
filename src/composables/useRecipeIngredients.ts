import { ref, computed } from 'vue';
import type { Ingredient } from '../feature/recipes/create/src/shared/types/recipe';
import type { Unit } from '../feature/recipes/create/src/shared/types/units.ts';
import type { Recipe } from '../feature/plan/src/shared/types.ts';

export function useRecipeIngredients() {
  const ingredients = ref<Ingredient[]>([]);
  const servings = ref(1);
  const totalPrice = ref<number | null>(null);

  let nextId = 1;

  // Initialisiert die 3 Standard-Felder
  function setInitialIngredients() {
    ingredients.value = [
      { id: 1, amount: null, unit: 'GRAM', name: '' },
      { id: 2, amount: null, unit: 'GRAM', name: '' },
      { id: 3, amount: null, unit: 'GRAM', name: '' },
    ];
    nextId = 4;
  }

  const ingredientCount = computed(() => ingredients.value.length);

  const pricePerPerson = computed(() => {
    if (totalPrice.value === null || totalPrice.value <= 0) return null;
    return Math.round((totalPrice.value / servings.value) * 100) / 100;
  });

  const calculatedPricePerPersonCents = computed(() => {
    if (totalPrice.value === null || totalPrice.value <= 0) return null;
    return Math.round((totalPrice.value / servings.value) * 100);
  });

  function addIngredient() {
    ingredients.value.push({ id: nextId++, amount: null, unit: 'GRAM', name: '' });
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

  function setIngredientsFromRecipe(recipeIngredients: Recipe['ingredients']) {
    if (!recipeIngredients) return;
    ingredients.value = recipeIngredients.map((ing, index) => ({
      id: index + 1,
      amount: ing.quantity,
      unit: (ing.unit as Unit) || 'GRAM',
      name: ing.ingredientName || ''
    }));
    nextId = recipeIngredients.length + 1;
  }

  return {
    ingredients,
    servings,
    totalPrice,
    ingredientCount,
    pricePerPerson,
    calculatedPricePerPersonCents,
    setInitialIngredients,
    setIngredientsFromRecipe,
    addIngredient,
    removeIngredient,
    updateIngredientAmount,
    updateIngredientUnit,
    updateIngredientName,
    moveIngredientUp,
    moveIngredientDown
  };
}