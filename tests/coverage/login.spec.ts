import { test, expect } from '@testdino/playwright';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('login-btn')).toBeVisible();
  });

  test('should show error for empty email', async ({ page }) => {
    await page.getByTestId('login-btn').click();
    // Validation error appears on field-specific error div, not login-error
    await expect(page.locator('.field-error').first()).toHaveText(/required/i);
  });

  test('should show error for invalid email format', async ({ page }) => {
    await page.getByTestId('email-input').fill('notanemail');
    await page.getByTestId('password-input').fill('Demo1234!');
    await page.getByTestId('login-btn').click();
    await expect(page.locator('.field-error').first()).toHaveText(/invalid email/i);
  });

  test('should show error for wrong credentials', async ({ page }) => {
    await page.getByTestId('email-input').fill('wrong@example.com');
    await page.getByTestId('password-input').fill('WrongPass1!');
    await page.getByTestId('login-btn').click();
    await expect(page.getByTestId('login-error')).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.getByTestId('email-input').fill('demo@example.com');
    await page.getByTestId('password-input').fill('Demo1234!');
    await page.getByTestId('login-btn').click();
    await expect(page.getByTestId('login-success')).toBeVisible();
  });

  test('should show logout button when logged in', async ({ page }) => {
    await page.getByTestId('email-input').fill('demo@example.com');
    await page.getByTestId('password-input').fill('Demo1234!');
    await page.getByTestId('login-btn').click();
    await expect(page.getByTestId('logout-btn')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.getByTestId('email-input').fill('demo@example.com');
    await page.getByTestId('password-input').fill('Demo1234!');
    await page.getByTestId('login-btn').click();
    await expect(page.getByTestId('logout-btn')).toBeVisible();

    // Logout
    await page.getByTestId('logout-btn').click();
    await expect(page.getByTestId('email-input')).toBeVisible();
  });

  test('should show password validation errors', async ({ page }) => {
    await page.getByTestId('email-input').fill('demo@example.com');
    await page.getByTestId('password-input').fill('short');
    await page.getByTestId('login-btn').click();
    // Password errors appear on the second field-error div
    await expect(page.locator('.field-error').nth(1)).toHaveText(/8 characters/i);
  });
});
