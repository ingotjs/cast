import { auth } from "@packages/auth";
import { z } from "zod";

import { adminProcedure } from "../../base";

export const listUsers = adminProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
      search: z.string().optional(),
    })
  )
  .handler(async ({ input, context }) => {
    const result = await auth.api.listUsers({
      headers: context.headers,
      query: {
        limit: input.limit,
        offset: input.offset,
        ...(input.search ? { searchValue: input.search, searchField: "email" as const } : {}),
      },
    });
    return result;
  });

export const banUser = adminProcedure
  .input(
    z.object({
      userId: z.string().min(1),
      banReason: z.string().optional(),
    })
  )
  .handler(({ input, context }) =>
    auth.api.banUser({
      headers: context.headers,
      body: {
        userId: input.userId,
        banReason: input.banReason,
      },
    })
  );

export const unbanUser = adminProcedure.input(z.object({ userId: z.string().min(1) })).handler(({ input, context }) =>
  auth.api.unbanUser({
    headers: context.headers,
    body: { userId: input.userId },
  })
);

export const setRole = adminProcedure
  .input(
    z.object({
      userId: z.string().min(1),
      role: z.enum(["user", "admin"]),
    })
  )
  .handler(({ input, context }) =>
    auth.api.setRole({
      headers: context.headers,
      body: { userId: input.userId, role: input.role },
    })
  );

export const removeUser = adminProcedure.input(z.object({ userId: z.string().min(1) })).handler(({ input, context }) =>
  auth.api.removeUser({
    headers: context.headers,
    body: { userId: input.userId },
  })
);
