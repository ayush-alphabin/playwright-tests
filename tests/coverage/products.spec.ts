import { test, expect } from '@testdino/playwright';

test.describe('Products Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/products');
  });

  test('should display product cards', async ({ page }) => {
    const cards = page.getByTestId('product-card');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(5);
  });

  test('should filter by category', async ({ page }) => {
    await page.getByTestId('category-filter').selectOption('Electronics');
    const cards = page.getByTestId('product-card');
    // Electronics category has specific products
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(12); // filtered subset
  });

  test('should sort by price ascending', async ({ page }) => {
    await page.getByTestId('sort-select').selectOption('price-asc');
    const prices = await page.locator('[data-testid="product-card"] [data-testid="product-price"]').allTextContents();
    const numericPrices = prices.map((p) => parseFloat(p.replace(/[^0-9.]/g, '')));
    for (let i = 1; i < numericPrices.length; i++) {
      expect(numericPrices[i]).toBeGreaterThanOrEqual(numericPrices[i - 1]);
    }
  });

  test('should sort by price descending', async ({ page }) => {
    await page.getByTestId('sort-select').selectOption('price-desc');
    const prices = await page.locator('[data-testid="product-card"] [data-testid="product-price"]').allTextContents();
    const numericPrices = prices.map((p) => parseFloat(p.replace(/[^0-9.]/g, '')));
    for (let i = 1; i < numericPrices.length; i++) {
      expect(numericPrices[i]).toBeLessThanOrEqual(numericPrices[i - 1]);
    }
  });

  test('should add product to cart', async ({ page }) => {
    const cartCount = page.locator('#cart-count');
    const before = parseInt(await cartCount.textContent() || '0', 10);

    await page.getByTestId('add-to-cart-p1').click();

    const after = parseInt(await cartCount.textContent() || '0', 10);
    expect(after).toBe(before + 1);
  });

  test('should show all categories in filter', async ({ page }) => {
    const options = await page.getByTestId('category-filter').locator('option').allTextContents();
    expect(options.length).toBeGreaterThan(2); // "All" + at least 2 categories
  });
});
