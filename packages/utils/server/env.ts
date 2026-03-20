import { z } from "zod";

import { consts, DEV_URL } from "../shared/consts";

// oxlint-disable-next-line node/no-process-env -- env module reads raw process.env
const { env } = process;

const isDev = env.NODE_ENV !== "production";

/** Parse an env var with a Zod schema. Throws with a descriptive message on failure. */
const parseEnv = <T>(key: string, schema: z.ZodType<T>): T => {
  const result = schema.safeParse(env[key]);
  if (!result.success) {
    throw new Error(`Invalid env var "${key}": ${result.error.issues[0]?.message ?? "validation failed"}`);
  }
  return result.data;
};

/**
 * Server environment variables.
 *
 * Service env groups are enabled by env var presence:
 * - Set the primary env var → group is validated and active
 * - Leave it unset → group is `undefined` (service disabled)
 */
export const serverEnv = {
  URL: isDev ? DEV_URL : consts.siteUrl,
  NODE_ENV: (env.NODE_ENV ?? "development") as "development" | "test" | "production",
  BETTER_AUTH_SECRET:
    env.BETTER_AUTH_SECRET ??
    (isDev ? "dev-secret-at-least-32-characters-long" : parseEnv("BETTER_AUTH_SECRET", z.string().min(32))),

  // Service env groups — enabled by env var presence
  email: env.RESEND_API_KEY
    ? {
        RESEND_API_KEY: parseEnv("RESEND_API_KEY", z.string().min(1)),
        EMAIL_FROM: parseEnv("EMAIL_FROM", z.string().email()),
      }
    : undefined,

  googleOAuth: env.VITE_PUBLIC_GOOGLE_CLIENT_ID
    ? {
        GOOGLE_CLIENT_ID: parseEnv("VITE_PUBLIC_GOOGLE_CLIENT_ID", z.string().min(1)),
        GOOGLE_CLIENT_SECRET: parseEnv("GOOGLE_CLIENT_SECRET", z.string().min(1)),
      }
    : undefined,

  posthog: env.VITE_PUBLIC_POSTHOG_KEY
    ? {
        VITE_PUBLIC_POSTHOG_KEY: parseEnv("VITE_PUBLIC_POSTHOG_KEY", z.string().min(1)),
        VITE_PUBLIC_POSTHOG_HOST: z.url().parse(env.VITE_PUBLIC_POSTHOG_HOST ?? "https://us.posthog.com"),
      }
    : undefined,
};

export const isDevelopment = serverEnv.NODE_ENV === "development";
