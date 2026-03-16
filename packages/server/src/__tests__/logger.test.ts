import { describe, expect, test } from "bun:test";

import { logger } from "../logger";

describe("logger", () => {
  test("logger is a pino instance", () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.debug).toBe("function");
  });

  test("log level is debug in dev", () => {
    expect(logger.level).toBe("debug");
  });

  test("can create child loggers", () => {
    const child = logger.child({ requestId: "test-123" });
    expect(child).toBeDefined();
    expect(typeof child.info).toBe("function");
  });
});
