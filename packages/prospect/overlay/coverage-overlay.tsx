import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ElementHighlighter } from "./element-highlighter.tsx";
import { TestTooltip } from "./test-tooltip.tsx";
import type { CoverageStats, HighlightRect, Interaction, Route, TooltipData } from "./types.ts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CoverageOverlayProps = {
  /** Routes from defineE2ECoverage — the coverage map */
  coverage: Record<string, Route>;
  /** Current route path. Falls back to window.location.pathname */
  currentRoute?: string;
};

// ---------------------------------------------------------------------------
// Coverage map builder
// ---------------------------------------------------------------------------

type CoverageEntry = {
  routeKey: string;
  interactions: Interaction[];
};

function buildCoverageMap(routes: Record<string, Route>): Map<string, CoverageEntry[]> {
  const map = new Map<string, CoverageEntry[]>();

  function processInteractions(routeKey: string, interactions: Record<string, Interaction[]>) {
    for (const [testIdValue, cases] of Object.entries(interactions)) {
      const existing = map.get(testIdValue) ?? [];
      existing.push({ routeKey, interactions: cases });
      map.set(testIdValue, existing);

      for (const c of cases) {
        if (c.reveals) {
          processInteractions(routeKey, c.reveals);
        }
      }
    }
  }

  for (const [routeKey, route] of Object.entries(routes)) {
    processInteractions(routeKey, route.interactions);
  }

  return map;
}

function computeRouteStats(routes: Record<string, Route>, pathname: string): CoverageStats {
  const route = routes[pathname];
  if (!route) return { covered: 0, uncovered: 0, total: 0, percentage: 0 };

  let covered = 0;
  let uncovered = 0;

  function count(interactions: Record<string, Interaction[]>) {
    for (const cases of Object.values(interactions)) {
      for (const c of cases) {
        if (c.test !== null) covered++;
        else uncovered++;
        if (c.reveals) count(c.reveals);
      }
    }
  }

  count(route.interactions);

  if (route.access) {
    for (const access of Object.values(route.access)) {
      if (access.test !== null) covered++;
      else uncovered++;
    }
  }

  const total = covered + uncovered;
  return { covered, uncovered, total, percentage: total > 0 ? Math.round((covered / total) * 100) : 0 };
}

// ---------------------------------------------------------------------------
// DOM scanning
// ---------------------------------------------------------------------------

let idCounter = 0;
const elementIdMap = new WeakMap<Element, string>();

function getElementId(el: Element): string {
  let id = elementIdMap.get(el);
  if (!id) {
    id = `prospect-${idCounter++}`;
    elementIdMap.set(el, id);
  }
  return id;
}

function scanDOM(coverageMap: Map<string, CoverageEntry[]>): {
  highlights: HighlightRect[];
  interactionMap: Map<string, Interaction[]>;
} {
  const highlights: HighlightRect[] = [];
  const interactionMap = new Map<string, Interaction[]>();

  const elements = document.querySelectorAll("[data-testid]");

  for (const el of elements) {
    if (el.closest("[data-prospect-overlay]")) continue;

    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") continue;

    const rect = el.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) continue;
    if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
    if (rect.right < 0 || rect.left > window.innerWidth) continue;

    const testIdValue = el.getAttribute("data-testid");
    if (!testIdValue) continue;

    const entries = coverageMap.get(testIdValue);
    if (!entries) continue;

    const allInteractions = entries.flatMap((e) => e.interactions);
    const coveredCount = allInteractions.filter((i) => i.test !== null).length;
    const elId = getElementId(el);

    interactionMap.set(elId, allInteractions);

    highlights.push({
      id: elId,
      rect,
      status: coveredCount > 0 ? "covered" : "uncovered",
      testCount: coveredCount,
      element: el,
    });
  }

  return { highlights, interactionMap };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DRAG_THRESHOLD = 4;
