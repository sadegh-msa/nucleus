import { expect, test } from './fixtures';

test.describe('App Visual Regression', () => {
  test('should match app layout screenshot', async ({ authenticatedPage: page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('app-layout.png', {
      fullPage: true,
    });
  });

  test('should match navigation menu screenshot', async ({ authenticatedPage: page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const nav = page.locator('nav, [class*="nav"], [class*="menu"]').first();
    if (await nav.isVisible()) {
      await expect(nav).toHaveScreenshot('navigation-menu.png');
    }
  });

  test('should match header screenshot', async ({ authenticatedPage: page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const header = page.locator('header, [class*="header"]').first();
    if (await header.isVisible()) {
      await expect(header).toHaveScreenshot('app-header.png');
    }
  });
});
