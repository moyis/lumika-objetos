import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      sku: z.string().optional(),
      price: z.number().nonnegative(),
      currency: z.literal('ARS'),
      stock: z.number().int().nonnegative().default(0),
      featured: z.boolean().default(false),
      images: z
        .array(
          z.object({
            image: image(),
          }),
        )
        .default([]),
      date: z.coerce.date(),
    }),
});

export const collections = { products };
