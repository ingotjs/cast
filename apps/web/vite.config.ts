import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import type { PluginOption } from "vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
  plugins: [
    // Reference: https://inlang.com/m/gerre34r/library-inlang-paraglideJs/strategy
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      strategy: ["cookie", "preferredLanguage", "url", "baseLocale"],
    }),
    devtools(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart(),
    nitro({ config: { preset: "bun" } }),
    viteReact({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ] as PluginOption[],
});

export default config;
