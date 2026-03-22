import { useCallback, useEffect, useRef, useState } from "react";

import { pkgConfig, pmCommands, type PkgName, type PmName } from "../lib/pkg-config";
import { CopyButton } from "./copy-button";
import { PmTabs } from "./pm-switcher";

const CLAUDE_MD_CODE =
  '<span class="comment"># Auto-invoke skills</span>\n<span class="keyword">_frontend</span>  <span class="comment">→ apps/web/ changes</span>\n<span class="keyword">_auth</span>      <span class="comment">→ packages/auth/ changes</span>\n<span class="keyword">_database</span>  <span class="comment">→ schema, migrations, queries</span>\n<span class="keyword">_i18n</span>      <span class="comment">→ user-facing text</span>\n<span class="keyword">_email</span>     <span class="comment">→ email templates</span>\n<span class="keyword">_testing</span>   <span class="comment">→ unit/integration tests</span>\n<span class="keyword">_e2e</span>       <span class="comment">→ Playwright E2E tests</span>\n<span class="keyword">_seo</span>       <span class="comment">→ meta tags, OG images</span>\n\n<span class="comment"># One command validates everything</span>\n<span class="string">bun ok</span> <span class="comment">→ types + lint + fmt + test</span>';
const COVERAGE_CODE =
  '<span class="keyword">const</span> e2e = <span class="string">defineE2ECoverage</span>({\n  testId,\n  routes: {\n    <span class="string">"/auth/sign-in"</span>: {\n      interactions: {\n        [testId.signin.submit]: [\n          {\n            context: <span class="string">"valid"</span>,\n            expected: <span class="string">"navigate to /dashboard"</span>,\n            test: <span class="string">"sign-in.e2e.ts"</span>,\n          },\n          {\n            context: <span class="string">"invalid"</span>,\n            expected: <span class="string">"shows error"</span>,\n            test: <span class="string">"sign-in.e2e.ts"</span>,\n          },\n        ],\n      },\n    },\n    <span class="string">"/dashboard"</span>: {\n      interactions: {\n        [testId.dashboard.create]: [\n          {\n            expected: <span class="string">"opens modal"</span>,\n            test: <span class="comment">null</span>, <span class="comment">// ← gap</span>\n          },\n        ],\n      },\n    },\n  },\n})';

