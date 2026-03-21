import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const getInitialMode = (): ThemeMode => {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyThemeMode = (mode: ThemeMode) => {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(mode);
  document.documentElement.dataset.theme = mode;
  document.documentElement.style.colorScheme = mode;
};

export const ThemeToggle = () => {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const initial = getInitialMode();
    setMode(initial);
    applyThemeMode(initial);
  }, []);

  const toggleMode = () => {
    const next: ThemeMode = mode === "light" ? "dark" : "light";
    setMode(next);
    applyThemeMode(next);
    window.localStorage.setItem("theme", next);
  };

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
      data-testid="header-button-theme-toggle"
      className="rounded-xl p-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
    >
      {mode === "light" ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
};
