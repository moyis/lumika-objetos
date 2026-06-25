// @ts-check
/* global process, URL */
import { defineConfig, envField, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

import sitemap from '@astrojs/sitemap';

import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Build a slug -> last-modified map from product frontmatter so the sitemap
// emits an accurate <lastmod> per product (Astro's sitemap omits it otherwise).
const productsDir = fileURLToPath(new URL('./src/content/products', import.meta.url));
const slugRe = /^slug:\s*(.+)$/m;
const dateRe = /^date:\s*(.+)$/m;
const lastmodBySlug = new Map();
for (const file of readdirSync(productsDir)) {
  if (!file.endsWith('.md')) continue;
  const fm = readFileSync(`${productsDir}/${file}`, 'utf8');
  const slug = slugRe.exec(fm)?.[1].trim();
  const date = dateRe.exec(fm)?.[1].trim();
  if (slug && date) lastmodBySlug.set(slug, new Date(date).toISOString());
}
// Static pages (home, about, contact, shop index) reflect the freshest product.
const latestContent = [...lastmodBySlug.values()].sort((a, b) => a.localeCompare(b)).at(-1);

// Match /shop/<slug> to its product lastmod; fall back to the freshest content.
/** @param {string} url */
const lastmodFor = (url) => {
  const slug = /\/shop\/([^/]+)\/?$/.exec(new URL(url).pathname)?.[1];
  return (slug && lastmodBySlug.get(slug)) || latestContent;
};

// The Cloudflare adapter runs `astro dev` inside the workerd runtime, whose
// sandboxed fs can't read host files (node:fs/promises -> ENOENT on
// vite/package.json, the sharp image endpoint, etc.), so `astro dev` crashes on
// every request. The whole site is prerendered, so dev needs none of the worker
// runtime — skip the adapter during `astro dev` and let Astro serve in plain
// Node (working <Image>, fonts and HMR). `astro build`/`preview` still use it.
const isDev = process.argv.includes('dev');

// https://astro.build/config
export default defineConfig({
  site: 'https://www.lumikaobjetos.com.ar',
  // Prefetch internal links on hover/focus (tap on touch) for near-instant
  // navigation. Static assets get an ETag from Cloudflare, so prefetch works
  // across browsers.
  prefetch: { prefetchAll: true },
  build: {
    // Inline CSS into each page so styles apply during HTML parse instead of
    // arriving via a render-blocking <link>. Removes the flash-of-unstyled
    // content (images painting at intrinsic size) on refresh.
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Stropica',
      cssVariable: '--font-stropica',
      options: {
        variants: [
          {
            weight: 400,
            style: 'normal',
            src: ['./src/assets/fonts/Stropica.woff2'],
          },
        ],
      },
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Poppins',
      cssVariable: '--font-poppins',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
    },
  ],
  env: {
    schema: {
      PUBLIC_INSTAGRAM_HANDLE: envField.string({
        context: 'client',
        access: 'public',
        default: 'lumika.objetos',
      }),
      PUBLIC_CONTACT_EMAIL: envField.string({
        context: 'client',
        access: 'public',
        default: 'lumikaobjetos@gmail.com',
      }),
    },
  },
  image: {
    // Use Astro's sharp service so the (prerendered) build actually resizes
    // images to the requested widths. The Cloudflare 'compile' service only
    // re-encodes at full resolution, which shipped oversized variants.
    service: {
      entrypoint: 'astro/assets/services/sharp',
      // sharp's AVIF defaults to effort:4, which dominates cold builds (~8s per
      // 1600px variant vs ~1.6s at effort:3 — a ~5x cliff). effort tunes the
      // compression search, not visual quality (that's `quality`), so the only
      // cost is ~6-11% larger AVIFs. Cuts a cold build from ~61s to ~28s; warm
      // builds (cache hit) are ~3s regardless.
      config: { avif: { effort: 3 } },
    },
    // Auto-generate srcset/sizes for every <Image>/<Picture>. Each image only
    // needs a `width` cap (its max rendered size) — Astro derives the variants.
    layout: 'constrained',
    // Curated breakpoints matching the site's real render widths. Astro's
    // default list adds 750/828/1668/2048/2560, which would generate many
    // unused variants (and slow the build) for our small render sizes.
    breakpoints: [640, 1080, 1600],
    // Tailwind (object-cover, w-full, aspect-*) handles visual sizing, so skip
    // Astro's own responsive styles (they'd out-specify Tailwind via :where()).
    responsiveStyles: false,
  },
  adapter: isDev ? undefined : cloudflare({ imageService: 'custom', prerenderEnvironment: 'node' }),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin'),
      serialize: (item) => ({ ...item, lastmod: lastmodFor(item.url) }),
    }),
  ],
});
