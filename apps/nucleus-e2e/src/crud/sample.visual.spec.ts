import { expect, test } from '../fixtures';

test.describe('Sample CRUD Visual Regression', () => {
  test.describe('List Page', () => {
    test('should match sample list page screenshot', async ({ authenticatedPage: page }) => {
      await page.goto('/crud/sample/list');
      await expect(page.locator('app-sample-list')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('sample-list-page.png', {
        fullPage: true,
      });
    });

    test('should match sample list toolbar screenshot', async ({ authenticatedPage: page }) => {
      await page.goto('/crud/sample/list');
      await expect(page.locator('.page-toolbar')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page.locator('.page-toolbar')).toHaveScreenshot('sample-list-toolbar.png');
    });

    test('should match sample list table screenshot', async ({ authenticatedPage: page }) => {
      await page.goto('/crud/sample/list');
      await expect(page.locator('.page-content')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page.locator('.page-content')).toHaveScreenshot('sample-list-table.png');
    });
  });

  test.describe('Add Page', () => {
    test('should match sample add form screenshot', async ({ authenticatedPage: page }) => {
      await page.goto('/crud/sample/add');
      await expect(page.locator('app-sample-form')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('sample-add-page.png', {
        fullPage: true,
      });
    });

    test('should match sample form fields screenshot', async ({ authenticatedPage: page }) => {
      await page.goto('/crud/sample/add');
      await expect(page.locator('#sample-form-ng-form0-title')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page.locator('app-sample-form')).toHaveScreenshot('sample-form-fields.png');
    });
  });

  test.describe('View Page', () => {
    test('should match sample view page screenshot', async ({ authenticatedPage: page }) => {
      await page.goto('/crud/sample/view/1');
      await expect(page.locator('app-sample-form')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('sample-view-page.png', {
        fullPage: true,
      });
    });
  });

  test.describe('Edit Page', () => {
    test('should match sample edit page screenshot', async ({ authenticatedPage: page }) => {
      await page.goto('/crud/sample/edit/1');
      await expect(page.locator('app-sample-form')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('sample-edit-page.png', {
        fullPage: true,
      });
    });
  });
});
