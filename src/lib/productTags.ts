import tagsData from '../data/tags.json';

export interface Tag {
  /** URL/query slug, e.g. "velas". Used in /shop?tag=… and product frontmatter. */
  slug: string;
  /** Display name, e.g. "Velas". Shown in chips, breadcrumbs and the footer. */
  label: string;
}

// Tags double as store categories. Edit them in the admin panel
// (Configuración → Etiquetas), which writes src/data/tags.json.
export const TAGS: Tag[] = tagsData.tags;

// Tuple of slugs for the content-collection enum (z.enum needs a non-empty tuple).
export const PRODUCT_TAGS = TAGS.map((t) => t.slug) as [string, ...string[]];

export type ProductTag = string;

export const TAG_LABELS: Record<string, string> = Object.fromEntries(
  TAGS.map((t) => [t.slug, t.label]),
);
