import { type I18n, setupI18n } from "@lingui/core";

import { messages as enMessages } from "./locales/en/messages";

const catalogs: Record<string, Record<string, string>> = { en: enMessages as Record<string, string> };

/** Create an i18n instance for auth translations with the given locale */
export const createAuthI18n = (locale = "en"): I18n => {
  const messages = catalogs[locale] ?? catalogs.en!;
  const i18n = setupI18n();
  i18n.load(locale, messages);
  i18n.activate(locale);
  return i18n;
};
