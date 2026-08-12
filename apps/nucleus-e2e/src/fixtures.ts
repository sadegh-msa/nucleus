import { test as base, expect, type Page } from '@playwright/test';

async function performAuthentication(page: Page): Promise<void> {
  const id = Math.random().toString(36).substring(2, 10);
  const email = `user-${id}@example.com`;
  const password = `AbCd12!@${id}`;

  // Mock the signin API to return a valid token
  await page.route('**/api/auth/signin', async (route) => {
    console.log('Mocking signin API (full):', route.request().url());
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
      }),
    });
  });

  await page.goto('/signin');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('app-root', { state: 'attached', timeout: 30000 });

  await page.locator('#signin-form-ng-form0-email').fill(email);
  await page.locator('#signin-form-ng-form0-password').fill(password);

  await page.evaluate(() => {
    const form = document.querySelector('#signin-form');
    if (form) {
      const evt = new SubmitEvent('submit', { cancelable: true, bubbles: true });
      form.dispatchEvent(evt);
    }
  });

  // Wait for the app to process signin and set the cookie via its Cryptograph
  await page.waitForTimeout(5000);

  // Navigate to home and wait for auth to initialize
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('app-root', { state: 'attached', timeout: 30000 });

  // Verify authentication by checking the cookie is set
  await page.waitForFunction(() => document.cookie.includes('aat='), { timeout: 10000 });

  await page.waitForTimeout(2000);
}

export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    await performAuthentication(page);
    await use(page);
  },
});

export { expect, performAuthentication as authenticate };
