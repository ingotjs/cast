/**
 * E2E Test: Sign Out Flow
 *
 * Steps:
 * 1. Create a user via the Better Auth API
 * 2. Sign in through the UI
 * 3. Navigate to the home page and verify authenticated state (Welcome link visible)
 * 4. Sign out by calling the Better Auth sign-out API (no sign-out button in UI yet)
 * 5. Reload the page to clear any client-side session cache
 * 6. Verify the home page shows unauthenticated state (Sign In link visible)
 */

import { expect, test } from "../fixtures/auth";

test.describe("Sign Out", () => {
  test("should sign out and show unauthenticated state", async ({
    page,
    createUser,
  }) => {
    // Create user and sign in via UI
    const { email, password } = await createUser();
    await page.context().clearCookies();
    await page.goto("/auth/sign-in");
    await expect(page.getByTestId("signin-form")).toBeVisible();
    await page.getByLabel("Email").fill(email);
    await page.locator("#password").fill(password);
    await page.getByTestId("signin-submit").click();
    await expect(page).toHaveURL("/", { timeout: 15_000 });

    // Verify authenticated state on home page
    await expect(page.getByTestId("home-user-link")).toBeVisible({
      timeout: 10_000,
    });

    // Sign out via Better Auth API (no UI button exists yet)
    await page.request.post("http://localhost:3000/api/auth/sign-out");

    // Reload to pick up the cleared session
    await page.reload();

    // Verify unauthenticated state
    await expect(page.getByTestId("home-signin-link")).toBeVisible({
      timeout: 10_000,
    });
  });
});
