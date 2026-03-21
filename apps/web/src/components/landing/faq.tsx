import { Trans, useLingui } from "@lingui/react/macro";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";

export const Faq = () => {
  const { t } = useLingui();

  const items = [
    {
      question: t`What's included in the starter?`,
      answer: t`Authentication (email, passkey, magic link, OAuth), database (Drizzle + D1), API (oRPC), transactional email (React Email + Resend), i18n (Lingui), analytics (PostHog), and Cloudflare Workers deployment.`,
    },
    {
      question: t`Can I use this for commercial projects?`,
      answer: t`Yes. This starter is MIT licensed. Use it for personal or commercial projects, modify it freely, and ship without restrictions.`,
    },
    {
      question: t`How do I customize the design?`,
      answer: t`Edit the CSS variables in styles.css to change colors, or modify the Tailwind theme. Components use shadcn/ui which you can customize or replace.`,
    },
    {
      question: t`What database does it use?`,
      answer: t`Cloudflare D1 (SQLite at the edge) with Drizzle ORM. Schemas are type-safe and generate Zod validators automatically.`,
    },
    {
      question: t`Is it production-ready?`,
      answer: t`Yes. It deploys to Cloudflare's global edge network with built-in error tracking, analytics, and observability. The CI pipeline runs type checks, linting, and tests.`,
    },
  ];

  return (
    <section className="border-[var(--line)] border-t px-4 py-16 sm:py-24">
      <div className="page-wrap">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="island-kicker mb-3">
              <Trans>FAQ</Trans>
            </p>
            <h2 className="display-title mb-4 font-bold text-3xl text-[var(--sea-ink)] tracking-tight sm:text-4xl">
              <Trans>Common questions</Trans>
            </h2>
            <p className="mb-6 text-[var(--sea-ink-soft)] leading-relaxed">
              <Trans>Can&apos;t find what you&apos;re looking for? Check the docs or reach out.</Trans>
            </p>
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-2.5 font-semibold text-sm text-[var(--sea-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[rgba(50,143,151,0.4)]"
              data-testid="home-link-faq-all"
            >
              <Trans>View all FAQ</Trans>
            </Link>
          </div>

          <div className="divide-y divide-[var(--line)]">
            {items.map(({ question, answer }) => (
              <details key={question} name="faq" className="group">
                <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 font-medium text-[var(--sea-ink)]">
                  {question}
                  <ChevronDown className="size-4 shrink-0 text-[var(--sea-ink-soft)] transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-0 pb-5 text-sm text-[var(--sea-ink-soft)] leading-relaxed">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
