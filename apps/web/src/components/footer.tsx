import { LogoIcon } from "@ingot/ui/components/logo";
import { consts } from "@ingot/utils/consts";
import { Trans } from "@lingui/react/macro";
import { Link } from "@tanstack/react-router";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer px-4 pt-12 pb-10 text-[var(--sea-ink-soft)]">
      <div className="page-wrap">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 font-semibold text-[var(--sea-ink)] no-underline">
              <LogoIcon className="text-[var(--lagoon-deep)]" />
              {consts.appName}
            </Link>
            <p className="mt-2 max-w-xs text-sm leading-relaxed">
              <Trans>The modern full-stack starter for shipping fast.</Trans>
            </p>
          </div>

          <div className="flex gap-16 text-sm">
            <div>
              <p className="mb-3 font-semibold text-[var(--sea-ink)]">
                <Trans>Product</Trans>
              </p>
              <div className="flex flex-col gap-2.5">
                <Link to="/" className="transition hover:text-[var(--sea-ink)]">
                  <Trans>Features</Trans>
                </Link>
                <Link to="/about" className="transition hover:text-[var(--sea-ink)]">
                  <Trans>About</Trans>
                </Link>
              </div>
            </div>
            <div>
              <p className="mb-3 font-semibold text-[var(--sea-ink)]">
                <Trans>Legal</Trans>
              </p>
              <div className="flex flex-col gap-2.5">
                <Link to="/faq" className="transition hover:text-[var(--sea-ink)]" data-testid="footer-link-faq">
                  <Trans>FAQ</Trans>
                </Link>
                <Link
                  to="/privacy"
                  className="transition hover:text-[var(--sea-ink)]"
                  data-testid="footer-link-privacy"
                >
                  <Trans>Privacy</Trans>
                </Link>
                <Link to="/terms" className="transition hover:text-[var(--sea-ink)]" data-testid="footer-link-terms">
                  <Trans>Terms</Trans>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-[var(--line)] border-t pt-6 text-xs">
          &copy; {year} {consts.appName}
        </div>
      </div>
    </footer>
  );
};
