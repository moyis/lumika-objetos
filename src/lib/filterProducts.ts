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
  return [...products].sort((a, b) => a.data.title.localeCompare(b.data.title, 'es'));
}
