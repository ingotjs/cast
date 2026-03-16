/**
 * App constants (non-feature-flag).
 * Feature flags are in features.ts.
 */

export const consts = {
  appName: "Start",

  auth: {
    /** Where to redirect after login */
    pathWhenLoggedIn: "/app",
  },
} as const;
