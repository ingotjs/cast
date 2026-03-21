import { describe, expect, test } from "bun:test";

import { createRouterClient } from "@orpc/server";

import { router } from "../../index";

const client = createRouterClient(router, {
  context: { headers: new Headers() },
});

describe("health endpoint", () => {
  test("returns status ok", async () => {
    const result = await client.health();

    expect(result.status).toBe("ok");
  });

  test("returns a valid ISO timestamp", async () => {
    const before = new Date().toISOString();
    const result = await client.health();
    const after = new Date().toISOString();

    expect(result.timestamp).toBeDefined();
    expect(result.timestamp >= before).toBe(true);
    expect(result.timestamp <= after).toBe(true);
  });

  test("does not require authentication", async () => {
    const noAuthClient = createRouterClient(router, {
      context: { headers: new Headers() },
    });

    const result = await noAuthClient.health();
    expect(result.status).toBe("ok");
  });
});
