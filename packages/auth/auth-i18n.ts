// Reference: https://better-auth.com/docs/plugins/i18n
// Reference: https://better-auth.com/docs/reference/errors

import * as messages from "./paraglide/messages";
import { baseLocale, locales } from "./paraglide/runtime";

const AUTH_PREFIX = "auth_";

/**
 * Build Better Auth i18n translations from Paraglide server messages.
 *
 * Skips the base locale (English) — Better Auth already provides English defaults.
 * Only generates translations for non-default locales. The `auth_*` keys in
 * `packages/auth/messages/en.json` serve as the canonical key list and
 * translation reference for Paraglide, not as runtime English overrides.
 *
 * Returns `null` when only the base locale is configured (no translations needed).
 * The i18n plugin should not be added in this case.
 *
 * When a new locale is added to `project.inlang/settings.json` with `auth_*`
 * translations, they automatically flow through — no code changes needed.
 *
 * This file only covers base + passkey error codes — not admin or other plugin
 * codes. Admin errors are internal and don't need i18n. To add error codes from
 * another Better Auth plugin, add `auth_{ERROR_CODE}` keys to `en.json` matching
 * the plugin's `$ERROR_CODES` export, then compile Paraglide (`bun run build`
 * in `packages/auth`).
 */
export const buildAuthTranslations = (): Record<string, Record<string, string>> | null => {
  const translations: Record<string, Record<string, string>> = {};

  for (const locale of locales) {
    // Skip base locale — Better Auth provides English defaults natively
    if (locale === baseLocale) {
      continue;
    }

    translations[locale] = {};

    for (const [key, fn] of Object.entries(messages)) {
      if (key.startsWith(AUTH_PREFIX) && typeof fn === "function") {
        const errorCode = key.slice(AUTH_PREFIX.length);
        translations[locale][errorCode] = (fn as (options: { locale: string }) => string)({ locale });
      }
    }
  }

  // Return null when no non-default locales exist — i18n plugin should not be added
  if (Object.keys(translations).length === 0) {
    return null;
  }

  return translations;
};
