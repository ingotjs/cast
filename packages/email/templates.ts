import { render } from "@react-email/components";
import { createElement } from "react";

import { AccountDeletedEmail } from "./emails/account-deleted";
import { EmailVerificationEmail } from "./emails/email-verification";
import { MagicLinkEmail } from "./emails/magic-link";
import { PasswordChangedEmail } from "./emails/password-changed";
import { ResetPasswordEmail } from "./emails/reset-password";
import { WelcomeEmail } from "./emails/welcome";
import { loc } from "./locale";
import * as m from "./src/paraglide/messages";

type CommonProps = {
  appName: string;
  appUrl: string;
  locale?: string;
};

export const renderResetPasswordEmail = (
  props: CommonProps & { resetLink: string }
) => render(createElement(ResetPasswordEmail, props));

export const renderMagicLinkEmail = (
  props: CommonProps & { token: string; magicLink: string }
) => render(createElement(MagicLinkEmail, props));

export const renderEmailVerificationEmail = (
  props: CommonProps & { verificationLink: string }
) => render(createElement(EmailVerificationEmail, props));

export const renderPasswordChangedEmail = (
  props: CommonProps & { resetPasswordLink: string }
) => render(createElement(PasswordChangedEmail, props));

export const renderAccountDeletedEmail = (props: CommonProps) =>
  render(createElement(AccountDeletedEmail, props));

export const renderWelcomeEmail = (props: CommonProps) =>
  render(createElement(WelcomeEmail, props));

/** Localized email subject lines */
export const getEmailSubject = {
  resetPassword: ({ appName, locale }: { appName: string; locale?: string }) =>
    m.email_subject_reset_password({ appName }, loc(locale ?? "en")),
  magicLink: ({ appName, locale }: { appName: string; locale?: string }) =>
    m.email_subject_magic_link({ appName }, loc(locale ?? "en")),
  verification: ({ appName, locale }: { appName: string; locale?: string }) =>
    m.email_subject_verification({ appName }, loc(locale ?? "en")),
  passwordChanged: ({
    appName,
    locale,
  }: {
    appName: string;
    locale?: string;
  }) => m.email_subject_password_changed({ appName }, loc(locale ?? "en")),
  accountDeleted: ({ appName, locale }: { appName: string; locale?: string }) =>
    m.email_subject_account_deleted({ appName }, loc(locale ?? "en")),
  welcome: ({ appName, locale }: { appName: string; locale?: string }) =>
    m.email_subject_welcome({ appName }, loc(locale ?? "en")),
};
