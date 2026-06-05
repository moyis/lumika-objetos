// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://lumika-objetos.faustomoya-99.workers.dev',
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
      PUBLIC_WHATSAPP_NUMBER: envField.string({
        context: 'client',
        access: 'public',
        default: '5491100000000',
      }),
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
  },
  adapter: cloudflare({ imageService: 'custom', prerenderEnvironment: 'node' }),
  integrations: [sitemap({ filter: (page) => !page.includes('/admin') })],
});
