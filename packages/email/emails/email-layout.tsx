import { Body, Container, Head, Html, Link, Preview, Section, Tailwind, Text } from "@react-email/components";
import type { ReactNode } from "react";

import { loc } from "../locale";
import * as m from "../paraglide/messages";

type EmailLayoutProps = {
  locale: string;
  previewText: string;
  appName: string;
  appUrl: string;
  children: ReactNode;
};

export const EmailLayout = ({ locale, previewText, appName, appUrl, children }: EmailLayoutProps) => (
  <Html lang={locale} dir="ltr">
    <Head />
    <Preview>{previewText}</Preview>
    <Tailwind>
      <Body className="bg-gray-50 font-sans">
        <Container className="mx-auto mb-16 bg-white py-5 pb-12">
          <Section className="px-12">
            {children}
            <Section className="mx-auto mt-8">
              <Text className="mx-auto mt-3 mb-0 text-center text-[#b7b7b7] text-xs">
                © {new Date().getFullYear()}{" "}
                <Link href={appUrl} className="text-inherit underline">
                  {appName}
                </Link>
                . {m.email_footer_copyright({}, loc(locale))}
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
