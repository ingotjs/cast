import { COVERAGE_CODE } from "./constants";

export function ProspectShowcase() {
  return (
    <section className="showcase">
      <div className="showcase-grid">
        <div className="showcase-content">
          <h2>
            Coverage as <span className="highlight-green">code</span>
          </h2>
          <p>
            Map every route's interactive elements to tests. Mark gaps with <code>null</code>. The overlay shows it all
            visually — coverage, flakiness, and test videos — right in your running app.
          </p>
        </div>
        <div className="showcase-code animate-on-scroll">
          <div className="code-header">coverage.ts</div>
          <pre>
            <code dangerouslySetInnerHTML={{ __html: COVERAGE_CODE }} />
          </pre>
        </div>
      </div>
    </section>
  );
}
