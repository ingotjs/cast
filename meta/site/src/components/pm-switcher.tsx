import { useCallback } from "react";
import type { KeyboardEvent } from "react";

import { pmNames } from "../lib/pkg-config";
import type { PmName } from "../lib/pkg-config";

export function PmTabs({ active, onSwitch }: { active: PmName; onSwitch: (pm: PmName) => void }) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const idx = pmNames.indexOf(active);
      let newIdx: number | undefined;
      if (e.key === "ArrowRight") {
        newIdx = (idx + 1) % pmNames.length;
      } else if (e.key === "ArrowLeft") {
        newIdx = (idx - 1 + pmNames.length) % pmNames.length;
      }
      if (newIdx !== undefined) {
        e.preventDefault();
        onSwitch(pmNames[newIdx]);
      }
    },
    [active, onSwitch]
  );

  return (
    <div className="pm-tabs" role="tablist" aria-label="Package manager" onKeyDown={handleKeyDown}>
      {pmNames.map((pm) => (
        <button
          key={pm}
          role="tab"
          className="pm-tab"
          data-pm={pm}
          aria-selected={pm === active}
          tabIndex={pm === active ? 0 : -1}
          onClick={() => {
            onSwitch(pm);
          }}
        >
          {pm}
        </button>
      ))}
    </div>
  );
}
