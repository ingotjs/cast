import { passkey } from "@better-auth/passkey";
import { createEmailSender } from "@packages/email/send";
import { renderResetPasswordEmail } from "@packages/email/templates";
import { consts } from "@packages/shared/consts";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

import { db } from "./db";
import { features, serverEnv } from "./env";

// Reference: https://better-auth.com/docs
// Reference: https://better-auth.com/docs/reference/security

const emailSender = serverEnv.email
  ? createEmailSender({
      apiKey: serverEnv.email.RESEND_API_KEY,
      from: serverEnv.email.EMAIL_FROM,
    })
  : null;

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", usePlural: true }),
  secret: serverEnv.BETTER_AUTH_SECRET,
  baseURL: serverEnv.BETTER_AUTH_URL ?? serverEnv.URL,
  trustedOrigins: [serverEnv.URL],
  emailAndPassword: {
    enabled: !!features.password,
    // Reference: https://better-auth.com/docs/authentication/email-password#forget-password
    sendResetPassword: async ({ user, url }) => {
      if (emailSender) {
        const html = await renderResetPasswordEmail({
          resetLink: url,
          appName: consts.appName,
          appUrl: serverEnv.URL,
        });
        // Don't await send — prevents timing attacks
        emailSender.sendHtml({
          to: user.email,
          subject: `Reset your ${consts.appName} password`,
          html,
        });
      } else {
        console.log(`[auth] Reset password link for ${user.email}: ${url}`);
      }
    },
  },
  // Reference: https://better-auth.com/docs/plugins/admin
  plugins: [...(features.passkey ? [passkey()] : []), admin()],
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
