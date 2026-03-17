import { z } from "zod";

// oxlint-disable-next-line node/no-process-env -- env module reads import.meta.env
const env = import.meta.env as Record<string, string | undefined>;

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

/**
 * Client environment variables.
 * Service env groups are enabled by env var presence.
 */
export const clientEnv = {
  posthog: env.VITE_PUBLIC_POSTHOG_KEY
    ? {
        VITE_PUBLIC_POSTHOG_KEY: parseEnv(
          "VITE_PUBLIC_POSTHOG_KEY",
          z.string().min(1)
        ),
        VITE_PUBLIC_POSTHOG_HOST: parseEnv("VITE_PUBLIC_POSTHOG_HOST", z.url()),
      }
    : undefined,
};
