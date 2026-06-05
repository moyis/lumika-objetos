export const FRAGRANCES = [
  'Frutos del bosque',
  'Limón',
  'Chocolate',
  'Océano',
  'Vainilla',
  'Rosas',
  'Tutti frutti',
  'Rosas y vainilla',
] as const;

export type Fragrance = (typeof FRAGRANCES)[number];
