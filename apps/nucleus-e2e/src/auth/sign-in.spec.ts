import { expect, test } from '@playwright/test';

test.describe('Sign In Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('app-root', { state: 'attached', timeout: 30000 });
  });

  test('should display sign in form', async ({ page }) => {
    const form = page.locator('#signin-form');
    await expect(form).toBeVisible();
  });

  test('should have email input', async ({ page }) => {
    const emailInput = page.locator('#signin-form-ng-form0-email');
    await expect(emailInput).toBeVisible();
  });

  test('should have password input', async ({ page }) => {
    const passwordInput = page.locator('#signin-form-ng-form0-password');
    await expect(passwordInput).toBeVisible();
  });

  test('should have remember me checkbox', async ({ page }) => {
    const checkbox = page.locator('#signin-form-ng-form0-rememberMe');
    await expect(checkbox).toBeVisible();
  });

  test('should have sign in button', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Sign in' });
    await expect(button).toBeVisible();
  });

  test('should have create account link', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Create account' });
    await expect(link).toBeVisible();
  });

  test('should have forgot password link', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Forgot password?' });
    await expect(link).toBeVisible();
  });

  test('should show validation error for empty email on submit', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Sign in' });
    await button.click();

    const emailField = page.locator('fieldset.form-field').filter({ hasText: 'Email' });
    await expect(emailField).toContainText('Required');
  });

  test('should show email validation error for invalid email', async ({ page }) => {
    const emailInput = page.locator('#signin-form-ng-form0-email');
    await emailInput.fill('invalid-email');
    await emailInput.blur();

    const emailField = page.locator('fieldset.form-field').filter({ hasText: 'Email' });
    await expect(emailField).toContainText('Invalid');
  });

  test('should accept valid email format', async ({ page }) => {
    const emailInput = page.locator('#signin-form-ng-form0-email');
    await emailInput.fill('user@example.com');
    await emailInput.blur();

    const emailField = page.locator('fieldset.form-field').filter({ hasText: 'Email' });
    await expect(emailField).not.toContainText('Invalid');
  });

  test('should navigate to sign up page', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Create account' });
    await link.click();
    await expect(page).toHaveURL(/signup/);
  });
});
