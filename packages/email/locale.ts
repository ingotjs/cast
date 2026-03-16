/**
 * Bridge between string locale values and Paraglide's narrow locale literal types.
 *
 * Paraglide generates `{ locale?: "en" | "de" | ... }` based on configured locales.
 * Since we store user locales as plain strings, we need this cast. At runtime,
 * Paraglide falls back to the base locale for unknown locales.
 */
export const loc = (locale: string) => ({ locale: locale as never });
