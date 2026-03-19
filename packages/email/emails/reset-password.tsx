import { Button, Text } from "@react-email/components";

import { createEmailI18n } from "../i18n";
import { EmailLayout } from "./email-layout";

type ResetPasswordEmailProps = {
  resetLink: string;
  appName: string;
  appUrl: string;
  locale?: string;
};

export const ResetPasswordEmail = ({ resetLink, appName, appUrl, locale = "en" }: ResetPasswordEmailProps) => {
  const i18n = createEmailI18n(locale);

  return (
    <EmailLayout
      locale={locale}
      previewText={i18n._("Reset your {appName} password", { appName })}
      appName={appName}
      appUrl={appUrl}
    >
      <Text className="mt-7 mb-0 font-bold text-3xl text-[#1d1c1d]">
        {i18n._("Reset your {appName} password", { appName })}
      </Text>
      <Text className="mt-8 mb-6 text-black text-lg leading-7">
        {i18n._("We received a request to reset your password. Click the button below to choose a new password.")}
      </Text>
      <Button
        href={resetLink}
        className="mt-3.5 mb-0 box-border inline-block w-full rounded-lg bg-black px-4 py-3 text-center font-semibold text-white no-underline"
      >
        {i18n._("Reset Password")}
      </Button>
      <Text className="mt-5 mb-0 text-[#444] text-sm">
        {i18n._(
          "If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged."
        )}
      </Text>
    </EmailLayout>
  );
};

ResetPasswordEmail.PreviewProps = {
  resetLink: "https://example.com/auth/reset-password?token=abc123",
  appName: "Start",
  appUrl: "https://example.com",
  locale: "en",
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;
