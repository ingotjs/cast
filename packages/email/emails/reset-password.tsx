import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type ResetPasswordEmailProps = {
  resetLink: string;
  appName: string;
  appUrl: string;
  /** i18n: preview text */
  previewText?: string;
  /** i18n: heading */
  heading?: string;
  /** i18n: body text */
  bodyText?: string;
  /** i18n: button label */
  buttonLabel?: string;
  /** i18n: footer disclaimer */
  disclaimer?: string;
};

export const ResetPasswordEmail = ({
  resetLink,
  appName,
  appUrl,
  previewText,
  heading,
  bodyText,
  buttonLabel = "Reset Password",
  disclaimer,
}: ResetPasswordEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{previewText ?? `Reset your ${appName} password`}</Preview>
    <Tailwind>
      <Body className="bg-gray-50 font-sans">
        <Container className="mx-auto mb-16 bg-white py-5 pb-12">
          <Section className="px-12">
            <Text className="mt-7 mb-0 font-bold text-3xl text-[#1d1c1d]">
              {heading ?? `Reset your ${appName} password`}
            </Text>
            <Text className="mt-8 mb-6 text-black text-lg leading-7">
              {bodyText ??
                "We received a request to reset your password. Click the button below to choose a new password."}
            </Text>
            <Button
              href={resetLink}
              className="mt-3.5 mb-0 box-border inline-block w-full rounded-lg bg-black px-4 py-3 text-center font-semibold text-white no-underline"
            >
              {buttonLabel}
            </Button>
            <Text className="mt-5 mb-0 text-[#444] text-sm">
              {disclaimer ??
                "If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged."}
            </Text>
            <Section className="mx-auto mt-8">
              <Text className="mx-auto mt-3 mb-0 text-center text-[#b7b7b7] text-xs">
                © {new Date().getFullYear()}{" "}
                <Link href={appUrl} className="text-inherit underline">
                  {appName}
                </Link>
                . All Rights Reserved.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

ResetPasswordEmail.PreviewProps = {
  resetLink: "https://example.com/auth/reset-password?token=abc123",
  appName: "Start",
  appUrl: "https://example.com",
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;
