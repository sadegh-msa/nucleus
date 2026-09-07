import { expect, test } from '@playwright/test';

test.describe('App', () => {
  test('should redirect to sign-in when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/signin/);
  });

  test('should redirect unknown routes to sign-in', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await expect(page).toHaveURL(/signin/);
  });

  test('should have RTL/LTR toggle button', async ({ page }) => {
    await page.goto('/signin');
    await page.waitForLoadState('networkidle');
    const rtlButton = page.getByRole('button', { name: 'RTL' });
    await expect(rtlButton).toBeVisible();

    await rtlButton.click();
    const ltrButton = page.getByRole('button', { name: 'LTR' });
    await expect(ltrButton).toBeVisible();
  });

  test('should toggle direction back to LTR', async ({ page }) => {
    await page.goto('/signin');
    await page.waitForLoadState('networkidle');
    const rtlButton = page.getByRole('button', { name: 'RTL' });
    await rtlButton.click();

    const ltrButton = page.getByRole('button', { name: 'LTR' });
    await ltrButton.click();

    const rtlButtonAgain = page.getByRole('button', { name: 'RTL' });
    await expect(rtlButtonAgain).toBeVisible();
  });

  test('should redirect protected routes to sign-in when not authenticated', async ({ page }) => {
    const protectedRoutes = [
      '/ui/button',
      '/ui/icon',
      '/ui/menu',
      '/ui/popover',
      '/ui/typography',
      '/crud/sample',
      '/crud/sample/list',
      '/crud/sample/add',
    ];

    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(/signin/, { timeout: 10000 });
    }
  });
});
