import { cloudflare } from "@cloudflare/vite-plugin";
import { DEV_PORT } from "@ingot/utils/consts";
import { lingui } from "@lingui/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import type { PluginOption } from "vite-plus";
import { defineConfig } from "vite-plus";

import { emailCapturePlugin } from "./vite-email-capture-plugin";

// Reference: https://developers.cloudflare.com/workers/frameworks/framework-guides/tanstack-start/

const config = defineConfig({
  server: { port: DEV_PORT },
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    // For posthog
    sourcemap: true,
  },
  plugins: [
    // Filter out Lingui's macro error reporter — it throws during dep scanning
    // before babel transforms apply. Our babel config handles macros correctly.
    ...lingui().filter(
      (p) => typeof p === "object" && "name" in p && p.name !== "vite-plugin-lingui-report-macro-error"
    ),
    emailCapturePlugin(),
    devtools(),
    tailwindcss(),
    cloudflare({
      configPath: "../../wrangler.jsonc",
      persistState: { path: "../../.wrangler/state" },
      viteEnvironment: { name: "ssr" },
    }),
    tanstackStart(),
    viteReact({
      babel: {
        plugins: [["babel-plugin-react-compiler"], ["@lingui/babel-plugin-lingui-macro"]],
      },
    }),
  ] as PluginOption[],
});

export default config;
