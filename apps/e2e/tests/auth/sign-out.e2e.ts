/**
 * E2E Test: Sign Out Flow
 *
 * Uses the `authenticatedPage` fixture which creates a user via API
 * (session cookies set automatically).
 *
 * Steps:
 * 1. authenticatedPage fixture creates user (cookies set via API)
 * 2. Navigate to home page and verify authenticated state
 * 3. Open the user menu dropdown by clicking the trigger
 * 4. Click the "Sign out" menu item
 * 5. Verify the header shows the "Sign in" link instead of user menu
 */

import { expect, test } from "../fixtures/auth";

test.describe("Sign Out", () => {
  test("should sign out via user menu and show unauthenticated state", async ({ page, authenticatedPage: _setup }) => {
    // Navigate to home page and verify authenticated state
    await page.goto("/");
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
