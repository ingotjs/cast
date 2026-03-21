import { Trans, useLingui } from "@lingui/react/macro";
import { Code2, Globe, Paintbrush, Shield, Terminal, Zap } from "lucide-react";

export const Features = () => {
  const { t } = useLingui();

  const features = [
    {
      icon: Shield,
      title: t`Authentication`,
      description: t`Email, passkey, magic link, and OAuth — all pre-configured with Better Auth.`,
    },
    {
      icon: Code2,
      title: t`Type-Safe API`,
      description: t`End-to-end type safety from database to frontend with oRPC and TanStack Query.`,
    },
    {
      icon: Globe,
      title: t`Internationalization`,
      description: t`Full i18n support with Lingui across UI, emails, and server-side rendering.`,
    },
    {
      icon: Zap,
      title: t`Edge Deployment`,
      description: t`Deploy globally on Cloudflare Workers with D1, KV, and R2 storage built in.`,
    },
    {
      icon: Paintbrush,
      title: t`Modern UI`,
      description: t`Tailwind CSS v4, shadcn components, and dark mode — ready for production.`,
    },
    {
      icon: Terminal,
      title: t`Developer Experience`,
      description: t`Hot reload, type checking with tsgo, testing with Bun, and one-command deployment.`,
    },
  ];

  return (
    <section className="border-[var(--line)] border-t px-4 py-16 sm:py-24">
      <div className="page-wrap">
        <div className="mb-12 text-center">
          <p className="island-kicker mb-3">
            <Trans>Features</Trans>
          </p>
          <h2 className="display-title mx-auto mb-4 max-w-2xl font-bold text-3xl text-[var(--sea-ink)] tracking-tight sm:text-4xl">
            <Trans>Everything you need to ship</Trans>
          </h2>
          <p className="mx-auto max-w-xl text-[var(--sea-ink-soft)]">
            <Trans>
              Stop wiring up boilerplate. Start building your product with a foundation that handles the hard parts.
            </Trans>
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }, index) => (
            <article
              key={title}
              className="island-shell feature-card rise-in rounded-2xl p-6"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="mb-4 inline-flex rounded-xl border border-[var(--chip-line)] bg-[var(--chip-bg)] p-2.5">
                <Icon className="size-5 text-[var(--lagoon-deep)]" />
              </div>
              <h3 className="mb-2 font-semibold text-[var(--sea-ink)]">{title}</h3>
              <p className="m-0 text-sm text-[var(--sea-ink-soft)] leading-relaxed">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
