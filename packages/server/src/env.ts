import { consts, requireIfEnabled } from "@packages/shared/consts";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/** Database required in prod only — dev uses PGlite */
const database = { dev: false, prod: true } as const;

/** Auth secret required in prod only — dev uses a static fallback */
const authSecret = { dev: false, prod: true } as const;

/**
 * Server-only env vars. Separated from the client env (apps/web/src/lib/env.ts)
 * so server env var names stay hidden from client bundles.
 *
 * Reference: https://env.t3.gg/docs/core
 */
export const serverEnv = createEnv({
  server: {
    URL: z.url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    DATABASE_URL: requireIfEnabled(database, z.url()),
    BETTER_AUTH_SECRET: requireIfEnabled(authSecret, z.string().min(32)),
    BETTER_AUTH_URL: z.url().optional(),
    GOOGLE_CLIENT_ID: requireIfEnabled(
      consts.features.googleOAuth.enabled,
      z.string().min(1)
    ),
    GOOGLE_CLIENT_SECRET: requireIfEnabled(
      consts.features.googleOAuth.enabled,
      z.string().min(1)
    ),
    RESEND_API_KEY: requireIfEnabled(
      consts.features.email.enabled,
      z.string().min(1)
    ),
    EMAIL_FROM: requireIfEnabled(
      consts.features.email.enabled,
      z.string().min(1)
    ),
  },
  runtimeEnvStrict: {
    URL:
      process.env.URL ??
      (process.env.RAILWAY_PUBLIC_DOMAIN
        ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
        : "http://localhost:3000"),
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET:
      process.env.BETTER_AUTH_SECRET ??
      (process.env.NODE_ENV === "production"
        ? undefined
        : "dev-secret-at-least-32-characters-long"),
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
  },
  emptyStringAsUndefined: true,
  skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
});

export const isDevelopment = serverEnv.NODE_ENV === "development";
