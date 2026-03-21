import { Trans } from "@lingui/react/macro";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Cta = () => (
  <section className="border-[var(--line)] border-t px-4 py-20 sm:py-32">
    <div className="page-wrap text-center">
      <p className="island-kicker mb-3">
        <Trans>Start building</Trans>
      </p>
      <h2 className="display-title mx-auto mb-4 max-w-xl font-bold text-3xl text-[var(--sea-ink)] tracking-tight sm:text-5xl">
        <Trans>Ready to get started?</Trans>
      </h2>
      <p className="mx-auto mb-10 max-w-md text-[var(--sea-ink-soft)] leading-relaxed">
        <Trans>Clone the repo, run one command, and start building. Your next project starts here.</Trans>
      </p>
      <Link
        to="/auth/$path"
        params={{ path: "sign-up" }}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--lagoon-deep)] px-7 py-3.5 font-semibold text-sm text-white no-underline shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--lagoon)] hover:shadow-lg"
        data-testid="home-link-cta-signup"
      >
        <Trans>Get Started</Trans>
        <ArrowRight className="size-4" />
      </Link>
    </div>
  </section>
);
