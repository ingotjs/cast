/**
 * E2E Test: Sign Out Flow
 *
 * Uses the `authenticatedPage` fixture which creates a user via API,
 * signs in through the UI, and lands on the home page authenticated.
 *
 * Steps:
 * 1. authenticatedPage fixture creates user and signs in through the UI
 * 2. Verify authenticated state (user menu trigger visible in header)
 * 3. Open the user menu dropdown by clicking the trigger
 * 4. Click the "Sign out" menu item
 * 5. Verify the user is redirected to the home page in unauthenticated state
 * 6. Verify the header shows the "Sign in" link instead of user menu
 */

import { expect, test } from "../fixtures/auth";

test.describe("Sign Out", () => {
  test("should sign out via user menu and show unauthenticated state", async ({
    page,
    authenticatedPage: _setup,
  }) => {
    // Verify authenticated state on home page (fixture already signed in)
    await expect(page.getByTestId("user-menu-trigger")).toBeVisible({
      timeout: 10_000,
    });

    // Open the user menu dropdown
    await page.getByTestId("user-menu-trigger").click();

    // Click the sign-out menu item
    await page.getByTestId("user-menu-signout").click();

    // Verify unauthenticated state — header shows "Sign in" link
    await expect(page.getByTestId("header-signin-link")).toBeVisible({
      timeout: 10_000,
    });

    // _setup activates the authenticatedPage fixture (unused directly)
  });
});
