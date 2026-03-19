import { Button, Text } from "@react-email/components";

import { createEmailI18n } from "../i18n";
import { EmailLayout } from "./email-layout";

type EmailVerificationEmailProps = {
  verificationLink: string;
  appName: string;
  appUrl: string;
  locale?: string;
};

export const EmailVerificationEmail = ({
  verificationLink,
  appName,
  appUrl,
  locale = "en",
}: EmailVerificationEmailProps) => {
  const i18n = createEmailI18n(locale);

  return (
    <EmailLayout
      locale={locale}
      previewText={i18n._("Verify your {appName} email address", { appName })}
      appName={appName}
      appUrl={appUrl}
    >
      <Text className="mt-7 mb-0 font-bold text-3xl text-[#1d1c1d]">{i18n._("Verify your email address")}</Text>
      <Text className="mt-8 mb-6 text-black text-lg leading-7">
        {i18n._("Please verify your email address by clicking the button below.")}
      </Text>
      <Button
        href={verificationLink}
        className="mt-3.5 mb-0 box-border inline-block w-full rounded-lg bg-black px-4 py-3 text-center font-semibold text-white no-underline"
      >
        {i18n._("Verify Email")}
      </Button>
      <Text className="mt-5 mb-0 text-[#444] text-sm">
        {i18n._("If you did not create an account, you can safely ignore this email.")}
      </Text>
    </EmailLayout>
  );
};

EmailVerificationEmail.PreviewProps = {
  verificationLink: "https://example.com/auth/verify-email?token=abc123",
  appName: "Start",
  appUrl: "https://example.com",
  locale: "en",
} as EmailVerificationEmailProps;

export default EmailVerificationEmail;
