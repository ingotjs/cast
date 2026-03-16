import { consts, requireIfEnabled } from "@packages/shared/consts";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const isLocalDev = !process.env.DATABASE_URL;

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
    /** Optional for local dev (uses PGlite), required for production */
    DATABASE_URL: z.url().optional(),
    /** Optional for local dev (uses dev secret with warning), required for production */
    BETTER_AUTH_SECRET: isLocalDev
      ? z.string().min(32).optional()
      : z.string().min(32),
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
  },
  runtimeEnvStrict: {
    URL:
      process.env.URL ??
      (process.env.RAILWAY_PUBLIC_DOMAIN
        ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
        : "http://localhost:3000"),
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
  emptyStringAsUndefined: true,
  skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
});

export const isDevelopment = serverEnv.NODE_ENV === "development";
