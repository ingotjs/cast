import { createFileRoute } from "@tanstack/react-router";

import { clientEnv } from "../lib/env";
import { seoMeta } from "../lib/seo";
import { m } from "../paraglide/messages";

const PrivacyPage = () => (
  <main className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
    <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
    <p className="mt-2 text-sm text-muted-foreground">Last updated: March 16, 2026</p>

    <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none [counter-reset:section] [&>h2]:before:[counter-increment:section] [&>h2]:before:content-[counter(section)_'._']">
      <h2>Information We Collect</h2>
      <p>We collect information you provide directly to us, including:</p>
      <ul>
        <li>Name and email address when you create an account</li>
        <li>Usage data and interaction with the service</li>
        <li>Device and browser information</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, maintain, and improve the service</li>
        <li>Send you technical notices and support messages</li>
        <li>Respond to your comments and questions</li>
        <li>Detect, investigate, and prevent fraudulent or unauthorized activity</li>
      </ul>

      <h2>Information Sharing</h2>
      <p>
        We do not sell your personal information. We may share your information only in the following circumstances:
      </p>
      <ul>
        <li>With your consent</li>
        <li>To comply with legal obligations</li>
        <li>To protect our rights, privacy, safety, or property</li>
      </ul>

      <h2>Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures to protect your personal information against
        unauthorized access, alteration, disclosure, or destruction.
      </p>

      <h2>Data Retention</h2>
      <p>
        We retain your personal information for as long as your account is active or as needed to provide services. You
        can request deletion of your account and associated data at any time.
      </p>

      <h2>Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal information</li>
        <li>Correct inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Export your data</li>
      </ul>

      {clientEnv.posthog && (
        <>
          <h2>Analytics</h2>
          <p>
            We use PostHog for product analytics, error tracking, and to understand how you interact with the service.
            PostHog may collect usage data, device information, and performance metrics. You can opt out of tracking by
            using a browser ad blocker.
          </p>

          <h2>International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in the United States, where our analytics provider
            (PostHog) operates. These transfers are protected by Standard Contractual Clauses (SCCs) approved by the
            European Commission, ensuring your data receives an adequate level of protection regardless of where it is
            processed.
          </p>
        </>
      )}

      <h2>Cookies</h2>
      <p>
        We use essential cookies to maintain your session and preferences. We may also use analytics cookies to
        understand how you use the service.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this privacy policy from time to time. We will notify you of significant changes by posting a
        notice on the service.
      </p>

      <h2>Contact</h2>
      <p>If you have questions about this privacy policy, please contact us through the application.</p>
    </div>
  </main>
);

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      ...seoMeta({
        title: m.meta_privacy_title(),
        description: m.meta_privacy_description(),
      }),
    ],
  }),
  component: PrivacyPage,
});
