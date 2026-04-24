import { getCategories } from './categoryApiService.ts';
import type {
  GetCategoriesResponseDto,
  SuperCategoryResponseDto,
  CategoryResponseDto,
  SuperCategoryOption,
  CategoryOption,
  CategoryLists,
} from './categoryApiTypes.ts';

function mapSuperCategoryDto(
  dto: SuperCategoryResponseDto,
): SuperCategoryOption {
  return {
    id: dto.id,
    name: dto.name.trim(),
  };
}

function mapCategoryDto(
  dto: CategoryResponseDto,
): CategoryOption {
  return {
    id: dto.id,
    name: dto.name.trim(),
    superCategoryId: dto.superCategoryId,
  };
}

export function mapCategoriesResponseToLists(
  dto: GetCategoriesResponseDto,
): CategoryLists {
  return {
    superCategories: dto.superCategories.map(mapSuperCategoryDto),
    categories: dto.categories.map(mapCategoryDto),
  };
}

export async function loadCategoryLists(): Promise<CategoryLists> {
  const dto = await getCategories();
  return mapCategoriesResponseToLists(dto);
}