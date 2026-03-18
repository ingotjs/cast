# env-functions: Use Environment Functions for Configuration

## Priority: MEDIUM

## Explanation

Environment functions provide type-safe access to environment variables on the server. They ensure secrets stay server-side, provide validation, and enable different configurations per environment.

## Bad Example

```tsx
// Accessing env vars directly - no validation, potential leaks
export const getApiData = createServerFn()
  .handler(async () => {
    const apiKey = process.env.API_KEY  // May be undefined
    return fetch(url, { headers: { Authorization: apiKey } })
  })

// Importing env in shared files
// lib/config.ts
export const config = {
  apiKey: process.env.API_KEY,  // Bundled into client!
}
```

## Good Example: Validated Environment Configuration

```tsx
// lib/env.server.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  SENTRY_DSN: z.string().url().optional(),
})

function validateEnv() {
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors)
    throw new Error('Invalid environment configuration')
  }
  return parsed.data
}

export const env = validateEnv()
```

## Good Example: Public vs Private Config

```tsx
// lib/env.server.ts - Server only (secrets)
export const serverEnv = {
  databaseUrl: process.env.DATABASE_URL!,
  sessionSecret: process.env.SESSION_SECRET!,
}

// lib/env.ts - Public config (safe for client)
export const publicEnv = {
  appUrl: process.env.VITE_APP_URL ?? 'http://localhost:3000',
  stripePublicKey: process.env.VITE_STRIPE_PUBLIC_KEY!,
}

// Vite exposes VITE_ prefixed vars to client
// Non-prefixed vars are server-only
```

## Environment Variable Checklist

| Variable | Prefix | Accessible On |
|----------|--------|---------------|
| `DATABASE_URL` | None | Server only |
| `SESSION_SECRET` | None | Server only |
| `VITE_APP_URL` | `VITE_` | Server + Client |
| `VITE_STRIPE_PUBLIC_KEY` | `VITE_` | Server + Client |

## Context

- Never import `.server.ts` files in client code
- Use `VITE_` prefix for client-accessible variables
- Validate at startup to fail fast on misconfiguration
- Keep secrets out of error messages and logs
