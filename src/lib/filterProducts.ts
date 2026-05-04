import type { CollectionEntry } from 'astro:content';
import { PRODUCT_TAGS, type ProductTag } from './productTags';

type Product = CollectionEntry<'products'>;

export function filterProductsByTags(products: Product[], selectedTags: ProductTag[]): Product[] {
  if (selectedTags.length === 0) return products;
  return products.filter((p) => selectedTags.every((tag) => p.data.tags.includes(tag)));
}

export function parseTagsFromQuery(query: URLSearchParams): ProductTag[] {
  return query
    .getAll('tag')
    .filter((t): t is ProductTag => (PRODUCT_TAGS as readonly string[]).includes(t));
}

export function sortProducts(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const aOut = a.data.stock === 0 ? 1 : 0;
    const bOut = b.data.stock === 0 ? 1 : 0;
    if (aOut !== bOut) return aOut - bOut;
    return b.data.date.getTime() - a.data.date.getTime();
  });
}
