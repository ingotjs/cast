/**
 * E2E Test: Delete Account Flow
 *
 * Uses the `authenticatedPage` fixture which creates a user via API
 * (session cookies set automatically).
 *
 * Steps:
 * 1. authenticatedPage fixture creates user (cookies set via API)
 * 2. Navigate to the account settings page at /account
 * 3. Wait for the page to settle (session data loading causes re-renders)
 * 4. Click the "Delete account" trigger button to reveal the confirmation form
 * 5. Enter the user's password in the confirmation field
 * 6. Click the "Delete my account" confirmation button
 * 7. Verify the user is redirected to the home page in unauthenticated state
 * 8. Verify the header shows the "Sign in" link (unauthenticated)
 * 9. Verify an account-deleted email was captured for the user
 * 10. Verify the user can no longer sign in with their credentials
 */

import { expect, test } from "../fixtures/auth";

test.describe("Delete Account", () => {
  test("should delete account and prevent further sign-in", async ({ page, authenticatedPage, getEmails }) => {
    // Navigate to account settings
    await page.goto("/account");

    // Wait for page to settle (session data loading causes re-renders that
    // reset component state — clicking too early would get undone)
    await expect(page.getByText("Loading sessions...")).not.toBeVisible({
      timeout: 10_000,
    });

    // Click the initial delete trigger button
    await expect(page.getByTestId("delete-account-trigger")).toBeVisible();
    await page.getByTestId("delete-account-trigger").click();

    // Verify the confirmation form appears
    await expect(page.getByTestId("delete-account-form")).toBeVisible();

    // Enter password and confirm deletion
    await page.locator("#delete-password").fill(authenticatedPage.password);
    await page.getByTestId("delete-account-confirm").click();

    // Verify redirect to home page in unauthenticated state
    await expect(page).toHaveURL("/", { timeout: 15_000 });
    await expect(page.getByTestId("header-signin-link")).toBeVisible({
      timeout: 10_000,
    });

    // Verify account-deleted email was captured (poll — email capture is async)
    await expect(() => {
      const emails = getEmails(authenticatedPage.email);
      const deletedEmail = emails.find((e) => e.subject.toLowerCase().includes("deleted"));
      expect(deletedEmail).toBeTruthy();
    }).toPass({ timeout: 5_000 });

    // Verify the deleted user cannot sign in anymore
    await page.goto("/auth/sign-in");
    await expect(page.getByTestId("signin-form")).toBeVisible();
    await page.getByLabel("Email").fill(authenticatedPage.email);
    await page.locator("#password").fill(authenticatedPage.password);
    await page.getByTestId("signin-submit").click();

    // Should remain on sign-in page (auth failure)
    await expect(page).toHaveURL(/\/auth\/sign-in/, { timeout: 10_000 });
  });
});
