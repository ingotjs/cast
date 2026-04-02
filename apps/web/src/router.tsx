import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { detectClientLocale, detectLocale, loadCatalog } from "./lib/i18n";
import type { RouterContext } from "./lib/i18n";
import { routeTree } from "./routeTree.gen";

const getLocale = createIsomorphicFn()
  .server(() => detectLocale(getRequest()))
  .client(() => detectClientLocale());

export const getRouter = async () => {
  const locale = getLocale();
  const i18n = await loadCatalog(locale);

  return createTanStackRouter({
    routeTree,
    context: { i18n } satisfies RouterContext,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });
};

declare module "@tanstack/react-router" {
  // biome-ignore lint/style/useConsistentTypeDefinitions: module augmentation requires interface
  // oxlint-disable-next-line typescript/consistent-type-definitions -- module augmentation requires interface
  interface Register {
    router: Awaited<ReturnType<typeof getRouter>>;
  }
}
