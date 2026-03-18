import { getLogger } from "@orpc/experimental-pino";
import { ORPCError, os } from "@orpc/server";
import { auth } from "@packages/auth";

// Reference: https://orpc.dev/docs/integrations/better-auth
// Reference: https://orpc.dev/docs/integrations/pino
// Note: LoggerContext is injected at the handler level by LoggingHandlerPlugin,
// not in the base context type. Use getLogger(context) to access the logger.
const base = os.$context<{ headers: Headers }>();

const authMiddleware = base.middleware(async ({ context, next }) => {
  const sessionData = await auth.api.getSession({
    headers: context.headers,
  });

  if (!sessionData?.session || !sessionData?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  return next({
    context: {
      session: sessionData.session,
      user: sessionData.user,
    },
  });
});

// Reference: https://better-auth.com/docs/plugins/admin
const adminMiddleware = base.middleware(async ({ context, next }) => {
  const sessionData = await auth.api.getSession({
    headers: context.headers,
  });

  if (!sessionData?.session || !sessionData?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  if (sessionData.user.role !== "admin") {
    throw new ORPCError("FORBIDDEN", { message: "Admin access required" });
  }

  return next({
    context: {
      session: sessionData.session,
      user: sessionData.user,
    },
  });
});

export const publicProcedure = base;
/** @public */
export const protectedProcedure = base.use(authMiddleware);
export const adminProcedure = base.use(adminMiddleware);

/** @public Get the Pino logger from procedure context (injected by LoggingHandlerPlugin) */
export { getLogger };
