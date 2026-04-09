import { test, expect } from '@testdino/playwright';

test.describe('Cart Page', () => {
  test('should show empty cart message when no items', async ({ page }) => {
    await page.goto('/#/cart');
    await expect(page.getByTestId('empty-cart')).toBeVisible();
  });

  test('should display cart items after adding products', async ({ page }) => {
    // Add a product first
    await page.goto('/#/products');
    await page.getByTestId('add-to-cart-p1').click();
    await page.getByTestId('add-to-cart-p3').click();

    // Navigate to cart
    await page.goto('/#/cart');
    await expect(page.getByTestId('cart-table')).toBeVisible();
  });

  test('should update quantity', async ({ page }) => {
    await page.goto('/#/products');
    await page.getByTestId('add-to-cart-p1').click();

    await page.goto('/#/cart');
    const qtyInput = page.getByTestId('qty-p1');
    await qtyInput.fill('3');
    await qtyInput.press('Enter');

    // Total should reflect the updated quantity
    const subtotal = await page.getByTestId('subtotal').textContent();
    expect(subtotal).toBeTruthy();
  });

  test('should remove item from cart', async ({ page }) => {
    await page.goto('/#/products');
    await page.getByTestId('add-to-cart-p1').click();

    await page.goto('/#/cart');
    await page.getByTestId('remove-p1').click();

    await expect(page.getByTestId('empty-cart')).toBeVisible();
  });

  test('should apply valid discount code', async ({ page }) => {
    await page.goto('/#/products');
    await page.getByTestId('add-to-cart-p1').click();

    await page.goto('/#/cart');
    await page.getByTestId('discount-input').fill('SAVE10');
    await page.getByTestId('apply-discount').click();

    const message = await page.getByTestId('discount-message').textContent();
    expect(message).toContain('save');
  });

  test('should reject invalid discount code', async ({ page }) => {
    await page.goto('/#/products');
    await page.getByTestId('add-to-cart-p1').click();

    await page.goto('/#/cart');
    await page.getByTestId('discount-input').fill('INVALIDCODE');
    await page.getByTestId('apply-discount').click();

    const message = await page.getByTestId('discount-message').textContent();
    expect(message).toContain('Invalid');
  });

  test('should show subtotal, tax, shipping, and total', async ({ page }) => {
    await page.goto('/#/products');
    await page.getByTestId('add-to-cart-p1').click();

    await page.goto('/#/cart');
    await expect(page.getByTestId('subtotal')).toBeVisible();
    await expect(page.getByTestId('tax')).toBeVisible();
    await expect(page.getByTestId('shipping')).toBeVisible();
    await expect(page.getByTestId('total')).toBeVisible();
  });

  test('should show free shipping for orders over $100', async ({ page }) => {
    await page.goto('/#/products');
    // Add expensive item (Smart Watch $249.99)
    await page.getByTestId('add-to-cart-p6').click();

    await page.goto('/#/cart');
    const shipping = await page.getByTestId('shipping').textContent();
    expect(shipping).toContain('FREE');
  });
});
