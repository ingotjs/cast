import { consts } from "@ingot/utils/consts";
import { msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import { Link, createFileRoute } from "@tanstack/react-router";

import { useSession } from "../lib/auth-client";
import { getI18n } from "../lib/i18n";
import { seoMeta } from "../lib/seo";

const { appName } = consts;

const metaHomeTitle = msg`${appName} — The Modern Full-Stack Starter`;
const metaHomeDescription = msg`Ship production TypeScript apps in minutes. Auth, API, database, email, i18n, and deployment — all wired up and ready.`;

const App = () => {
  const { data: session } = useSession();
  const { t } = useLingui();

  return (
    <main className="page-wrap px-4 pt-14 pb-8">
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -top-24 -left-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <p className="island-kicker mb-3">TanStack Start Base Template</p>
        <h1 className="display-title mb-5 max-w-3xl font-bold text-4xl text-[var(--sea-ink)] leading-[1.02] tracking-tight sm:text-6xl">
          <Trans>Start simple, ship quickly.</Trans>
        </h1>
        <p className="mb-8 max-w-2xl text-[var(--sea-ink-soft)] text-base sm:text-lg">
          <Trans>
            This base starter intentionally keeps things light: two routes, clean structure, and the essentials you need
            to build from scratch.
          </Trans>
        </p>
        <div className="flex flex-wrap gap-3">
          {session?.user ? (
            <Link
              to="/admin"
              className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 font-semibold text-[var(--lagoon-deep)] text-sm no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
              data-testid="home-link-user"
            >
              {t`Welcome, ${session.user.name}`}
            </Link>
          ) : (
            <Link
              to="/auth/$path"
              params={{ path: "sign-in" }}
              className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 font-semibold text-[var(--lagoon-deep)] text-sm no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
              data-testid="home-link-signin"
            >
              <Trans>Sign In</Trans>
            </Link>
          )}
          <a
            href="/about"
            className="rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 px-5 py-2.5 font-semibold text-[var(--sea-ink)] text-sm no-underline transition hover:-translate-y-0.5 hover:border-[rgba(23,58,64,0.35)]"
          >
            <Trans>About This Starter</Trans>
          </a>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [t`Type-Safe Routing`, t`Routes and links stay in sync across every page.`],
          [t`Server Functions`, t`Call server code from your UI without creating API boilerplate.`],
          [t`Streaming by Default`, t`Ship progressively rendered responses for faster experiences.`],
          [t`Tailwind Native`, t`Design quickly with utility-first styling and reusable tokens.`],
        ].map(([title, desc], index) => (
          <article
            key={title}
            className="island-shell feature-card rise-in rounded-2xl p-5"
            style={{ animationDelay: `${index * 90 + 80}ms` }}
          >
            <h2 className="mb-2 font-semibold text-[var(--sea-ink)] text-base">{title}</h2>
            <p className="m-0 text-[var(--sea-ink-soft)] text-sm">{desc}</p>
          </article>
        ))}
      </section>

      <section className="island-shell mt-8 rounded-2xl p-6">
        <p className="island-kicker mb-2">
          <Trans>Quick Start</Trans>
        </p>
        <ul className="m-0 list-disc space-y-2 pl-5 text-[var(--sea-ink-soft)] text-sm">
          <li>
            <Trans>
              Edit <code>src/routes/index.tsx</code> to customize the home page.
            </Trans>
          </li>
          <li>
            <Trans>
              Update <code>src/components/Header.tsx</code> and <code>src/components/Footer.tsx</code> for brand links.
            </Trans>
          </li>
          <li>
            <Trans>
              Add routes in <code>src/routes</code> and tweak visual tokens in <code>src/styles.css</code>.
            </Trans>
          </li>
        </ul>
      </section>
    </main>
  );
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      ...seoMeta({
        title: getI18n()._(metaHomeTitle.id, { appName }),
        description: getI18n()._(metaHomeDescription.id),
      }),
    ],
  }),
  component: App,
});
