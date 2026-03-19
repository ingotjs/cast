import { Button, Text } from "@react-email/components";

import { createEmailI18n } from "../i18n";
import { EmailLayout } from "./email-layout";

type WelcomeEmailProps = {
  appName: string;
  appUrl: string;
  locale?: string;
};

export const WelcomeEmail = ({ appName, appUrl, locale = "en" }: WelcomeEmailProps) => {
  const i18n = createEmailI18n(locale);

  return (
    <EmailLayout
      locale={locale}
      previewText={i18n._("Welcome to {appName}", { appName })}
      appName={appName}
      appUrl={appUrl}
    >
      <Text className="mt-7 mb-0 font-bold text-3xl text-[#1d1c1d]">
        {i18n._("Welcome to {appName}!", { appName })}
      </Text>
      <Text className="mt-8 mb-6 text-black text-lg leading-7">
        {i18n._("Thank you for joining {appName}. We're excited to have you on board.", { appName })}
      </Text>
      <Button
        href={appUrl}
        className="mt-3.5 mb-0 box-border inline-block w-full rounded-lg bg-black px-4 py-3 text-center font-semibold text-white no-underline"
      >
        {i18n._("Get Started")}
      </Button>
      <Text className="mt-5 mb-0 text-[#444] text-sm">
        {i18n._("You're receiving this email because you signed up for {appName}.", { appName })}
      </Text>
    </EmailLayout>
  );
};

WelcomeEmail.PreviewProps = {
  appName: "Start",
  appUrl: "https://example.com",
  locale: "en",
} as WelcomeEmailProps;

export default WelcomeEmail;
