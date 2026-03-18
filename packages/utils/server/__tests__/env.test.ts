import { describe, expect, test } from "bun:test";

import { consts } from "../../shared/consts";
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
  test("services are undefined when their env vars are unset, or objects when set", () => {
    // Each service group is either undefined (env var absent) or a valid object (env var present)
    for (const group of [serverEnv.email, serverEnv.googleOAuth, serverEnv.posthog]) {
      expect(group === undefined || typeof group === "object").toBe(true);
    }
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
