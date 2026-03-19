// Reference: https://github.com/TanStack/router/tree/main/examples/react/start-i18n-paraglide

import { initKv } from "@ingot/auth/kv-storage";
import { initDb } from "@ingot/db";
import handler from "@tanstack/react-start/server-entry";
import { env } from "cloudflare:workers";

import { paraglideMiddleware } from "./paraglide/server.js";

// Initialize bindings from the Workers environment
initDb(env.DB);
initKv(env.SESSION_KV);

export default {
  fetch(req: Request): Promise<Response> {
    // TanStack Router handles URL rewriting via deLocalizeUrl/localizeUrl
    // so we pass the original `req` instead of the modified `request`
    return paraglideMiddleware(req, () => handler.fetch(req));
  },
};
