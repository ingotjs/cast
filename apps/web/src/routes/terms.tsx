import { consts } from "@ingot/utils/consts";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { createFileRoute } from "@tanstack/react-router";

import { seoMeta } from "../lib/seo";

const { appName } = consts;

const metaTermsTitle = msg`Terms of Service — ${appName}`;
const metaTermsDescription = msg`Terms and conditions for using ${appName}.`;

const TermsPage = () => (
  <main className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
    <h1 className="text-3xl font-bold tracking-tight">
      <Trans>Terms of Service</Trans>
    </h1>
    <p className="mt-2 text-sm text-muted-foreground">
      <Trans>Last updated: March 16, 2026</Trans>
    </p>

    <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
      <h2>
        <Trans>1. Acceptance of Terms</Trans>
      </h2>
      <p>
        <Trans>
          By accessing or using {consts.appName}, you agree to be bound by these Terms of Service. If you do not agree
          to these terms, please do not use the service.
        </Trans>
      </p>

      <h2>
        <Trans>2. Description of Service</Trans>
      </h2>
      <p>
        <Trans>
          {consts.appName} provides a web application platform. We reserve the right to modify, suspend, or discontinue
          any part of the service at any time.
        </Trans>
      </p>

      <h2>
        <Trans>3. User Accounts</Trans>
      </h2>
      <p>
        <Trans>
          You are responsible for maintaining the confidentiality of your account credentials and for all activities
          that occur under your account. You must notify us immediately of any unauthorized use.
        </Trans>
      </p>

      <h2>
        <Trans>4. Acceptable Use</Trans>
      </h2>
      <p>
        <Trans>You agree not to:</Trans>
      </p>
      <ul>
        <li>
          <Trans>Use the service for any unlawful purpose</Trans>
        </li>
        <li>
          <Trans>Attempt to gain unauthorized access to any part of the service</Trans>
        </li>
        <li>
          <Trans>Interfere with the proper functioning of the service</Trans>
        </li>
        <li>
          <Trans>Upload malicious code or content</Trans>
        </li>
      </ul>

      <h2>
        <Trans>5. Intellectual Property</Trans>
      </h2>
      <p>
        <Trans>
          All content, features, and functionality of the service are owned by us and are protected by copyright,
          trademark, and other intellectual property laws.
        </Trans>
      </p>

      <h2>
        <Trans>6. Limitation of Liability</Trans>
      </h2>
      <p>
        <Trans>
          To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages resulting from your use of the service.
        </Trans>
      </p>

      <h2>
        <Trans>7. Changes to Terms</Trans>
      </h2>
      <p>
        <Trans>
          We may update these terms from time to time. Continued use of the service after changes constitutes acceptance
          of the new terms.
        </Trans>
      </p>

      <h2>
        <Trans>8. Contact</Trans>
      </h2>
      <p>
        <Trans>If you have questions about these terms, please contact us through the application.</Trans>
      </p>
    </div>
  </main>
);

export const Route = createFileRoute("/terms")({
  head: (ctx) => ({
    meta: [
      ...seoMeta({
        title: ctx.match.context.i18n._(metaTermsTitle.id, { appName }),
        description: ctx.match.context.i18n._(metaTermsDescription.id, { appName }),
      }),
    ],
  }),
  component: TermsPage,
});
