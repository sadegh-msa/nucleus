import { expect, test } from '../fixtures';

test.describe('UI Visual Regression', () => {
  test.describe('Button Page', () => {
    test('should match button showcase screenshot', async ({ authenticatedPage: page }) => {
      await page.goto('/ui/button');
      await expect(page.locator('app-button')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('button-page.png', {
        fullPage: true,
      });
    });

    test('should match button variants screenshot', async ({ authenticatedPage: page }) => {
      await page.goto('/ui/button');
      await expect(page.locator('app-button')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page.locator('table').first()).toHaveScreenshot('button-variants.png');
    });
  });

  test.describe('Icon Page', () => {
    test('should match icon showcase screenshot', async ({ authenticatedPage: page }) => {
      await page.goto('/ui/icon');
      await expect(page.locator('app-icon')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('icon-page.png', {
        fullPage: true,
      });
    });

    test('should match icon grid screenshot', async ({ authenticatedPage: page }) => {
      await page.goto('/ui/icon');
      await expect(page.locator('app-icon')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page.locator('table').first()).toHaveScreenshot('icon-grid.png');
    });
  });

  test.describe('Menu Page', () => {
    test('should match menu showcase screenshot', async ({ authenticatedPage: page }) => {
      await page.goto('/ui/menu');
      await expect(page.locator('app-menu')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('menu-page.png', {
        fullPage: true,
      });
    });
  });

  test.describe('Popover Page', () => {
    test('should match popover showcase screenshot', async ({ authenticatedPage: page }) => {
      await page.goto('/ui/popover');
      await expect(page.locator('app-popover')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('popover-page.png', {
        fullPage: true,
      });
    });

    test('should match tooltips section screenshot', async ({ authenticatedPage: page }) => {
      await page.goto('/ui/popover');
      await expect(page.locator('#tooltips')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page.locator('#tooltips')).toHaveScreenshot('tooltips-section.png');
    });

    test('should match popovers section screenshot', async ({ authenticatedPage: page }) => {
      await page.goto('/ui/popover');
      await expect(page.locator('#popovers')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page.locator('#popovers')).toHaveScreenshot('popovers-section.png');
    });

    test('should match popovers section with focus trigger screenshot', async ({
      authenticatedPage: page,
    }) => {
      await page.goto('/ui/popover');
      await page.waitForLoadState('networkidle');

      await page.locator('button.event').click();
      await expect(page.locator('button.event')).toHaveText('Event: focus');
      await page.waitForTimeout(500);

      await expect(page.locator('#popovers')).toHaveScreenshot('popovers-focus-trigger.png');
    });

    test('should match bubbles section screenshot', async ({ authenticatedPage: page }) => {
      await page.goto('/ui/popover');
      await expect(page.locator('#bubbles')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page.locator('#bubbles')).toHaveScreenshot('bubbles-section.png');
    });
  });

  test.describe('Typography Page', () => {
    test('should match typography showcase screenshot', async ({ authenticatedPage: page }) => {
      await page.goto('/ui/typography');
      await expect(page.locator('app-typography')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('typography-page.png', {
        fullPage: true,
      });
    });

    test('should match headings section screenshot', async ({ authenticatedPage: page }) => {
      await page.goto('/ui/typography');
      await expect(page.locator('.headings')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page.locator('.headings')).toHaveScreenshot('headings-section.png');
    });

    test('should match colors table screenshot', async ({ authenticatedPage: page }) => {
      await page.goto('/ui/typography');
      await expect(page.locator('table.colors')).toBeVisible();
      await page.waitForLoadState('networkidle');

      await expect(page.locator('table.colors')).toHaveScreenshot('typography-colors.png');
    });
  });
});
