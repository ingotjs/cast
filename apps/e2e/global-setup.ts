import { existsSync, readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

import { setup } from "@ingot/prospect/setup";

import { routes, testId } from "./coverage";

const EMAIL_CAPTURE_DIR = resolve(__dirname, "../../packages/email/_etc/.email-captures");

const validateCoverage = setup({ testId, routes }, { testDir: resolve(__dirname, "./tests") });

// Reference: https://playwright.dev/docs/test-global-setup-teardown
export default function globalSetup() {
  validateCoverage();

  if (existsSync(EMAIL_CAPTURE_DIR)) {
    for (const file of readdirSync(EMAIL_CAPTURE_DIR)) {
      rmSync(resolve(EMAIL_CAPTURE_DIR, file));
    }
  }
}
