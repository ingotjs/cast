---
name: i18n
description: Internationalization with Paraglide JS across the full stack — frontend UI, backend auth errors, Zod validation, and email templates. Use when adding i18n strings, creating new locales, working with Better Auth error translations, or any task involving user-facing text.
---

# Internationalization (i18n)

[Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) for type-safe i18n across the entire stack. **All user-facing text MUST be internationalized** — NEVER hardcode strings.

i18n covers frontend UI, backend API responses, Zod validation errors, auth error messages, and email templates — every layer is locale-aware from day one.

## Architecture

**Three separate Paraglide projects (separation of concerns):**

| Project  | Path                        | Covers                                                                        |
| :------- | :-------------------------- | :---------------------------------------------------------------------------- |
| Frontend | `apps/web/messages/`        | UI labels, buttons, placeholders, toasts, auth forms, settings, admin         |
| Backend  | `packages/server/messages/` | Auth error messages (`auth_*`), oRPC errors, API responses, validation errors |
| Email    | `packages/email/messages/`  | Subject lines, body copy, CTAs, transactional email content                   |

Each has its own `project.inlang/settings.json` and generates its own `paraglide/messages`. Server strings never leak to client bundle.

**Languages:** Currently English (`en`). When adding strings, MUST also translate for all languages in each `project.inlang/settings.json` `locales` array. Do NOT use machine translation from paraglide.

**Paraglide integration (follows [official TanStack Start example](https://github.com/TanStack/router/tree/main/examples/react/start-i18n-paraglide)):**

- `apps/web/src/server.ts` — `paraglideMiddleware` wraps the server entry for per-request locale detection
- `apps/web/src/router.tsx` — `rewrite` with `deLocalizeUrl`/`localizeUrl` for URL-based locale support
- `<html lang={getLocale()}>` in root layout — dynamic locale on HTML tag
- Import style: `import { m } from "@/paraglide/messages"` (named import, NOT `import * as m`)

## CRITICAL — ZERO TOLERANCE for non-i18n strings

ALL user-facing strings MUST use Paraglide. This includes UI text, Zod validation errors (frontend + backend), toast messages, auth forms, oRPC errors, email templates (subjects, body, buttons, disclaimers). There MUST be NEVER any hardcoded user-facing string anywhere in this codebase. Every text the user sees — whether in the browser, in an email, or in an API error — MUST come from a Paraglide message function.

## How to add a new i18n string

1. Add to the appropriate `messages/en.json`:
   - Frontend → `apps/web/messages/en.json`
   - Backend → `packages/server/messages/en.json`
   - Email → `packages/email/messages/en.json`
2. Import: `import { m } from "@/paraglide/messages"`
3. Use:
   ```tsx
   <Label>{m.email_label()}</Label>; // JSX
   z.string().min(1, m.email_required()); // Zod (frontend)
   z.string({ error: () => m.field_required() }); // Zod (backend)
   toast.success(m.profile_updated()); // Toast
   ```
4. Add translations for all other languages if they exist.

## Zod i18n (full-stack)

Every validation message the user sees is locale-aware:

- **Frontend:** Message functions called at validation time (not import time), so module-level schemas resolve to current locale.
- **Backend:** Message functions in Zod `error` callbacks resolve per-request via Paraglide's server runtime.

## Email i18n

Email templates use their own Paraglide project (`packages/email/messages/`). All email text — subjects, headings, body, buttons — MUST use Paraglide. Emails are sent in the recipient's preferred locale (stored in the `users.locale` DB field).

**Locale bridge:** `packages/email/locale.ts` — `loc()` casts string locale to Paraglide's narrow type.

**Pattern:** `m.email_xxx({...}, loc(locale))` where `loc()` bridges the string locale from the DB to Paraglide's type system.

## Auth Error i18n (Better Auth i18n plugin)

Reference: https://better-auth.com/docs/plugins/i18n
Reference: https://better-auth.com/docs/reference/errors

All Better Auth error codes are translated via the [`@better-auth/i18n` plugin](https://better-auth.com/docs/plugins/i18n), integrated with Paraglide.

### How it works

| File                                   | Purpose                                                            |
| :------------------------------------- | :----------------------------------------------------------------- |
| `packages/server/messages/en.json`     | `auth_*` keys — canonical key list and translation reference       |
| `packages/server/src/auth-i18n.ts`     | `buildAuthTranslations()` — maps Paraglide messages to error codes |
| `packages/server/src/auth.ts`          | Conditionally adds plugin when non-default locales exist           |
| `packages/server/src/__tests__/auth-i18n.test.ts` | Coverage + integration tests                            |

**Key pattern:** Paraglide key `auth_USER_NOT_FOUND` → Better Auth error code `USER_NOT_FOUND`. The `auth_` prefix is stripped at runtime by the builder.

**English messages are NOT duplicated at runtime** — Better Auth provides English defaults natively. The `auth_*` keys in `en.json` serve as Paraglide's canonical key list (required for Paraglide to generate message functions) and as a translation reference. `buildAuthTranslations()` skips the base locale and returns `null` when only English is configured. When `null`, the i18n plugin is not added at all — zero overhead for English-only setups.

**When non-default locales exist:** The plugin activates with translations for those locales only. Detection order: user's stored `locale` field (DB session) → `Accept-Language` header.

### What's covered and what's NOT

This file covers **base** error codes (`BASE_ERROR_CODES` from `better-auth`) and **passkey** error codes (`passkey().$ERROR_CODES` from `@better-auth/passkey`). These are the user-facing errors.

**Not covered:**
- Admin error codes — admin-only, not user-facing, no i18n needed
- Other plugin error codes (organization, phone, anonymous, etc.) — not used in this project

To add error codes from another Better Auth plugin:
1. Check the plugin's `$ERROR_CODES` export (e.g., `myPlugin().$ERROR_CODES`)
2. Add `auth_{ERROR_CODE}` keys to `packages/server/messages/en.json` matching each code
3. Compile Paraglide: `cd packages/server && bun run build`
4. The test `"Paraglide messages cover all BASE_ERROR_CODES"` validates base coverage — add a similar test for the new plugin

### Typesafety

The test suite (`auth-i18n.test.ts`) imports `BASE_ERROR_CODES` from `better-auth` and verifies every code has a corresponding `auth_*` Paraglide message. If Better Auth adds new error codes in a version update, this test will catch missing translations.

## Adding a new locale

1. Add the locale code to **all three** `project.inlang/settings.json` `locales` arrays:
   - `apps/web/project.inlang/settings.json`
   - `packages/server/project.inlang/settings.json`
   - `packages/email/project.inlang/settings.json`
2. Create `messages/{locale}.json` in each project with translated strings
3. For auth errors: add `auth_*` keys to `packages/server/messages/{locale}.json` — the builder automatically includes non-default locale translations
4. Compile Paraglide in each package (`bun run build`) or run `bun ok` from root
5. Auth error translations flow through automatically — no code changes needed

## i18n for meta tags

All meta tag values MUST use Paraglide message functions (e.g., `m.meta_home_title()`). Keys are in `apps/web/messages/en.json`.

**Per-page SEO pattern:**

```tsx
import { seoMeta } from "../lib/seo";
import { m } from "../paraglide/messages";

export const Route = createFileRoute("/my-page")({
  head: () => ({
    meta: [
      ...seoMeta({
        title: m.meta_mypage_title(),
        description: m.meta_mypage_description(),
      }),
    ],
  }),
  component: MyPage,
});
```
