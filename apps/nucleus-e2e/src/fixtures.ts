import { test as base, expect, type Page } from '@playwright/test';

function randomString(length = 10): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

function randomCredentials() {
  const id = randomString(8);
  return {
    email: `user-${id}@example.com`,
    password: `Pass-${id}-123!`,
  };
}

async function signIn(page: Page) {
  const { email, password } = randomCredentials();
  await page.goto('/signin');
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.locator('#sign-in-button').click();
  await expect(page).not.toHaveURL(/signin/, { timeout: 10000 });
}

export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    await signIn(page);
    await use(page);
  },
});

export { expect };
