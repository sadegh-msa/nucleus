import { expect, test } from '../fixtures';

test.describe('Sample CRUD Routes', () => {
  test.describe('List Page', () => {
    test('should redirect /crud/sample to list view', async ({ authenticatedPage: page }) => {
      await page.goto('/crud/sample');
      await expect(page).toHaveURL(/\/crud\/sample\/list/);
    });

    test('should render sample list', async ({ authenticatedPage: page }) => {
      await page.goto('/crud/sample/list');
      await expect(page.locator('app-sample-list')).toBeVisible();
      await expect(page.locator('.page-list')).toBeVisible();
      await expect(page.locator('.page-list-toolbar')).toBeVisible();
      await expect(page.locator('.page-list-content')).toBeVisible();
    });
  });

  test.describe('Add Page', () => {
    test('should render sample form in add mode', async ({ authenticatedPage: page }) => {
      await page.goto('/crud/sample/add');
      await expect(page.locator('app-sample-form')).toBeVisible();
      await expect(page.locator('#title')).toBeVisible();
      await expect(page.locator('#code')).toBeVisible();
      await expect(page.locator('#description')).toBeVisible();
    });
  });

  test.describe('View Page', () => {
    test('should render sample form in view mode', async ({ authenticatedPage: page }) => {
      await page.goto('/crud/sample/view/1');
      await expect(page.locator('app-sample-form')).toBeVisible();
      await expect(page.locator('#title')).toBeVisible();
      await expect(page.locator('#code')).toBeVisible();
    });
  });

  test.describe('Edit Page', () => {
    test('should render sample form in edit mode', async ({ authenticatedPage: page }) => {
      await page.goto('/crud/sample/edit/1');
      await expect(page.locator('app-sample-form')).toBeVisible();
      await expect(page.locator('#title')).toBeVisible();
      await expect(page.locator('#code')).toBeVisible();
    });
  });
});
