import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "auto";

const getInitialMode = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "auto";
  }

  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark" || stored === "auto") {
    return stored;
  }

  return "auto";
};

const applyThemeMode = (mode: ThemeMode) => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  let resolved: "light" | "dark";
  if (mode === "auto") {
    resolved = prefersDark ? "dark" : "light";
  } else {
    resolved = mode;
  }

  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(resolved);

  if (mode === "auto") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = mode;
  }

  document.documentElement.style.colorScheme = resolved;
};

export const ThemeToggle = () => {
  const [mode, setMode] = useState<ThemeMode>("auto");

  useEffect(() => {
    const initialMode = getInitialMode();
    setMode(initialMode);
    applyThemeMode(initialMode);
  }, []);

  useEffect(() => {
    if (mode !== "auto") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyThemeMode("auto");

    media.addEventListener("change", onChange);
    return () => {
      media.removeEventListener("change", onChange);
    };
  }, [mode]);

  // oxlint-disable-next-line react-perf/jsx-no-new-function-as-prop -- React Compiler handles memoization
  const toggleMode = () => {
    const modeMap: Record<ThemeMode, ThemeMode> = {
      light: "dark",
      dark: "auto",
      auto: "light",
    };
    const nextMode = modeMap[mode];
    setMode(nextMode);
    applyThemeMode(nextMode);
    window.localStorage.setItem("theme", nextMode);
  };

  const label =
    mode === "auto"
      ? "Theme mode: auto (system). Click to switch to light mode."
      : `Theme mode: ${mode}. Click to switch mode.`;

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 font-semibold text-[var(--sea-ink)] text-sm shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5"
    >
      {{ auto: "Auto", dark: "Dark", light: "Light" }[mode]}
    </button>
  );
};
