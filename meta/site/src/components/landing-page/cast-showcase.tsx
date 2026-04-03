import { CLAUDE_MD_CODE } from "./constants";

export function CastShowcase() {
  return (
    <section className="showcase">
      <div className="showcase-grid">
        <div className="showcase-content">
          <h2>
            Built for
            <br />
            <span className="highlight-violet">AI-assisted development</span>
          </h2>
          <p>
            Cast isn't just AI-compatible — it's designed from the ground up for AI agents to be productive from the
            first prompt. Detailed project instructions, auto-invoked skills per domain, and a dependency graph that AI
            can reason about.
          </p>
          <div className="showcase-stats">
            <div className="showcase-stat">
              <div className="showcase-stat-number">42</div>
              <div className="showcase-stat-label">Claude Skills</div>
            </div>
            <div className="showcase-stat">
              <div className="showcase-stat-number">15+</div>
              <div className="showcase-stat-label">Auto-Invoke Rules</div>
            </div>
            <div className="showcase-stat">
              <div className="showcase-stat-number">8</div>
              <div className="showcase-stat-label">Internal Packages</div>
            </div>
          </div>
        </div>
        <div className="showcase-code animate-on-scroll">
          <div className="code-header">CLAUDE.md</div>
          <pre>
            <code dangerouslySetInnerHTML={{ __html: CLAUDE_MD_CODE }} />
          </pre>
        </div>
      </div>
    </section>
  );
}
