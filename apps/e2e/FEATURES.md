# E2E Test Feature Coverage

## Auth Features

| #   | Feature         | Scenario                                          | Test File                            |
| :-- | :-------------- | :------------------------------------------------ | :----------------------------------- |
| 1   | Sign Up         | Create account through full UI form               | `tests/auth/sign-up.test.ts`         |
| 2   | Sign Up         | Validation errors for empty fields                | `tests/auth/sign-up.test.ts`         |
| 3   | Sign Up         | Password mismatch rejected                        | `tests/auth/sign-up.test.ts`         |
| 4   | Sign Up         | Verification email captured after registration    | `tests/auth/sign-up.test.ts`         |
| 5   | Sign In         | Sign in with valid credentials (testUser fixture) | `tests/auth/sign-in.test.ts`         |
| 6   | Sign In         | Invalid credentials show error                    | `tests/auth/sign-in.test.ts`         |
| 7   | Sign In         | Empty form validation                             | `tests/auth/sign-in.test.ts`         |
| 8   | Sign Out        | Sign out via user menu dropdown                   | `tests/auth/sign-out.test.ts`        |
| 9   | Change Password | Change password, verify email, sign in with new   | `tests/auth/change-password.test.ts` |
| 10  | Change Password | Wrong current password rejected                   | `tests/auth/change-password.test.ts` |
| 11  | Delete Account  | Delete account, verify email, can't sign in after | `tests/auth/delete-account.test.ts`  |

### Notes

- **#1**: This is the only test that exercises the full sign-up UI. All other tests create users via the `testUser` or `authenticatedPage` fixtures (API-based setup).
- **#4**: Email verification is checked by reading captured emails from `packages/email/.etc/.email-captures/` (the dev server writes emails to JSON files instead of sending via Resend).
- **#5**: Uses `testUser` fixture which creates a user via API and clears cookies, so the test signs in through the UI.
- **#8**: Sign-out uses the user menu dropdown in the header (`user-menu-trigger` then `user-menu-signout`).
- **#9**: Uses `authenticatedPage` fixture. After changing the password, signs out via user menu, then signs in with the new password through the UI.
- **#11**: Uses `authenticatedPage` fixture. After deleting the account, verifies the header shows "Sign in" link and the deleted user's credentials are rejected on the sign-in page.

### Fixtures

| Fixture             | Description                                                                        |
| :------------------ | :--------------------------------------------------------------------------------- |
| `testUser`          | Creates user via API, clears cookies. Returns `{ email, password, name }`.         |
| `authenticatedPage` | Creates user via API, signs in through UI. Returns `{ email, password, name }`.    |
| `getEmails`         | Reads captured emails for a recipient from `packages/email/.etc/.email-captures/`. |
| `clearEmails`       | Clears all captured emails.                                                        |
