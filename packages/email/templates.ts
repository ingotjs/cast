import { render } from "@react-email/components";
import { createElement } from "react";

import { AccountDeletedEmail } from "./emails/account-deleted";
import { EmailVerificationEmail } from "./emails/email-verification";
import { MagicLinkEmail } from "./emails/magic-link";
import { PasswordChangedEmail } from "./emails/password-changed";
import { ResetPasswordEmail } from "./emails/reset-password";
import { WelcomeEmail } from "./emails/welcome";
import { createEmailI18n } from "./i18n";

type CommonProps = {
  appName: string;
  appUrl: string;
  locale?: string;
};

export const renderResetPasswordEmail = async (props: CommonProps & { resetLink: string }) =>
  render(createElement(ResetPasswordEmail, props));

export const renderMagicLinkEmail = async (props: CommonProps & { token: string; magicLink: string }) =>
  render(createElement(MagicLinkEmail, props));

export const renderEmailVerificationEmail = async (props: CommonProps & { verificationLink: string }) =>
  render(createElement(EmailVerificationEmail, props));

export const renderPasswordChangedEmail = async (props: CommonProps & { resetPasswordLink: string }) =>
  render(createElement(PasswordChangedEmail, props));

export const renderAccountDeletedEmail = async (props: CommonProps) =>
  render(createElement(AccountDeletedEmail, props));

export const renderWelcomeEmail = async (props: CommonProps) => render(createElement(WelcomeEmail, props));

/** Localized email subject lines */
export const getEmailSubject = {
  resetPassword: ({ appName, locale }: { appName: string; locale?: string }) =>
    createEmailI18n(locale)._("Reset your {appName} password", { appName }),
  magicLink: ({ appName, locale }: { appName: string; locale?: string }) =>
    createEmailI18n(locale)._("Your {appName} login link", { appName }),
  verification: ({ appName, locale }: { appName: string; locale?: string }) =>
    createEmailI18n(locale)._("Verify your {appName} email", { appName }),
  passwordChanged: ({ appName, locale }: { appName: string; locale?: string }) =>
    createEmailI18n(locale)._("Your {appName} password was changed", { appName }),
  accountDeleted: ({ appName, locale }: { appName: string; locale?: string }) =>
    createEmailI18n(locale)._("Your {appName} account has been deleted", { appName }),
  welcome: ({ appName, locale }: { appName: string; locale?: string }) =>
    createEmailI18n(locale)._("Welcome to {appName}", { appName }),
};
