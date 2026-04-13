// types used for measurements in Create Recipe feature
export const UNIT_VALUES = [
  'GRAM',
  'KILOGRAM',
  'MILLILITER',
  'LITER',
  'PIECE',
  'TEASPOON',
  'TABLESPOON',
] as const;

export type Unit = (typeof UNIT_VALUES)[number];
