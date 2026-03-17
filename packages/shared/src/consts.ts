/**
 * App constants (non-feature-flag).
 * Feature flags are in features.ts.
 */

export const consts = {
  appName: "OmegaStart",
  /** Production URL — update before deploying (used for sitemap, robots.txt, JSON-LD) */
  siteUrl: "https://example.com",
  defaultLocale: "en",

  auth: {
    /** Where to redirect after login */
    pathWhenLoggedIn: "/app",
    /** Send a welcome email after user registration */
    welcomeEmail: true,
    /** Enable email & password authentication */
    password: true,
    /** Enable passkey (WebAuthn) authentication */
    passkey: true,
    /** Enable magic link authentication (requires email service env vars) */
    magicLink: false,
  },
} as const;
