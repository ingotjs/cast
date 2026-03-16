import type { FeatureFlag } from "@packages/shared/consts";

/**
 * Check if a feature flag is active for the current client environment.
 * Uses Vite's built-in `import.meta.env.DEV` to determine the environment.
 */
// oxlint-disable-next-line node/no-process-env -- using import.meta.env, not process.env
export const isFeatureActive = (flag: FeatureFlag): boolean =>
  import.meta.env.DEV ? flag.dev : flag.prod;
