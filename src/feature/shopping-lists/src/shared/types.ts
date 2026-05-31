export interface ShoppingListSummary {
  id: string;
  weekStart: string;
  createdAt: string;
  itemCount: number;
}

export interface ShoppingList {
  id: string;
  weekStart: string;
  createdAt: string;
  items: ShoppingListItem[];
}

export interface ShoppingListItem {
  ingredientName: string;
  quantity: number;
  unit: string;
}
