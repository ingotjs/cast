import { Trans } from "@lingui/react/macro";
import { ArrowRight } from "lucide-react";

import { useAuthModal } from "../auth/auth-modal";

export const Cta = () => {
  const { open: openAuthModal } = useAuthModal();

  return (
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
        <button
          type="button"
          onClick={openAuthModal}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--btn-accent)] px-7 py-3.5 font-semibold text-sm text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--btn-accent-hover)] hover:shadow-lg"
          data-testid="home-link-cta-signup"
        >
          <Trans>Get Started</Trans>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </section>
  );
};
