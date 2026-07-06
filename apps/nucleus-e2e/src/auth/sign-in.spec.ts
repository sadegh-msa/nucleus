import { expect, test } from '@playwright/test';

test.describe('Sign In Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
  });

  test('should display sign in form', async ({ page }) => {
    const form = page.locator('#sign-in-form');
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

  test('should have remember me checkbox', async ({ page }) => {
    const checkbox = page.locator('#remember-me');
    await expect(checkbox).toBeVisible();
  });

  test('should have sign in button', async ({ page }) => {
    const button = page.locator('#sign-in-button');
    await expect(button).toBeVisible();
    await expect(button).toContainText('Sign in');
  });

  test('should have create account link', async ({ page }) => {
    const link = page.locator('#sign-up-button');
    await expect(link).toBeVisible();
    await expect(link).toContainText('Create account');
  });

  test('should have forgot password link', async ({ page }) => {
    const link = page.locator('#reset-password-button');
    await expect(link).toBeVisible();
    await expect(link).toContainText('Forgot password');
  });

  test('should show validation error for empty email on submit', async ({ page }) => {
    const button = page.locator('#sign-in-button');
    await button.click();

    const emailField = page.locator('#email-form-field');
    await expect(emailField).toContainText('Required');
  });

  test('should show email validation error for invalid email', async ({ page }) => {
    const emailInput = page.locator('#email');
    await emailInput.fill('invalid-email');
    await emailInput.blur();

    const emailField = page.locator('#email-form-field');
    await expect(emailField).toContainText('Invalid');
  });

  test('should accept valid email format', async ({ page }) => {
    const emailInput = page.locator('#email');
    await emailInput.fill('user@example.com');
    await emailInput.blur();

    const emailField = page.locator('#email-form-field');
    await expect(emailField).not.toContainText('Invalid');
  });

  test('should navigate to sign up page', async ({ page }) => {
    const link = page.locator('#sign-up-button');
    await link.click();
    await expect(page).toHaveURL(/signup/);
  });
});
