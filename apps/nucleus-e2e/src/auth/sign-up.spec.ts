import { expect, test } from '@playwright/test';

test.describe('Sign Up Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('app-root', { state: 'attached', timeout: 30000 });
  });

  test('should display sign up form', async ({ page }) => {
    const form = page.locator('#signup-form');
    await expect(form).toBeVisible();
  });

  test('should have email input', async ({ page }) => {
    const emailInput = page.locator('#signup-form-ng-form0-email');
    await expect(emailInput).toBeVisible();
  });

  test('should have password input', async ({ page }) => {
    const passwordInput = page.locator('#signup-form-ng-form0-password');
    await expect(passwordInput).toBeVisible();
  });

  test('should have confirm password input', async ({ page }) => {
    const confirmPasswordInput = page.locator('#signup-form-ng-form0-confirmPassword');
    await expect(confirmPasswordInput).toBeVisible();
  });

  test('should have sign up button', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Sign up' });
    await expect(button).toBeVisible();
  });

  test('should have sign in link', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Sign in' });
    await expect(link).toBeVisible();
  });

  test('should have forgot password link', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Forgot password?' });
    await expect(link).toBeVisible();
  });

  test('should navigate to sign in page', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Sign in' });
    await link.click();
    await expect(page).toHaveURL(/signin/);
  });

  test('should fill in sign up form', async ({ page }) => {
    await page.locator('#signup-form-ng-form0-email').fill('newuser@example.com');
    await page.locator('#signup-form-ng-form0-password').fill('AbCd12!@abcd1234');
    await page.locator('#signup-form-ng-form0-confirmPassword').fill('AbCd12!@abcd1234');

    await expect(page.locator('#signup-form-ng-form0-email')).toHaveValue('newuser@example.com');
    await expect(page.locator('#signup-form-ng-form0-password')).toHaveValue('AbCd12!@abcd1234');
    await expect(page.locator('#signup-form-ng-form0-confirmPassword')).toHaveValue(
      'AbCd12!@abcd1234',
    );
  });

  test('should show moderate strength hint for moderate password', async ({ page }) => {
    await page.locator('#signup-form-ng-form0-email').fill('newuser@example.com');
    // Password with 8-11 chars for moderate (not strong): 2+ upper, 2+ lower, 2+ digits, 2+ special
    await page.locator('#signup-form-ng-form0-password').fill('Ab1!Cd2@');
    await page.locator('#signup-form-ng-form0-password').blur();

    const hint = page.locator('fieldset.form-field').filter({ hasText: 'Password' }).first();
    await expect(hint).toContainText('Moderate');
  });

  test('should show match hint when passwords match', async ({ page }) => {
    await page.locator('#signup-form-ng-form0-password').fill('AbCd12!@abcd1234');
    await page.locator('#signup-form-ng-form0-confirmPassword').fill('AbCd12!@abcd1234');
    await page.locator('#signup-form-ng-form0-confirmPassword').blur();

    const hint = page.locator('fieldset.form-field').filter({ hasText: 'Confirm password' });
    await expect(hint).toContainText('Match');
  });

  test('should show match error when passwords do not match', async ({ page }) => {
    await page.locator('#signup-form-ng-form0-password').fill('AbCd12!@abcd1234');
    await page.locator('#signup-form-ng-form0-confirmPassword').fill('Different12!@');
    await page.locator('#signup-form-ng-form0-confirmPassword').blur();

    const hint = page.locator('fieldset.form-field').filter({ hasText: 'Confirm password' });
    await expect(hint).toContainText('Mismatch');
  });
});
