---
name: email
description: Transactional email system — React Email templates, Resend integration, email i18n via Paraglide, email triggers in Better Auth, and email capture for E2E tests. Use when adding/modifying email templates, changing email triggers, or working with packages/email/.
---

> **Keyword Usage:** Use **MUST** and **NEVER** to enforce critical requirements. These signal mandatory behavior that AI agents MUST follow without exception.
>
> **Keep this skill in sync:** When making changes to email templates, triggers, Resend config, or email i18n patterns, this skill MUST be updated to reflect the current state. Outdated skills are worse than no skills.

# Transactional Emails

All transactional emails are in `packages/email/`. Emails are fully i18n via Paraglide — text is NEVER hardcoded. Emails MUST be sent in the user's preferred `locale` (stored in the users table).

## Current Templates

| Email              | Trigger                                                 | Template                        |
| :----------------- | :------------------------------------------------------ | :------------------------------ |
| Email verification | On signup (`emailVerification.sendOnSignUp`)            | `emails/email-verification.tsx` |
| Password reset     | Forgot password (`sendResetPassword`)                   | `emails/reset-password.tsx`     |
| Password changed   | After change-password (`hooks.after`)                   | `emails/password-changed.tsx`   |
| Account deleted    | After user deletion (`deleteUser.afterDelete`)          | `emails/account-deleted.tsx`    |
| Welcome            | After user creation (`databaseHooks.user.create.after`) | `emails/welcome.tsx`            |
| Magic link         | Magic link auth (disabled)                              | `emails/magic-link.tsx`         |

## Architecture

| File | Purpose |
|:-----|:--------|
| `packages/email/emails/email-layout.tsx` | Shared layout (Html, Head, Preview, Tailwind, Body, footer) |
| `packages/email/locale.ts` | `loc()` helper to bridge string locale → Paraglide's narrow locale literal types |
| `packages/email/templates.ts` | Render functions (`renderXxxEmail`) + localized subject helpers (`getEmailSubject.xxx`) |
| `packages/email/send.ts` | `createEmailSender` factory (Resend API) |
| `packages/auth/auth.ts` | All email triggers configured here (hooks, databaseHooks, emailVerification, deleteUser) |
| `packages/email/messages/en.json` | Email i18n strings |

## Email i18n Pattern

All email text MUST use `m.email_xxx({...}, loc(locale))` where `loc()` casts the string locale to Paraglide's type. NEVER hardcode text in email templates.

## Welcome Email Config

`consts.auth.welcomeEmail` (boolean) in `packages/utils/shared/consts.ts` — set to `false` to disable.

## Adding a New Email Template

1. Add message keys to `packages/email/messages/en.json` (pattern: `email_{template}_{element}`)
2. Create template in `packages/email/emails/` using `EmailLayout` + `loc()` + `m.email_xxx()`
3. Add render function to `packages/email/templates.ts`
4. Add subject to `getEmailSubject` in `packages/email/templates.ts`
5. Wire trigger in `packages/auth/auth.ts`
6. Add tests to `packages/auth/__tests__/email-notifications.test.ts`

## Email Capture (E2E)

`packages/email/email-capture.ts` — captures emails to `packages/email/.etc/.email-captures/` as JSON in dev/test mode. Read via `getEmails` fixture in E2E tests.

## Preview

`bun dev:email` — starts React Email preview server on port 3002.
