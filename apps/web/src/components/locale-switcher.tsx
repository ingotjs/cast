import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@ingot/ui/components/dropdown-menu";
import { useLingui } from "@lingui/react";

import { type Locale, LOCALE_LABELS, LOCALES } from "@/lib/i18n";

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
        className="cursor-pointer rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 font-semibold text-[var(--sea-ink)] text-sm uppercase shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5"
      >
        {currentLocale}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8}>
        <DropdownMenuRadioGroup
          value={currentLocale}
          onValueChange={(locale) => {
            if (locale === currentLocale) return;
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
