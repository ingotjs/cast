import { Button, Text } from "@react-email/components";

import { loc } from "../locale";
import * as m from "../paraglide/messages";
import { EmailLayout } from "./email-layout";

type MagicLinkEmailProps = {
  token: string;
  magicLink: string;
  appName: string;
  appUrl: string;
  locale?: string;
};

export const MagicLinkEmail = ({ token, magicLink, appName, appUrl, locale = "en" }: MagicLinkEmailProps) => (
  <EmailLayout
    locale={locale}
    previewText={m.email_magic_link_preview({ appName, token }, loc(locale))}
    appName={appName}
    appUrl={appUrl}
  >
    <Text className="mt-7 mb-0 font-bold text-3xl text-[#1d1c1d]">
      {m.email_magic_link_heading({ appName }, loc(locale))}
    </Text>
    <Text className="mt-8 mb-6 text-black text-lg leading-7">{m.email_magic_link_body({}, loc(locale))}</Text>
    <Text className="my-0 rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-center font-semibold text-black text-xl">
      {token}
    </Text>
    <Button
      href={magicLink}
      className="mt-3.5 mb-0 box-border inline-block w-full rounded-lg bg-black px-4 py-3 text-center font-semibold text-white no-underline"
    >
      {m.email_magic_link_button({}, loc(locale))}
    </Button>
    <Text className="mt-5 mb-0 text-[#444] text-sm">{m.email_magic_link_disclaimer({}, loc(locale))}</Text>
  </EmailLayout>
);

MagicLinkEmail.PreviewProps = {
  token: "ABC-123-DEF-456",
  magicLink: "https://example.com/auth/verify?token=abc123",
  appName: "Start",
  appUrl: "https://example.com",
  locale: "en",
} as MagicLinkEmailProps;

export default MagicLinkEmail;
