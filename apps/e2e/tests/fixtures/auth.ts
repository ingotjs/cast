import { existsSync, readFileSync, readdirSync, unlinkSync } from "node:fs";
import { join, resolve } from "node:path";

import { test as base, expect } from "@playwright/test";

// Reference: https://playwright.dev/docs/test-fixtures

const BASE_URL = "http://localhost:3000";
const EMAIL_CAPTURE_DIR = resolve(__dirname, "../../../../.email-captures");
const TEST_PASSWORD = "TestPassword123!";

const generateEmail = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@e2e.test`;

type TestUser = { email: string; password: string; name: string };

type CapturedEmail = {
  timestamp: string;
  subject: string;
  html: string;
};

type AuthFixtures = {
  /** Create a user via API. Returns credentials. Does NOT sign in. */
  testUser: TestUser;
  /** Create a user and sign in via the UI. Returns authenticated page + credentials. */
  authenticatedPage: TestUser;
  /** Read captured emails for a recipient */
  getEmails: (email: string) => CapturedEmail[];
  /** Clear all captured emails */
  clearEmails: () => void;
};

export const test = base.extend<AuthFixtures>({
  testUser: async ({ page }, use) => {
    const email = generateEmail("e2e");
    const name = "E2E Test User";

    const res = await page.request.post(`${BASE_URL}/api/auth/sign-up/email`, {
      data: { email, password: TEST_PASSWORD, name },
    });
    expect(res.ok()).toBe(true);

    // Clear cookies so test starts unauthenticated
    await page.context().clearCookies();

    await use({ email, password: TEST_PASSWORD, name });
  },

  authenticatedPage: async ({ page }, use) => {
    const email = generateEmail("e2e");
    const name = "E2E Test User";

    // Create user via API
    const res = await page.request.post(`${BASE_URL}/api/auth/sign-up/email`, {
      data: { email, password: TEST_PASSWORD, name },
    });
    expect(res.ok()).toBe(true);

    // Clear cookies and sign in through the UI (like a real user)
    // Wait for header-signin-link to confirm React hydration is complete
    await page.context().clearCookies();
    await page.goto("/auth/sign-in");
    await expect(page.getByTestId("header-signin-link")).toBeVisible({
      timeout: 10_000,
    });
    await page.getByLabel("Email").fill(email);
    await page.locator("#password").fill(TEST_PASSWORD);
    await page.getByTestId("signin-submit").click();
    await expect(page).toHaveURL("/", { timeout: 15_000 });

    await use({ email, password: TEST_PASSWORD, name });
  },

  getEmails: async ({}, use) => {
    await use((email: string) => {
      const filename = email.replaceAll(/[^a-zA-Z0-9@._-]/g, "_");
      const filepath = join(EMAIL_CAPTURE_DIR, `${filename}.json`);
      if (!existsSync(filepath)) {
        return [];
      }
      const data: Record<string, { subject: string; html: string }> =
        JSON.parse(readFileSync(filepath, "utf8"));
      return Object.entries(data).map(([timestamp, content]) => ({
        timestamp,
        ...content,
      }));
    });
  },

  clearEmails: async ({}, use) => {
    await use(() => {
      if (!existsSync(EMAIL_CAPTURE_DIR)) {
        return;
      }
      for (const file of readdirSync(EMAIL_CAPTURE_DIR)) {
        unlinkSync(join(EMAIL_CAPTURE_DIR, file));
      }
    });
  },
});

export { expect } from "@playwright/test";
