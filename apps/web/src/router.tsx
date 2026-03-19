import { createRouter as createTanStackRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
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
