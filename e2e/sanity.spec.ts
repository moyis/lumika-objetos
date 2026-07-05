import { test, expect } from '@playwright/test';

// Sanity checks: the app builds, serves, and its core pages render.
// Intentionally lean — this suite gates auto-merge of dependency updates.
test.describe('Sanity checks', () => {
  test('homepage loads successfully', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Lumika Objetos/);
  });

  test('homepage has meta description', async ({ page }) => {
    await page.goto('/');
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
  });

  test('shop lists products and a product page renders', async ({ page }) => {
    const response = await page.goto('/shop');
    expect(response?.status()).toBe(200);

    const productLink = page.locator('a[href^="/shop/"]').first();
    await expect(productLink).toBeVisible();

    await productLink.click();
    await expect(page).toHaveURL(/\/shop\/.+/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('unknown route returns 404 page', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    expect(response?.status()).toBe(404);
    await expect(page.getByText('Error 404')).toBeVisible();
  });

  test('no console errors on homepage', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(errors).toHaveLength(0);
  });
});

test.describe('Build artifacts', () => {
  test('sitemap is generated', async ({ page }) => {
    const response = await page.goto('/sitemap-index.xml');
    expect(response?.status()).toBe(200);
    const content = await response?.text();
    expect(content).toContain('sitemap');
  });

  test('robots.txt exists', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    const content = await response?.text();
    expect(content).toContain('User-agent');
  });

  test('google shopping feed is generated', async ({ page }) => {
    const response = await page.goto('/google-shopping.xml');
    expect(response?.status()).toBe(200);
    const content = await response?.text();
    expect(content).toContain('<rss');
  });
});
