// oxlint-disable node/no-process-env
import { defineConfig } from "@playwright/test";

// Reference: https://playwright.dev/docs/test-configuration
export default defineConfig({
  globalSetup: "./global-setup.ts",
  testDir: "./tests",
  testMatch: "**/*.e2e.ts",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  workers: process.env.CI ? 8 : 1000,

  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:2000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "bun dev",
    url: "http://localhost:2000",
    reuseExistingServer: true,
    cwd: "../..",
    timeout: 60_000,
  },
});
