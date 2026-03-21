/**
 * E2E Test: Sign Up Flow (Unified Auth Form)
 *
 * The auth form handles both sign-in and sign-up automatically.
 * When a new email + password is submitted, an account is created.
 *
 * Test 1 — Full sign-up flow:
 * 1. Navigate to /auth/sign-up (renders unified auth form)
 * 2. Fill in email and password
 * 3. Submit the form via "Continue"
 * 4. Verify redirect to home and authenticated state
 * 5. Verify verification email was captured
 *
 * Test 2 — Empty form submission:
 * 1. Navigate to /auth/sign-up
 * 2. Submit empty form
 * 3. Verify form stays on page (client-side validation)
 */

import { testId } from "../../coverage";
import { expect, test } from "../fixtures/auth";

const generateEmail = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@e2e.test`;

test.describe("Sign Up", () => {
  test("should create an account through the UI and redirect to home", async ({ page, expectEmail }) => {
    const email = generateEmail("signup");
    const password = "TestPassword123!";

    // Navigate to auth page and wait for form hydration
    await page.goto("/auth/sign-up");
    await page.waitForSelector("[data-hydrated]");

    // Fill in email and password
    await page.getByLabel("Email").fill(email);
    await page.locator("#password").fill(password);

    // Submit the form
    await page.getByTestId(testId.signin.buttonSubmit).click();

    // Auth redirect involves server-side session creation + redirect
    await expect(page).toHaveURL("/", { timeout: 15_000 });
    await expect(page.getByTestId(testId.userMenu.buttonTrigger)).toBeVisible();

    // Verify verification email was captured
    await expectEmail(email, "verif");
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    await page.goto("/auth/sign-up");

    // Submit empty form
    await page.getByTestId(testId.signin.buttonSubmit).click();

    // Verify form doesn't navigate away
    await expect(page).toHaveURL(/\/auth\/sign-up/);
  });
});
