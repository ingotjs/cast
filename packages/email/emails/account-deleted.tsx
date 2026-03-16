import { Text } from "@react-email/components";

import { loc } from "../locale";
import * as m from "../src/paraglide/messages";
import { EmailLayout } from "./email-layout";

type AccountDeletedEmailProps = {
  appName: string;
  appUrl: string;
  locale?: string;
};

export const AccountDeletedEmail = ({
  appName,
  appUrl,
  locale = "en",
}: AccountDeletedEmailProps) => (
  <EmailLayout
    locale={locale}
    previewText={m.email_account_deleted_preview({ appName }, loc(locale))}
    appName={appName}
    appUrl={appUrl}
  >
    <Text className="mt-7 mb-0 font-bold text-3xl text-[#1d1c1d]">
      {m.email_account_deleted_heading({}, loc(locale))}
    </Text>
    <Text className="mt-8 mb-6 text-black text-lg leading-7">
      {m.email_account_deleted_body({}, loc(locale))}
    </Text>
    <Text className="mt-5 mb-0 text-[#444] text-sm">
      {m.email_account_deleted_disclaimer({}, loc(locale))}
    </Text>
  </EmailLayout>
);

AccountDeletedEmail.PreviewProps = {
  appName: "Start",
  appUrl: "https://example.com",
  locale: "en",
} as AccountDeletedEmailProps;

export default AccountDeletedEmail;
