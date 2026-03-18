import { defineConfig } from "@playwright/test";

// Reference: https://playwright.dev/docs/test-configuration
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.e2e.ts",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
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
