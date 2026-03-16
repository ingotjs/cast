import { os } from "@orpc/server";

import { health } from "./procedures/health";

export const router = os.router({
  health,
});

export type Router = typeof router;
