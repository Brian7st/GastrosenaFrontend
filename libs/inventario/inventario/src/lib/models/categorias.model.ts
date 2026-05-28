export const CATEGORIAS_BIEN = [
  'Perecederos',
  'Fruver',
  'Abarrotes y Secos',
  'Bebidas y Líquidos',
  'Repostería y Congelados',
] as const;

export type CategoriaBien = (typeof CATEGORIAS_BIEN)[number];
