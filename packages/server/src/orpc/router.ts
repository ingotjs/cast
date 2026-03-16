import { adminProcedure, publicProcedure } from "./base";
import {
  banUser,
  listUsers,
  removeUser,
  setRole,
  unbanUser,
} from "./procedures/admin/users";
import { health } from "./procedures/health";

export const router = publicProcedure.router({
  health,
  admin: adminProcedure.router({
    users: adminProcedure.router({
      list: listUsers,
      ban: banUser,
      unban: unbanUser,
      setRole,
      remove: removeUser,
    }),
  }),
});

export type Router = typeof router;
