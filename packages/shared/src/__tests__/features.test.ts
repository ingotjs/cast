import { describe, expect, test } from "bun:test";

import { createFeatures } from "../features";

// Tests run with NODE_ENV !== "production", so isDev = true.

describe("createFeatures", () => {
  test("returns all features", () => {
    const features = createFeatures();

    expect(Object.keys(features).toSorted()).toEqual([
      "email",
      "googleOAuth",
      "magicLink",
      "passkey",
      "password",
      "posthog",
    ]);
  });

  // --- Enabled / disabled (in dev mode, since tests run with NODE_ENV=test) ---

  describe("enabled vs disabled", () => {
    test("enabled feature is true", () => {
      const features = createFeatures();

      // password: { dev: true, prod: true }
      expect(features.password).toBe(true);
    });

    test("disabled feature returns undefined", () => {
      const features = createFeatures();

      // email: { dev: false, prod: false }
      expect(features.email).toBeUndefined();
      expect(!!features.email).toBe(false);
    });

    test("dev-disabled feature is undefined in test env", () => {
      const features = createFeatures();

      // posthog: { dev: false, prod: true } — dev=false so undefined in tests
      expect(features.posthog).toBeUndefined();
      expect(!!features.posthog).toBe(false);
    });

    test("disabled boolean feature is falsy", () => {
      const features = createFeatures();

      // magicLink: { dev: false, prod: false }
      expect(features.magicLink).toBeUndefined();
      expect(!!features.magicLink).toBe(false);
    });
  });

  // --- Truthiness pattern ---

  describe("truthiness pattern", () => {
    test("enabled feature is truthy for conditional rendering", () => {
      const features = createFeatures();

      // Simulates: !!features.password && <Component />
      expect(!!features.password).toBe(true);
      // Simulates: features.email ? doSomething() : skip
      expect(features.email ? "enabled" : "disabled").toBe("disabled");
    });
  });
});
