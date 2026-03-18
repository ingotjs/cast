import { publicProcedure } from "../base";

export const health = publicProcedure.handler(() => ({
  status: "ok" as const,
  timestamp: new Date().toISOString(),
}));
