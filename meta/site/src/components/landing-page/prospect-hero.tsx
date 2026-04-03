import type { PmName } from "../../lib/pkg-config";
import { CopyButton } from "../copy-button";
import { PmTabs } from "../pm-switcher";

type ProspectHeroProps = {
  activePm: PmName;
  onPmSwitch: (pm: PmName) => void;
  pmBin: string;
  pmArgs: string;
  pmFullCmd: string;
};

export function ProspectHero({ activePm, onPmSwitch, pmBin, pmArgs, pmFullCmd }: ProspectHeroProps) {
  return (
    <section className="hero">
      <h1>
        The full Playwright
        <br />
        companion.
      </h1>
      <p className="hero-desc">
        Coverage mapping, flakiness tracking, test artifacts, and a dev overlay — all in one package. Your AI agent
        scans every route, applies <code>data-testid</code>, and builds the coverage file. You see everything in an
        overlay without leaving your app.
      </p>
      <div className="hero-cmd hero-cmd--pm" data-pm-group="prospect-hero">
        <PmTabs active={activePm} onSwitch={onPmSwitch} />
        <div className="hero-cmd-line">
          <span className="prompt">$</span>
          <span className="cmd">
            <span className="cmd-green">{pmBin}</span> <span className="cmd-amber">{pmArgs}</span>
          </span>
          <CopyButton text={pmFullCmd} />
        </div>
      </div>
      <div className="hero-links">
        <a
          href="https://github.com/ingotjs/cast/tree/main/packages/prospect"
          target="_blank"
          rel="noopener"
          className="hero-link"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          GitHub
        </a>
        <a href="https://www.npmjs.com/package/@ingot/prospect" target="_blank" rel="noopener" className="hero-link">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M0 0v16h16V0H0zm13 13H8V5H5v8H3V3h10v10z" fill="currentColor" />
          </svg>
          npm
        </a>
      </div>
    </section>
  );
}
