// Reference: https://lingui.dev/tutorials/react-rsc

import { type I18n, setupI18n } from "@lingui/core";

/** Available locales — update when adding a new language */
export const LOCALES = ["en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Display labels for each locale */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
};

/** Router context — i18n instance flows through TanStack Router context */
export type RouterContext = { i18n: I18n };

/** Load a catalog for the given locale and return a configured i18n instance */
export const loadCatalog = async (locale: string): Promise<I18n> => {
  const { messages } = await import(`../locales/${locale}/messages.po`);
  const i18n = setupI18n({ locale, messages: { [locale]: messages } });
  return i18n;
};

/** Detect locale from a request (cookie → Accept-Language → default) */
export const detectLocale = (req: Request): string => {
  const cookie = req.headers.get("cookie");
  if (cookie) {
    const match = cookie.match(/(?:^|;\s*)locale=([a-z]{2}(?:-[A-Z]{2})?)/);
    if (match?.[1]) return match[1];
  }

  const acceptLang = req.headers.get("accept-language");
  if (acceptLang) {
    const preferred = acceptLang.split(",")[0]?.split("-")[0]?.trim();
    if (preferred && (LOCALES as readonly string[]).includes(preferred)) return preferred;
  }

  return "en";
};

/** Detect locale on the client from the SSR-rendered <html lang> attribute */
export const detectClientLocale = (): string => {
  return document.documentElement.lang || "en";
};
