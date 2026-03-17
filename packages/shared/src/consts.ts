/** App constants — product decisions that don't change per environment. */

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
  },
} as const;
