// Reference: https://better-auth.com/docs/plugins/i18n
// Reference: https://better-auth.com/docs/reference/errors

import * as messages from "./paraglide/messages";
import { locales } from "./paraglide/runtime";

const AUTH_PREFIX = "auth_";

/**
 * Build Better Auth i18n translations from Paraglide server messages.
 *
 * Dynamically iterates over all `auth_*` Paraglide message functions and maps
 * them to Better Auth error codes for each configured locale. When a new locale
 * is added to `packages/server/project.inlang/settings.json`, translations
 * automatically flow through without code changes.
 */
export const buildAuthTranslations = (): Record<
  string,
  Record<string, string>
> => {
  const translations: Record<string, Record<string, string>> = {};

  for (const locale of locales) {
    translations[locale] = {};

    for (const [key, fn] of Object.entries(messages)) {
      if (key.startsWith(AUTH_PREFIX) && typeof fn === "function") {
        const errorCode = key.slice(AUTH_PREFIX.length);
        translations[locale][errorCode] = (
          fn as (options: { locale: string }) => string
        )({ locale });
      }
    }
  }

  return translations;
};
