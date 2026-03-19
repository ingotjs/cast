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
 * 7. Verify new password works via signOut + signIn fixtures
 *
 * Test 2 — Incorrect current password:
 * 1. authenticatedPage fixture creates user (cookies set via API)
 * 2. Navigate to /account
 * 3. Enter wrong current password with valid new password
 * 4. Submit the form
 * 5. Verify no success toast appears (the change is rejected)
 */

import { testId } from "../../coverage";
import { expect, test } from "../fixtures/auth";

test.describe("Change Password", () => {
  test("should change password and allow sign-in with new password", async ({
    page,
    authenticatedPage,
    expectEmail,
    signOut,
    signIn,
  }) => {
    const newPassword = "NewPassword456!";

    // Navigate to account settings
    await page.goto("/account");
    await expect(page.getByTestId(testId.changePassword.buttonSubmit)).toBeVisible();

    // Wait for the page to fully settle (session data loading causes re-renders
    // that reset form fields). The "Sessions" card shows "Loading sessions..." then
    // actual session data — wait for that to stabilize.
    await expect(page.getByText("Loading sessions...")).not.toBeVisible();

    // Fill in the change-password form
    await page.locator("#currentPassword").fill(authenticatedPage.password);
    await page.locator("#newPassword").fill(newPassword);
    await page.locator("#confirmPassword").fill(newPassword);

    // Submit the form
    await page.getByTestId(testId.changePassword.buttonSubmit).click();

    // Verify success toast
    await expect(page.getByText("Password changed successfully")).toBeVisible();

    // Verify password-changed email was captured
    await expectEmail(authenticatedPage.email, "password");

    // Verify new password works via API
    await signOut();
    await signIn(authenticatedPage.email, newPassword);
  });

  test("should reject incorrect current password", async ({ page, authenticatedPage: _setup }) => {
    await page.goto("/account");
    await expect(page.getByTestId(testId.changePassword.buttonSubmit)).toBeVisible();

    // Wait for page to settle (session data loading)
    await expect(page.getByText("Loading sessions...")).not.toBeVisible();

    // Use wrong current password
    await page.locator("#currentPassword").fill("WrongPassword999!");
    await page.locator("#newPassword").fill("NewPassword456!");
    await page.locator("#confirmPassword").fill("NewPassword456!");

    await page.getByTestId(testId.changePassword.buttonSubmit).click();

    // Should show an error, not success
    await expect(page.getByText("Password changed successfully")).not.toBeVisible();

    // _setup activates the authenticatedPage fixture (unused directly)
  });
});
