// Reference: https://github.com/TanStack/router/tree/main/examples/react/start-i18n-paraglide

import { createRouter as createTanStackRouter } from "@tanstack/react-router";

import { deLocalizeUrl, localizeUrl } from "./paraglide/runtime.js";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    rewrite: {
      input: ({ url }) => deLocalizeUrl(url),
      output: ({ url }) => localizeUrl(url),
    },
  });

  return router;
};

declare module "@tanstack/react-router" {
  // biome-ignore lint/style/useConsistentTypeDefinitions: module augmentation requires interface
  // oxlint-disable-next-line typescript/consistent-type-definitions -- module augmentation requires interface
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
