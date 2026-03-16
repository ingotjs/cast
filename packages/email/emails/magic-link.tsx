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

type MagicLinkEmailProps = {
  token: string;
  magicLink: string;
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

export const MagicLinkEmail = ({
  token,
  magicLink,
  appName,
  appUrl,
  previewText,
  heading,
  bodyText,
  buttonLabel = "Sign In with Magic Link",
  disclaimer,
}: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>
      {previewText ?? `Log in to ${appName} with this code: ${token}`}
    </Preview>
    <Tailwind>
      <Body className="bg-gray-50 font-sans">
        <Container className="mx-auto mb-16 bg-white py-5 pb-12">
          <Section className="px-12">
            <Text className="mt-7 mb-0 font-bold text-3xl text-[#1d1c1d]">
              {heading ?? `Login to ${appName}`}
            </Text>
            <Text className="mt-8 mb-6 text-black text-lg leading-7">
              {bodyText ??
                "We received a request to log in to our services. You can use either the following code or link:"}
            </Text>
            <Text className="my-0 rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-center font-semibold text-black text-xl">
              {token}
            </Text>
            <Button
              href={magicLink}
              className="mt-3.5 mb-0 box-border inline-block w-full rounded-lg bg-black px-4 py-3 text-center font-semibold text-white no-underline"
            >
              {buttonLabel}
            </Button>
            <Text className="mt-5 mb-0 text-[#444] text-sm">
              {disclaimer ??
                "If you did not request access to our services, you can safely ignore this email."}
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

MagicLinkEmail.PreviewProps = {
  token: "ABC-123-DEF-456",
  magicLink: "https://example.com/auth/verify?token=abc123",
  appName: "Start",
  appUrl: "https://example.com",
} as MagicLinkEmailProps;

export default MagicLinkEmail;
