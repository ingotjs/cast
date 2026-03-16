import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createRouterClient } from "@orpc/server";
import type { RouterClient } from "@orpc/server";
import { createRouterUtils } from "@orpc/tanstack-query";
import type { Router } from "@packages/server/orpc";
import { router } from "@packages/server/orpc";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

// Reference: https://orpc.dev/docs/adapters/tanstack-start
const getORPCClient = createIsomorphicFn()
  .server(() =>
    createRouterClient(router, {
      context: () => ({
        headers: getRequestHeaders(),
      }),
    })
  )
  .client(
    (): RouterClient<Router> =>
      createORPCClient(
        new RPCLink({
          url: `${window.location.origin}/api/rpc`,
        })
      )
  );

export const client: RouterClient<Router> = getORPCClient();

export const orpc = createRouterUtils(client);
