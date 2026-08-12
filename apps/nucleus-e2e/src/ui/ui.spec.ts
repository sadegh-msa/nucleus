import { expect, test } from '../fixtures';

test.describe('UI Routes', () => {
  test.describe('Button Page', () => {
    test('should render button showcase', async ({ authenticatedPage: page }) => {
      await page.goto('/ui/button');
      await page.waitForSelector('app-button', { state: 'attached', timeout: 30000 });
      await expect(page.locator('app-button')).toBeVisible();
      await expect(page.locator('table').first()).toBeVisible();
      await expect(page.locator('button.ui.button').first()).toBeVisible();
    });
  });

  test.describe('Icon Page', () => {
    test('should render icon showcase', async ({ authenticatedPage: page }) => {
      await page.goto('/ui/icon');
      await page.waitForSelector('app-icon', { state: 'attached', timeout: 30000 });
      await expect(page.locator('app-icon')).toBeVisible();
      await expect(page.locator('table').first()).toBeVisible();
      await expect(page.locator('svg').first()).toBeVisible();
    });
  });

  test.describe('Menu Page', () => {
    test('should render menu showcase', async ({ authenticatedPage: page }) => {
      await page.goto('/ui/menu');
      await page.waitForSelector('app-menu', { state: 'attached', timeout: 30000 });
      await expect(page.locator('app-menu')).toBeVisible();
      await expect(page.locator('h4').first()).toBeVisible();
    });
  });

  test.describe('Popover Page', () => {
    test('should render popover showcase', async ({ authenticatedPage: page }) => {
      await page.goto('/ui/popover');
      await page.waitForSelector('app-popover', { state: 'attached', timeout: 30000 });
      await expect(page.locator('app-popover')).toBeVisible();
      await expect(page.locator('#tooltips')).toBeVisible();
      await expect(page.locator('#popovers')).toBeVisible();
      await expect(page.locator('#bubbles')).toBeVisible();
    });
  });

  test.describe('Typography Page', () => {
    test('should render typography showcase', async ({ authenticatedPage: page }) => {
      await page.goto('/ui/typography');
      await page.waitForSelector('app-typography', { state: 'attached', timeout: 30000 });
      await expect(page.locator('app-typography')).toBeVisible();
      await expect(page.locator('.headings')).toBeVisible();
      await expect(page.locator('h1')).toContainText('Heading 1');
      await expect(page.locator('table.colors')).toBeVisible();
    });
  });
});