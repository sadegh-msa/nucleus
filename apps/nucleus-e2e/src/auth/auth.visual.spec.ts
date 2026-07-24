import { expect, test } from '@playwright/test';

test.describe('Auth Visual Regression', () => {
  test.describe('Sign In Page', () => {
    test('should match sign in page screenshot', async ({ page }) => {
      await page.goto('/signin');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('signin-page.png', {
        fullPage: true,
      });
    });

    test('should match sign in form screenshot', async ({ page }) => {
      await page.goto('/signin');
      await expect(page.locator('#sign-in-form')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page.locator('#sign-in-form')).toHaveScreenshot('signin-form.png');
    });

    test('should match sign in form with validation errors screenshot', async ({ page }) => {
      await page.goto('/signin');
      await page.waitForLoadState('networkidle');

      const button = page.locator('#sign-in-button');
      await button.click();

      await expect(page.locator('#sign-in-form')).toHaveScreenshot('signin-form-errors.png');
    });
  });

  test.describe('Sign Up Page', () => {
    test('should match sign up page screenshot', async ({ page }) => {
      await page.goto('/signup');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('signup-page.png', {
        fullPage: true,
      });
    });

    test('should match sign up form screenshot', async ({ page }) => {
      await page.goto('/signup');
      await expect(page.locator('#sign-up-form')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page.locator('#sign-up-form')).toHaveScreenshot('signup-form.png');
    });
  });
});
