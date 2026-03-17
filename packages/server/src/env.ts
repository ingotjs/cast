import { createFeatures } from "@packages/shared/features";
import { z } from "zod";

// oxlint-disable-next-line node/no-process-env -- env module reads raw process.env
const { env } = process;

const isDev = env.NODE_ENV !== "production";

/** Parse an env var with a Zod schema. Throws with a descriptive message on failure. */
const parseEnv = <T>(key: string, schema: z.ZodType<T>): T => {
  const result = schema.safeParse(env[key]);
  if (!result.success) {
    throw new Error(
      `Invalid env var "${key}": ${result.error.issues[0]?.message ?? "validation failed"}`
    );
  }
  return result.data;
};

/** Feature flags — each is `{} | undefined` */
export const features = createFeatures();

/**
 * Server environment variables.
 * Feature-gated envs are nested under their feature name.
 * If the feature is enabled, its envs are validated with Zod (throws if invalid).
 */
export const serverEnv = {
  URL:
    env.URL ??
    (env.RAILWAY_PUBLIC_DOMAIN
      ? `https://${env.RAILWAY_PUBLIC_DOMAIN}`
      : "http://localhost:3000"),
  NODE_ENV: (env.NODE_ENV ?? "development") as
    | "development"
    | "test"
    | "production",
  DATABASE_URL: env.DATABASE_URL,
  BETTER_AUTH_SECRET:
    env.BETTER_AUTH_SECRET ??
    (isDev
      ? "dev-secret-at-least-32-characters-long"
      : parseEnv("BETTER_AUTH_SECRET", z.string().min(32))),
  BETTER_AUTH_URL: env.BETTER_AUTH_URL,

  // Feature-gated env groups
  email: features.email
    ? {
        RESEND_API_KEY: parseEnv("RESEND_API_KEY", z.string().min(1)),
        EMAIL_FROM: parseEnv("EMAIL_FROM", z.string().email()),
      }
    : undefined,

  googleOAuth: features.googleOAuth
    ? {
        GOOGLE_CLIENT_ID: parseEnv("GOOGLE_CLIENT_ID", z.string().min(1)),
        GOOGLE_CLIENT_SECRET: parseEnv(
          "GOOGLE_CLIENT_SECRET",
          z.string().min(1)
        ),
      }
    : undefined,

  posthog: features.posthog
    ? {
        POSTHOG_API_KEY: parseEnv("VITE_PUBLIC_POSTHOG_KEY", z.string().min(1)),
        POSTHOG_HOST: parseEnv("VITE_PUBLIC_POSTHOG_HOST", z.url()),
      }
    : undefined,
};

export const isDevelopment = serverEnv.NODE_ENV === "development";
