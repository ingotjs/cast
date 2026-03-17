import { describe, expect, test } from "bun:test";

import { logger } from "../logger";

describe("logger", () => {
  test("logger has all log methods", () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.debug).toBe("function");
  });
});
