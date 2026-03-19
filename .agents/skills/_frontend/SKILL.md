---
name: frontend
description: Frontend development guidelines for this project — React components, Tailwind CSS, shadcn/ui, mobile-first responsive design, i18n-safe layouts, SEO patterns, forms, and route creation. MUST be activated when writing or modifying any frontend code in apps/web/ (components, routes, styles, layouts).
---

> **Keyword Usage:** Use **MUST** and **NEVER** to enforce critical requirements. These signal mandatory behavior that AI agents MUST follow without exception.
>
> **Keep this skill in sync:** When making changes to frontend patterns, component conventions, UI guidelines, or route structure, this skill MUST be updated to reflect the current state. Outdated skills are worse than no skills.

# Frontend Development Guide

This project uses **TanStack Start** + **React** + **Tailwind CSS v4** + **shadcn/ui v4** + **Paraglide JS** for the frontend. All code lives in `apps/web/`.

## Mobile-First — NON-NEGOTIABLE

Every screen, component, and layout MUST be designed **mobile-first**. Desktop is the enhancement. The app may ship as a native app via Capacitor, so touch-friendly UX is mandatory.

### Responsive Design

- MUST start with the mobile layout — use `sm:`, `md:`, `lg:` breakpoints **upward**
- NEVER design for desktop first and then squeeze it into mobile
- Stack vertically on mobile, go horizontal on larger screens: `flex-col sm:flex-row`

### Touch Targets

- Interactive elements MUST be at least **44×44px** tap area
- Use adequate padding on buttons, links, and form controls
- Prefer larger tap areas over pixel-perfect compact layouts

### i18n-Safe Layouts

Text can be significantly longer or shorter depending on locale. UI MUST accommodate variable text lengths:

- NEVER use fixed widths on text containers — use `min-w-0`, `flex-1`, `w-full`
- Prefer wrapping (`flex-wrap`) over truncation for important content
- Use `truncate` only for secondary/non-critical text (e.g. email addresses in lists)
- Buttons MUST grow with their label — NEVER fixed-width buttons with text
- Test mentally: "Would this break if the label were 2× longer?"

## Component Patterns

### Composition Over Custom CSS

- Prefer composition of small **shadcn primitives** over custom CSS
- Use Tailwind utilities directly — NEVER create CSS files
- Keep component files short and focused
- Import shadcn components from `@ingot/ui/*`

### Flexbox min-w-0 Pattern

Flex items have `min-width: auto` by default, breaking `truncate`:

```tsx
<div className="flex min-w-0">
  <Icon className="flex-shrink-0" />
  <span className="min-w-0 flex-1 truncate">Long text...</span>
  <Button className="flex-shrink-0" />
</div>
```

### React Rules

- **Rules of Hooks** — top level only, never conditional, no early return before hooks
- `"use client"` only when genuinely needed (hooks, event handlers, browser APIs)
- React Compiler handles memoization — no manual `useMemo`/`useCallback` needed

### Dark Mode — Theme-Aware Colors

MUST use Tailwind's semantic color tokens — NEVER hardcode colors like `bg-white`, `text-black`, or `bg-gray-100`.

```tsx
// Correct — adapts to light/dark mode
<div className="bg-card text-card-foreground" />
<p className="text-muted-foreground" />
<div className="border-border" />

// WRONG — breaks in dark mode
<div className="bg-white text-black" />
```

Common tokens: `bg-background`, `bg-card`, `bg-muted`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-destructive`, `text-destructive-foreground`.

## Spacing, Layout & Typography

- Use consistent spacing via Tailwind's scale: `gap-2`, `p-4`, `space-y-3`
- Use `container` + `max-w-*` for content width
- Use Tailwind's responsive text sizes: `text-sm md:text-base`
- Ensure readable line lengths: `max-w-prose` for long-form text

## Forms

- Full-width inputs on mobile
- Stack labels above inputs (not beside)
- Use shadcn form components consistently
- Use `zodFormResolver` from `@/lib/zod-form-resolver` for form validation (Zod v4 compatible)
- Share Zod schemas between client forms and server validation (`@/lib/schemas.ts`)

### Form Pattern

```tsx
import { useForm } from "react-hook-form";
import { zodFormResolver } from "@/lib/zod-form-resolver";
import { mySchema } from "@/lib/schemas";

function MyForm() {
  const form = useForm({
    resolver: zodFormResolver(mySchema),
    defaultValues: { ... },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* shadcn form fields */}
    </form>
  );
}
```

## Internationalization

**ZERO TOLERANCE for non-i18n strings.** Every text the user sees MUST come from a Paraglide message function.

```tsx
import { m } from "@/paraglide/messages";

// Correct
<Button>{m.auth_sign_in()}</Button>

// WRONG — hardcoded string
<Button>Sign In</Button>
```

- Named import: `import { m } from "@/paraglide/messages"` (NOT `import * as m`)
- Message keys in `apps/web/messages/en.json`
- Pattern: `{section}_{element}` (e.g., `auth_sign_in`, `settings_profile_title`)

## SEO — New Public Routes

Every new public route MUST follow this checklist:

1. Add `head()` with title, description, OG meta tags (i18n):

```tsx
import { seoMeta } from "@/lib/seo";
import { m } from "@/paraglide/messages";

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

2. Add i18n keys to `apps/web/messages/en.json` (pattern: `meta_{page}_title`, `meta_{page}_description`)
3. Add page to `apps/web/public/sitemap.xml`
4. Add page to `apps/web/public/llms.txt`
5. If FAQ-like content, add `FAQPage` JSON-LD schema in `head().scripts`
6. Add link in footer nav (`apps/web/src/components/footer.tsx`)

## Route Protection

- Auth routes at `/auth/$path`, account at `/account`
- Auth guard: `beforeLoad` checks `getSession()` and redirects to `/auth/sign-in`
- Admin guard: `beforeLoad` checks `user.role === "admin"`
- Use `data-testid` on interactive elements for E2E testability

## Key Frontend Files

| File | Purpose |
|:-----|:--------|
| `apps/web/src/routes/__root.tsx` | Root layout (providers, header, footer, JSON-LD) |
| `apps/web/src/components/header.tsx` | Header with nav + user menu |
| `apps/web/src/components/footer.tsx` | Footer with nav links |
| `apps/web/src/components/providers.tsx` | Client providers (theme, query, posthog) |
| `apps/web/src/components/auth/` | Auth forms (sign-in, sign-up, forgot/reset password) |
| `apps/web/src/components/settings/` | Account settings cards |
| `apps/web/src/lib/seo.ts` | `seoMeta()` helper for OG + meta tags |
| `apps/web/src/lib/schemas.ts` | Shared Zod schemas (password, etc.) |
| `apps/web/src/lib/auth-client.ts` | Better Auth React client |
| `apps/web/src/lib/orpc.ts` | oRPC client (SSR + browser) |
| `apps/web/src/lib/env.ts` | Client env vars + feature groups |
| `apps/web/src/lib/zod-form-resolver.ts` | Zod v4 resolver for react-hook-form |
| `apps/web/messages/en.json` | Frontend i18n strings |

## PostHog Event Capture (Client)

```tsx
import { usePostHog } from "@posthog/react";

const posthog = usePostHog();
posthog?.capture("event_name", { property: "value" });
```

Events tracked: `user_signed_in`, `user_signed_up`, `user_signed_out`, `password_reset_requested`, `password_reset_completed`, `password_changed`, `profile_updated`, `passkey_added`, `passkey_deleted`, `session_revoked`, `account_deleted`.
