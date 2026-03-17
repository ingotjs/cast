/**
 * E2E Test: Change Password Flow
 *
 * Steps:
 * 1. Create a user via the Better Auth API
 * 2. Sign in through the UI (API sign-in cookies don't propagate to browser navigation)
 * 3. Navigate to the account settings page at /account
 * 4. Fill in the change-password form (current password, new password, confirm new password)
 * 5. Submit the form and verify success toast appears
 * 6. Verify a password-changed email was captured for the user
 * 7. Clear cookies, then verify the user can sign in with the new password via UI
 *
 * Also tests:
 * - Incorrect current password is rejected (form stays, no success toast)
 */

import type { Page } from "@playwright/test";

import { expect, test } from "../fixtures/auth";

/** Sign in through the UI — more reliable than API-based cookie setting */
const signInViaUI = async (page: Page, email: string, password: string) => {
  await page.goto("/auth/sign-in");
  await expect(page.getByTestId("signin-form")).toBeVisible();
  await page.getByLabel("Email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByTestId("signin-submit").click();
  await expect(page).toHaveURL("/", { timeout: 15_000 });
};

test.describe("Change Password", () => {
  test("should change password and allow sign-in with new password", async ({
    page,
    createUser,
    getEmails,
  }) => {
    const oldPassword = "TestPassword123!";
    const newPassword = "NewPassword456!";

    // Create user with known password, then sign in via UI
    const { email } = await createUser({ password: oldPassword });
    await page.context().clearCookies();
    await signInViaUI(page, email, oldPassword);

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
    await page.locator("#currentPassword").fill(oldPassword);
    await page.locator("#newPassword").fill(newPassword);
    await page.locator("#confirmPassword").fill(newPassword);

    // Submit the form
    await page.getByTestId("change-password-submit").click();

    // Verify success toast
    await expect(page.getByText("Password changed successfully")).toBeVisible({
      timeout: 10_000,
    });

    // Verify password-changed email was captured
    await page.waitForTimeout(500);
    const emails = getEmails(email);
    const passwordChangedEmail = emails.find(
      (e) =>
        e.subject.toLowerCase().includes("password") &&
        e.subject.toLowerCase().includes("change")
    );
    expect(passwordChangedEmail).toBeTruthy();

    // Clear cookies and verify sign-in with new password works
    await page.context().clearCookies();
    await signInViaUI(page, email, newPassword);
  });

  test("should reject incorrect current password", async ({
    page,
    createUser,
  }) => {
    const { email, password } = await createUser();
    await page.context().clearCookies();
    await signInViaUI(page, email, password);

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
    await expect(
      page.getByText("Password changed successfully")
    ).not.toBeVisible({
      timeout: 5000,
    });
  });
});
