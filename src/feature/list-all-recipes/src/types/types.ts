export interface Recipe {
  id: number;
  name: string;
  instructions: string;
  cookingTime: number;
  categories: Category[];
  components: Component[];
}

export interface Category {
  id: number;
  name: string;
  color: string;
}

export interface Component {
  ingredientId: number;
  ingredientName: string;
  quantity: number;
  unit: string;
}
export type RecipeList = Recipe[];