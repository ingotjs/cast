import { Button, Text } from "@react-email/components";

import { loc } from "../locale";
import * as m from "../src/paraglide/messages";
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
}: EmailVerificationEmailProps) => (
  <EmailLayout
    locale={locale}
    previewText={m.email_verification_preview({ appName }, loc(locale))}
    appName={appName}
    appUrl={appUrl}
  >
    <Text className="mt-7 mb-0 font-bold text-3xl text-[#1d1c1d]">
      {m.email_verification_heading({}, loc(locale))}
    </Text>
    <Text className="mt-8 mb-6 text-black text-lg leading-7">
      {m.email_verification_body({}, loc(locale))}
    </Text>
    <Button
      href={verificationLink}
      className="mt-3.5 mb-0 box-border inline-block w-full rounded-lg bg-black px-4 py-3 text-center font-semibold text-white no-underline"
    >
      {m.email_verification_button({}, loc(locale))}
    </Button>
    <Text className="mt-5 mb-0 text-[#444] text-sm">
      {m.email_verification_disclaimer({}, loc(locale))}
    </Text>
  </EmailLayout>
);

EmailVerificationEmail.PreviewProps = {
  verificationLink: "https://example.com/auth/verify-email?token=abc123",
  appName: "Start",
  appUrl: "https://example.com",
  locale: "en",
} as EmailVerificationEmailProps;

export default EmailVerificationEmail;
