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
      await expect(page.locator('#signin-form')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page.locator('#signin-form')).toHaveScreenshot('signin-form.png');
    });

    test('should match sign in form with validation errors screenshot', async ({ page }) => {
      await page.goto('/signin');
      await page.waitForLoadState('networkidle');

      await page.locator('#signin-form-ng-form0-email').fill('invalid');
      await page.locator('#signin-form-ng-form0-email').blur();
      await expect(page.locator('fieldset.form-field').filter({ hasText: 'Email' })).toContainText(
        'Invalid',
      );

      await page.locator('#signin-form-ng-form0-password').fill('');
      await page.locator('#signin-form-ng-form0-password').blur();
      await expect(
        page.locator('fieldset.form-field').filter({ hasText: 'Password' }),
      ).toContainText('Required');

      await expect(page.locator('#signin-form')).toHaveScreenshot('signin-form-errors.png');
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
      await expect(page.locator('#signup-form')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page.locator('#signup-form')).toHaveScreenshot('signup-form.png');
    });

    test('should match sign up form with validation errors screenshot', async ({ page }) => {
      await page.goto('/signup');
      await page.waitForLoadState('networkidle');

      await page.locator('#signup-form-ng-form0-email').fill('invalid');
      await page.locator('#signup-form-ng-form0-email').blur();
      await expect(page.locator('fieldset.form-field').filter({ hasText: 'Email' })).toContainText(
        'Invalid',
      );

      await page.locator('#signup-form-ng-form0-password').fill('');
      await page.locator('#signup-form-ng-form0-password').blur();
      await expect(
        page.locator('fieldset.form-field').filter({ hasText: 'Password' }).first(),
      ).toContainText('Required');

      await page.locator('#signup-form-ng-form0-confirmPassword').fill('');
      await page.locator('#signup-form-ng-form0-confirmPassword').blur();
      await expect(
        page.locator('fieldset.form-field').filter({ hasText: 'Confirm password' }),
      ).toContainText('Required');

      await expect(page.locator('#signup-form')).toHaveScreenshot('signup-form-errors.png');
    });

    test('should match sign up password strength popover screenshot', async ({ page }) => {
      await page.goto('/signup');
      await page.waitForLoadState('networkidle');

      await page.locator('#signup-form-ng-form0-password').focus();
      await expect(
        page.locator('fieldset.form-field').filter({ hasText: 'Password' }).first(),
      ).toBeVisible();

      await expect(
        page.locator('fieldset.form-field').filter({ hasText: 'Password' }).first(),
      ).toHaveScreenshot('signup-form-password-popover.png');
    });

    test('should match sign up form with matching passwords screenshot', async ({ page }) => {
      await page.goto('/signup');
      await page.waitForLoadState('networkidle');

      await page.locator('#signup-form-ng-form0-email').fill('newuser@example.com');
      await page.locator('#signup-form-ng-form0-password').fill('AB1!ab2@CD3#');
      await page.locator('#signup-form-ng-form0-confirmPassword').fill('AB1!ab2@CD3#');
      await page.locator('#signup-form-ng-form0-confirmPassword').blur();
      await expect(
        page.locator('fieldset.form-field').filter({ hasText: 'Confirm password' }),
      ).toContainText('Match');

      await expect(page.locator('#signup-form')).toHaveScreenshot('signup-form-matching.png');
    });
  });
});
