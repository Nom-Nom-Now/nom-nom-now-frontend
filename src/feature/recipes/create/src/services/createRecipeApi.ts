/**
 * Types that mirror the backend REST API contract.
 * The frontend uses its own domain types internally;
 * mapping happens in the service layer.
 */

// --- Request ---

export interface CreateRecipeComponentDto {
  name: string;
  quantity: number;
  unit: string;
}

export interface CreateRecipeRequestDto {
  name: string;
  instructions: string;
  cookingTime: number;
  categoryIds: number[];
  components: CreateRecipeComponentDto[];
}

// --- Response ---

export interface RecipeComponentResponseDto {
  ingredientId: number;
  ingredientName: string;
  quantity: number;
  unit: string;
}

export interface CreateRecipeResponseDto {
  id: number;
  name: string;
  instructions: string;
  cookingTime: number;
  ownerName: string;
  categories: string;
  components: RecipeComponentResponseDto[];
}
