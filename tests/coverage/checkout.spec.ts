import { test, expect } from '@testdino/playwright';

test.describe('Checkout Page', () => {
  test('should show message when cart is empty', async ({ page }) => {
    await page.goto('/#/checkout');
    const content = await page.locator('#app').textContent();
    expect(content).toContain('empty');
  });

  test('should display checkout form with items in cart', async ({ page }) => {
    // Add products first
    await page.goto('/#/products');
    await page.getByTestId('add-to-cart-p1').click();
    await page.getByTestId('add-to-cart-p3').click();

    await page.goto('/#/checkout');
    await expect(page.getByTestId('ship-name')).toBeVisible();
    await expect(page.getByTestId('card-number')).toBeVisible();
    await expect(page.getByTestId('place-order')).toBeVisible();
  });

  test('should validate shipping fields', async ({ page }) => {
    await page.goto('/#/products');
    await page.getByTestId('add-to-cart-p1').click();

    await page.goto('/#/checkout');
    // Submit without filling fields
    await page.getByTestId('place-order').click();

    // Should show validation errors
    const errors = page.locator('.error');
    expect(await errors.count()).toBeGreaterThan(0);
  });

  test('should validate credit card number', async ({ page }) => {
    await page.goto('/#/products');
    await page.getByTestId('add-to-cart-p1').click();

    await page.goto('/#/checkout');
    await page.getByTestId('ship-name').fill('John Doe');
    await page.getByTestId('ship-address').fill('123 Main St');
    await page.getByTestId('ship-city').fill('New York');
    await page.getByTestId('ship-zip').fill('10001');
    await page.getByTestId('card-number').fill('1234567890');
    await page.getByTestId('card-expiry').fill('12/28');
    await page.getByTestId('card-cvv').fill('123');

    await page.getByTestId('place-order').click();

    const errors = page.locator('.error');
    expect(await errors.count()).toBeGreaterThan(0);
  });

  test('should complete order with valid data', async ({ page }) => {
    await page.goto('/#/products');
    await page.getByTestId('add-to-cart-p1').click();

    await page.goto('/#/checkout');
    await page.getByTestId('ship-name').fill('John Doe');
    await page.getByTestId('ship-address').fill('123 Main St');
    await page.getByTestId('ship-city').fill('New York');
    await page.getByTestId('ship-zip').fill('10001');
    // Valid Visa test card (passes Luhn)
    await page.getByTestId('card-number').fill('4111111111111111');
    await page.getByTestId('card-expiry').fill('12/28');
    await page.getByTestId('card-cvv').fill('123');

    await page.getByTestId('place-order').click();

    await expect(page.getByTestId('order-confirmation')).toBeVisible({ timeout: 5000 });
  });

  test('should validate zip code format', async ({ page }) => {
    await page.goto('/#/products');
    await page.getByTestId('add-to-cart-p1').click();

    await page.goto('/#/checkout');
    await page.getByTestId('ship-name').fill('John Doe');
    await page.getByTestId('ship-address').fill('123 Main St');
    await page.getByTestId('ship-city').fill('New York');
    await page.getByTestId('ship-zip').fill('INVALID');
    await page.getByTestId('card-number').fill('4111111111111111');
    await page.getByTestId('card-expiry').fill('12/28');
    await page.getByTestId('card-cvv').fill('123');

    await page.getByTestId('place-order').click();

    const errors = page.locator('.error');
    expect(await errors.count()).toBeGreaterThan(0);
  });
});
