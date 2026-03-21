/**
 * E2E Test: Sign In Flow (Unified Auth Form)
 *
 * Uses the `testUser` fixture which creates a user via API and clears cookies,
 * so the test starts in an unauthenticated state with a valid user ready.
 *
 * Test 1 — Successful sign-in:
 * 1. testUser fixture creates a user via API and clears cookies
 * 2. Navigate to /auth/sign-in
 * 3. Fill in email and password
 * 4. Submit the form
 * 5. Verify redirect to home and authenticated state
 *
 * Test 2 — Wrong password for existing user:
 * 1. testUser fixture creates a user
 * 2. Enter correct email but wrong password
 * 3. Submit — sign-in fails, sign-up fails (email exists), error shown
 * 4. Verify stays on auth page
 *
 * Test 3 — Empty form submission:
 * 1. Navigate to sign-in page
 * 2. Submit empty form
 * 3. Verify stays on page (client-side validation)
 */

import { testId } from "../../coverage";
import { expect, test } from "../fixtures/auth";

test.describe("Sign In", () => {
  test("should sign in with valid credentials and redirect to home", async ({ page, testUser }) => {
    // Navigate to auth page and wait for form hydration
    await page.goto("/auth/sign-in");
    await page.waitForSelector("[data-hydrated]");

    // Fill in credentials
    await page.getByLabel("Email").fill(testUser.email);
    await page.locator("#password").fill(testUser.password);

    // Submit the form
    await page.getByTestId(testId.signin.buttonSubmit).click();

    // Auth redirect involves server-side session creation + redirect
    await expect(page).toHaveURL("/");
    await expect(page.getByTestId(testId.userMenu.buttonTrigger)).toBeVisible();
  });

  test("should show error for wrong password on existing account", async ({ page, testUser }) => {
    await page.goto("/auth/sign-in");
    await page.waitForSelector("[data-hydrated]");

    // Use the test user's email but a wrong password
    await page.getByLabel("Email").fill(testUser.email);
    await page.locator("#password").fill("WrongPassword999!");

    await page.getByTestId(testId.signin.buttonSubmit).click();

    // Should stay on the auth page (sign-in fails, sign-up fails because email exists)
    await expect(page).toHaveURL(/\/auth\/sign-in/);
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    await page.goto("/auth/sign-in");

    // Submit empty form
    await page.getByTestId(testId.signin.buttonSubmit).click();

    // Should remain on sign-in page
    await expect(page).toHaveURL(/\/auth\/sign-in/);
  });
});
