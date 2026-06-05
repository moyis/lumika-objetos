import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { PRODUCT_TAGS } from './lib/productTags';

export type { ProductTag } from './lib/productTags';
export { PRODUCT_TAGS } from './lib/productTags';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      subtitle: z.string().optional(),
      sku: z.string().optional(),
      price: z.number().nonnegative(),
      currency: z.literal('ARS'),
      stock: z.number().int().nonnegative().default(0),
      featured: z.boolean().default(false),
      fragrances: z.array(z.string()).default([]),
      tags: z.array(z.enum(PRODUCT_TAGS)).default([]),
      images: z.array(image()).default([]),
      date: z.coerce.date(),
    }),
});

export const collections = { products };
