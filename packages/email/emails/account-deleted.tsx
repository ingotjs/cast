import { Text } from "@react-email/components";

import { createEmailI18n } from "../i18n";
import { EmailLayout } from "./email-layout";

type AccountDeletedEmailProps = {
  appName: string;
  appUrl: string;
  locale?: string;
};

export const AccountDeletedEmail = ({ appName, appUrl, locale = "en" }: AccountDeletedEmailProps) => {
  const i18n = createEmailI18n(locale);

  return (
    <EmailLayout
      locale={locale}
      previewText={i18n._("Your {appName} account has been deleted", { appName })}
      appName={appName}
      appUrl={appUrl}
    >
      <Text className="mt-7 mb-0 font-bold text-3xl text-[#1d1c1d]">{i18n._("Account deleted")}</Text>
      <Text className="mt-8 mb-6 text-black text-lg leading-7">
        {i18n._("Your account and all associated data have been permanently deleted. We're sorry to see you go.")}
      </Text>
      <Text className="mt-5 mb-0 text-[#444] text-sm">
        {i18n._("If you did not request this, please contact support immediately.")}
      </Text>
    </EmailLayout>
  );
};

AccountDeletedEmail.PreviewProps = {
  appName: "Start",
  appUrl: "https://example.com",
  locale: "en",
} as AccountDeletedEmailProps;

export default AccountDeletedEmail;
