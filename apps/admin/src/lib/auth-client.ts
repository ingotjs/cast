import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Reference: https://better-auth.com/docs/reference/client
export const authClient = createAuthClient({
  baseURL: "/",
  plugins: [adminClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
