import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

import { db } from "./db";
import { serverEnv } from "./env";

// Reference: https://better-auth.com/docs
// Reference: https://better-auth.com/docs/reference/security

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", usePlural: true }),
  secret: serverEnv.BETTER_AUTH_SECRET,
  baseURL: serverEnv.BETTER_AUTH_URL ?? serverEnv.URL,
  trustedOrigins: [serverEnv.URL],
  emailAndPassword: {
    enabled: true,
  },
  // Reference: https://better-auth.com/docs/plugins/admin
  plugins: [passkey(), admin()],
  // Reference: https://better-auth.com/docs/concepts/session-management
  session: {
    // 30 days
    expiresIn: 60 * 60 * 24 * 30,
    // Refresh after 1 day
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      // 5 minutes
      maxAge: 5 * 60,
    },
  },
  // Reference: https://better-auth.com/docs/concepts/typescript#additional-fields
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
