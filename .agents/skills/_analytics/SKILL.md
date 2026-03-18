---
name: analytics
description: PostHog analytics, error tracking, and event capture — client provider, server client, reverse proxy, event tracking plan, and error boundaries. Use when adding events, modifying analytics setup, or working with PostHog integration.
---

> **Keyword Usage:** Use **MUST** and **NEVER** to enforce critical requirements. These signal mandatory behavior that AI agents MUST follow without exception.
>
> **Keep this skill in sync:** When making changes to PostHog setup, event tracking, error boundaries, reverse proxy, or logging config, this skill MUST be updated to reflect the current state. Outdated skills are worse than no skills.

# Analytics, Error Tracking & Event Capture

[PostHog](https://posthog.com/) — full-stack analytics, error tracking, and event capture. Enabled by env var presence. Admin analytics at `/admin/analytics`.

## Key Files

| What                | Where                                                                                     |
| :------------------ | :---------------------------------------------------------------------------------------- |
| Client provider     | `apps/web/src/routes/__root.tsx` — `PostHogProvider` + `PostHogErrorBoundary`             |
| Client env          | `apps/web/src/lib/env.ts` — `VITE_PUBLIC_POSTHOG_KEY`, `VITE_PUBLIC_POSTHOG_HOST`         |
| Server client       | `packages/utils/src/server/posthog.ts` — `posthog-node` with `enableExceptionAutocapture` |
| Server env          | `packages/utils/src/server/env.ts` — same `VITE_PUBLIC_POSTHOG_*` env vars as client      |
| Reverse proxy       | `apps/web/vite.config.ts` — Nitro `routeRules` proxies `/api/ph/**` to `us.i.posthog.com` |
| Event tracking plan | `.posthog-events.json` — all tracked events with descriptions and source files            |

## Reverse Proxy

Reference: https://posthog.com/docs/advanced/proxy

All client-side PostHog traffic flows through `/api/ph/` on your own domain via Nitro `routeRules`. This avoids ad blockers. Static assets route to `us-assets.i.posthog.com`, API calls to `us.i.posthog.com`. Client uses `api_host: "/api/ph"` + `ui_host` for toolbar/session replay. E2E tested in `apps/e2e/tests/proxy/`.

## Error Tracking

**Client:**
- `capture_exceptions: true` auto-captures uncaught errors + unhandled promise rejections
- `PostHogErrorBoundary` catches React rendering errors

**Server:**
- `enableExceptionAutocapture: true` catches uncaught exceptions + unhandled promise rejections at the process level
- Client initialized via import in `auth.ts`

**Manual capture:**
- Client: `posthog.captureException(error)`
- Server: `posthog?.captureException(error, distinctId)`

## Event Capture

**Client-side** (via `usePostHog()` hook):
`user_signed_in`, `user_signed_up`, `user_signed_out`, `password_reset_requested`, `password_reset_completed`, `password_changed`, `profile_updated`, `passkey_added`, `passkey_deleted`, `session_revoked`, `account_deleted`

**Server-side** (via `posthog?.capture()`):
`user_created`, `user_deleted` — fired in Better Auth database hooks (`packages/auth/auth.ts`)

**User identification:** `posthog.identify(userId, { email, name })` MUST be called on sign-in and sign-up

## Usage Pattern

```tsx
// Client: import { usePostHog } from "@posthog/react"
const posthog = usePostHog();
posthog?.capture("event_name", { property: "value" });

// Server: import { posthog } from "@packages/utils/server/posthog"
posthog?.capture({ distinctId: userId, event: "event_name", properties: { ... } });
```

## Logging

Structured console logger — Cloudflare Workers compatible. JSON in prod (Cloudflare Logpush), colored output in dev.

| What            | Where                                              |
| :-------------- | :------------------------------------------------- |
| Logger instance | `packages/utils/src/server/logger.ts`              |
| Methods         | `logger.info()`, `.warn()`, `.error()`, `.debug()` |

Cloudflare Workers observability is enabled via `alchemy.run.ts` wrangler transform (`"observability": { "enabled": true }`).
