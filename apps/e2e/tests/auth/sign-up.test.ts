/**
 * E2E Test: Sign Up Flow
 *
 * This is the ONLY test that exercises the full sign-up UI manually.
 * All other tests use the API to create users for speed.
 *
 * Steps:
 * 1. Navigate to the sign-up page at /auth/sign-up
 * 2. Fill in the registration form (first name, last name, email, password, confirm password)
 * 3. Submit the form via the "Create an account" button
 * 4. Verify the user is redirected to the home page after successful registration
 * 5. Verify the home page shows authenticated state (Welcome link with user name)
 * 6. Verify a verification email was captured for the registered email address
 *
 * Also tests:
 * - Empty form submission stays on sign-up page (validation errors)
 * - Mismatched passwords stay on sign-up page
 */

import { expect, test } from "../fixtures/auth";

test.describe("Sign Up", () => {
  test("should create an account through the UI and redirect to home", async ({
    page,
    uniqueEmail,
    getEmails,
  }) => {
    const email = uniqueEmail("signup");
    const password = "TestPassword123!";
    const firstName = "Test";
    const lastName = "User";

    // Navigate to the sign-up page and wait for hydration
    await page.goto("/auth/sign-up");
    await expect(page.getByTestId("signup-form")).toBeVisible();

    // Fill in the registration form using id locators for reliability
    // (getByLabel can be ambiguous with PasswordInput's toggle button)
    await page.locator("#firstName").fill(firstName);
    await page.locator("#lastName").fill(lastName);
    await page.locator("#email").fill(email);
    await page.locator("#password").fill(password);
    await page.locator("#confirmPassword").fill(password);

    // Submit the form
    await page.getByTestId("signup-submit").click();

    // Verify redirect to home page and authenticated state
    await expect(page).toHaveURL("/", { timeout: 15_000 });
    await expect(page.getByTestId("home-user-link")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByTestId("home-user-link")).toContainText(
      `${firstName} ${lastName}`
    );

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

  test("should show error when passwords do not match", async ({
    page,
    uniqueEmail,
  }) => {
    const email = uniqueEmail("signup-mismatch");

    await page.goto("/auth/sign-up");

    await page.getByLabel("First name").fill("Test");
    await page.getByLabel("Last name").fill("User");
    await page.getByLabel("Email").fill(email);
    await page.locator("#password").fill("TestPassword123!");
    await page.locator("#confirmPassword").fill("DifferentPassword123!");

    await page.getByTestId("signup-submit").click();

    // Should stay on the sign-up page due to validation error
    await expect(page).toHaveURL(/\/auth\/sign-up/);
  });
});
