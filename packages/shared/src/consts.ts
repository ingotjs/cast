/**
 * App constants (non-feature-flag).
 * Feature flags are in features.ts.
 */

export const consts = {
  appName: "OmegaStart",
  defaultLocale: "en",

  auth: {
    /** Where to redirect after login */
    pathWhenLoggedIn: "/app",
    /** Send a welcome email after user registration */
    welcomeEmail: true,
  },
} as const;
