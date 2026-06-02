export interface RecipeComponent {
  ingredientName: string;
  quantity: number | null;
  unit: string | null;
}

export interface Recipe {
  id: string;
  title: string;
  imageUrl: string | null;
  duration: string;
  servings: number;
  cost: string;
  description: string;
  owner: string;
  ingredients: RecipeComponent[];
  categories: string[];
}