export function LandingPage() {
  const [activePkg, setActivePkg] = useState<PkgName>("cast");
  const [activePm, setActivePm] = useState<PmName>("bun");
  const navNpmRef = useRef<HTMLAnchorElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const navGithubRef = useRef<HTMLAnchorElement>(null);

  const switchPkg = useCallback(
    (pkg: PkgName) => {
      if (pkg === activePkg) return;
      setActivePkg(pkg);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [activePkg]
  );

  useEffect(() => {
    const cfg = pkgConfig[activePkg];
    if (navNpmRef.current) navNpmRef.current.href = cfg.npm;
    if (navGithubRef.current) navGithubRef.current.href = cfg.github;
  }, [activePkg]);

  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const pkgs: PkgName[] = ["cast", "prospect"];
      const idx = pkgs.indexOf(activePkg);
      let newIdx: number | undefined;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") newIdx = (idx + 1) % pkgs.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") newIdx = (idx - 1 + pkgs.length) % pkgs.length;
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
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    // Defer to next frame so DOM is fully committed
    const raf = requestAnimationFrame(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.querySelectorAll(".animate-on-scroll").forEach((el) => el.classList.add("visible"));
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
      cleanupRef.current = () => observer.disconnect();
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
              <svg viewBox="0 0 24 18" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="ingot-top" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#D4A04A" />
                    <stop offset="100%" stopColor="#C08B30" />
                  </linearGradient>
                  <linearGradient id="ingot-front" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B8892E" />
                    <stop offset="100%" stopColor="#8B6914" />
                  </linearGradient>
                  <linearGradient id="ingot-side" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#A07820" />
                    <stop offset="100%" stopColor="#7A5C10" />
                  </linearGradient>
                </defs>
                <path d="M1 17L15 17L13 11L3 11Z" fill="url(#ingot-front)" />
                <path d="M3 11L13 11L21 5L11 5Z" fill="url(#ingot-top)" />
                <path d="M15 17L23 11L21 5L13 11Z" fill="url(#ingot-side)" />
                <path d="M3 11L13 11L21 5L11 5Z" fill="rgba(255,255,255,0.15)" />
              </svg>
              @ingot
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
            onClick={() => switchPkg("cast")}
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
            onClick={() => switchPkg("prospect")}
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
        {/* ════════════════════════════════════════════ */}
        {/* CAST */}
        {/* ════════════════════════════════════════════ */}
        <div className="pkg-page" id="page-cast" style={{ position: "relative" }} hidden={activePkg !== "cast"}>
          <div className="hero-bg-cast">
            <img src="bg-cast.webp" alt="" />
          </div>
          <section className="hero">
            <h1>
              Setup and deploy
              <br />
              in a single command.
            </h1>
            <p className="hero-desc">
              Auth, API, database, email, i18n, edge deploy — all wired up. Built with strict code standards and
              comprehensive AI coding instructions so your agent writes production-quality code from day one.
            </p>
            <div className="hero-cmd">
              <span className="prompt">$</span>{" "}
              <span className="cmd">
                <a href="https://bun.sh" target="_blank" rel="noopener" className="cmd-green bun-link">
                  bunx
                </a>{" "}
                <span className="cmd-amber">@ingot/cast</span>
              </span>
              <CopyButton text="bunx @ingot/cast" />
            </div>
            <div className="hero-links">
              <a href="https://github.com/ingotjs/cast" target="_blank" rel="noopener" className="hero-link">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
                GitHub
              </a>
              <a href="https://www.npmjs.com/package/@ingot/cast" target="_blank" rel="noopener" className="hero-link">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M0 0v16h16V0H0zm13 13H8V5H5v8H3V3h10v10z" fill="currentColor" />
                </svg>
                npm
              </a>
            </div>
          </section>

          <section className="trust">
            <p className="trust-label">Built with</p>
            <div className="trust-logos">
              <a href="https://tanstack.com/start" target="_blank" rel="noopener">
                <img
                  src="https://tanstack.com/images/logos/logo-color-100.png"
                  width="20"
                  height="20"
                  alt=""
                  aria-hidden="true"
                />
                TanStack Start
              </a>
              <a href="https://vite.dev/plus/" target="_blank" rel="noopener">
                <svg viewBox="0 0 36 20" fill="none" aria-hidden="true">
                  <path
                    fill="#6254fe"
                    d="M17.85 19.535a.483.483 0 0 1-.864-.298v-4.403a.967.967 0 0 0-.967-.967h-4.862a.483.483 0 0 1-.393-.764l3.197-4.475a.967.967 0 0 0-.788-1.53H7.29a.483.483 0 0 1-.393-.764L11.04.533a.48.48 0 0 1 .394-.203h12.348c.393 0 .622.445.393.764L20.978 5.57c-.457.64 0 1.53.788 1.53h4.861c.404 0 .63.464.38.782L17.85 19.536"
                  />
                  <path
                    fill="#9ca3af"
                    d="M3.644 0c-3.932 5.628-3.955 14.351 0 20H6.3C2.346 14.35 2.37 5.627 6.3 0zM30.625 10h2.657c-.001-3.593-.99-7.184-2.957-10h-2.656c1.966 2.816 2.955 6.407 2.957 10zM35.314 14.907h-2.665a19 19 0 0 0 .453-2.251h-2.657a19 19 0 0 1-.453 2.251h-2.669a17 17 0 0 1-.944 2.658h2.669A15 15 0 0 1 27.668 20h2.656a15 15 0 0 0 1.38-2.435h2.665c.386-.851.7-1.742.944-2.658"
                  />
                </svg>
                Vite+
              </a>
              <a href="https://workers.cloudflare.com/" target="_blank" rel="noopener">
                <svg viewBox="0 -70 256 256" aria-hidden="true">
                  <g transform="translate(0, -1)">
                    <path
                      d="M202.357,50.394 L197.046,48.27 C172.085,104.434 72.786,70.289 66.811,86.997 C65.815,98.283 121.038,89.143 160.517,91.056 C172.556,91.639 178.593,100.727 173.481,115.54 L183.55,115.571 C195.165,79.362 232.233,97.841 233.782,85.891 C231.237,78.034 191.181,85.891 202.357,50.394 Z"
                      fill="#FFFFFF"
                    />
                    <path
                      d="M176.332,109.348 C177.925,104.037 177.394,98.726 174.739,95.539 C172.083,92.352 168.365,90.228 163.585,89.697 L71.17,88.634 C70.639,88.634 70.108,88.103 69.577,88.103 C69.046,87.572 69.046,87.041 69.577,86.51 C70.108,85.448 70.639,84.916 71.701,84.916 L164.647,83.854 C175.801,83.323 187.486,74.294 191.734,63.672 L197.046,49.863 C197.046,49.331 197.577,48.8 197.046,48.269 C191.203,21.182 166.772,0.999 138.091,0.999 C111.535,0.999 88.697,17.995 80.73,41.896 C75.419,38.178 69.046,36.053 61.61,36.585 C48.863,37.647 38.772,48.269 37.178,61.016 C36.647,64.203 37.178,67.39 37.71,70.576 C16.996,71.107 0,88.103 0,109.348 C0,111.472 0,113.066 0.531,115.19 C0.531,116.253 1.593,116.784 2.125,116.784 L172.614,116.784 C173.676,116.784 174.739,116.253 174.739,115.19 L176.332,109.348 Z"
                      fill="#F4811F"
                    />
                    <path
                      d="M205.544,49.863 L202.888,49.863 C202.357,49.863 201.826,50.394 201.295,50.925 L197.577,63.672 C195.984,68.983 196.515,74.295 199.171,77.481 C201.826,80.668 205.544,82.792 210.324,83.324 L229.976,84.386 C230.507,84.386 231.038,84.917 231.569,84.917 C232.1,85.448 232.1,85.979 231.569,86.51 C231.038,87.573 230.507,88.104 229.444,88.104 L209.262,89.166 C198.108,89.697 186.424,98.726 182.175,109.348 L181.112,114.129 C180.581,114.66 181.112,115.722 182.175,115.722 L252.283,115.722 C253.345,115.722 253.876,115.191 253.876,114.129 C254.938,109.88 256,105.1 256,100.319 C256,72.701 233.162,49.863 205.544,49.863"
                      fill="#FAAD3F"
                    />
                  </g>
                </svg>
                Cloudflare
              </a>
              <a href="https://better-auth.com/" target="_blank" rel="noopener">
                <svg viewBox="0 0 20 15" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="m0 0h5v5h5v5H5v5H0V5ZM15 10V5H10V0H20V15H10v-5z" clipRule="evenodd" />
                </svg>
                Better Auth
              </a>
              <a href="https://orm.drizzle.team/" target="_blank" rel="noopener">
                <svg viewBox="0 0 70 55" fill="#C5F74F" aria-hidden="true">
                  <rect
                    width="5.254"
                    height="22.283"
                    rx="2.627"
                    transform="matrix(0.873 0.488 -0.497 0.868 16.079 30.329)"
                  />
                  <rect
                    width="5.254"
                    height="22.283"
                    rx="2.627"
                    transform="matrix(0.873 0.488 -0.497 0.868 34.33 19)"
                  />
                  <rect
                    width="5.254"
                    height="22.283"
                    rx="2.627"
                    transform="matrix(0.873 0.488 -0.497 0.868 62.413 19)"
                  />
                  <rect
                    width="5.254"
                    height="22.283"
                    rx="2.627"
                    transform="matrix(0.873 0.488 -0.497 0.868 44.156 30.329)"
                  />
                </svg>
                Drizzle
              </a>
              <a href="https://orpc.dev/" target="_blank" rel="noopener">
                <img src="https://orpc.dev/logo.webp" width="20" height="20" alt="" aria-hidden="true" />
                oRPC
              </a>
              <a href="https://resend.com/" target="_blank" rel="noopener">
                <svg viewBox="0 0 1800 1800" aria-hidden="true">
                  <path
                    d="M1000.46 450C1174.77 450 1278.43 553.669 1278.43 691.282C1278.43 828.896 1174.77 932.563 1000.46 932.563H912.382L1350 1350H1040.82L707.794 1033.48C683.944 1011.47 672.936 985.781 672.935 963.765C672.935 932.572 694.959 905.049 737.161 893.122L908.712 847.244C973.85 829.812 1018.81 779.353 1018.81 713.298C1018.8 632.567 952.745 585.78 871.095 585.78H450V450H1000.46Z"
                    fill="currentColor"
                  />
                </svg>
                Resend
              </a>
              <a href="https://posthog.com/" target="_blank" rel="noopener">
                <svg viewBox="0 0 300 300" aria-hidden="true">
                  <path
                    fill="#fff"
                    d="M33 179.379L72.004 218.33H33V179.379ZM33 169.641L81.755 218.33H120.759L33 130.689V169.641ZM33 120.951L130.51 218.33H169.513L33 82V120.951ZM81.755 120.951L179.264 218.33V179.379L81.755 82V120.951ZM130.51 82V120.951L179.264 169.641V130.689L130.51 82Z"
                  />
                  <path
                    fill="#fff"
                    d="M266.863 203.174C256.87 203.174 247.291 199.208 240.231 192.158L186 138V218.754H266.863V203.174Z"
                  />
                  <circle cx="209.563" cy="194.959" r="7.8" fill="#000" />
                </svg>
                PostHog
              </a>
              <a href="https://playwright.dev/" target="_blank" rel="noopener">
                <svg viewBox="0 0 400 400" fill="none" aria-hidden="true">
                  <path
                    d="M161.661 262.296V239.863L99.332 257.537C99.332 257.537 103.938 230.777 136.444 221.556C146.302 218.762 154.713 218.781 161.661 220.123V128.11H192.869C189.471 117.61 186.184 109.526 183.423 103.909C178.856 94.612 174.174 100.775 163.545 109.665C156.059 115.919 137.139 129.261 108.668 136.933C80.197 144.61 57.179 142.574 47.575 140.911C33.96 138.562 26.839 135.572 27.505 145.928C28.085 155.062 30.261 169.224 35.245 187.928C46.027 228.433 81.663 306.481 149.01 288.342C166.602 283.602 179.019 274.233 187.626 262.291H161.661ZM61.085 188.484L108.946 175.876C108.946 175.876 107.551 194.288 89.609 199.018C71.661 203.743 61.085 188.484 61.085 188.484Z"
                    fill="#E2574C"
                  />
                  <path
                    d="M341.786 129.174C329.345 131.355 299.498 134.072 262.612 124.185C225.716 114.304 201.236 97.022 191.537 88.899C177.788 77.383 171.74 69.38 165.788 81.486C160.526 92.163 153.797 109.54 147.284 133.866C133.171 186.543 122.623 297.706 209.867 321.098C297.093 344.47 343.53 242.92 357.644 190.238C364.157 165.917 367.013 147.5 367.799 135.625C368.695 122.173 359.455 126.078 341.786 129.174ZM166.497 172.756C166.497 172.756 180.246 151.372 203.565 158C226.899 164.628 228.706 190.425 228.706 190.425L166.497 172.756ZM223.42 268.713C182.403 256.698 176.077 223.99 176.077 223.99L286.262 254.796C286.262 254.791 264.021 280.578 223.42 268.713ZM262.377 201.495C262.377 201.495 276.107 180.126 299.422 186.773C322.736 193.411 324.572 219.208 324.572 219.208L262.377 201.495Z"
                    fill="#2EAD33"
                  />
                </svg>
                Playwright
              </a>
            </div>
          </section>

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
                    Auth, API, database, email, i18n, observability, and CI/CD — all wired up and working together. Not
                    a skeleton — a foundation you can ship on.
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
                    </a>{" "}
                    +
                    <a href="https://oxc.rs/docs/guide/usage/formatter" target="_blank" rel="noopener">
                      Oxfmt
                    </a>{" "}
                    +
                    <a
                      href="https://github.com/nicolo-ribaudo/tc39-proposal-type-annotations"
                      target="_blank"
                      rel="noopener"
                    >
                      tsgo
                    </a>
                    +{" "}
                    <a href="https://syncpack.dev/" target="_blank" rel="noopener">
                      syncpack
                    </a>{" "}
                    +
                    <a href="https://knip.dev/" target="_blank" rel="noopener">
                      Knip
                    </a>{" "}
                    +
                    <a href="https://playwright.dev/" target="_blank" rel="noopener">
                      Playwright
                    </a>
                    . Pre-commit hooks, supply chain scanning, and one command (<code>bun ok</code>) that validates
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
                    Wrangler provisions D1, applies migrations, and deploys the Worker — all in one step. CI
                    auto-deploys on push to main.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="more">
            <div className="more-inner">
              <div className="section-header">
                <h2>And more</h2>
                <p>Everything you need, already wired up.</p>
              </div>
              <div className="more-grid">
                <div className="more-item animate-on-scroll">
                  <div className="more-item-img">{/* TODO: add OG image screenshot */}</div>
                  <div className="more-item-body">
                    <h3>Dynamic OG Images with i18n</h3>
                    <p>
                      Auto-generated Open Graph images per page with full internationalization support. Every route gets
                      a unique, localized social preview out of the box.
                    </p>
                  </div>
                </div>
                <div className="more-item animate-on-scroll">
                  <div className="more-item-img">{/* TODO: add email template screenshot */}</div>
                  <div className="more-item-body">
                    <h3>Transactional Emails</h3>
                    <p>
                      React Email templates with Resend, fully i18n-ready. Welcome emails, password resets, magic links
                      — styled, tested, and localized.
                    </p>
                  </div>
                </div>
                <div className="more-item animate-on-scroll">
                  <div className="more-item-img">{/* TODO: add auth screenshot */}</div>
                  <div className="more-item-body">
                    <h3>Auth That Just Works</h3>
                    <p>
                      Email/password, passkeys, Google OAuth, magic links, and admin roles. Session storage on
                      Cloudflare KV with rate limiting built in.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="showcase">
            <div className="showcase-grid">
              <div className="showcase-content">
                <h2>
                  Built for
                  <br />
                  <span className="highlight-violet">AI-assisted development</span>
                </h2>
                <p>
                  Cast isn't just AI-compatible — it's designed from the ground up for AI agents to be productive from
                  the first prompt. Detailed project instructions, auto-invoked skills per domain, and a dependency
                  graph that AI can reason about.
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

          <section className="quickstart">
            <div className="quickstart-inner">
              <h2>Get started</h2>
              <p className="quickstart-sub">Scaffold, install, dev. Done.</p>
              <div className="code-block">
                <div className="code-header">
                  <div className="macos-dots">
                    <span></span>
                    <span></span>
                    <span></span>
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
        </div>

        {/* ════════════════════════════════════════════ */}
        {/* PROSPECT */}
        {/* ════════════════════════════════════════════ */}
        <div className="pkg-page" id="page-prospect" style={{ position: "relative" }} hidden={activePkg !== "prospect"}>
          <div className="hero-bg-cast">
            <img src="bg-prospect.webp" alt="" />
          </div>
          <section className="hero">
            <h1>
              The full Playwright
              <br />
              companion.
            </h1>
            <p className="hero-desc">
              Coverage mapping, flakiness tracking, test artifacts, and a dev overlay — all in one package. Your AI
              agent scans every route, applies <code>data-test-id</code>, and builds the coverage file. You see
              everything in an overlay without leaving your app.
            </p>
            <div className="hero-cmd hero-cmd--pm" data-pm-group="prospect-hero">
              <PmTabs active={activePm} onSwitch={setActivePm} />
              <div className="hero-cmd-line">
                <span className="prompt">$</span>
                <span className="cmd">
                  <span className="cmd-green">{pm.bin}</span> <span className="cmd-amber">{pm.args}</span>
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
              <a
                href="https://www.npmjs.com/package/@ingot/prospect"
                target="_blank"
                rel="noopener"
                className="hero-link"
              >
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M0 0v16h16V0H0zm13 13H8V5H5v8H3V3h10v10z" fill="currentColor" />
                </svg>
                npm
              </a>
            </div>
          </section>

          <section className="trust">
            <p className="trust-label">Built with</p>
            <div className="trust-logos">
              <a href="https://playwright.dev/" target="_blank" rel="noopener">
                <svg viewBox="0 0 400 400" fill="none" aria-hidden="true">
                  <path
                    d="M136.444 221.556C123.558 225.213 115.104 231.625 109.535 238.032C114.869 233.364 122.014 229.08 131.652 226.348C141.51 223.554 149.92 223.574 156.869 224.915V219.481C150.941 218.939 144.145 219.371 136.444 221.556Z"
                    fill="#2D4552"
                  />
                  <path
                    d="M149.005 288.347C81.6582 306.486 46.0272 228.438 35.2396 187.928C30.2556 169.229 28.0799 155.067 27.5 145.928L27.5336 143.446C24.04 143.657 22.3674 145.473 22.7077 150.721C23.2876 159.855 25.4633 174.016 30.4473 192.721C41.2301 233.225 76.8659 311.273 144.213 293.134C158.872 289.185 169.885 281.992 178.152 272.81C170.532 279.692 160.995 285.112 149.005 288.347Z"
                    fill="#2D4552"
                  />
                  <path d="M161.661 128.11V132.903H188.077L186.447 128.11H161.661Z" fill="#2D4552" />
                  <path
                    d="M299.422 186.777C277.573 180.547 264.145 198.916 262.535 201.255C268.89 196.736 278.158 193.031 289.837 196.362C301.698 199.741 307.976 208.06 311.307 215.436L324.572 219.212C324.572 219.212 322.736 193.41 299.422 186.777Z"
                    fill="#2D4552"
                  />
                  <path
                    d="M193.981 167.584C205.861 170.958 212.144 179.287 215.465 186.658L228.711 190.42C228.711 190.42 226.904 164.623 203.57 157.995C181.741 151.793 168.308 170.124 166.674 172.496C173.024 167.972 182.297 164.268 193.981 167.584Z"
                    fill="#2D4552"
                  />
                  <path
                    d="M161.661 262.296V239.863L99.3324 257.537C99.3324 257.537 103.938 230.777 136.444 221.556C146.302 218.762 154.713 218.781 161.661 220.123V128.11H192.869C189.471 117.61 186.184 109.526 183.423 103.909C178.856 94.612 174.174 100.775 163.545 109.665C156.059 115.919 137.139 129.261 108.668 136.933C80.1966 144.61 57.179 142.574 47.5752 140.911C33.9601 138.562 26.8387 135.572 27.5049 145.928C28.0847 155.062 30.2605 169.224 35.2445 187.928C46.0272 228.433 81.663 306.481 149.01 288.342C166.602 283.602 179.019 274.233 187.626 262.291H161.661ZM61.0848 188.484L108.946 175.876C108.946 175.876 107.551 194.288 89.6087 199.018C71.6614 203.743 61.0848 188.484 61.0848 188.484Z"
                    fill="#E2574C"
                  />
                  <path
                    d="M341.786 129.174C329.345 131.355 299.498 134.072 262.612 124.185C225.716 114.304 201.236 97.0224 191.537 88.8994C177.788 77.3834 171.74 69.3802 165.788 81.4857C160.526 92.163 153.797 109.54 147.284 133.866C133.171 186.543 122.623 297.706 209.867 321.098C297.093 344.47 343.53 242.92 357.644 190.238C364.157 165.917 367.013 147.5 367.799 135.625C368.695 122.173 359.455 126.078 341.786 129.174ZM166.497 172.756C166.497 172.756 180.246 151.372 203.565 158C226.899 164.628 228.706 190.425 228.706 190.425L166.497 172.756ZM223.42 268.713C182.403 256.698 176.077 223.99 176.077 223.99L286.262 254.796C286.262 254.791 264.021 280.578 223.42 268.713ZM262.377 201.495C262.377 201.495 276.107 180.126 299.422 186.773C322.736 193.411 324.572 219.208 324.572 219.208L262.377 201.495Z"
                    fill="#2EAD33"
                  />
                  <path
                    d="M286.262 254.795L176.072 223.99C176.072 223.99 177.265 230.038 181.842 237.869L274.617 263.805C282.255 259.386 286.262 254.795 286.262 254.795Z"
                    fill="#2D4552"
                  />
                  <path
                    d="M108.946 175.876L61.0895 188.484C61.0895 188.484 61.9617 189.716 63.5767 191.36L104.153 180.668C104.153 180.668 103.578 188.077 98.5847 194.705C108.03 187.559 108.946 175.876 108.946 175.876Z"
                    fill="#2D4552"
                  />
                </svg>
                Playwright
              </a>
              <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="#3178C6" aria-hidden="true">
                  <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
                </svg>
                TypeScript
              </a>
              <a href="https://bun.sh/" target="_blank" rel="noopener">
                <svg viewBox="0 0 80 70" fill="none" aria-hidden="true">
                  <path
                    d="M73 35.7C73 50.91 57.33 63.24 38 63.24C18.67 63.24 3 50.91 3 35.7C3 26.27 9 17.94 18.22 13C27.44 8.06 33.18 3 38 3C42.82 3 46.94 7.13 57.78 13C67 17.94 73 26.27 73 35.7Z"
                    fill="#FBF0DF"
                  />
                  <path
                    d="M73 35.7C72.995 33.746 72.726 31.802 72.2 29.92C69.47 63.22 28.85 64.82 12.88 54.86C20.06 60.42 28.92 63.38 38 63.24C57.3 63.24 73 50.89 73 35.7Z"
                    fill="#F6DECE"
                  />
                  <path
                    d="M38 65.75C17.32 65.75.5 52.27.5 35.7.5 25.7 6.68 16.37 17.03 10.78c3-1.6 5.57-3.21 7.86-4.62C26.15 5.38 27.34 4.65 28.49 3.97 32 1.89 35 .5 38 .5s5.62 1.2 8.9 3.14c1 .57 2 1.19 3.07 1.87 2.49 1.54 5.3 3.28 9 5.27C69.32 16.37 75.5 25.69 75.5 35.7c0 16.57-16.82 30.05-37.5 30.05ZM38 3c-2.42 0-5 1.25-8.25 3.13-1.13.66-2.3 1.39-3.54 2.15-2.33 1.44-5 3.07-8 4.7C8.69 18.13 3 26.62 3 35.7 3 50.89 18.7 63.25 38 63.25S73 50.89 73 35.7C73 26.62 67.31 18.13 57.78 13c-3.78-2-6.73-3.88-9.12-5.36-1.09-.67-2.09-1.29-3-1.84C42.63 4 40.42 3 38 3Z"
                    fill="black"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M25.7 38.8a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Zm24.77 0a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z"
                    fill="black"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M24 33.64a2.07 2.07 0 1 0 0-4.14 2.07 2.07 0 0 0 0 4.14Zm24.77 0a2.07 2.07 0 1 0 0-4.14 2.07 2.07 0 0 0 0 4.14Z"
                    fill="white"
                  />
                  <path
                    d="M45.05 43a7.85 7.85 0 0 1-2.92 4.71 5.33 5.33 0 0 1-4 1.88 5.33 5.33 0 0 1-4.13-1.88A7.85 7.85 0 0 1 31.12 43a.35.35 0 0 1 .8-.01h12.34a.35.35 0 0 1 .79.01Z"
                    fill="#B71422"
                  />
                </svg>
                Bun
              </a>
            </div>
          </section>

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
                    See coverage, flakiness, and test videos directly in your app. Green for covered, red for gaps,
                    amber for flaky. Click any element to watch its test run.
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
                    Playwright reporter stores every run locally. Track pass rates, spot flaky tests, browse artifacts —
                    no external service, no per-seat pricing.
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
                    Videos, screenshots, and traces stored locally. Watch any test run from the overlay — even passing
                    tests — to see exactly what each test does.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="showcase">
            <div className="showcase-grid">
              <div className="showcase-content">
                <h2>
                  Coverage as <span className="highlight-green">code</span>
                </h2>
                <p>
                  Map every route's interactive elements to tests. Mark gaps with <code>null</code>. The overlay shows
                  it all visually — coverage, flakiness, and test videos — right in your running app.
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

          <section className="quickstart">
            <div className="quickstart-inner">
              <h2>Get started</h2>
              <p className="quickstart-sub">Install, define, validate.</p>
              <div className="code-block" data-pm-group="prospect-quickstart">
                <div className="code-header">
                  <div className="macos-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <PmTabs active={activePm} onSwitch={setActivePm} />
                </div>
                <pre>
                  <code>
                    <span className="prompt">$</span>{" "}
                    <span className="cmd">
                      <span className="cmd-green">{pm.bin}</span> <span className="cmd-amber">{pm.args}</span>
                    </span>
                  </code>
                  <CopyButton text="bunx @ingot/cast" />
                </pre>
              </div>
            </div>
          </section>
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
