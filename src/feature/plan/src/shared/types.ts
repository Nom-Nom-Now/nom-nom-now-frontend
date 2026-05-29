export interface Recipe {
  id: string;
  title: string;
  imageUrl: string | null;
  duration: string;
  cost: string;
  description: string;
  categories: string[];
  owner: string;
  ingredients: RecipeComponent[];
}

export interface RecipeComponent {
  ingredientName: string;
  quantity: number | null;
  unit: string | null;
}
