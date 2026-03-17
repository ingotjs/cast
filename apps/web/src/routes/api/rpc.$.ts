import { RPCHandler } from "@orpc/server/fetch";
import { router } from "@packages/server/orpc";
import { createFileRoute } from "@tanstack/react-router";

const handler = new RPCHandler(router);

export const Route = createFileRoute("/api/rpc/$")({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        const { response } = await handler.handle(request, {
          prefix: "/api/rpc",
          context: { headers: request.headers },
        });

        return response ?? new Response("Not Found", { status: 404 });
      },
    },
  },
});
