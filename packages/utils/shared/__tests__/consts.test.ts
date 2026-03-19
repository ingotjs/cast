import { describe, expect, test } from "bun:test";

import { consts } from "../consts";

describe("consts", () => {
  test("auth capability flags are defined", () => {
    expect(typeof consts.auth.password).toBe("boolean");
    expect(typeof consts.auth.passkey).toBe("boolean");
  });
});
