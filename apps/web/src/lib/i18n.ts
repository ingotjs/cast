// Reference: https://lingui.dev/tutorials/react-rsc
// Reference: https://github.com/lingui/js-lingui/pull/2267

import { type I18n, setupI18n } from "@lingui/core";

/** Available locales — update when adding a new language */
export const LOCALES = ["en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Display labels for each locale */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
};

// --- Server: per-request i18n via AsyncLocalStorage (SSR-safe) ---
// --- Client: module-level singleton ---

let clientI18n: I18n | undefined;

// Cloudflare Workers supports AsyncLocalStorage with nodejs_compat
// Dynamic import avoids breaking client-side bundles
let i18nStorage: InstanceType<typeof import("node:async_hooks").AsyncLocalStorage<I18n>> | undefined;

try {
  // Available in Node.js and Cloudflare Workers (nodejs_compat)
  // Not available in browsers — caught and ignored
  const { AsyncLocalStorage } = await import("node:async_hooks");
  i18nStorage = new AsyncLocalStorage<I18n>();
} catch {
  // Client-side: async_hooks not available
}

// On the client, eagerly load the default locale catalog so getI18n() works
// before I18nProvider mounts (e.g. during hydration when head() is called).
if (!i18nStorage) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- .po resolved by Lingui Vite plugin
  const mod = await import(`../locales/${"en"}/messages.po`);
  clientI18n = setupI18n({ locale: "en", messages: { en: (mod as { messages: Record<string, string> }).messages } });
}

/** Get the current i18n instance (server: per-request, client: singleton) */
export const getI18n = (): I18n => {
  const serverInstance = i18nStorage?.getStore();
  if (serverInstance) return serverInstance;
  if (clientI18n) return clientI18n;
  throw new Error("i18n not initialized");
};

/** Set the client-side i18n singleton (called once during hydration) */
export const setClientI18n = (i18n: I18n): void => {
  clientI18n = i18n;
};

/** Run a function with a per-request i18n instance (server-side) */
export const runWithI18n = <T>(i18n: I18n, fn: () => T): T => {
  if (!i18nStorage) return fn();
  return i18nStorage.run(i18n, fn);
};

/** Load a catalog for the given locale and return a configured i18n instance */
export const loadCatalog = async (locale: string): Promise<I18n> => {
  const { messages } = await import(`../locales/${locale}/messages.po`);
  const i18n = setupI18n({ locale, messages: { [locale]: messages } });
  return i18n;
};

/** Detect locale from a request (cookie → Accept-Language → default) */
export const detectLocale = (req: Request): string => {
  // Check cookie
  const cookie = req.headers.get("cookie");
  if (cookie) {
    const match = cookie.match(/(?:^|;\s*)locale=([a-z]{2}(?:-[A-Z]{2})?)/);
    if (match?.[1]) return match[1];
  }

  // Check Accept-Language header
  const acceptLang = req.headers.get("accept-language");
  if (acceptLang) {
    const preferred = acceptLang.split(",")[0]?.split("-")[0]?.trim();
    if (preferred && ["en"].includes(preferred)) return preferred;
  }

  return "en";
};
