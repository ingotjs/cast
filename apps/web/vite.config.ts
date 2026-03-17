import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import type { PluginOption } from "vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// PostHog reverse proxy — derive region (us/eu) from VITE_PUBLIC_POSTHOG_HOST
// Reference: https://posthog.com/docs/advanced/proxy
// oxlint-disable-next-line node/no-process-env -- vite config reads env at build time
const phRegion = process.env.VITE_PUBLIC_POSTHOG_HOST?.includes("eu")
  ? "eu"
  : "us";

const config = defineConfig({
  build: {
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
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart(),
    // Reference: https://nitro.build/docs/routing#route-rules
    nitro({
      config: {
        preset: "bun",
        routeRules: {
          "/api/ph/static/**": {
            proxy: `https://${phRegion}-assets.i.posthog.com/static/**`,
          },
          "/api/ph/**": {
            proxy: `https://${phRegion}.i.posthog.com/**`,
          },
        },
      },
    }),
    viteReact({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ] as PluginOption[],
});

export default config;
