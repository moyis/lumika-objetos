import { defineConfig, devices } from '@playwright/test';

// In CI, tests run against the Cloudflare preview version URL (set by the
// workflow). Locally, the production build is served by wrangler dev.
const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:8787';
const useRemotePreview = !!process.env.PLAYWRIGHT_TEST_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Only start a local server when not testing against a Cloudflare preview
  webServer: useRemotePreview
    ? undefined
    : {
        command: 'bun run preview',
        url: 'http://localhost:8787',
        reuseExistingServer: !process.env.CI,
        timeout: 300_000, // astro check + build + wrangler dev startup
      },
});
