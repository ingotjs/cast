import { existsSync, readFileSync, readdirSync, unlinkSync } from "node:fs";
import { join, resolve } from "node:path";

import { DEV_URL } from "@ingot/utils/consts";
import { test as base, expect } from "@playwright/test";

// Reference: https://playwright.dev/docs/test-fixtures

const BASE_URL = DEV_URL;
const EMAIL_CAPTURE_DIR = resolve(__dirname, "../../../../packages/email/_etc/.email-captures");
const TEST_PASSWORD = "TestPassword123!";

const generateEmail = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@e2e.test`;

type TestUser = { email: string; password: string; name: string };

type CapturedEmail = {
  timestamp: string;
  subject: string;
  html: string;
};

type AuthFixtures = {
  /** Create a user via API. Returns credentials. Does NOT sign in. */
  testUser: TestUser;
  /** Create a user via API. Session cookies are set automatically. Returns credentials. */
  authenticatedPage: TestUser;
  /** Sign in via API. Sets session cookies on browser context. */
  signIn: (email: string, password: string) => Promise<void>;
  /** Sign out by clearing cookies. */
  signOut: () => Promise<void>;
  /** Read captured emails for a recipient */
  getEmails: (email: string) => CapturedEmail[];
  /** Assert an email with a matching subject keyword was captured (polls until found) */
  expectEmail: (email: string, subjectKeyword: string) => Promise<void>;
  /** Clear all captured emails */
  clearEmails: () => void;
};

export const test = base.extend<AuthFixtures>({
  testUser: async ({ page }, use) => {
    const email = generateEmail("e2e");
    const name = "E2E Test User";

    const res = await page.request.post(`${BASE_URL}/api/auth/sign-up/email`, {
      data: { email, password: TEST_PASSWORD, name },
      headers: { Origin: BASE_URL },
    });
    expect(res.ok()).toBe(true);

    // Clear cookies so test starts unauthenticated
    await page.context().clearCookies();

    await use({ email, password: TEST_PASSWORD, name });
  },

  authenticatedPage: async ({ page }, use) => {
    const email = generateEmail("e2e");
    const name = "E2E Test User";

    // Create user via API — session cookies are set automatically on the browser context
    const res = await page.request.post(`${BASE_URL}/api/auth/sign-up/email`, {
      data: { email, password: TEST_PASSWORD, name },
      headers: { Origin: BASE_URL },
    });
    expect(res.ok()).toBe(true);

    await use({ email, password: TEST_PASSWORD, name });
  },

  signIn: async ({ page }, use) => {
    await use(async (email: string, password: string) => {
      const res = await page.request.post(`${BASE_URL}/api/auth/sign-in/email`, {
        data: { email, password },
        headers: { Origin: BASE_URL },
      });
      expect(res.ok()).toBe(true);
    });
  },

  signOut: async ({ page }, use) => {
    await use(async () => {
      await page.context().clearCookies();
    });
  },

  getEmails: async ({}, use) => {
    await use((email: string) => {
      const filename = email.replaceAll(/[^a-zA-Z0-9@._-]/g, "_");
      const filepath = join(EMAIL_CAPTURE_DIR, `${filename}.json`);
      if (!existsSync(filepath)) {
        return [];
      }
      const data: Record<string, { subject: string; html: string }> = JSON.parse(readFileSync(filepath, "utf8"));
      return Object.entries(data).map(([timestamp, content]) => ({
        timestamp,
        ...content,
      }));
    });
  },

  expectEmail: async ({ getEmails }, use) => {
    await use(async (email: string, subjectKeyword: string) => {
      await expect(() => {
        const found = getEmails(email).find((e) => e.subject.toLowerCase().includes(subjectKeyword));
        expect(found).toBeTruthy();
      }).toPass();
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
