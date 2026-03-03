import tr from "@/locales/tr.json";
import en from "@/locales/en.json";

export type Locale = "tr" | "en";

const dictionaries: Record<Locale, typeof tr> = { tr, en };

/**
 * Returns the translation dictionary for the given locale.
 * Falls back to Turkish (tr) if the locale is not recognized.
 * @param locale - The locale identifier ("tr" or "en")
 * @returns Translation dictionary object
 */
export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? tr;
}
