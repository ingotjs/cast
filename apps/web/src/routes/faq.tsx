import { consts } from "@ingot/utils/consts";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { createFileRoute } from "@tanstack/react-router";

import { getI18n } from "../lib/i18n";
import { seoMeta } from "../lib/seo";

const { appName } = consts;

const metaFaqTitle = msg`FAQ — ${appName}`;
const metaFaqDescription = msg`Frequently asked questions about ${appName}, the modern full-stack TypeScript starter.`;

const faqHeading = msg`Frequently Asked Questions`;
const faqSubheading = msg`Everything you need to know about ${appName}.`;

const faqQWhatIs = msg`What is ${appName}?`;
const faqAWhatIs = msg`${appName} is a production-ready, full-stack TypeScript starter built on TanStack Start, Bun, and Turborepo. It comes with authentication, API layer, database, transactional emails, internationalization, logging, CI/CD, and deployment pre-configured and working together.`;
const faqQTechStack = msg`What tech stack does ${appName} use?`;
const faqATechStack = msg`TanStack Start (Vite + TanStack Router + Nitro) for the framework, Drizzle ORM with PGlite/PostgreSQL for the database, Better Auth for authentication, oRPC for type-safe APIs, React Email + Resend for transactional emails, Lingui for i18n, and Tailwind CSS + shadcn for the UI.`;
const faqQGetStarted = msg`How do I get started?`;
const faqAGetStarted = msg`Run 'bun install' and 'bun dev'. PGlite creates a local PostgreSQL database automatically — no Docker or external services needed. Your app will be running at localhost:2000 in seconds.`;
const faqQAuth = msg`What authentication methods are supported?`;
const faqAAuth = msg`Email/password authentication and passkeys (WebAuthn) out of the box, powered by Better Auth. Additional providers like Google OAuth and magic links are available via feature flags.`;
const faqQOpenSource = msg`Is ${appName} free and open source?`;
const faqAOpenSource = msg`Yes, ${appName} is completely free and open source. You can use it for personal projects, commercial applications, or anything in between.`;
const faqQDeploy = msg`How do I deploy ${appName}?`;
const faqADeploy = msg`Cloudflare Workers is the deployment target. Create a D1 database, set your BETTER_AUTH_SECRET, and deploy with wrangler. Migrations are applied via 'wrangler d1 migrations apply'. The deployment is pre-configured in wrangler.jsonc.`;

const FAQPage = () => {
  const { i18n } = useLingui();

  const faqs = [
    { question: i18n._(faqQWhatIs.id, { appName }), answer: i18n._(faqAWhatIs.id, { appName }) },
    { question: i18n._(faqQTechStack.id, { appName }), answer: i18n._(faqATechStack.id) },
    { question: i18n._(faqQGetStarted.id), answer: i18n._(faqAGetStarted.id) },
    { question: i18n._(faqQAuth.id), answer: i18n._(faqAAuth.id) },
    { question: i18n._(faqQOpenSource.id, { appName }), answer: i18n._(faqAOpenSource.id, { appName }) },
    { question: i18n._(faqQDeploy.id, { appName }), answer: i18n._(faqADeploy.id) },
  ];

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight">{i18n._(faqHeading.id)}</h1>
      <p className="mt-2 text-muted-foreground">{i18n._(faqSubheading.id, { appName })}</p>

      <div className="mt-8 space-y-8">
        {faqs.map((faq) => (
          <section key={faq.question}>
            <h2 className="text-lg font-semibold">{faq.question}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">{faq.answer}</p>
          </section>
        ))}
      </div>
    </main>
  );
};

export const Route = createFileRoute("/faq")({
  head: () => {
    const i18n = getI18n();
    const faqs = [
      { question: i18n._(faqQWhatIs.id, { appName }), answer: i18n._(faqAWhatIs.id, { appName }) },
      { question: i18n._(faqQTechStack.id, { appName }), answer: i18n._(faqATechStack.id) },
      { question: i18n._(faqQGetStarted.id), answer: i18n._(faqAGetStarted.id) },
      { question: i18n._(faqQAuth.id), answer: i18n._(faqAAuth.id) },
      { question: i18n._(faqQOpenSource.id, { appName }), answer: i18n._(faqAOpenSource.id, { appName }) },
      { question: i18n._(faqQDeploy.id, { appName }), answer: i18n._(faqADeploy.id) },
    ];

    return {
      meta: [
        ...seoMeta({
          title: i18n._(metaFaqTitle.id, { appName }),
          description: i18n._(metaFaqDescription.id, { appName }),
        }),
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        },
      ],
    };
  },
  component: FAQPage,
});
