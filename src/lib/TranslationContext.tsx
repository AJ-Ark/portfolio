"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import {
  detectBrowserLanguage,
  loadTranslations,
  isRTL,
  type LanguageCode,
} from "./i18n";
import en from "../../public/messages/en.json";

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
  // English ships in the bundle so SSR/prerender and first paint always have
  // real strings — detected-language messages swap in after hydration.
  const [translations, setTranslations] = useState<Record<string, string>>(en);
  const [isRTLMode, setIsRTLMode] = useState(false);
  // Monotonic token: only the most recent load may commit its messages, so a
  // slow earlier fetch can't clobber the strings of a faster later switch.
  const loadSeq = useRef(0);

  const applyLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
    setIsRTLMode(isRTL(lang));
    const seq = ++loadSeq.current;
    if (lang === "en") {
      setTranslations(en);
    } else {
      loadTranslations(lang).then((msgs) => {
        if (seq === loadSeq.current) setTranslations(msgs);
      });
    }
    document.documentElement.dir = isRTL(lang) ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, []);

  useEffect(() => {
    applyLanguage(detectBrowserLanguage());
  }, [applyLanguage]);

  const setLanguage = useCallback(
    (lang: LanguageCode) => {
      applyLanguage(lang);
      localStorage.setItem("__portfolio_lang", lang);
    },
    [applyLanguage]
  );

  const t = useCallback(
    (key: string): string =>
      translations[key] || (en as Record<string, string>)[key] || key,
    [translations]
  );

  const value = useMemo(
    () => ({ language, setLanguage, translations, t, isRTL: isRTLMode }),
    [language, setLanguage, translations, t, isRTLMode]
  );

  return (
    <TranslationContext.Provider value={value}>
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
