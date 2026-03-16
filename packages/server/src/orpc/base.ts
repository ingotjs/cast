import { ORPCError, os } from "@orpc/server";

import { auth } from "../auth";

// Reference: https://orpc.dev/docs/integrations/better-auth
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
export const protectedProcedure = base.use(authMiddleware);
export const adminProcedure = base.use(adminMiddleware);
