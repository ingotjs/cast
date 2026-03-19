import { Button, Text } from "@react-email/components";

import { createEmailI18n } from "../i18n";
import { EmailLayout } from "./email-layout";

type PasswordChangedEmailProps = {
  resetPasswordLink: string;
  appName: string;
  appUrl: string;
  locale?: string;
};

export const PasswordChangedEmail = ({
  resetPasswordLink,
  appName,
  appUrl,
  locale = "en",
}: PasswordChangedEmailProps) => {
  const i18n = createEmailI18n(locale);

  return (
    <EmailLayout
      locale={locale}
      previewText={i18n._("Your {appName} password was changed", { appName })}
      appName={appName}
      appUrl={appUrl}
    >
      <Text className="mt-7 mb-0 font-bold text-3xl text-[#1d1c1d]">{i18n._("Password changed")}</Text>
      <Text className="mt-8 mb-6 text-black text-lg leading-7">
        {i18n._(
          "Your password has been successfully changed. If you did not make this change, please reset your password immediately."
        )}
      </Text>
      <Button
        href={resetPasswordLink}
        className="mt-3.5 mb-0 box-border inline-block w-full rounded-lg bg-black px-4 py-3 text-center font-semibold text-white no-underline"
      >
        {i18n._("Reset Password")}
      </Button>
      <Text className="mt-5 mb-0 text-[#444] text-sm">
        {i18n._("If you made this change, no further action is required.")}
      </Text>
    </EmailLayout>
  );
};

PasswordChangedEmail.PreviewProps = {
  resetPasswordLink: "https://example.com/auth/forgot-password",
  appName: "Start",
  appUrl: "https://example.com",
  locale: "en",
} as PasswordChangedEmailProps;

export default PasswordChangedEmail;
