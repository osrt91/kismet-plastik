/**
 * Single source of truth for supported locales.
 * Used by both middleware (proxy.ts) and i18n system (i18n.ts).
 */
export const locales = ["tr", "en", "ar", "ru", "fr", "de", "es", "zh", "ja", "ko", "pt"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

export const localeNames: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  ar: "العربية",
  ru: "Русский",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  pt: "Português",
};

export const localeDirections: Partial<Record<Locale, "rtl">> = {
  ar: "rtl",
};

/** Map short locale code to full Intl locale string for formatting */
const intlLocaleMap: Record<string, string> = {
  tr: "tr-TR",
  en: "en-US",
  ar: "ar-SA",
  ru: "ru-RU",
  fr: "fr-FR",
  de: "de-DE",
  es: "es-ES",
  pt: "pt-PT",
  zh: "zh-CN",
  ja: "ja-JP",
  ko: "ko-KR",
};

export function toIntlLocale(locale: string): string {
  return intlLocaleMap[locale] || "tr-TR";
}
