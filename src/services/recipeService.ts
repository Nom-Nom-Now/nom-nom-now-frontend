const API_BASE_URL = 'http://localhost:8080';

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
  color: string;
};

export type Category = {
  id: string;
  name: string;
  color: string;
  label: string;
};

export type RecipeCreationResult = {
  id: string;
};

export type CategoryCreationResult = Category;

type CreateRecipePayload = {
  name: string;
  instructions: string;
  cookingTime: number;
  categoryIds: Array<number | string>;
  components: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
};

type CreateRecipeResponse = {
  id: number | string;
};

type CreateCategoryResponse = {
  id: number | string;
  name: string;
  color: string;
};

function normalizeRecipe(input: RecipeInput): RecipeInput {
  return {
    ...input,
    name: input.name.trim(),
    instructions: input.instructions.trim(),
    ingredients: input.ingredients
      .map(ingredient => ({
        ...ingredient,
        name: ingredient.name.trim(),
      }))
      .filter(ingredient => ingredient.name.length > 0 && Number.isFinite(ingredient.amount)),
  };
}

function normalizeCategoryInput(input: CategoryInput): CategoryInput {
  return {
    name: input.name.trim(),
    color: input.color.trim(),
  };
}

function buildCategoryLabel(input: { name: string; color: string }) {
  return input.color ? `${input.name} (${input.color})` : input.name;
}

function coerceCategoryId(id: string): number | string {
  const numeric = Number(id);
  return Number.isFinite(numeric) && id.trim() !== '' ? numeric : id;
}

function mapRecipeToPayload(recipe: RecipeInput): CreateRecipePayload {
  return {
    name: recipe.name,
    instructions: recipe.instructions,
    cookingTime: recipe.expectedMinutes,
    categoryIds: recipe.categoryId ? [coerceCategoryId(recipe.categoryId)] : [],
    components: recipe.ingredients.map(ingredient => ({
      name: ingredient.name,
      quantity: ingredient.amount,
      unit: ingredient.unit,
    })),
  };
}

async function postJson<TRequest, TResponse>(path: string, body: TRequest): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }
  return responseText ? (JSON.parse(responseText) as TResponse) : ({} as TResponse);
}

export async function createRecipe(input: RecipeInput): Promise<RecipeCreationResult> {
  const normalizedRecipe = normalizeRecipe(input);
  const payload = mapRecipeToPayload(normalizedRecipe);
  const recipe = await postJson<CreateRecipePayload, CreateRecipeResponse>('/recipe', payload);
  if (!recipe?.id && recipe?.id !== 0) {
    throw new Error('Recipe id missing in response');
  }
  return { id: String(recipe.id) };
}

export async function createCategory(input: CategoryInput): Promise<CategoryCreationResult> {
  const normalizedCategory = normalizeCategoryInput(input);
  const category = await postJson<CategoryInput, CreateCategoryResponse>('/category', normalizedCategory);
  if (!category?.id && category?.id !== 0) {
    throw new Error('Category id missing in response');
  }
  const hydratedCategory = {
    id: String(category.id),
    name: category.name ?? normalizedCategory.name,
    color: category.color ?? normalizedCategory.color,
  };
  return {
    ...hydratedCategory,
    label: buildCategoryLabel(hydratedCategory),
  };
}
