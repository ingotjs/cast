import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@ingot/ui/components/dropdown-menu";
import { useLingui } from "@lingui/react";
import { Languages } from "lucide-react";

import { LOCALE_LABELS, LOCALES } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const setLocaleCookie = (locale: string) => {
  document.cookie = `locale=${locale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
};

export const LocaleSwitcher = () => {
  const { i18n } = useLingui();
  const currentLocale = i18n.locale as Locale;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-testid="locale-switcher-button-trigger"
        className="cursor-pointer rounded-xl p-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
        aria-label="Change language"
      >
        <Languages className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8}>
        <DropdownMenuRadioGroup
          value={currentLocale}
          onValueChange={(locale) => {
            if (locale === currentLocale) {
              return;
            }
            setLocaleCookie(locale);
            window.location.reload();
          }}
        >
          {LOCALES.map((locale) => (
            <DropdownMenuRadioItem key={locale} value={locale} data-testid={`locale-switcher-item-${locale}`}>
              {LOCALE_LABELS[locale]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
