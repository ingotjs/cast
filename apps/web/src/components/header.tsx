import { Logo } from "@ingot/ui/components/logo";
import { consts } from "@ingot/utils/consts";
import { Link } from "@tanstack/react-router";

import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export const Header = () => (
  <header className="sticky top-0 z-50 border-[var(--line)] border-b bg-[var(--header-bg)] px-4 backdrop-blur-lg">
    <nav className="page-wrap flex items-center justify-between py-3 sm:py-4">
      <div className="flex items-center gap-6">
        <Link to="/" className="no-underline" data-testid="header-link-logo">
          <Logo name={consts.appName} className="text-[var(--sea-ink)]" />
        </Link>

        <div className="hidden items-center gap-4 font-semibold text-sm sm:flex">
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: "nav-link is-active" }}
            data-testid="header-link-home"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="nav-link"
            activeProps={{ className: "nav-link is-active" }}
            data-testid="header-link-about"
          >
            About
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <LocaleSwitcher />
        <ThemeToggle />
        <UserMenu />
      </div>
    </nav>
  </header>
);
