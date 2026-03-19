import { defineConfig } from "@lingui/cli";

// Reference: https://lingui.dev/ref/conf

export default defineConfig({
  locales: ["en"],
  sourceLocale: "en",
  catalogs: [
    {
      path: "<rootDir>/apps/web/src/locales/{locale}/messages",
      include: ["apps/web/src/**/*.{ts,tsx}"],
    },
    {
      path: "<rootDir>/packages/email/locales/{locale}/messages",
      include: ["packages/email/**/*.{ts,tsx}"],
      exclude: ["**/node_modules/**", "**/locales/**"],
    },
  ],
});
