import { auth } from "@packages/server/auth";
import { createFileRoute } from "@tanstack/react-router";

// Reference: https://better-auth.com/docs
export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      ANY: ({ request }) => auth.handler(request),
    },
  },
});
