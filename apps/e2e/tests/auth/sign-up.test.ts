/**
 * E2E Test: Sign Up Flow
 *
 * This is the ONLY test that exercises the full sign-up UI manually.
 * It generates its own email/password inline since it cannot use the
 * `testUser` fixture (which creates users via API).
 *
 * Test 1 — Full sign-up flow:
 * 1. Navigate to the sign-up page at /auth/sign-up
 * 2. Fill in the registration form (first name, last name, email, password, confirm password)
 * 3. Submit the form via the "Create an account" button
 * 4. Verify the user is redirected to the home page after successful registration
 * 5. Verify the home page shows authenticated state (user menu trigger visible)
 * 6. Verify a verification email was captured for the registered email address
 *
 * Test 2 — Empty form submission:
 * 1. Navigate to sign-up page
 * 2. Submit empty form
 * 3. Verify form stays on sign-up page (client-side validation prevents submission)
 *
 * Test 3 — Password mismatch:
 * 1. Navigate to sign-up page
 * 2. Fill in all fields but with mismatched passwords
 * 3. Submit the form
 * 4. Verify form stays on sign-up page (client-side validation catches mismatch)
 */

import { expect, test } from "../fixtures/auth";

const generateEmail = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@e2e.test`;

test.describe("Sign Up", () => {
  test("should create an account through the UI and redirect to home", async ({
    page,
    getEmails,
  }) => {
    const email = generateEmail("signup");
    const password = "TestPassword123!";
    const firstName = "Test";
    const lastName = "User";

    // Navigate to the sign-up page and wait for React hydration.
    // The header's Sign In link (data-testid="header-signin-link") only renders
    // after hydration since UserMenu uses useSession hook.
    await page.goto("/auth/sign-up");
    await expect(page.getByTestId("header-signin-link")).toBeVisible({
      timeout: 10_000,
    });

    // Fill in the registration form using id locators for reliability
    await page.locator("#firstName").fill(firstName);
    await page.locator("#lastName").fill(lastName);
    await page.locator("#email").fill(email);
    await page.locator("#password").fill(password);
    await page.locator("#confirmPassword").fill(password);

    // Submit the form
    await page.getByTestId("signup-submit").click();

    // Verify redirect to home page and authenticated state
    await expect(page).toHaveURL("/", { timeout: 15_000 });
    await expect(page.getByTestId("user-menu-trigger")).toBeVisible({
      timeout: 10_000,
    });

    // Verify verification email was captured
    // Wait a moment for the async email capture to complete
    await page.waitForTimeout(500);
    const emails = getEmails(email);
    expect(emails.length).toBeGreaterThanOrEqual(1);

    const verificationEmail = emails.find((e) =>
      e.subject.toLowerCase().includes("verif")
    );
    expect(verificationEmail).toBeTruthy();
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    await page.goto("/auth/sign-up");

    // Submit empty form
    await page.getByTestId("signup-submit").click();

    // Verify form doesn't navigate away
    await expect(page).toHaveURL(/\/auth\/sign-up/);
  });

  test("should show error when passwords do not match", async ({ page }) => {
    const email = generateEmail("signup-mismatch");

    await page.goto("/auth/sign-up");

    await page.locator("#firstName").fill("Test");
    await page.locator("#lastName").fill("User");
    await page.locator("#email").fill(email);
    await page.locator("#password").fill("TestPassword123!");
    await page.locator("#confirmPassword").fill("DifferentPassword123!");

    await page.getByTestId("signup-submit").click();

    // Should stay on the sign-up page due to validation error
    await expect(page).toHaveURL(/\/auth\/sign-up/);
  });
});
