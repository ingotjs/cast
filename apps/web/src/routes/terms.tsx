import { consts } from "@packages/shared/consts";
import { createFileRoute } from "@tanstack/react-router";

const TermsPage = () => (
  <main className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
    <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
    <p className="mt-2 text-sm text-muted-foreground">
      Last updated: March 16, 2026
    </p>

    <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using {consts.appName}, you agree to be bound by these
        Terms of Service. If you do not agree to these terms, please do not use
        the service.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        {consts.appName} provides a web application platform. We reserve the
        right to modify, suspend, or discontinue any part of the service at any
        time.
      </p>

      <h2>3. User Accounts</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account
        credentials and for all activities that occur under your account. You
        must notify us immediately of any unauthorized use.
      </p>

      <h2>4. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the service for any unlawful purpose</li>
        <li>Attempt to gain unauthorized access to any part of the service</li>
        <li>Interfere with the proper functioning of the service</li>
        <li>Upload malicious code or content</li>
      </ul>

      <h2>5. Intellectual Property</h2>
      <p>
        All content, features, and functionality of the service are owned by us
        and are protected by copyright, trademark, and other intellectual
        property laws.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, we shall not be liable for any
        indirect, incidental, special, consequential, or punitive damages
        resulting from your use of the service.
      </p>

      <h2>7. Changes to Terms</h2>
      <p>
        We may update these terms from time to time. Continued use of the
        service after changes constitutes acceptance of the new terms.
      </p>

      <h2>8. Contact</h2>
      <p>
        If you have questions about these terms, please contact us through the
        application.
      </p>
    </div>
  </main>
);

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});
