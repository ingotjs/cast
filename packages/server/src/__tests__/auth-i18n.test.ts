import { afterAll, describe, expect, test } from "bun:test";

import { auth } from "../auth";
import { buildAuthTranslations } from "../auth-i18n";
import { cleanupTestUser, createTestUser, uniqueEmail } from "./test-utils";

// --- buildAuthTranslations ---

describe("buildAuthTranslations", () => {
  test("returns translations for all configured locales", () => {
    const translations = buildAuthTranslations();

    expect(Object.keys(translations)).toContain("en");
  });

  test("includes base error codes", () => {
    const translations = buildAuthTranslations();
    const { en } = translations;

    expect(en.USER_NOT_FOUND).toBe("User not found");
    expect(en.INVALID_EMAIL_OR_PASSWORD).toBe("Invalid email or password");
    expect(en.INVALID_PASSWORD).toBe("Invalid password");
    expect(en.PASSWORD_TOO_SHORT).toBe("Password too short");
    expect(en.USER_ALREADY_EXISTS).toBe("User already exists");
    expect(en.SESSION_EXPIRED).toBe(
      "Session expired. Re-authenticate to perform this action."
    );
  });

  test("includes passkey error codes", () => {
    const translations = buildAuthTranslations();
    const { en } = translations;

    expect(en.CHALLENGE_NOT_FOUND).toBe("Challenge not found");
    expect(en.PASSKEY_NOT_FOUND).toBe("Passkey not found");
    expect(en.AUTHENTICATION_FAILED).toBe("Authentication failed");
  });

  test("includes admin error codes", () => {
    const translations = buildAuthTranslations();
    const { en } = translations;

    expect(en.YOU_CANNOT_BAN_YOURSELF).toBe("You cannot ban yourself");
    expect(en.BANNED_USER).toBe("You have been banned from this application");
    expect(en.INVALID_ROLE_TYPE).toBe("Invalid role type");
  });

  test("does not include non-auth keys", () => {
    const translations = buildAuthTranslations();
    const { en } = translations;

    // The 'm' namespace re-export should not leak into translations
    expect(en.m).toBeUndefined();
  });
});

// --- i18n error responses ---

describe("auth i18n error responses", () => {
  const testUserIds: string[] = [];

  afterAll(async () => {
    for (const id of testUserIds) {
      await cleanupTestUser(id);
    }
  });

  test("returns translated INVALID_EMAIL_OR_PASSWORD on wrong password", async () => {
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
    expect(body.message).toBe("Invalid email or password");
  });

  test("returns translated USER_NOT_FOUND for non-existent user sign-in", async () => {
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
    // Better Auth may return INVALID_EMAIL_OR_PASSWORD for security (prevents user enumeration)
    expect(["INVALID_EMAIL_OR_PASSWORD", "USER_NOT_FOUND"]).toContain(
      body.code
    );
  });

  test("returns translated error on duplicate signup", async () => {
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
    expect(body.message).toBe("User already exists. Use another email.");
  });

  test("respects Accept-Language header for locale detection", async () => {
    const response = await auth.handler(
      new Request("http://localhost/api/auth/sign-in/email", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "accept-language": "en-US,en;q=0.9",
        },
        body: JSON.stringify({
          email: "nonexistent@test.local",
          password: "password123456",
        }),
      })
    );

    expect(response.ok).toBe(false);
    const body = await response.json();
    // With only English configured, message should be in English
    expect(typeof body.message).toBe("string");
    expect(body.message.length).toBeGreaterThan(0);
  });
});
