/**
 * PostHog reverse proxy E2E test.
 *
 * Verifies that Nitro's routeRules proxy at /api/ph forwards requests
 * to PostHog's servers (us.i.posthog.com) instead of being handled
 * by our app's router.
 *
 * Steps:
 * 1. POST to /api/ph/decide?v=3 with an invalid token
 * 2. Verify we get a PostHog response (401 with PostHog error text),
 *    NOT our app's HTML error page (which proves the proxy is active)
 * 3. Verify a non-proxied /api/nonexistent route returns our app's
 *    HTML error page (proves the difference is the proxy, not a coincidence)
 */
import { expect, test } from "@playwright/test";

test.describe("PostHog reverse proxy", () => {
  test("proxies /api/ph/ requests to PostHog servers", async ({ request }) => {
    const response = await request.post("/api/ph/decide?v=3", {
      data: { token: "test_invalid", distinct_id: "test" },
    });

    // PostHog rejects invalid tokens with 401
    expect(response.status()).toBe(401);

    // Response comes from PostHog's infrastructure, not our app
    const text = await response.text();
    expect(text).toContain("API key");
  });

  test("non-proxied /api/ routes return app HTML, not PostHog", async ({ request }) => {
    const response = await request.get("/api/nonexistent");
    const text = await response.text();

    // Our app returns an HTML error page for unknown routes
    expect(text).toContain("<!DOCTYPE html>");
  });
});
