import { afterAll, describe, expect, test } from "bun:test";

import { BASE_ERROR_CODES } from "better-auth";

import { auth } from "../auth";
import { buildAuthTranslations } from "../auth-i18n";
import * as messages from "../paraglide/messages";
import { cleanupTestUser, createTestUser, uniqueEmail } from "./test-utils";

const AUTH_PREFIX = "auth_";

// --- buildAuthTranslations ---

describe("buildAuthTranslations", () => {
  test("returns null when only base locale is configured", () => {
    const translations = buildAuthTranslations();

    // With only English configured, no translations needed — Better Auth handles defaults
    expect(translations).toBeNull();
  });

  test("Paraglide messages cover all BASE_ERROR_CODES", () => {
    const messageKeys = new Set(
      Object.keys(messages).filter(
        (k) =>
          k.startsWith(AUTH_PREFIX) &&
          typeof (messages as Record<string, unknown>)[k] === "function"
      )
    );

    const missingCodes: string[] = [];
    for (const code of Object.keys(BASE_ERROR_CODES)) {
      if (!messageKeys.has(`${AUTH_PREFIX}${code}`)) {
        missingCodes.push(code);
      }
    }

    expect(missingCodes).toEqual([]);
  });

  test("Paraglide messages cover passkey error codes", () => {
    const passkeyCodeKeys = [
      "CHALLENGE_NOT_FOUND",
      "YOU_ARE_NOT_ALLOWED_TO_REGISTER_THIS_PASSKEY",
      "FAILED_TO_VERIFY_REGISTRATION",
      "PASSKEY_NOT_FOUND",
      "AUTHENTICATION_FAILED",
      "UNABLE_TO_CREATE_SESSION",
      "FAILED_TO_UPDATE_PASSKEY",
    ];

    const messageKeys = new Set(Object.keys(messages));
    const missingCodes: string[] = [];
    for (const code of passkeyCodeKeys) {
      if (!messageKeys.has(`${AUTH_PREFIX}${code}`)) {
        missingCodes.push(code);
      }
    }

    expect(missingCodes).toEqual([]);
  });
});

// --- Auth error responses (uses Better Auth defaults for English) ---

describe("auth error responses", () => {
  const testUserIds: string[] = [];

  afterAll(async () => {
    for (const id of testUserIds) {
      await cleanupTestUser(id);
    }
  });

  test("returns INVALID_EMAIL_OR_PASSWORD on wrong password", async () => {
    const email = uniqueEmail("i18n-wrong-pw");
    const result = await createTestUser({
      email,
      name: "i18n Test",
      password: "password123456",
    });
    testUserIds.push(result.userId);

    const response = await auth.handler(
      new Request("http://localhost/api/auth/sign-in/email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password: "wrongpassword123" }),
      })
    );

    expect(response.ok).toBe(false);
    const body = await response.json();
    expect(body.code).toBe("INVALID_EMAIL_OR_PASSWORD");
  });

  test("returns error code for non-existent user sign-in", async () => {
    const response = await auth.handler(
      new Request("http://localhost/api/auth/sign-in/email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "nonexistent@test.local",
          password: "password123456",
        }),
      })
    );

    expect(response.ok).toBe(false);
    const body = await response.json();
    expect(["INVALID_EMAIL_OR_PASSWORD", "USER_NOT_FOUND"]).toContain(
      body.code
    );
  });

  test("returns error on duplicate signup", async () => {
    const email = uniqueEmail("i18n-dup");
    const result = await createTestUser({
      email,
      name: "i18n Dup Test",
      password: "password123456",
    });
    testUserIds.push(result.userId);

    const response = await auth.handler(
      new Request("http://localhost/api/auth/sign-up/email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          name: "Duplicate",
          password: "password123456",
        }),
      })
    );

    expect(response.ok).toBe(false);
    const body = await response.json();
    expect(body.code).toBe("USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL");
  });
});
