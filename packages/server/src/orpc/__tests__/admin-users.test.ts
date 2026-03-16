import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { createRouterClient, ORPCError } from "@orpc/server";

import {
  cleanupTestUser,
  createTestUser,
  uniqueEmail,
} from "../../__tests__/test-utils";
import { router } from "../router";

// --- Test data ---

const testUserIds: string[] = [];

let adminClient: ReturnType<typeof createRouterClient<typeof router>>;
let userClient: ReturnType<typeof createRouterClient<typeof router>>;
let noAuthClient: ReturnType<typeof createRouterClient<typeof router>>;
let regularUserId: string;

beforeAll(async () => {
  const adminResult = await createTestUser({
    email: uniqueEmail("admin"),
    name: "Test Admin",
    password: "password123456",
    role: "admin",
  });
  testUserIds.push(adminResult.userId);
  adminClient = createRouterClient(router, {
    context: { headers: adminResult.headers },
  });

  const userResult = await createTestUser({
    email: uniqueEmail("user"),
    name: "Test Regular User",
    password: "password123456",
  });
  regularUserId = userResult.userId;
  testUserIds.push(regularUserId);
  userClient = createRouterClient(router, {
    context: { headers: userResult.headers },
  });

  noAuthClient = createRouterClient(router, {
    context: { headers: new Headers() },
  });
});

afterAll(async () => {
  for (const id of testUserIds) {
    await cleanupTestUser(id);
  }
});

// --- Auth middleware tests ---

describe("admin auth middleware", () => {
  test("rejects unauthenticated requests", async () => {
    await expect(
      noAuthClient.admin.users.list({ limit: 10, offset: 0 })
    ).rejects.toThrow(ORPCError);
  });

  test("rejects non-admin users", async () => {
    await expect(
      userClient.admin.users.list({ limit: 10, offset: 0 })
    ).rejects.toThrow(ORPCError);
  });

  test("rejects non-admin with FORBIDDEN code", async () => {
    try {
      await userClient.admin.users.list({ limit: 10, offset: 0 });
      expect.unreachable("Should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(ORPCError);
      expect((error as ORPCError).code).toBe("FORBIDDEN");
    }
  });

  test("rejects unauthenticated with UNAUTHORIZED code", async () => {
    try {
      await noAuthClient.admin.users.list({ limit: 10, offset: 0 });
      expect.unreachable("Should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(ORPCError);
      expect((error as ORPCError).code).toBe("UNAUTHORIZED");
    }
  });
});

// --- listUsers ---

describe("admin.users.list", () => {
  test("lists users for admin", async () => {
    const result = await adminClient.admin.users.list({
      limit: 50,
      offset: 0,
    });

    expect(result.users).toBeDefined();
    expect(Array.isArray(result.users)).toBe(true);
    expect(result.users.length).toBeGreaterThanOrEqual(2);
  });

  test("respects limit parameter", async () => {
    const result = await adminClient.admin.users.list({
      limit: 1,
      offset: 0,
    });

    expect(result.users).toHaveLength(1);
  });

  test("respects offset parameter", async () => {
    const all = await adminClient.admin.users.list({
      limit: 100,
      offset: 0,
    });

    const offset = await adminClient.admin.users.list({
      limit: 100,
      offset: 1,
    });

    expect(offset.users.length).toBe(all.users.length - 1);
  });

  test("applies default limit and offset", async () => {
    const result = await adminClient.admin.users.list({});

    expect(result.users).toBeDefined();
  });

  test("supports search by email", async () => {
    const result = await adminClient.admin.users.list({
      limit: 50,
      offset: 0,
      search: "admin",
    });

    expect(result.users).toBeDefined();
    for (const user of result.users) {
      expect(user.email.toLowerCase()).toContain("admin");
    }
  });
});

// --- banUser ---

describe("admin.users.ban", () => {
  let targetUserId: string;

  beforeAll(async () => {
    const target = await createTestUser({
      email: uniqueEmail("ban-target"),
      name: "Ban Target",
      password: "password123456",
    });
    targetUserId = target.userId;
    testUserIds.push(targetUserId);
  });

  test("bans a user with reason", async () => {
    const result = await adminClient.admin.users.ban({
      userId: targetUserId,
      banReason: "Test ban",
    });

    expect(result.user).toBeDefined();
    expect(result.user.banned).toBe(true);
    expect(result.user.banReason).toBe("Test ban");
  });

  test("bans a user without reason", async () => {
    const result = await adminClient.admin.users.ban({
      userId: targetUserId,
    });

    expect(result.user.banned).toBe(true);
  });
});

// --- unbanUser ---

describe("admin.users.unban", () => {
  let targetUserId: string;

  beforeAll(async () => {
    const target = await createTestUser({
      email: uniqueEmail("unban-target"),
      name: "Unban Target",
      password: "password123456",
    });
    targetUserId = target.userId;
    testUserIds.push(targetUserId);

    await adminClient.admin.users.ban({
      userId: targetUserId,
      banReason: "Pre-ban for unban test",
    });
  });

  test("unbans a banned user", async () => {
    const result = await adminClient.admin.users.unban({
      userId: targetUserId,
    });

    expect(result.user).toBeDefined();
    expect(result.user.banned).toBe(false);
  });
});

// --- setRole ---

describe("admin.users.setRole", () => {
  let targetUserId: string;

  beforeAll(async () => {
    const target = await createTestUser({
      email: uniqueEmail("role-target"),
      name: "Role Target",
      password: "password123456",
    });
    targetUserId = target.userId;
    testUserIds.push(targetUserId);
  });

  test("promotes user to admin", async () => {
    const result = await adminClient.admin.users.setRole({
      userId: targetUserId,
      role: "admin",
    });

    expect(result.user).toBeDefined();
    expect(result.user.role).toBe("admin");
  });

  test("demotes admin to user", async () => {
    const result = await adminClient.admin.users.setRole({
      userId: targetUserId,
      role: "user",
    });

    expect(result.user).toBeDefined();
    expect(result.user.role).toBe("user");
  });
});

// --- removeUser ---

describe("admin.users.remove", () => {
  test("removes a user", async () => {
    const target = await createTestUser({
      email: uniqueEmail("remove-target"),
      name: "Remove Target",
      password: "password123456",
    });

    const result = await adminClient.admin.users.remove({
      userId: target.userId,
    });

    expect(result.success).toBe(true);
  });
});
