import { existsSync, readFileSync, readdirSync, unlinkSync } from "node:fs";
import { join, resolve } from "node:path";

import { test as base, expect } from "@playwright/test";

// Reference: https://playwright.dev/docs/test-fixtures

const BASE_URL = "http://localhost:3000";
// Project root is 2 levels up from apps/e2e/
const EMAIL_CAPTURE_DIR = resolve(__dirname, "../../../../.email-captures");

type CapturedEmail = {
  timestamp: string;
  subject: string;
  html: string;
};

type AuthFixtures = {
  /** Create a user via the Better Auth API and return credentials */
  createUser: (opts?: {
    email?: string;
    password?: string;
    name?: string;
  }) => Promise<{
    email: string;
    password: string;
    name: string;
  }>;
  /** Sign in via the Better Auth API and set session cookies on the page context */
  signInViaAPI: (email: string, password: string) => Promise<void>;
  /** Read captured emails for a recipient */
  getEmails: (email: string) => CapturedEmail[];
  /** Clear all captured emails */
  clearEmails: () => void;
  /** Generate a unique test email with the given prefix */
  uniqueEmail: (prefix: string) => string;
};

export const test = base.extend<AuthFixtures>({
  uniqueEmail: async ({}, use) => {
    await use(
      (prefix: string) =>
        `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@e2e.test`
    );
  },

  createUser: async ({ page }, use) => {
    await use(async (opts) => {
      const email =
        opts?.email ??
        `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@e2e.test`;
      const password = opts?.password ?? "TestPassword123!";
      const name = opts?.name ?? "E2E Test User";

      // Sign up via Better Auth API
      const signUpRes = await page.request.post(
        `${BASE_URL}/api/auth/sign-up/email`,
        {
          data: { email, password, name },
        }
      );
      expect(signUpRes.ok()).toBe(true);

      return { email, password, name };
    });
  },

  signInViaAPI: async ({ page }, use) => {
    await use(async (email: string, password: string) => {
      const res = await page.request.post(
        `${BASE_URL}/api/auth/sign-in/email`,
        {
          data: { email, password },
        }
      );
      expect(res.ok()).toBe(true);
    });
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
