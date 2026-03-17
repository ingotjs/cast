import { describe, expect, test } from "bun:test";

import { consts } from "../consts";

describe("consts", () => {
  test("appName is set", () => {
    expect(consts.appName).toBe("OmegaStart");
  });

  test("auth capability flags are defined", () => {
    expect(typeof consts.auth.password).toBe("boolean");
    expect(typeof consts.auth.passkey).toBe("boolean");
    expect(typeof consts.auth.magicLink).toBe("boolean");
  });
});
