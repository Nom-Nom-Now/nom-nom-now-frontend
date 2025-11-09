export type IngredientInput = {
  name: string;
  amount: number;
  unit: string;
};

export type RecipeInput = {
  name: string;
  categoryId: string;
  expectedMinutes: number;
  instructions: string;
  ingredients: IngredientInput[];
};

export type CategoryInput = {
  name: string;
  origin: string;
};

export type Category = {
  id: string;
  label: string;
};

export type RecipeCreationResult = {
  id: string;
};

export type CategoryCreationResult = Category;

function normalizeRecipe(input: RecipeInput) {
  return {
    ...input,
    name: input.name.trim(),
    instructions: input.instructions.trim(),
    ingredients: input.ingredients.map(ingredient => ({
      ...ingredient,
      name: ingredient.name.trim(),
    })),
  };
}

function buildCategoryLabel(input: CategoryInput) {
  return `${input.name}, ${input.origin}`;
}

export async function createRecipe(input: RecipeInput): Promise<RecipeCreationResult> {
  normalizeRecipe(input);
  await new Promise(resolve => setTimeout(resolve, 250));
  return { id: crypto.randomUUID() };
}

export async function createCategory(input: CategoryInput): Promise<CategoryCreationResult> {
  await new Promise(resolve => setTimeout(resolve, 150));
  return { id: crypto.randomUUID(), label: buildCategoryLabel(input) };
}
