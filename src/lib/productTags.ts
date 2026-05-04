export const PRODUCT_TAGS = ['velas', 'resina', 'nuevo', 'edicion-limitada'] as const;
export type ProductTag = (typeof PRODUCT_TAGS)[number];
