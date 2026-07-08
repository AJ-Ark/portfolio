/* ═══════════════════════════════════════════════════════════════════
   Lightweight i18n system: auto-detect browser language, load translations,
   provide useTranslation hook to components.
   ═══════════════════════════════════════════════════════════════════ */

export const SUPPORTED_LANGUAGES = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  zh: "中文 (简体)",
  ja: "日本語",
  ar: "العربية",
  pt: "Português",
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

const DEFAULT_LANGUAGE: LanguageCode = "en";
const STORAGE_KEY = "__portfolio_lang";

/* Detect browser language from navigator.language or Accept-Language header */
export function detectBrowserLanguage(): LanguageCode {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && stored in SUPPORTED_LANGUAGES) {
    return stored as LanguageCode;
  }

  const browserLang = navigator.language.toLowerCase();
  const langCode = browserLang.split("-")[0];

  if (langCode in SUPPORTED_LANGUAGES) {
    return langCode as LanguageCode;
  }

  return DEFAULT_LANGUAGE;
}

/* Save user's language choice to localStorage */
export function setLanguage(lang: LanguageCode) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, lang);
  }
}

/* Load translation file for a language */
const translationCache: Partial<Record<LanguageCode, Record<string, string>>> = {};

export async function loadTranslations(
  lang: LanguageCode
): Promise<Record<string, string>> {
  if (translationCache[lang]) {
    return translationCache[lang];
  }

  try {
    const response = await fetch(`/messages/${lang}.json`);
    if (!response.ok) {
      console.warn(`Translation file for ${lang} not found, using English`);
      // Base case: if English itself is unavailable, return {} — t() falls
      // back to the bundled en.json, and recursing here would loop forever.
      return lang === "en" ? {} : await loadTranslations("en");
    }
    const messages = await response.json();
    translationCache[lang] = messages;
    return messages;
  } catch (error) {
    console.error(`Failed to load translations for ${lang}:`, error);
    return lang === "en" ? {} : await loadTranslations("en");
  }
}

/* Simple translation function */
export function translate(
  key: string,
  translations: Record<string, string>
): string {
  return translations[key] || key;
}

/* Get the current language from server or fallback to English */
export function getCurrentLanguageServer(): LanguageCode {
  return DEFAULT_LANGUAGE;
}

/* Check if a language is RTL (Arabic, Hebrew, etc.) */
export function isRTL(lang: LanguageCode): boolean {
  return ["ar", "he"].includes(lang);
}
