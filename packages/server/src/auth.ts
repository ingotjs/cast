import { passkey } from "@better-auth/passkey";
import { createEmailSender } from "@packages/email/send";
import {
  getEmailSubject,
  renderAccountDeletedEmail,
  renderEmailVerificationEmail,
  renderPasswordChangedEmail,
  renderResetPasswordEmail,
  renderWelcomeEmail,
} from "@packages/email/templates";
import { consts } from "@packages/shared/consts";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { admin } from "better-auth/plugins";

import { db } from "./db";
import { captureEmail } from "./email-capture";
import { serverEnv } from "./env";
import { posthog } from "./posthog";

// Reference: https://better-auth.com/docs
// Reference: https://better-auth.com/docs/reference/security

const emailSender = serverEnv.email
  ? createEmailSender({
      apiKey: serverEnv.email.RESEND_API_KEY,
      from: serverEnv.email.EMAIL_FROM,
    })
  : null;

/** Send an email notification, falling back to console.log when email is disabled */
const sendEmailNotification = ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  if (emailSender) {
    // Don't await send — prevents timing attacks
    emailSender.sendHtml({ to, subject, html });
  } else {
    console.log(`[auth] Email to ${to}: ${subject}`);
  }
  // Always capture for E2E test verification
  captureEmail({ to, subject, html });
};

/** Extract locale from a user object (additionalFields are typed as Record<string, unknown> in hooks) */
const getUserLocale = (user: Record<string, unknown>): string =>
  typeof user.locale === "string" ? user.locale : consts.defaultLocale;

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", usePlural: true }),
  secret: serverEnv.BETTER_AUTH_SECRET,
  baseURL: serverEnv.BETTER_AUTH_URL ?? serverEnv.URL,
  trustedOrigins: [serverEnv.URL],
  emailAndPassword: {
    enabled: consts.auth.password,
    // Reference: https://better-auth.com/docs/authentication/email-password#forget-password
    sendResetPassword: async ({ user, url }) => {
      const locale = getUserLocale(user as unknown as Record<string, unknown>);
      const html = await renderResetPasswordEmail({
        resetLink: url,
        appName: consts.appName,
        appUrl: serverEnv.URL,
        locale,
      });
      sendEmailNotification({
        to: user.email,
        subject: getEmailSubject.resetPassword({
          appName: consts.appName,
          locale,
        }),
        html,
      });
    },
  },
  // Reference: https://better-auth.com/docs/authentication/email-password#email-verification
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const locale = getUserLocale(user as unknown as Record<string, unknown>);
      const html = await renderEmailVerificationEmail({
        verificationLink: url,
        appName: consts.appName,
        appUrl: serverEnv.URL,
        locale,
      });
      sendEmailNotification({
        to: user.email,
        subject: getEmailSubject.verification({
          appName: consts.appName,
          locale,
        }),
        html,
      });
    },
  },
  // Reference: https://better-auth.com/docs/plugins/admin
  plugins: [...(consts.auth.passkey ? [passkey()] : []), admin()],
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
      locale: {
        type: "string",
        required: false,
        defaultValue: consts.defaultLocale,
        input: true,
      },
    },
    // Reference: https://better-auth.com/docs/concepts/users#delete-user
    deleteUser: {
      enabled: true,
      afterDelete: async (user) => {
        posthog?.capture({
          distinctId: user.id,
          event: "user_deleted",
          properties: { email: user.email },
        });

        const locale = getUserLocale(user as Record<string, unknown>);
        const html = await renderAccountDeletedEmail({
          appName: consts.appName,
          appUrl: serverEnv.URL,
          locale,
        });
        sendEmailNotification({
          to: user.email,
          subject: getEmailSubject.accountDeleted({
            appName: consts.appName,
            locale,
          }),
          html,
        });
      },
    },
  },
  // Reference: https://better-auth.com/docs/concepts/database-hooks
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          posthog?.capture({
            distinctId: user.id,
            event: "user_created",
            properties: { email: user.email },
          });

          if (!consts.auth.welcomeEmail) {
            return;
          }
          const locale = getUserLocale(user);
          const html = await renderWelcomeEmail({
            appName: consts.appName,
            appUrl: serverEnv.URL,
            locale,
          });
          sendEmailNotification({
            to: user.email,
            subject: getEmailSubject.welcome({
              appName: consts.appName,
              locale,
            }),
            html,
          });
        },
      },
    },
  },
  // Reference: https://better-auth.com/docs/concepts/hooks
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/change-password") {
        const { session } = ctx.context;
        if (!session?.user) {
          return;
        }
        const locale = getUserLocale(session.user as Record<string, unknown>);
        const resetUrl = `${serverEnv.URL}/auth/forgot-password`;
        const html = await renderPasswordChangedEmail({
          resetPasswordLink: resetUrl,
          appName: consts.appName,
          appUrl: serverEnv.URL,
          locale,
        });
        sendEmailNotification({
          to: session.user.email,
          subject: getEmailSubject.passwordChanged({
            appName: consts.appName,
            locale,
          }),
          html,
        });
      }
    }),
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
