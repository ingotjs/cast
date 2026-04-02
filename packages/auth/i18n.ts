// Reference: https://better-auth.com/docs/plugins/i18n
// Reference: https://better-auth.com/docs/reference/errors

import { setupI18n } from "@lingui/core";
import type { I18n } from "@lingui/core";

import { messages as enMessages } from "./locales/en/messages";

const catalogs: Record<string, Record<string, string>> = { en: enMessages };

/** Create an i18n instance for auth translations with the given locale */
export const createAuthI18n = (locale = "en"): I18n => {
  const messages = catalogs[locale] ?? catalogs.en!;
  const i18n = setupI18n();
  i18n.load(locale, messages);
  i18n.activate(locale);
  return i18n;
};

const AUTH_PREFIX = "auth_";
const locales = ["en"] as const;
const baseLocale = "en";

/**
 * Build Better Auth i18n translations from Lingui catalogs.
 *
 * Skips the base locale (English) — Better Auth already provides English defaults.
 * Returns `null` when only the base locale is configured (no translations needed).
 *
 * When a new locale is added, add its compiled catalog to the `catalogs` map above
 * and add it to the `locales` array. The `auth_*` messages in the PO file
 * automatically flow through.
 */
export const buildAuthTranslations = (): Record<string, Record<string, string>> | null => {
  const translations: Record<string, Record<string, string>> = {};

  for (const locale of locales) {
    if (locale === baseLocale) {
      continue;
    }

    const catalog = catalogs[locale];
    if (!catalog) {
      continue;
    }

    const i18n = setupI18n();
    i18n.load(locale, catalog);
    i18n.activate(locale);
    translations[locale] = {};

    for (const key of Object.keys(catalog)) {
      if (key.startsWith(AUTH_PREFIX)) {
        const errorCode = key.slice(AUTH_PREFIX.length);
        translations[locale][errorCode] = i18n._(key);
      }
    }
  }

  return Object.keys(translations).length === 0 ? null : translations;
};
