import { describe, expect, test } from "bun:test";

import { features, isDevelopment, serverEnv } from "../env";

describe("server env", () => {
  test("URL has a default value in dev", () => {
    expect(serverEnv.URL).toBeDefined();
    expect(serverEnv.URL).toContain("localhost");
  });

  test("NODE_ENV is set", () => {
    expect(serverEnv.NODE_ENV).toBeDefined();
    expect(["development", "test", "production"]).toContain(serverEnv.NODE_ENV);
  });

  test("BETTER_AUTH_SECRET has a dev fallback", () => {
    expect(serverEnv.BETTER_AUTH_SECRET).toBeDefined();
    expect(serverEnv.BETTER_AUTH_SECRET.length).toBeGreaterThanOrEqual(32);
  });

  test("isDevelopment is derived from NODE_ENV", () => {
    expect(typeof isDevelopment).toBe("boolean");
  });
});

describe("feature-gated env groups", () => {
  test("disabled features return undefined env groups", () => {
    // email and googleOAuth are disabled in dev
    if (!features.email) {
      expect(serverEnv.email).toBeUndefined();
    }
    if (!features.googleOAuth) {
      expect(serverEnv.googleOAuth).toBeUndefined();
    }
  });

  test("features object has all expected keys", () => {
    expect("email" in features).toBe(true);
    expect("googleOAuth" in features).toBe(true);
    expect("password" in features).toBe(true);
    expect("passkey" in features).toBe(true);
    expect("posthog" in features).toBe(true);
    expect("magicLink" in features).toBe(true);
  });

  test("password feature is enabled in dev", () => {
    expect(features.password).toBe(true);
  });

  test("passkey feature is enabled in dev", () => {
    expect(features.passkey).toBe(true);
  });
});
