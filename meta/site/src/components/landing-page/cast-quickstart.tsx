import { CopyButton } from "../copy-button";

export function CastQuickstart() {
  return (
    <section className="quickstart">
      <div className="quickstart-inner">
        <h2>Get started</h2>
        <p className="quickstart-sub">From zero to dev in a single command.</p>
        <div className="code-block">
          <div className="code-header">
            <div className="macos-dots">
              <span />
              <span />
              <span />
            </div>
          </div>
          <pre>
            <code>
              <span className="prompt">$</span>{" "}
              <a href="https://bun.sh" target="_blank" rel="noopener" className="cmd-green bun-link">
                bunx
              </a>{" "}
              <span className="cmd-amber">@ingot/cast</span>
            </code>
            <CopyButton text="bunx @ingot/cast" />
          </pre>
        </div>
      </div>
    </section>
  );
}
