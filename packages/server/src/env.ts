import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Server-only env vars. Separated from the client env (apps/web/src/lib/env.ts)
 * so server env var names stay hidden from client bundles.
 *
 * Reference: https://env.t3.gg/docs/core
 */
export const serverEnv = createEnv({
  server: {
    /**
     * Project URL with protocol.
     * Production: set URL or auto-derived from RAILWAY_PUBLIC_DOMAIN.
     * Development: defaults to http://localhost:3000.
     */
    URL: z.url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  runtimeEnvStrict: {
    URL:
      process.env.URL ??
      (process.env.RAILWAY_PUBLIC_DOMAIN
        ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
        : "http://localhost:3000"),
    NODE_ENV: process.env.NODE_ENV,
  },
  emptyStringAsUndefined: true,
  skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
});

export const isDevelopment = serverEnv.NODE_ENV === "development";
