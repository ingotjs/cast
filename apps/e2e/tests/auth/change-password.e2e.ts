/**
 * E2E Test: Change Password Flow
 *
 * Uses the `authenticatedPage` fixture which creates a user via API
 * (session cookies set automatically).
 *
 * Test 1 — Successful password change:
 * 1. authenticatedPage fixture creates user (cookies set via API)
 * 2. Navigate to the account settings page at /account
 * 3. Wait for the page to settle (session data loading causes re-renders)
 * 4. Fill in the change-password form (current password, new password, confirm new password)
 * 5. Submit the form and verify success toast appears
 * 6. Verify a password-changed email was captured for the user
 * 7. Sign out via user menu dropdown
 * 8. Sign in with the new password through the UI to verify it works
 *
 * Test 2 — Incorrect current password:
 * 1. authenticatedPage fixture creates user (cookies set via API)
 * 2. Navigate to /account
 * 3. Enter wrong current password with valid new password
 * 4. Submit the form
 * 5. Verify no success toast appears (the change is rejected)
 */

import { expect, test } from "../fixtures/auth";

test.describe("Change Password", () => {
  test("should change password and allow sign-in with new password", async ({ page, authenticatedPage, getEmails }) => {
    const newPassword = "NewPassword456!";

    // Navigate to account settings
    await page.goto("/account");
    await expect(page.getByTestId("change-password-form")).toBeVisible({
      timeout: 10_000,
    });

    // Wait for the page to fully settle (session data loading causes re-renders
    // that reset form fields). The "Sessions" card shows "Loading sessions..." then
    // actual session data — wait for that to stabilize.
    await expect(page.getByText("Loading sessions...")).not.toBeVisible({
      timeout: 10_000,
    });

    // Fill in the change-password form
    await page.locator("#currentPassword").fill(authenticatedPage.password);
    await page.locator("#newPassword").fill(newPassword);
    await page.locator("#confirmPassword").fill(newPassword);

    // Submit the form
    await page.getByTestId("change-password-submit").click();

    // Verify success toast
    await expect(page.getByText("Password changed successfully")).toBeVisible({
      timeout: 10_000,
    });

    // Verify password-changed email was captured (poll — email capture is async)
    await expect(() => {
      const emails = getEmails(authenticatedPage.email);
      const passwordChangedEmail = emails.find(
        (e) => e.subject.toLowerCase().includes("password") && e.subject.toLowerCase().includes("change")
      );
      expect(passwordChangedEmail).toBeTruthy();
    }).toPass({ timeout: 5_000 });

    // Sign out via user menu
    await page.getByTestId("user-menu-trigger").click();
    await page.getByTestId("user-menu-signout").click();
    await expect(page.getByTestId("header-signin-link")).toBeVisible({
      timeout: 10_000,
    });

    // Sign in with new password through the UI
    await page.goto("/auth/sign-in");
    await expect(page.getByTestId("signin-form")).toBeVisible();
    await page.getByLabel("Email").fill(authenticatedPage.email);
    await page.locator("#password").fill(newPassword);
    await page.getByTestId("signin-submit").click();
    await expect(page).toHaveURL("/", { timeout: 15_000 });
  });

  test("should reject incorrect current password", async ({ page, authenticatedPage: _setup }) => {
    await page.goto("/account");
    await expect(page.getByTestId("change-password-form")).toBeVisible({
      timeout: 10_000,
    });

    // Wait for page to settle (session data loading)
    await expect(page.getByText("Loading sessions...")).not.toBeVisible({
      timeout: 10_000,
    });

    // Use wrong current password
    await page.locator("#currentPassword").fill("WrongPassword999!");
    await page.locator("#newPassword").fill("NewPassword456!");
    await page.locator("#confirmPassword").fill("NewPassword456!");

    await page.getByTestId("change-password-submit").click();

    // Should show an error, not success
    await expect(page.getByText("Password changed successfully")).not.toBeVisible({
      timeout: 5000,
    });

    // _setup activates the authenticatedPage fixture (unused directly)
  });
});
