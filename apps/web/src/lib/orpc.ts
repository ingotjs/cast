import { createORPCClient, onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createRouterClient } from "@orpc/server";
import type { RouterClient } from "@orpc/server";
import { createRouterUtils } from "@orpc/tanstack-query";
import type { Router } from "@packages/api";
import { router } from "@packages/api";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { toast } from "sonner";

// Reference: https://orpc.dev/docs/adapters/tanstack-start
// Reference: https://orpc.dev/docs/error-handling
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
          interceptors: [
            onError((error) => {
              // oRPC sanitizes non-ORPCError exceptions to INTERNAL_SERVER_ERROR
              // so error.message is always safe to display
              const message = error instanceof Error ? error.message : "Something went wrong";
              toast.error(message);
            }),
          ],
        })
      )
  );

export const client: RouterClient<Router> = getORPCClient();

export const orpc = createRouterUtils(client);
