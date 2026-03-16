import { passkeyClient } from "@better-auth/passkey/client";
import { createAuthClient } from "better-auth/react";

// Reference: https://better-auth.com/docs/reference/client
export const authClient = createAuthClient({
  baseURL: "/",
  plugins: [passkeyClient()],
});

export const { signIn, signUp, signOut, useSession, passkey } = authClient;
