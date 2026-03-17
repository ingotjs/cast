<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into OmegaStart. The `PostHogProvider`, `PostHogErrorBoundary`, and server-side `posthog-node` client were already in place. This run audited all key user flows and found most events already instrumented. Two additional events were added — `password_reset_completed` (reset-password form success) and `session_revoked` (sessions settings) — completing full coverage of every key user action. User identification (`posthog.identify`) runs on sign-in and sign-up; `posthog.reset()` runs on sign-out and account deletion. Environment variables were written to `apps/web/.env`.

**Changes made this run:**

- `apps/web/.env` — Updated `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST`
- `apps/web/src/components/auth/reset-password.tsx` — Added `usePostHog` and `password_reset_completed` capture on success
- `apps/web/src/components/settings/sessions-card.tsx` — Added `usePostHog` and `session_revoked` capture on success

| Event                      | Description                                                | File                                                        |
| :------------------------- | :--------------------------------------------------------- | :---------------------------------------------------------- |
| `user_signed_up`           | User successfully creates a new account                    | `apps/web/src/components/auth/sign-up.tsx`                  |
| `user_signed_in`           | User successfully signs in with email/password             | `apps/web/src/components/auth/sign-in.tsx`                  |
| `user_signed_out`          | User clicks the sign-out button                            | `apps/web/src/components/user-menu.tsx`                     |
| `password_reset_requested` | User submits forgot-password form                          | `apps/web/src/components/auth/forgot-password.tsx`          |
| `password_reset_completed` | User successfully resets their password via the reset form | `apps/web/src/components/auth/reset-password.tsx`           |
| `password_changed`         | User successfully changes their password from settings     | `apps/web/src/components/settings/change-password-card.tsx` |
| `profile_updated`          | User updates their display name                            | `apps/web/src/components/settings/update-profile-card.tsx`  |
| `passkey_added`            | User registers a new passkey                               | `apps/web/src/components/settings/passkeys-card.tsx`        |
| `passkey_deleted`          | User removes a passkey                                     | `apps/web/src/components/settings/passkeys-card.tsx`        |
| `session_revoked`          | User revokes an active session from settings               | `apps/web/src/components/settings/sessions-card.tsx`        |
| `account_deleted`          | User permanently deletes their account                     | `apps/web/src/components/settings/delete-account-card.tsx`  |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/344795/dashboard/1369101
- **Sign Ups & Sign Ins**: https://us.posthog.com/project/344795/insights/cygPXMlJ
- **Sign Up → Sign In Funnel**: https://us.posthog.com/project/344795/insights/tW21prqf
- **Account Deletions (Churn)**: https://us.posthog.com/project/344795/insights/azf605VT
- **Password Reset Funnel**: https://us.posthog.com/project/344795/insights/WFHUdiEl
- **Passkey Adoption**: https://us.posthog.com/project/344795/insights/bJuJA1DQ

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
