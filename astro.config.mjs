// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://lumikaobjetos.com',
  vite: {
    plugins: [tailwindcss()],
  },
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
        default: 'lumikaobjetos',
      }),
      PUBLIC_CONTACT_EMAIL: envField.string({
        context: 'client',
        access: 'public',
        default: 'hola@lumikaobjetos.com',
      }),
    },
  },
  adapter: cloudflare(),
});
