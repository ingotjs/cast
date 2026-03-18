import { Button, Text } from "@react-email/components";

import { loc } from "../locale";
import * as m from "../src/paraglide/messages";
import { EmailLayout } from "./email-layout";

type WelcomeEmailProps = {
  appName: string;
  appUrl: string;
  locale?: string;
};

export const WelcomeEmail = ({ appName, appUrl, locale = "en" }: WelcomeEmailProps) => (
  <EmailLayout
    locale={locale}
    previewText={m.email_welcome_preview({ appName }, loc(locale))}
    appName={appName}
    appUrl={appUrl}
  >
    <Text className="mt-7 mb-0 font-bold text-3xl text-[#1d1c1d]">
      {m.email_welcome_heading({ appName }, loc(locale))}
    </Text>
    <Text className="mt-8 mb-6 text-black text-lg leading-7">{m.email_welcome_body({ appName }, loc(locale))}</Text>
    <Button
      href={appUrl}
      className="mt-3.5 mb-0 box-border inline-block w-full rounded-lg bg-black px-4 py-3 text-center font-semibold text-white no-underline"
    >
      {m.email_welcome_button({}, loc(locale))}
    </Button>
    <Text className="mt-5 mb-0 text-[#444] text-sm">{m.email_welcome_disclaimer({ appName }, loc(locale))}</Text>
  </EmailLayout>
);

WelcomeEmail.PreviewProps = {
  appName: "Start",
  appUrl: "https://example.com",
  locale: "en",
} as WelcomeEmailProps;

export default WelcomeEmail;
