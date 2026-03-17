import { passkeyClient } from "@better-auth/passkey/client";
import { auth } from "@packages/server/auth";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { createAuthClient } from "better-auth/react";

// Reference: https://better-auth.com/docs/reference/client
export const authClient = createAuthClient({
  plugins: [passkeyClient()],
});

export const { signIn, signUp, signOut, useSession, passkey } = authClient;

/**
 * Isomorphic session getter that works during both SSR and CSR.
 * - SSR: calls auth.api.getSession with forwarded request headers
 * - CSR: calls authClient.getSession (uses browser cookies)
 *
 * Reference: https://tanstack.com/start/latest/docs/framework/react/guide/ssr
 */
export const getSession = createIsomorphicFn()
  .server(async () => {
    const session = await auth.api.getSession({
      headers: getRequestHeaders(),
    });
    return session;
  })
  .client(async () => {
    const result = await authClient.getSession();
    return result.data;
  });
