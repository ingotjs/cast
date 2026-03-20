import { consts } from "@ingot/utils/consts";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { createFileRoute } from "@tanstack/react-router";

import { clientEnv } from "../lib/env";
import { seoMeta } from "../lib/seo";

const { appName } = consts;

const metaPrivacyTitle = msg`Privacy Policy — ${appName}`;
const metaPrivacyDescription = msg`How ${appName} handles your personal information and data.`;

const PrivacyPage = () => (
  <main className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
    <h1 className="text-3xl font-bold tracking-tight">
      <Trans>Privacy Policy</Trans>
    </h1>
    <p className="mt-2 text-sm text-muted-foreground">
      <Trans>Last updated: March 16, 2026</Trans>
    </p>

    <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none [counter-reset:section] [&>h2]:before:[counter-increment:section] [&>h2]:before:content-[counter(section)_'._']">
      <h2>
        <Trans>Information We Collect</Trans>
      </h2>
      <p>
        <Trans>We collect information you provide directly to us, including:</Trans>
      </p>
      <ul>
        <li>
          <Trans>Name and email address when you create an account</Trans>
        </li>
        <li>
          <Trans>Usage data and interaction with the service</Trans>
        </li>
        <li>
          <Trans>Device and browser information</Trans>
        </li>
      </ul>

      <h2>
        <Trans>How We Use Your Information</Trans>
      </h2>
      <p>
        <Trans>We use the information we collect to:</Trans>
      </p>
      <ul>
        <li>
          <Trans>Provide, maintain, and improve the service</Trans>
        </li>
        <li>
          <Trans>Send you technical notices and support messages</Trans>
        </li>
        <li>
          <Trans>Respond to your comments and questions</Trans>
        </li>
        <li>
          <Trans>Detect, investigate, and prevent fraudulent or unauthorized activity</Trans>
        </li>
      </ul>

      <h2>
        <Trans>Information Sharing</Trans>
      </h2>
      <p>
        <Trans>
          We do not sell your personal information. We may share your information only in the following circumstances:
        </Trans>
      </p>
      <ul>
        <li>
          <Trans>With your consent</Trans>
        </li>
        <li>
          <Trans>To comply with legal obligations</Trans>
        </li>
        <li>
          <Trans>To protect our rights, privacy, safety, or property</Trans>
        </li>
      </ul>

      <h2>
        <Trans>Data Security</Trans>
      </h2>
      <p>
        <Trans>
          We implement appropriate technical and organizational measures to protect your personal information against
          unauthorized access, alteration, disclosure, or destruction.
        </Trans>
      </p>

      <h2>
        <Trans>Data Retention</Trans>
      </h2>
      <p>
        <Trans>
          We retain your personal information for as long as your account is active or as needed to provide services.
          You can request deletion of your account and associated data at any time.
        </Trans>
      </p>

      <h2>
        <Trans>Your Rights</Trans>
      </h2>
      <p>
        <Trans>You have the right to:</Trans>
      </p>
      <ul>
        <li>
          <Trans>Access your personal information</Trans>
        </li>
        <li>
          <Trans>Correct inaccurate data</Trans>
        </li>
        <li>
          <Trans>Request deletion of your data</Trans>
        </li>
        <li>
          <Trans>Export your data</Trans>
        </li>
      </ul>

      {clientEnv.posthog && (
        <>
          <h2>
            <Trans>Analytics</Trans>
          </h2>
          <p>
            <Trans>
              We use PostHog for product analytics, error tracking, and to understand how you interact with the service.
              PostHog may collect usage data, device information, and performance metrics. You can opt out of tracking
              by using a browser ad blocker.
            </Trans>
          </p>

          <h2>
            <Trans>International Data Transfers</Trans>
          </h2>
          <p>
            <Trans>
              Your information may be transferred to and processed in the United States, where our analytics provider
              (PostHog) operates. These transfers are protected by Standard Contractual Clauses (SCCs) approved by the
              European Commission, ensuring your data receives an adequate level of protection regardless of where it is
              processed.
            </Trans>
          </p>
        </>
      )}

      <h2>
        <Trans>Cookies</Trans>
      </h2>
      <p>
        <Trans>
          We use essential cookies to maintain your session and preferences. We may also use analytics cookies to
          understand how you use the service.
        </Trans>
      </p>

      <h2>
        <Trans>Changes to This Policy</Trans>
      </h2>
      <p>
        <Trans>
          We may update this privacy policy from time to time. We will notify you of significant changes by posting a
          notice on the service.
        </Trans>
      </p>

      <h2>
        <Trans>Contact</Trans>
      </h2>
      <p>
        <Trans>If you have questions about this privacy policy, please contact us through the application.</Trans>
      </p>
    </div>
  </main>
);

export const Route = createFileRoute("/privacy")({
  head: (ctx) => ({
    meta: [
      ...seoMeta({
        title: ctx.match.context.i18n._(metaPrivacyTitle.id, { appName }),
        description: ctx.match.context.i18n._(metaPrivacyDescription.id, { appName }),
      }),
    ],
  }),
  component: PrivacyPage,
});
