export function ProspectFeatures() {
  return (
    <section className="features">
      <div className="features-inner">
        <div className="section-header">
          <h2>Why Prospect?</h2>
          <p>Everything you need to understand your E2E tests — without leaving your app.</p>
        </div>
        <div className="feature-grid">
          <div className="feature animate-on-scroll">
            <div className="feature-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4ade80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3>Coverage Mapping</h3>
            <p>
              <code>defineE2ECoverage()</code> maps routes to interactive elements. Type-safe, version-controlled,
              validated on every test run. <code>test: null</code> marks gaps explicitly.
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
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <h3>Dev Overlay</h3>
            <p>
              See coverage, flakiness, and test videos directly in your app. Green for covered, red for gaps, amber for
              flaky. Click any element to watch its test run.
            </p>
          </div>
          <div className="feature animate-on-scroll">
            <div className="feature-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <h3>Flakiness Tracking</h3>
            <p>
              Playwright reporter stores every run locally. Track pass rates, spot flaky tests, browse artifacts — no
              external service, no per-seat pricing.
            </p>
          </div>
          <div className="feature animate-on-scroll">
            <div className="feature-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a78bfa"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <h3>Test Artifacts</h3>
            <p>
              Videos, screenshots, and traces stored locally. Watch any test run from the overlay — even passing tests —
              to see exactly what each test does.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
