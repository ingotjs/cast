export function CastFeatures() {
  return (
    <section className="features">
      <div className="features-inner">
        <div className="section-header">
          <h2>Why Cast?</h2>
          <p>A full-stack foundation — type-safe, AI-navigable, production-ready from the first commit.</p>
        </div>
        <div className="feature-grid">
          <div className="feature animate-on-scroll">
            <div className="feature-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3>AI-First Architecture</h3>
            <p>
              Comprehensive CLAUDE.md instructions, dozens of Claude Code skills, and strict code standards that
              eliminate ambiguity. AI writes better code here than in most hand-rolled projects.
            </p>
          </div>
          <div className="feature animate-on-scroll">
            <div className="feature-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#34d399"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3>Production-Ready</h3>
            <p>
              Auth, API, database, email, i18n, observability, and CI/CD — all wired up and working together. Not a
              skeleton — a foundation you can ship on.
            </p>
          </div>
          <div className="feature animate-on-scroll">
            <div className="feature-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h3>Edge-Native</h3>
            <p>
              Cloudflare Workers + D1 + KV. Zero config — your app runs on the same global edge network as your
              database. Sub-10ms reads, zero egress fees, global replication.
            </p>
          </div>
          <div className="feature animate-on-scroll">
            <div className="feature-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h3>i18n From Day One</h3>
            <p>
              Every user-facing string flows through
              <a href="https://lingui.dev/" target="_blank" rel="noopener">
                Lingui
              </a>{" "}
              — UI, auth errors, emails, and meta tags. Adding a language is a PO file, not a refactor.
            </p>
          </div>
          <div className="feature animate-on-scroll">
            <div className="feature-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fb7185"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>Bulletproof Quality</h3>
            <p>
              <a href="https://oxc.rs/docs/guide/usage/linter" target="_blank" rel="noopener">
                Oxlint
              </a>
              {" + "}
              <a href="https://oxc.rs/docs/guide/usage/formatter" target="_blank" rel="noopener">
                Oxfmt
              </a>
              {" + "}
              <a href="https://github.com/microsoft/typescript-go" target="_blank" rel="noopener">
                tsgo
              </a>
              {" + "}
              <a href="https://syncpack.dev/" target="_blank" rel="noopener">
                syncpack
              </a>
              {" + "}
              <a href="https://knip.dev/" target="_blank" rel="noopener">
                Knip
              </a>
              {" + "}
              <a href="https://playwright.dev/" target="_blank" rel="noopener">
                Playwright
              </a>
              . Pre-commit hooks, supply chain scanning, and one command — <code>bun ok</code> — that validates
              everything.
            </p>
          </div>
          <div className="feature animate-on-scroll">
            <div className="feature-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <h3>Deploy in 60 Seconds</h3>
            <p>
              One command to deploy — database migrations, edge workers, everything. CI auto-deploys on push to main.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
