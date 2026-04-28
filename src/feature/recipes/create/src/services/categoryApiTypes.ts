export interface SuperCategoryResponseDto {
  id: number;
  name: string;
}

export interface CategoryResponseDto {
  id: number;
  name: string;
  superCategoryId: number;
}

export interface GetCategoriesResponseDto {
  superCategories: SuperCategoryResponseDto[];
  categories: CategoryResponseDto[];
}

export interface SuperCategoryOption {
  id: number;
  name: string;
}

export interface CategoryOption {
  id: number;
  name: string;
  superCategoryId: number;
}

export interface CategoryLists {
  superCategories: SuperCategoryOption[];
  categories: CategoryOption[];
}
