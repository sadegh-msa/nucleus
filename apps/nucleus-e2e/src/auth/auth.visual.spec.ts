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

      await page.locator('#email').fill('invalid');
      await page.locator('#email').blur();
      await expect(page.locator('#email-form-field')).toContainText('Invalid');

      await page.locator('#sign-in-button').click();
      await expect(page.locator('#password-form-field')).toContainText('Required');

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

    test('should match sign up form with validation errors screenshot', async ({ page }) => {
      await page.goto('/signup');
      await page.waitForLoadState('networkidle');

      await page.locator('#sign-up-button').click();
      await expect(page.locator('#email-form-field .ui-form-field-message')).toBeVisible();

      await expect(page.locator('#sign-up-form')).toHaveScreenshot('signup-form-errors.png');
    });

    test('should match sign up password strength popover screenshot', async ({ page }) => {
      await page.goto('/signup');
      await page.waitForLoadState('networkidle');

      await page.locator('#password').focus();
      await expect(page.locator('#password-form-field')).toBeVisible();

      await expect(page.locator('#password-form-field')).toHaveScreenshot(
        'signup-form-password-popover.png',
      );
    });

    test('should match sign up form with matching passwords screenshot', async ({ page }) => {
      await page.goto('/signup');
      await page.waitForLoadState('networkidle');

      await page.locator('#email').fill('newuser@example.com');
      await page.locator('#password').fill('AB1!ab2@CD3#');
      await page.locator('#confirm-password').fill('AB1!ab2@CD3#');
      await page.locator('#confirm-password').blur();
      await expect(page.locator('#confirm-password-form-field')).toContainText('Match');

      await expect(page.locator('#sign-up-form')).toHaveScreenshot('signup-form-matching.png');
    });
  });
});
