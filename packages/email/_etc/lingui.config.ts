import { defineConfig } from "@lingui/cli";

export default defineConfig({
  locales: ["en"],
  sourceLocale: "en",
  catalogs: [
    {
      path: "<rootDir>/locales/{locale}/messages",
      include: [".."],
      exclude: ["**/node_modules/**"],
    },
  ],
}) as ReturnType<typeof defineConfig>;
