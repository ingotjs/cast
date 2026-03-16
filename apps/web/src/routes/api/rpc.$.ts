import { LoggingHandlerPlugin } from "@orpc/experimental-pino";
import { RPCHandler } from "@orpc/server/fetch";
import { logger } from "@packages/server/logger";
import { router } from "@packages/server/orpc";
import { createFileRoute } from "@tanstack/react-router";

// Reference: https://orpc.dev/docs/integrations/pino
const handler = new RPCHandler(router, {
  plugins: [
    new LoggingHandlerPlugin({
      logger,
      generateId: () => crypto.randomUUID(),
      logRequestResponse: true,
      logRequestAbort: true,
    }),
  ],
});

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
