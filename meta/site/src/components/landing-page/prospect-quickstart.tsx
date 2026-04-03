import type { PmName } from "../../lib/pkg-config";
import { CopyButton } from "../copy-button";
import { PmTabs } from "../pm-switcher";

type ProspectQuickstartProps = {
  activePm: PmName;
  onPmSwitch: (pm: PmName) => void;
  pmBin: string;
  pmArgs: string;
};

export function ProspectQuickstart({ activePm, onPmSwitch, pmBin, pmArgs }: ProspectQuickstartProps) {
  return (
    <section className="quickstart">
      <div className="quickstart-inner">
        <h2>Get started</h2>
        <p className="quickstart-sub">Install, define, validate.</p>
        <div className="code-block" data-pm-group="prospect-quickstart">
          <div className="code-header">
            <div className="macos-dots">
              <span />
              <span />
              <span />
            </div>
            <PmTabs active={activePm} onSwitch={onPmSwitch} />
          </div>
          <pre>
            <code>
              <span className="prompt">$</span>{" "}
              <span className="cmd">
                <span className="cmd-green">{pmBin}</span> <span className="cmd-amber">{pmArgs}</span>
              </span>
            </code>
            <CopyButton text="bunx @ingot/cast" />
          </pre>
        </div>
      </div>
    </section>
  );
}
