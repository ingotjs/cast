import { afterAll, beforeAll, describe, expect, mock, test } from "bun:test";

import { auth } from "../auth";
import { cleanupTestUser, createTestUser, uniqueEmail } from "./test-utils";

// Spy on console.log to verify email notifications (emailSender is null in test)
const consoleSpy = mock(() => {});
const originalLog = console.log;

beforeAll(() => {
  console.log = (...args: unknown[]) => {
    consoleSpy(...args);
    // Still log to see output during test development
    originalLog(...args);
  };
});

afterAll(() => {
  console.log = originalLog;
});

/** Helper to check if a console.log call contains a specific email notification */
const findEmailLog = (toEmail: string, subjectContains: string): boolean =>
  consoleSpy.mock.calls.some(
    (call) =>
      typeof call[0] === "string" &&
      call[0].includes(`[auth] Email to ${toEmail}`) &&
      call[0].includes(subjectContains)
  );

// --- Welcome email ---

describe("welcome email", () => {
  const testUserIds: string[] = [];

  afterAll(async () => {
    for (const id of testUserIds) {
      await cleanupTestUser(id);
    }
  });

  test("sends welcome email on user creation", async () => {
    consoleSpy.mockClear();
    const email = uniqueEmail("welcome");
    const result = await createTestUser({
      email,
      name: "Welcome Test",
      password: "password123456",
    });
    testUserIds.push(result.userId);

    expect(findEmailLog(email, "Welcome")).toBe(true);
  });
});

// --- Email verification ---

describe("email verification", () => {
  const testUserIds: string[] = [];

  afterAll(async () => {
    for (const id of testUserIds) {
      await cleanupTestUser(id);
    }
  });

  test("sends verification email on signup", async () => {
    consoleSpy.mockClear();
    const email = uniqueEmail("verify");
    const result = await createTestUser({
      email,
      name: "Verify Test",
      password: "password123456",
    });
    testUserIds.push(result.userId);

    expect(findEmailLog(email, "Verify")).toBe(true);
  });
});

// --- Password changed notification ---

describe("password changed notification", () => {
  const testUserIds: string[] = [];
  let userHeaders: Headers;
  let userEmail: string;

  beforeAll(async () => {
    userEmail = uniqueEmail("pwchange");
    const result = await createTestUser({
      email: userEmail,
      name: "PW Change Test",
      password: "password123456",
    });
    testUserIds.push(result.userId);
    userHeaders = result.headers;
  });

  afterAll(async () => {
    for (const id of testUserIds) {
      await cleanupTestUser(id);
    }
  });

  test("sends notification after password change", async () => {
    consoleSpy.mockClear();

    const response = await auth.handler(
      new Request("http://localhost/api/auth/change-password", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          cookie: userHeaders.get("cookie") ?? "",
        },
        body: JSON.stringify({
          currentPassword: "password123456",
          newPassword: "newpassword123456",
        }),
      })
    );

    expect(response.ok).toBe(true);
    expect(findEmailLog(userEmail, "password was changed")).toBe(true);
  });
});

// --- Account deleted notification ---

describe("account deleted notification", () => {
  test("sends notification after account deletion", async () => {
    const email = uniqueEmail("delete");
    const result = await createTestUser({
      email,
      name: "Delete Test",
      password: "password123456",
    });

    consoleSpy.mockClear();

    const response = await auth.handler(
      new Request("http://localhost/api/auth/delete-user", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          cookie: result.headers.get("cookie") ?? "",
        },
        body: JSON.stringify({
          password: "password123456",
        }),
      })
    );

    expect(response.ok).toBe(true);
    expect(findEmailLog(email, "deleted")).toBe(true);
  });
});
