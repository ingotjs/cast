---
name: env
description: Environment variables, service feature flags, and capability flags — how to access, add, and toggle env-based features. MUST be activated when adding env vars, toggling features, or working with service/capability flags.
---

> **Keyword Usage:** Use **MUST** and **NEVER** to enforce critical requirements. These signal mandatory behavior that AI agents MUST follow without exception.
>
> **Keep this skill in sync:** When making changes to env var patterns, feature flags, or capability flags, this skill MUST be updated to reflect the current state. Outdated skills are worse than no skills.

# Environment Variables & Feature Flags

## Core Rule

**NEVER use `process.env` or `import.meta.env` directly.** Enforced by oxlint (`node/no-process-env`). Only `**/env.ts` files may access them.

| Context | Import                                                   | Example                                      |
| :------ | :------------------------------------------------------- | :------------------------------------------- |
| Server  | `import { serverEnv } from "@packages/utils/server/env"` | `serverEnv.email?.RESEND_API_KEY`            |
| Client  | `import { clientEnv } from "@/lib/env"`                  | `clientEnv.posthog?.VITE_PUBLIC_POSTHOG_KEY` |

## Service Features

External services toggled by env var presence. Set the env vars → service is on. Leave them out → off. No code changes needed.

| Service       | Primary env var           | Env group                                 |
| :------------ | :------------------------ | :---------------------------------------- |
| `posthog`     | `VITE_PUBLIC_POSTHOG_KEY` | `serverEnv.posthog` / `clientEnv.posthog` |
| `email`       | `RESEND_API_KEY`          | `serverEnv.email`                         |
| `googleOAuth` | `GOOGLE_CLIENT_ID`        | `serverEnv.googleOAuth`                   |

## Capability Flags

Product decisions in `consts.auth` (`packages/utils/shared/consts.ts`). Always the same regardless of environment.

| Capability | Default | Access                 |
| :--------- | :-----: | :--------------------- |
| `password` |  true   | `consts.auth.password` |
| `passkey`  |  true   | `consts.auth.passkey`  |

## UI-Toggle Env Vars

Show/hide auth UI elements per environment:

| Env var                    | Effect                                                             |
| :------------------------- | :----------------------------------------------------------------- |
| `VITE_PUBLIC_GOOGLE_OAUTH` | Show Google sign-in button (requires server Google OAuth env vars) |
| `VITE_PUBLIC_MAGIC_LINK`   | Show magic link sign-in option (requires email env vars)           |

## Usage Examples

```ts
serverEnv.email?.RESEND_API_KEY; // string if email env vars set, undefined if not
consts.auth.password; // true | false (product decision)
clientEnv.posthog?.VITE_PUBLIC_POSTHOG_KEY; // client-side env
```

## Adding a New Service Feature

1. Add an env group in the appropriate env file (`packages/utils/server/env.ts` and/or `apps/web/src/lib/env.ts`):
   ```ts
   myService: env.MY_SERVICE_KEY
     ? { MY_SERVICE_KEY: parseEnv("MY_SERVICE_KEY", z.string().min(1)) }
     : undefined,
   ```
2. Access via `serverEnv.myService?.MY_SERVICE_KEY` or `clientEnv.myService?.MY_SERVICE_KEY`
3. Add env vars to `.env.example`

## Key Files

| File                                | Purpose                                    |
| :---------------------------------- | :----------------------------------------- |
| `packages/utils/server/env.ts`  | Server env vars + feature-gated groups     |
| `apps/web/src/lib/env.ts`           | Client env vars + feature groups           |
| `packages/utils/shared/consts.ts` | App constants + capability flags         |
| `.env.example`                      | Template for required env vars             |
