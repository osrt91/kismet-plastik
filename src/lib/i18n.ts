import tr from "@/locales/tr.json";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

export type Locale = "tr" | "en" | "ar";

const dictionaries: Record<Locale, typeof tr> = { tr, en, ar };

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? tr;
}
