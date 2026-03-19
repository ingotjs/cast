// Reference: https://better-auth.com/docs/plugins/i18n
// Reference: https://better-auth.com/docs/reference/errors

import { setupI18n } from "@lingui/core";

const AUTH_PREFIX = "auth_";
const locales = ["en"] as const;
const baseLocale = "en";

/**
 * Build Better Auth i18n translations from Lingui catalogs.
 *
 * Skips the base locale (English) — Better Auth already provides English defaults.
 * Only generates translations for non-default locales.
 *
 * Returns `null` when only the base locale is configured (no translations needed).
 * The i18n plugin should not be added in this case.
 *
 * When a new locale is added, import its compiled catalog, add it to the `catalogs`
 * map, and add it to the `locales` array. The `auth_*` messages in the PO file
 * automatically flow through — no code changes needed beyond the import.
 *
 * This file only covers base + passkey error codes — not admin or other plugin
 * codes. Admin errors are internal and don't need i18n. To add error codes from
 * another Better Auth plugin, add `auth_{ERROR_CODE}` entries to the PO catalog
 * and recompile.
 */
export const buildAuthTranslations = (): Record<string, Record<string, string>> | null => {
  const translations: Record<string, Record<string, string>> = {};

  for (const locale of locales) {
    // Skip base locale — Better Auth provides English defaults natively
    if (locale === baseLocale) {
      continue;
    }

    // For non-English locales, dynamically import the compiled catalog
    // and iterate auth_ prefixed messages
    const catalog = getCatalog(locale);
    if (!catalog) continue;

    const i18n = setupI18n();
    i18n.load(locale, catalog as Record<string, string>);
    i18n.activate(locale);
    translations[locale] = {};

    for (const key of Object.keys(catalog)) {
      if (key.startsWith(AUTH_PREFIX)) {
        const errorCode = key.slice(AUTH_PREFIX.length);
        translations[locale][errorCode] = i18n._(key);
      }
    }
  }

  // Return null when no non-default locales exist — i18n plugin should not be added
  if (Object.keys(translations).length === 0) {
    return null;
  }

  return translations;
};

/** Get a compiled catalog for the given locale. Add imports here when adding locales. */
const getCatalog = (_locale: string): Record<string, unknown> | null => {
  // Currently only English is configured — non-English catalogs can be added here:
  // if (locale === "fr") return frMessages;
  return null;
};
