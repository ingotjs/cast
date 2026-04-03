import { useCallback, useEffect, useRef, useState } from "react";

import { pkgConfig, pmCommands } from "../../lib/pkg-config";
import type { PkgName, PmName } from "../../lib/pkg-config";
import { CastFeatures } from "./cast-features";
import { CastHero } from "./cast-hero";
import { CastMore } from "./cast-more";
import { CastQuickstart } from "./cast-quickstart";
import { CastShowcase } from "./cast-showcase";
import { CastTrustBar } from "./cast-trust-bar";
import { ProspectFeatures } from "./prospect-features";
import { ProspectHero } from "./prospect-hero";
import { ProspectQuickstart } from "./prospect-quickstart";
import { ProspectShowcase } from "./prospect-showcase";
import { ProspectTrustBar } from "./prospect-trust-bar";

export function LandingPage() {
  const [activePkg, setActivePkg] = useState<PkgName>("cast");
  const [activePm, setActivePm] = useState<PmName>("bun");
  const navNpmRef = useRef<HTMLAnchorElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const navGithubRef = useRef<HTMLAnchorElement>(null);

  const switchPkg = useCallback(
    (pkg: PkgName) => {
      if (pkg === activePkg) {
        return;
      }
      setActivePkg(pkg);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [activePkg]
  );

  useEffect(() => {
    const cfg = pkgConfig[activePkg];
    if (navNpmRef.current) {
      navNpmRef.current.href = cfg.npm;
    }
    if (navGithubRef.current) {
      navGithubRef.current.href = cfg.github;
    }
  }, [activePkg]);

  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const pkgs: PkgName[] = ["cast", "prospect"];
      const idx = pkgs.indexOf(activePkg);
      let newIdx: number | undefined;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        newIdx = (idx + 1) % pkgs.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        newIdx = (idx - 1 + pkgs.length) % pkgs.length;
      }
      if (newIdx !== undefined) {
        e.preventDefault();
        switchPkg(pkgs[newIdx]);
      }
    },
    [activePkg, switchPkg]
  );

  const pm = pmCommands[activePm];
  const pmFullCmd = `${pm.bin} ${pm.args}`;

  // Scroll animations — observe all .animate-on-scroll elements
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    // Defer to next frame so DOM is fully committed
    const raf = requestAnimationFrame(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.querySelectorAll(".animate-on-scroll").forEach((el) => {
          el.classList.add("visible");
        });
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.15 }
      );
      document.querySelectorAll(".pkg-page:not([hidden]) .animate-on-scroll").forEach((el) => {
        el.classList.remove("visible");
        observer.observe(el);
      });
      cleanupRef.current = () => {
        observer.disconnect();
      };
    });

    return () => {
      cancelAnimationFrame(raf);
      cleanupRef.current?.();
    };
  }, [activePkg]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      {/* Nav */}
      <header>
        <nav>
          <div className="nav-inner">
            <a href="/" className="nav-brand">
              <img src="/logo.svg" alt="ingot" height="28" />
            </a>
            <div className="nav-links">
              <a
                id="nav-npm"
                ref={navNpmRef}
                href="https://www.npmjs.com/package/@ingot/cast"
                target="_blank"
                rel="noopener"
                className="nav-link"
                aria-label="npm"
              >
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M0 0v16h16V0H0zm13 13H8V5H5v8H3V3h10v10z" />
                </svg>
                <span>npm</span>
              </a>
              <a
                id="nav-github"
                ref={navGithubRef}
                href="https://github.com/ingotjs/cast"
                target="_blank"
                rel="noopener"
                className="nav-link"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Package tab bar */}
      <div className="tab-bar">
        <div className="tab-bar-inner" role="tablist" aria-label="Package" onKeyDown={handleTabKeyDown}>
          <button
            role="tab"
            className="tab-btn tab-btn--cast"
            data-pkg="cast"
            aria-selected={activePkg === "cast"}
            aria-controls="page-cast"
            tabIndex={activePkg === "cast" ? 0 : -1}
            onClick={() => {
              switchPkg("cast");
            }}
          >
            <div className="tab-btn-top">
              <span className="tab-btn-name">@ingot/cast</span>
              <span className="tab-badge tab-badge--cast">New</span>
            </div>
            <p className="tab-btn-desc">Full-stack TypeScript starter with AI-first DX</p>
          </button>
          <button
            role="tab"
            className="tab-btn tab-btn--prospect"
            data-pkg="prospect"
            aria-selected={activePkg === "prospect"}
            aria-controls="page-prospect"
            tabIndex={activePkg === "prospect" ? 0 : -1}
            onClick={() => {
              switchPkg("prospect");
            }}
          >
            <div className="tab-btn-top">
              <span className="tab-btn-name">@ingot/prospect</span>
              <span className="tab-badge tab-badge--prospect">WIP</span>
            </div>
            <p className="tab-btn-desc">E2E coverage framework for route-based apps</p>
          </button>
        </div>
      </div>

      <main id="main" key={activePkg}>
        {/* CAST */}
        <div className="pkg-page" id="page-cast" style={{ position: "relative" }} hidden={activePkg !== "cast"}>
          <div className="hero-bg-cast">
            <img src="bg-cast.webp" alt="" />
          </div>
          <CastHero />
          <CastTrustBar />
          <CastFeatures />
          <CastMore />
          <CastShowcase />
          <CastQuickstart />
        </div>

        {/* PROSPECT */}
        <div className="pkg-page" id="page-prospect" style={{ position: "relative" }} hidden={activePkg !== "prospect"}>
          <div className="hero-bg-cast">
            <img src="bg-prospect.webp" alt="" />
          </div>
          <ProspectHero
            activePm={activePm}
            onPmSwitch={setActivePm}
            pmBin={pm.bin}
            pmArgs={pm.args}
            pmFullCmd={pmFullCmd}
          />
          <ProspectTrustBar />
          <ProspectFeatures />
          <ProspectShowcase />
          <ProspectQuickstart activePm={activePm} onPmSwitch={setActivePm} pmBin={pm.bin} pmArgs={pm.args} />
        </div>
      </main>

      {/* Footer */}
      <footer>
        <div className="footer-inner">
          <p className="footer-copy">
            made with <span className="heart">&#9829;</span> by{" "}
            <a href="https://github.com/ftzi" target="_blank" rel="noopener" className="footer-author">
              ftzi
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
