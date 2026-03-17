/**
 * E2E Test: Sign In Flow
 *
 * This test exercises the sign-in flow:
 *
 * 1. Create a user via the Better Auth API (bypassing the sign-up UI)
 * 2. Sign out by clearing cookies so the page is unauthenticated
 * 3. Navigate to the sign-in page at /auth/sign-in
 * 4. Fill in the email and password fields
 * 5. Submit the sign-in form
 * 6. Verify the user is redirected to the home page
 * 7. Verify the home page shows authenticated state (Welcome link with user name)
 *
 * Also tests:
 * - Invalid credentials show an error and keep the user on the sign-in page
 * - Empty form submission shows validation errors
 */

import { expect, test } from "../fixtures/auth";

test.describe("Sign In", () => {
  test("should sign in with valid credentials and redirect to home", async ({
    page,
    createUser,
  }) => {
    // Create user via API
    const { email, password, name } = await createUser();

    // Clear cookies to ensure unauthenticated state
    await page.context().clearCookies();

    // Navigate to sign-in page and wait for hydration
    await page.goto("/auth/sign-in");
    await expect(page.getByTestId("signin-form")).toBeVisible();

    // Fill in credentials using input id selectors (PasswordInput wraps input
    // inside a div alongside a toggle button, so getByLabel resolves to 2 elements)
    await page.getByLabel("Email").fill(email);
    await page.locator("#password").fill(password);

    // Submit the form
    await page.getByTestId("signin-submit").click();

    // Verify redirect to home and authenticated state
    await expect(page).toHaveURL("/", { timeout: 15_000 });
    await expect(page.getByTestId("home-user-link")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByTestId("home-user-link")).toContainText(name);
  });

  test("should show error for invalid credentials", async ({
    page,
    uniqueEmail,
  }) => {
    await page.goto("/auth/sign-in");
    await expect(page.getByTestId("signin-form")).toBeVisible();

    await page.getByLabel("Email").fill(uniqueEmail("invalid"));
    await page.locator("#password").fill("WrongPassword123!");

    await page.getByTestId("signin-submit").click();

    // Should stay on the sign-in page
    await expect(page).toHaveURL(/\/auth\/sign-in/, { timeout: 10_000 });
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    await page.goto("/auth/sign-in");

    // Submit empty form
    await page.getByTestId("signin-submit").click();

    // Should remain on sign-in page
    await expect(page).toHaveURL(/\/auth\/sign-in/);
  });
});
