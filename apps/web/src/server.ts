// Reference: https://github.com/TanStack/router/tree/main/examples/react/start-i18n-paraglide

import { initDb } from "@packages/server/db";
import handler from "@tanstack/react-start/server-entry";
import { env } from "cloudflare:workers";

import { paraglideMiddleware } from "./paraglide/server.js";

// Initialize the database with the D1 binding from the Workers environment
initDb(env.DB);

export default {
  fetch(req: Request): Promise<Response> {
    // TanStack Router handles URL rewriting via deLocalizeUrl/localizeUrl
    // so we pass the original `req` instead of the modified `request`
    return paraglideMiddleware(req, () => handler.fetch(req));
  },
};
