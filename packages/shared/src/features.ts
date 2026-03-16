/**
 * Feature flags — pure enabled/disabled signals.
 *
 * Features do NOT contain env var names. Env vars are defined in their
 * respective env files (server: packages/server/src/env.ts, client: apps/web/src/lib/env.ts)
 * and nested under feature-gated groups.
 *
 * Usage:
 *   features.password    // true | undefined
 *   features.email       // true | undefined
 *   serverEnv.email?.RESEND_API_KEY  // env access gated by feature flag
 */

// --- Types ---

type FeatureDef = {
  enabled: { dev: boolean; prod: boolean };
};

type ResolvedFeatures<Defs extends Record<string, FeatureDef>> = {
  [K in keyof Defs]: true | undefined;
};

// --- Feature definitions ---

const featureDefinitions = {
  /** PostHog analytics tracking */
  posthog: { enabled: { dev: false, prod: true } },

  /** Google OAuth sign-in */
  googleOAuth: { enabled: { dev: false, prod: false } },

  /** Email sending via Resend */
  email: { enabled: { dev: false, prod: false } },

  /** Email & password authentication */
  password: { enabled: { dev: true, prod: true } },

  /** Passkey (WebAuthn) authentication */
  passkey: { enabled: { dev: true, prod: true } },

  /** Magic link authentication */
  magicLink: { enabled: { dev: false, prod: false } },
} as const satisfies Record<string, FeatureDef>;

type FeatureDefs = typeof featureDefinitions;

// --- Exported type ---

export type Features = ResolvedFeatures<FeatureDefs>;

// --- Runtime ---

// oxlint-disable-next-line node/no-process-env -- needed to determine environment at module init
const isDev = process.env.NODE_ENV !== "production";

/**
 * Create the resolved features object.
 * Each enabled feature is `true`. Disabled features are `undefined`.
 */
export const createFeatures = (): Features => {
  const result: Record<string, true | undefined> = {};

  for (const [name, def] of Object.entries(featureDefinitions)) {
    const isEnabled = isDev ? def.enabled.dev : def.enabled.prod;
    result[name] = isEnabled || undefined;
  }

  return result as Features;
};

export { featureDefinitions };
