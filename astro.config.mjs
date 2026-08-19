// @ts-check
/* global process, URL */
import { defineConfig, envField, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

import sitemap from '@astrojs/sitemap';

import { readdirSync, readFileSync, statSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Astro emits the full-size original of every content-collection image() — even
// when pages only use the resized <Picture>/getImage variants — and nothing
// links to them. This integration deletes those orphans after build so the
// deploy ships only webp/avif (plus the referenced og:image JPEGs).
const pruneOrphanImages = () => ({
  name: 'prune-orphan-images',
  hooks: {
    /** @param {{ dir: URL, logger: { info: (msg: string) => void } }} ctx */
    'astro:build:done': ({ dir, logger }) => {
      const root = fileURLToPath(dir);
      const referenced = new Set();
      /** @type {string[]} */
      const raster = [];
      const assetRe = /[A-Za-z0-9_.-]+\.(?:jpe?g|png|webp|avif)/g;
      /** @param {string} d */
      const walk = (d) => {
        for (const e of readdirSync(d, { withFileTypes: true })) {
          const p = `${d}/${e.name}`;
          if (e.isDirectory()) walk(p);
          else if (/\.(html|xml)$/.test(e.name))
            for (const m of readFileSync(p, 'utf8').matchAll(assetRe)) referenced.add(m[0]);
          else if (/\.(jpe?g|png)$/.test(e.name) && p.includes('/_astro/')) raster.push(p);
        }
      };
      walk(root);
      let freed = 0;
      let n = 0;
      for (const p of raster) {
        if (referenced.has(p.split('/').pop())) continue;
        freed += statSync(p).size;
        unlinkSync(p);
        n++;
      }
      logger.info(`pruned ${n} orphan original(s), freed ${(freed / 1048576).toFixed(1)} MB`);
    },
  },
});

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
  // The site is fully prerendered and never touches Astro.session. Without
  // this, the Cloudflare adapter wires its default KV session driver and the
  // deploy declares a SESSION KV binding the worker never reads.
  session: false,
  experimental: {
    // Skip re-rendering prerendered pages whose data hasn't changed. Each
    // dynamic route returns a cacheKey covering every entry it reads, not just
    // its own — product pages embed related cards and category pages embed the
    // whole grid, so a sibling's price edit has to bust them too.
    incrementalBuild: true,
  },
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
    service: { entrypoint: 'astro/assets/services/sharp' },
    // Auto-generate srcset/sizes for every <Image>/<Picture>. Each image only
    // needs a `width` cap (its max rendered size) — Astro derives the variants.
    layout: 'constrained',
    // Curated breakpoints matching the site's real render widths. Astro's
    // default list adds 750/828/1668/2048/2560, which would generate many
    // unused variants (and slow the build) for our small render sizes.
    // 450 covers the product-card slot on 1x desktop (sizes caps it at 450px),
    // which otherwise falls through to the oversized 640 variant. 828 covers
    // full-bleed hero/carousel images on ~2x phones (375–414px viewports),
    // which otherwise jump from 640 straight to 1080.
    breakpoints: [450, 640, 828, 1080, 1600],
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
    pruneOrphanImages(),
  ],
});
