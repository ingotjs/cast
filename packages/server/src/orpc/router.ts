import { publicProcedure } from "./base";
import { health } from "./procedures/health";

export const router = publicProcedure.router({
  health,
});

export type Router = typeof router;
