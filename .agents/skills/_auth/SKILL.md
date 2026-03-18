---
name: auth
description: Authentication system using Better Auth — config, plugins, sessions, KV storage, auth forms, account settings, route protection, and error i18n. Use when modifying auth flows, adding auth plugins, working with sessions, or changing auth-related components in packages/auth/ or apps/web/src/components/auth/.
---

> **Keyword Usage:** Use **MUST** and **NEVER** to enforce critical requirements. These signal mandatory behavior that AI agents MUST follow without exception.
>
> **Keep this skill in sync:** When making changes to auth config, plugins, session handling, KV storage, or auth-related components, this skill MUST be updated to reflect the current state. Outdated skills are worse than no skills.

# Authentication

[Better Auth](https://better-auth.com/) with email/password + passkey + Google OAuth + magic link + admin + i18n plugins.

## Key Files

| What              | Where                                                                                                            |
| :---------------- | :--------------------------------------------------------------------------------------------------------------- |
| Auth config       | `packages/auth/auth.ts`                                                                                          |
| KV storage        | `packages/auth/kv-storage.ts` — Cloudflare KV adapter for Better Auth secondary storage                          |
| Auth i18n builder | `packages/auth/auth-i18n.ts` — builds translations dict from Paraglide messages                                  |
| Auth client       | `apps/web/src/lib/auth-client.ts` — exports `signIn`, `signUp`, `signOut`, `useSession`, `passkey`, `authClient` |
| Auth API route    | `apps/web/src/routes/api/auth.$.ts`                                                                              |
| Auth forms        | `apps/web/src/components/auth/` — sign-in, sign-up, forgot/reset password, social OAuth, magic link              |
| Account settings  | `apps/web/src/components/settings/` — profile, password, sessions, passkeys, delete                              |
| Password schema   | `apps/web/src/lib/schemas.ts` — shared across sign-up, reset-password, change-password                           |
| Auth error msgs   | `packages/auth/messages/en.json` — all Better Auth error codes as Paraglide messages                             |

## Routes & Guards

- Auth routes at `/auth/$path`, account at `/account` (redirects to sign-in if unauthenticated)
- Admin role guard on `/admin` via `beforeLoad` (`user.role === "admin"`)
- Auth guards MUST use isomorphic `getSession()` from `apps/web/src/lib/auth-client.ts` (works during SSR + CSR)

## Secondary Storage (Cloudflare KV)

- `packages/auth/kv-storage.ts` — sessions and rate limiting stored in KV for fast globally-replicated reads (<10ms)
- Sessions also stored in D1 (`storeSessionInDatabase: true`) for admin queries
- Rate limiting uses KV (`storage: "secondary-storage"`) instead of in-memory (required for Workers — each isolate has separate memory)

## Session Configuration

- Cookie caching (5 min), 30-day expiry, daily refresh, `trustedOrigins` for CSRF
- `BETTER_AUTH_SECRET` required in prod, auto-generated static fallback in dev
- Sonner `<Toaster />` in root layout for auth notifications

## User Configuration

- User `locale` field stored in DB (default `"en"`, updatable via `input: true` in additionalFields)
- `user.deleteUser` enabled — users can delete their own account with password confirmation
- Email verification enabled (`sendOnSignUp: true`, `autoSignInAfterVerification: true`)

## Capability Flags

Product decisions in `consts.auth` (`packages/utils/src/shared/consts.ts`):

| Capability | Default | Access                 |
| :--------- | :-----: | :--------------------- |
| `password` |  true   | `consts.auth.password` |
| `passkey`  |  true   | `consts.auth.passkey`  |

**UI-toggle env vars** — show/hide auth UI elements per environment:

| Env var                    | Effect                                                             |
| :------------------------- | :----------------------------------------------------------------- |
| `VITE_PUBLIC_GOOGLE_OAUTH` | Show Google sign-in button (requires server Google OAuth env vars) |
| `VITE_PUBLIC_MAGIC_LINK`   | Show magic link sign-in option (requires email env vars)           |

## Auth Error i18n

[`@better-auth/i18n` plugin](https://better-auth.com/docs/plugins/i18n) translates base + passkey [error codes](https://better-auth.com/docs/reference/errors) via Paraglide. English skipped (Better Auth defaults). Detection: session locale → Accept-Language. See `packages/auth/auth-i18n.ts`.
