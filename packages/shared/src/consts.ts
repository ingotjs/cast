/**
 * Feature flags and app constants.
 *
 * Each feature has an `enabled` object specifying where it's active:
 * - `{ dev: true, prod: true }` — enabled everywhere
 * - `{ dev: false, prod: true }` — production only (env vars optional in dev)
 * - `{ dev: true, prod: false }` — development only
 * - `{ dev: false, prod: false }` — disabled everywhere
 */

import type { z } from "zod";

export type FeatureFlag = { dev: boolean; prod: boolean };

export const consts = {
  appName: "Start",

  features: {
    /** PostHog analytics tracking */
    posthog: {
      enabled: { dev: false, prod: true } satisfies FeatureFlag,
    },

    /** Google OAuth sign-in */
    googleOAuth: {
      enabled: { dev: false, prod: false } satisfies FeatureFlag,
    },

    /** Email sending via Resend */
    email: {
      enabled: { dev: false, prod: false } satisfies FeatureFlag,
    },

    /** Email & password authentication */
    password: {
      enabled: { dev: true, prod: true } satisfies FeatureFlag,
    },

    /** Passkey (WebAuthn) authentication */
    passkey: {
      enabled: { dev: true, prod: true } satisfies FeatureFlag,
    },

    /** Magic link authentication */
    magicLink: {
      enabled: { dev: false, prod: false } satisfies FeatureFlag,
    },
  },

  auth: {
    /** Where to redirect after login */
    pathWhenLoggedIn: "/app",
  },
} as const;

/** Check if a feature is enabled for the current environment */
export const isFeatureEnabled = ({
  enabled,
  isDev,
}: {
  enabled: FeatureFlag;
  isDev: boolean;
}): boolean => (isDev ? enabled.dev : enabled.prod);

/**
 * Helper for t3-env: returns a required or optional Zod schema based on feature flag + environment.
 *
 * @example
 * ```ts
 * RESEND_API_KEY: requireIfEnabled(consts.features.email.enabled, isLocalDev, z.string().min(1)),
 * ```
 */
export const requireIfEnabled = <T extends z.ZodType>(
  enabled: FeatureFlag,
  schema: T
): T | z.ZodOptional<T> => {
  // oxlint-disable-next-line node/no-process-env -- needed to determine environment at module init
  const isDev = process.env.NODE_ENV !== "production";
  if (isFeatureEnabled({ enabled, isDev })) {
    return schema;
  }
  return schema.optional() as unknown as T;
};
