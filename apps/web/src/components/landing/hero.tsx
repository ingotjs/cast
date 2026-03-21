import { Trans, useLingui } from "@lingui/react/macro";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { useSession } from "../../lib/auth-client";

export const Hero = () => {
  const { data: session } = useSession();
  const { t } = useLingui();

  return (
    <section className="px-4 pt-20 pb-16 sm:pt-32 sm:pb-24">
      <div className="page-wrap flex flex-col items-center text-center">
        <div className="rise-in mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-4 py-1.5 text-sm text-[var(--sea-ink-soft)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--lagoon)]" />
          <Trans>Now open source</Trans>
        </div>

        <h1
          className="display-title rise-in mx-auto mb-6 max-w-4xl font-bold text-5xl text-[var(--sea-ink)] leading-[1.05] tracking-tight sm:text-7xl"
          style={{ animationDelay: "60ms" }}
        >
          <Trans>Build faster. Ship with confidence.</Trans>
        </h1>

        <p
          className="rise-in mx-auto mb-10 max-w-2xl text-lg text-[var(--sea-ink-soft)] leading-relaxed"
          style={{ animationDelay: "120ms" }}
        >
          <Trans>
            A production-ready full-stack starter with authentication, database, email, i18n, and deployment — all wired
            up so you can focus on what matters.
          </Trans>
        </p>

        <div className="rise-in flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "180ms" }}>
          {session?.user ? (
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--lagoon-deep)] px-7 py-3.5 font-semibold text-sm text-white no-underline shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--lagoon)] hover:shadow-lg"
              data-testid="home-link-user"
            >
              {t`Go to Dashboard`}
              <ArrowRight className="size-4" />
            </Link>
          ) : (
            <Link
              to="/auth/$path"
              params={{ path: "sign-up" }}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--lagoon-deep)] px-7 py-3.5 font-semibold text-sm text-white no-underline shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--lagoon)] hover:shadow-lg"
              data-testid="home-link-signup"
            >
              <Trans>Get Started</Trans>
              <ArrowRight className="size-4" />
            </Link>
          )}
          <Link
            to="/about"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-7 py-3.5 font-semibold text-sm text-[var(--sea-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[rgba(50,143,151,0.4)]"
            data-testid="home-link-learn-more"
          >
            <Trans>Learn More</Trans>
          </Link>
        </div>
      </div>
    </section>
  );
};
