import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { DEV_PORT } from "@packages/utils/consts";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import alchemy from "alchemy/cloudflare/tanstack-start";
import type { PluginOption } from "vite-plus";
import { defineConfig } from "vite-plus";

import { emailCapturePlugin } from "./vite-email-capture-plugin";

// Reference: https://alchemy.run/guides/cloudflare-tanstack-start/

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
    // Reference: https://inlang.com/m/gerre34r/library-inlang-paraglideJs/strategy
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      strategy: ["cookie", "preferredLanguage", "url", "baseLocale"],
    }),
    emailCapturePlugin(),
    devtools(),
    tailwindcss(),
    alchemy(),
    tanstackStart(),
    viteReact({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ] as PluginOption[],
});

export default config;
