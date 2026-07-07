"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  detectBrowserLanguage,
  loadTranslations,
  isRTL,
  type LanguageCode,
} from "./i18n";

interface TranslationContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  translations: Record<string, string>;
  t: (key: string) => string;
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isRTLMode, setIsRTLMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const detectedLang = detectBrowserLanguage();
    setLanguageState(detectedLang);
    setIsRTLMode(isRTL(detectedLang));
    loadTranslations(detectedLang).then(setTranslations);
    setMounted(true);

    // Apply RTL to HTML element if needed
    if (typeof document !== "undefined") {
      if (isRTL(detectedLang)) {
        document.documentElement.dir = "rtl";
        document.documentElement.lang = detectedLang;
      } else {
        document.documentElement.dir = "ltr";
        document.documentElement.lang = detectedLang;
      }
    }
  }, []);

  const setLanguage = async (lang: LanguageCode) => {
    setLanguageState(lang);
    setIsRTLMode(isRTL(lang));
    const msgs = await loadTranslations(lang);
    setTranslations(msgs);

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("__portfolio_lang", lang);
    }

    // Update HTML attributes
    if (typeof document !== "undefined") {
      if (isRTL(lang)) {
        document.documentElement.dir = "rtl";
      } else {
        document.documentElement.dir = "ltr";
      }
      document.documentElement.lang = lang;
    }
  };

  const t = (key: string): string => {
    return translations[key] || key;
  };

  // Don't render until client-side hydration is complete
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <TranslationContext.Provider
      value={{ language, setLanguage, translations, t, isRTL: isRTLMode }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider");
  }
  return context;
}
