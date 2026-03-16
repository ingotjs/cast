import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "./db";
import { isDevelopment, serverEnv } from "./env";

// Reference: https://better-auth.com/docs
const DEV_SECRET = "dev-secret-do-not-use-in-production!!";

if (isDevelopment && !serverEnv.BETTER_AUTH_SECRET) {
  console.warn(
    "⚠️  Using dev secret for Better Auth. Set BETTER_AUTH_SECRET in production."
  );
}

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", usePlural: true }),
  secret: serverEnv.BETTER_AUTH_SECRET ?? DEV_SECRET,
  baseURL: serverEnv.BETTER_AUTH_URL ?? serverEnv.URL,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [passkey()],
  // Reference: https://www.better-auth.com/docs/guides/optimizing-for-performance#caching
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
