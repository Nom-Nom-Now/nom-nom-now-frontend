import { describe, it, expect } from 'vitest';
import { mapCategoriesResponseToLists } from '../services/categoryMapper';
import type { GetCategoriesResponseDto } from '../services/categoryApiTypes';

describe('categoryMapper', () => {
  it('should map DTO to CategoryLists and trim names', () => {
    const dto: GetCategoriesResponseDto = {
      superCategories: [
        { id: 1, name: '  Küche  ' },
        { id: 2, name: 'Gang' },
      ],
      categories: [
        { id: 10, name: ' Italienisch ', superCategoryId: 1 },
        { id: 11, name: 'Vorspeise', superCategoryId: 2 },
      ],
    };

    const result = mapCategoriesResponseToLists(dto);

    expect(result.superCategories).toEqual([
      { id: 1, name: 'Küche' },
      { id: 2, name: 'Gang' },
    ]);
    expect(result.categories).toEqual([
      { id: 10, name: 'Italienisch', superCategoryId: 1 },
      { id: 11, name: 'Vorspeise', superCategoryId: 2 },
    ]);
  });

  it('should handle empty lists', () => {
    const dto: GetCategoriesResponseDto = {
      superCategories: [],
      categories: [],
    };

    const result = mapCategoriesResponseToLists(dto);

    expect(result.superCategories).toEqual([]);
    expect(result.categories).toEqual([]);
  });
});
