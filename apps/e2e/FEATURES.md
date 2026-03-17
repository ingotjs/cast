# E2E Test Feature Coverage

## Auth Features

| #   | Feature         | Scenario                                          | Test File                            |
| :-- | :-------------- | :------------------------------------------------ | :----------------------------------- |
| 1   | Sign Up         | Create account through full UI form               | `tests/auth/sign-up.test.ts`         |
| 2   | Sign Up         | Validation errors for empty fields                | `tests/auth/sign-up.test.ts`         |
| 3   | Sign Up         | Password mismatch rejected                        | `tests/auth/sign-up.test.ts`         |
| 4   | Sign Up         | Verification email captured after registration    | `tests/auth/sign-up.test.ts`         |
| 5   | Sign In         | Sign in with valid credentials                    | `tests/auth/sign-in.test.ts`         |
| 6   | Sign In         | Invalid credentials show error                    | `tests/auth/sign-in.test.ts`         |
| 7   | Sign In         | Empty form validation                             | `tests/auth/sign-in.test.ts`         |
| 8   | Sign Out        | Sign out via API, verify unauthenticated state    | `tests/auth/sign-out.test.ts`        |
| 9   | Change Password | Change password, verify email, sign in with new   | `tests/auth/change-password.test.ts` |
| 10  | Change Password | Wrong current password rejected                   | `tests/auth/change-password.test.ts` |
| 11  | Delete Account  | Delete account, verify email, can't sign in after | `tests/auth/delete-account.test.ts`  |

### Notes

- **#1**: This is the only test that exercises the full sign-up UI. All other tests create users via the Better Auth API for speed.
- **#4**: Email verification is checked by reading captured emails from `.email-captures/` (the dev server writes emails to JSON files instead of sending via Resend).
- **#8**: Sign-out uses the Better Auth API directly since there is no sign-out button in the UI yet.
- **#9**: After changing the password, the test clears cookies and signs in with the new password to verify it works.
- **#11**: After deleting the account, the test verifies that the deleted user's credentials are rejected on the sign-in page.
