import { existsSync, readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const EMAIL_CAPTURE_DIR = resolve(__dirname, "../../packages/email/.email-captures");

// Reference: https://playwright.dev/docs/test-global-setup-teardown
export default function globalSetup() {
  if (existsSync(EMAIL_CAPTURE_DIR)) {
    for (const file of readdirSync(EMAIL_CAPTURE_DIR)) {
      rmSync(resolve(EMAIL_CAPTURE_DIR, file));
    }
  }
}
