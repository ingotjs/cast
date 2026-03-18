import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import alchemy from "alchemy/cloudflare/tanstack-start";
import type { PluginOption } from "vite-plus";
import { defineConfig } from "vite-plus";

// Reference: https://alchemy.run/guides/cloudflare-tanstack-start/

const config = defineConfig({
  server: { port: 3000 },
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
