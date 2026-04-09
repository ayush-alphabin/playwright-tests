import { test, expect } from '@testdino/playwright';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display welcome heading', async ({ page }) => {
    await expect(page.getByTestId('home-heading')).toBeVisible();
  });

  test('should show featured products', async ({ page }) => {
    const products = page.getByTestId('featured-product');
    await expect(products.first()).toBeVisible();
    expect(await products.count()).toBeGreaterThanOrEqual(1);
  });

  test('should navigate to products via search', async ({ page }) => {
    await page.getByTestId('search-input').fill('headphones');
    await page.getByTestId('search-btn').click();
    await expect(page).toHaveURL(/#\/products/);
  });

  test('should navigate to products page via nav', async ({ page }) => {
    await page.locator('nav a[href="#/products"]').click();
    await expect(page).toHaveURL(/#\/products/);
  });

  test('should navigate to login page via nav', async ({ page }) => {
    await page.locator('nav a[href="#/login"]').click();
    await expect(page).toHaveURL(/#\/login/);
  });
});
