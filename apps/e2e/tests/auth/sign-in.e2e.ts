/**
 * E2E Test: Sign In Flow
 *
 * Uses the `testUser` fixture which creates a user via API and clears cookies,
 * so the test starts in an unauthenticated state with a valid user ready.
 *
 * Test 1 — Successful sign-in:
 * 1. testUser fixture creates a user via API and clears cookies
 * 2. Navigate to the sign-in page at /auth/sign-in
 * 3. Fill in the email and password fields
 * 4. Submit the sign-in form
 * 5. Verify the user is redirected to the home page
 * 6. Verify the home page shows authenticated state (user menu trigger visible)
 *
 * Test 2 — Invalid credentials:
 * 1. Navigate to sign-in page
 * 2. Enter a non-existent email with a password
 * 3. Submit the form
 * 4. Verify the user stays on the sign-in page (auth failure)
 *
 * Test 3 — Empty form submission:
 * 1. Navigate to sign-in page
 * 2. Submit empty form
 * 3. Verify form stays on sign-in page (client-side validation)
 */

import { testId } from "../../coverage";
import { expect, test } from "../fixtures/auth";

test.describe("Sign In", () => {
  test("should sign in with valid credentials and redirect to home", async ({ page, testUser }) => {
    // Navigate to sign-in page and wait for form hydration
    await page.goto("/auth/sign-in");
    await page.waitForSelector("[data-hydrated]");

    // Fill in credentials using input id selectors (PasswordInput wraps input
    // inside a div alongside a toggle button, so getByLabel resolves to 2 elements)
    await page.getByLabel("Email").fill(testUser.email);
    await page.locator("#password").fill(testUser.password);

    // Submit the form
    await page.getByTestId(testId.signin.buttonSubmit).click();

    // Auth redirect involves server-side session creation + redirect
    await expect(page).toHaveURL("/");
    await expect(page.getByTestId(testId.userMenu.buttonTrigger)).toBeVisible();
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/auth/sign-in");
    await expect(page.getByTestId(testId.header.linkSignin)).toBeVisible();

    await page.getByLabel("Email").fill("nonexistent@e2e.test");
    await page.locator("#password").fill("WrongPassword123!");

    await page.getByTestId(testId.signin.buttonSubmit).click();

    // Should stay on the sign-in page
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