const STORAGE_KEY = "prospect-overlay-position";
const RESCAN_DEBOUNCE_MS = 300;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const badgeBaseStyle: React.CSSProperties = {
  position: "fixed",
  zIndex: 999999,
  pointerEvents: "auto",
  touchAction: "none",
  userSelect: "none",
  display: "flex",
  alignItems: "center",
  gap: 6,
  borderRadius: "9999px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  cursor: "grab",
  fontFamily: "system-ui, -apple-system, sans-serif",
  fontSize: "12px",
  fontWeight: 500,
  transition: "background-color 0.15s ease, border-color 0.15s ease",
};

const badgeInactiveStyle: React.CSSProperties = {
  ...badgeBaseStyle,
  backgroundColor: "#1a1a2e",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "#999",
};

const badgeActiveStyle: React.CSSProperties = {
  ...badgeBaseStyle,
  backgroundColor: "#059669",
  border: "1px solid #10b981",
  color: "#fff",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CoverageOverlay({ coverage, currentRoute }: CoverageOverlayProps) {
  const [isActive, setIsActive] = useState(false);
  const [highlights, setHighlights] = useState<HighlightRect[]>([]);
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [showUncovered, setShowUncovered] = useState(false);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);
  const [badgePosition, setBadgePosition] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const pos = JSON.parse(saved) as { x: number; y: number };
        if (typeof pos.x === "number" && typeof pos.y === "number") return pos;
      }
    } catch {
      /* empty */
    }
    return { x: 16, y: 16 };
  });

  const coverageMapRef = useRef<Map<string, CoverageEntry[]>>(new Map());
  const interactionMapRef = useRef<Map<string, Interaction[]>>(new Map());
  const observerRef = useRef<MutationObserver | null>(null);
  const rescanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    isDragging: boolean;
    didDrag: boolean;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const pathname = currentRoute ?? (typeof window !== "undefined" ? window.location.pathname : "/");
  const stats = computeRouteStats(coverage, pathname);

  const runScan = useCallback(() => {
    const { highlights: newHighlights, interactionMap } = scanDOM(coverageMapRef.current);
    setHighlights(newHighlights);
    interactionMapRef.current = interactionMap;
  }, []);

  const toggle = useCallback(() => {
    setIsActive((prev) => {
      if (prev) {
        setHighlights([]);
        setTooltipData(null);
        setShowUncovered(false);
        return false;
      }
      coverageMapRef.current = buildCoverageMap(coverage);
      requestAnimationFrame(() => runScan());
      return true;
    });
  }, [coverage, runScan]);

  // Keyboard shortcut: Ctrl+Shift+E
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "E") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  // MutationObserver for DOM changes while active
  useEffect(() => {
    if (!isActive) return;

    const debouncedRescan = () => {
      if (rescanTimerRef.current) clearTimeout(rescanTimerRef.current);
      rescanTimerRef.current = setTimeout(runScan, RESCAN_DEBOUNCE_MS);
    };

    observerRef.current = new MutationObserver(debouncedRescan);
    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "hidden", "aria-hidden", "data-testid"],
    });

    window.addEventListener("popstate", debouncedRescan);
    window.addEventListener("resize", debouncedRescan);

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener("popstate", debouncedRescan);
      window.removeEventListener("resize", debouncedRescan);
      if (rescanTimerRef.current) clearTimeout(rescanTimerRef.current);
    };
  }, [isActive, runScan]);

  // Drag handlers
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      const badge = badgeRef.current;
      if (!badge) return;
      badge.setPointerCapture(e.pointerId);
      dragRef.current = {
        isDragging: false,
        didDrag: false,
        startX: e.clientX,
        startY: e.clientY,
        offsetX: e.clientX - badgePosition.x,
        offsetY: e.clientY - (window.innerHeight - badgePosition.y - badge.offsetHeight),
      };
    },
    [badgePosition]
  );

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    e.stopPropagation();

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (!drag.isDragging && Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) {
      drag.isDragging = true;
      drag.didDrag = true;
    }

    if (drag.isDragging) {
      const badge = badgeRef.current;
      if (!badge) return;
      const newX = Math.max(0, Math.min(e.clientX - drag.offsetX, window.innerWidth - badge.offsetWidth));
      const newBottom = Math.max(
        0,
        Math.min(
          window.innerHeight - (e.clientY - drag.offsetY) - badge.offsetHeight,
          window.innerHeight - badge.offsetHeight
        )
      );
      setBadgePosition({ x: newX, y: newBottom });
    }
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      const drag = dragRef.current;
      const badge = badgeRef.current;
      if (badge) badge.releasePointerCapture(e.pointerId);

      if (drag && !drag.didDrag) {
        toggle();
      }
      if (drag?.didDrag) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(badgePosition));
      }
      dragRef.current = null;
    },
    [toggle, badgePosition]
  );

  const handleHover = useCallback(
    (id: string | null, position: { x: number; y: number } | null) => {
      if (isTooltipHovered) return;

      if (!id || !position) {
        setTooltipData(null);
        return;
      }

      const interactions = interactionMapRef.current.get(id);
      if (!interactions) {
        setTooltipData(null);
        return;
      }

      const el = highlights.find((h) => h.id === id)?.element;
      const testId = el?.getAttribute("data-testid") ?? id;

      setTooltipData({
        testId,
        interactions: interactions.map((i) => ({
          context: i.context,
          condition: i.condition,
          expected: i.expected,
          test: i.test,
          visible: i.visible,
        })),
        position,
      });
    },
    [highlights, isTooltipHovered]
  );

  const handleToggleUncovered = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowUncovered((prev) => !prev);
  }, []);

  if (typeof window === "undefined") return null;

  return createPortal(
    <>
      {/* Badge */}
      <div
        ref={badgeRef}
        data-prospect-overlay="true"
        style={{
          ...(isActive ? badgeActiveStyle : badgeInactiveStyle),
          left: badgePosition.x,
          bottom: badgePosition.y,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onMouseDown={(e) => e.stopPropagation()}
        title="Toggle Prospect Overlay (Ctrl+Shift+E) — Drag to move"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px" }}>
          {/* Beaker icon */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4.5 3h15M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3M9 3v5.2a2 2 0 0 1-.65 1.47L6 12M15 3v5.2a2 2 0 0 0 .65 1.47L18 12" />
          </svg>
          <span>Prospect</span>
        </div>

        {isActive && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              borderLeft: "1px solid rgba(255,255,255,0.3)",
              padding: "6px 10px 6px 10px",
              fontSize: "11px",
            }}
          >
            <span style={{ fontWeight: 700 }}>{stats.percentage}%</span>
            <span style={{ opacity: 0.8 }}>
              {stats.covered}/{stats.total}
            </span>
            <button
              onClick={handleToggleUncovered}
              onPointerDown={(e) => e.stopPropagation()}
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                border: "none",
                borderRadius: "9999px",
                padding: "2px 8px",
                fontSize: "10px",
                cursor: "pointer",
                backgroundColor: showUncovered ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
                color: showUncovered ? "#fff" : "rgba(255,255,255,0.7)",
                transition: "background-color 0.1s ease",
              }}
              title={showUncovered ? "Hide uncovered elements" : "Show uncovered elements"}
            >
              {/* Eye icon */}
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {showUncovered ? (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </>
                ) : (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                )}
              </svg>
              <span style={{ color: "#fca5a5" }}>{stats.uncovered}</span>
            </button>
          </div>
        )}
      </div>

      {/* Highlights */}
      {isActive && highlights.length > 0 && (
        <ElementHighlighter highlights={highlights} showUncovered={showUncovered} onHover={handleHover} />
      )}

      {/* Tooltip */}
      {isActive && tooltipData && (
        <TestTooltip
          data={tooltipData}
          onMouseEnter={() => setIsTooltipHovered(true)}
          onMouseLeave={() => {
            setIsTooltipHovered(false);
            setTooltipData(null);
          }}
        />
      )}
    </>,
    document.body
  );
}
