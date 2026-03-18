import { describe, expect, test } from "bun:test";

import { consts } from "@packages/shared/consts";

import { isDevelopment, serverEnv } from "../env";

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

describe("service env groups (presence-based)", () => {
  test("services without env vars return undefined", () => {
    // These services require env vars that aren't set in test
    expect(serverEnv.email).toBeUndefined();
    expect(serverEnv.googleOAuth).toBeUndefined();
    expect(serverEnv.posthog).toBeUndefined();
  });
});

describe("capability flags (consts)", () => {
  test("password is enabled", () => {
    expect(consts.auth.password).toBe(true);
  });

  test("passkey is enabled", () => {
    expect(consts.auth.passkey).toBe(true);
  });
});
