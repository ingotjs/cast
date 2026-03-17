// Reference: https://github.com/TanStack/router/tree/main/examples/react/start-i18n-paraglide

import handler from "@tanstack/react-start/server-entry";

import { paraglideMiddleware } from "./paraglide/server.js";

export default {
  fetch(req: Request): Promise<Response> {
    // TanStack Router handles URL rewriting via deLocalizeUrl/localizeUrl
    // so we pass the original `req` instead of the modified `request`
    return paraglideMiddleware(req, () => handler.fetch(req));
  },
};
