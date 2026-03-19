import { Button, Text } from "@react-email/components";

import { createEmailI18n } from "../i18n";
import { EmailLayout } from "./email-layout";

type MagicLinkEmailProps = {
  token: string;
  magicLink: string;
  appName: string;
  appUrl: string;
  locale?: string;
};

export const MagicLinkEmail = ({ token, magicLink, appName, appUrl, locale = "en" }: MagicLinkEmailProps) => {
  const i18n = createEmailI18n(locale);

  return (
    <EmailLayout
      locale={locale}
      previewText={i18n._("Log in to {appName} with this code: {token}", { appName, token })}
      appName={appName}
      appUrl={appUrl}
    >
      <Text className="mt-7 mb-0 font-bold text-3xl text-[#1d1c1d]">{i18n._("Login to {appName}", { appName })}</Text>
      <Text className="mt-8 mb-6 text-black text-lg leading-7">
        {i18n._("We received a request to log in to our services. You can use either the following code or link:")}
      </Text>
      <Text className="my-0 rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-center font-semibold text-black text-xl">
        {token}
      </Text>
      <Button
        href={magicLink}
        className="mt-3.5 mb-0 box-border inline-block w-full rounded-lg bg-black px-4 py-3 text-center font-semibold text-white no-underline"
      >
        {i18n._("Sign In with Magic Link")}
      </Button>
      <Text className="mt-5 mb-0 text-[#444] text-sm">
        {i18n._("If you did not request access to our services, you can safely ignore this email.")}
      </Text>
    </EmailLayout>
  );
};

MagicLinkEmail.PreviewProps = {
  token: "ABC-123-DEF-456",
  magicLink: "https://example.com/auth/verify?token=abc123",
  appName: "Start",
  appUrl: "https://example.com",
  locale: "en",
} as MagicLinkEmailProps;

export default MagicLinkEmail;
