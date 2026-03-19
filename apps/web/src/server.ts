import { initKv } from "@ingot/auth/kv-storage";
import { initDb } from "@ingot/db";
import handler from "@tanstack/react-start/server-entry";
import { env } from "cloudflare:workers";

import { detectLocale, loadCatalog, runWithI18n } from "./lib/i18n";

// Initialize bindings from the Workers environment
initDb(env.DB);
initKv(env.SESSION_KV);

export default {
  async fetch(req: Request): Promise<Response> {
    const locale = detectLocale(req);
    const i18n = await loadCatalog(locale);
    return runWithI18n(i18n, () => handler.fetch(req));
  },
};
