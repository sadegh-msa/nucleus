import { expect, test } from '@playwright/test';

test.describe('Sign Up Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('should display sign up form', async ({ page }) => {
    const form = page.locator('#sign-up-form');
    await expect(form).toBeVisible();
  });

  test('should have email input', async ({ page }) => {
    const emailInput = page.locator('#email');
    await expect(emailInput).toBeVisible();
  });

  test('should have password input', async ({ page }) => {
    const passwordInput = page.locator('#password');
    await expect(passwordInput).toBeVisible();
  });

  test('should have confirm password input', async ({ page }) => {
    const confirmPasswordInput = page.locator('#confirm-password');
    await expect(confirmPasswordInput).toBeVisible();
  });

  test('should have sign up button', async ({ page }) => {
    const button = page.locator('#sign-up-button');
    await expect(button).toBeVisible();
    await expect(button).toContainText('Sign up');
  });

  test('should have sign in link', async ({ page }) => {
    const link = page.locator('#sign-in-button');
    await expect(link).toBeVisible();
    await expect(link).toContainText('Sign in');
  });

  test('should have forgot password link', async ({ page }) => {
    const link = page.locator('#reset-password-button');
    await expect(link).toBeVisible();
    await expect(link).toContainText('Forgot password');
  });

  test('should navigate to sign in page', async ({ page }) => {
    const link = page.locator('#sign-in-button');
    await link.click();
    await expect(page).toHaveURL(/signin/);
  });

  test('should fill in sign up form', async ({ page }) => {
    await page.locator('#email').fill('newuser@example.com');
    await page.locator('#password').fill('AB1!ab2@');
    await page.locator('#confirm-password').fill('AB1!ab2@');

    await expect(page.locator('#email')).toHaveValue('newuser@example.com');
    await expect(page.locator('#password')).toHaveValue('AB1!ab2@');
    await expect(page.locator('#confirm-password')).toHaveValue('AB1!ab2@');
  });

  test('should show moderate strength hint for moderate password', async ({ page }) => {
    await page.locator('#email').fill('newuser@example.com');
    await page.locator('#password').fill('AB1!ab2@');
    await page.locator('#password').blur();

    const hint = page.locator('#password-form-field .ui-form-field-message');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText('Moderate');
  });

  test('should show match hint when passwords match', async ({ page }) => {
    await page.locator('#password').fill('AB1!ab2@CD3#');
    await page.locator('#confirm-password').fill('AB1!ab2@CD3#');
    await page.locator('#confirm-password').blur();

    const hint = page.locator('#confirm-password-form-field .ui-form-field-message');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText('Match');
  });

  test('should show match error when passwords do not match', async ({ page }) => {
    await page.locator('#password').fill('AB1!ab2@CD3#');
    await page.locator('#confirm-password').fill('CD1!cd2@AB3#');
    await page.locator('#confirm-password').blur();

    const hint = page.locator('#confirm-password-form-field .ui-form-field-message');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText('Mismatch');
  });
});
