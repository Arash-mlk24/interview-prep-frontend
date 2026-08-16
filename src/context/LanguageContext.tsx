"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Language, Direction, translations, TranslationKeys } from "../i18n/translations";

interface LanguageContextType {
  language: Language;
  direction: Direction;
  isRtl: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKeys, params?: Record<string, string | number>) => string;
  getLocalized: (enVal: string, faVal?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{
  initialLocale: Language;
  children: React.ReactNode;
}> = ({ initialLocale, children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [language, setLanguageState] = useState<Language>(initialLocale);

  useEffect(() => {
    setLanguageState(initialLocale);
  }, [initialLocale]);

  const direction: Direction = language === "fa" ? "rtl" : "ltr";
  const isRtl = direction === "rtl";

  const changeLanguage = (nextLang: Language) => {
    if (nextLang === language) return;

    // Set cookie for 1 year so returning visitors stay on their chosen language
    if (typeof document !== "undefined") {
      document.cookie = `devprep_lang=${nextLang}; path=/; max-age=31536000; SameSite=Lax`;
    }

    // Replace locale prefix in the current pathname
    if (pathname) {
      const segments = pathname.split("/");
      // segments[0] is "", segments[1] is current locale ("en" | "fa")
      if (segments[1] === "en" || segments[1] === "fa") {
        segments[1] = nextLang;
        const newPath = segments.join("/") || `/${nextLang}`;
        router.push(newPath);
      } else {
        router.push(`/${nextLang}${pathname}`);
      }
    } else {
      router.push(`/${nextLang}`);
    }
  };

  const setLanguage = (lang: Language) => {
    changeLanguage(lang);
  };

  const toggleLanguage = () => {
    const nextLang = language === "en" ? "fa" : "en";
    changeLanguage(nextLang);
  };

  const t = (key: TranslationKeys, params?: Record<string, string | number>): string => {
    const dict = translations[language] || translations.en;
    let text: string = dict[key] || translations.en[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(paramVal));
      });
    }

    return text;
  };

  const getLocalized = (enVal: string, faVal?: string): string => {
    if (language === "fa" && faVal) {
      return faVal;
    }
    return enVal;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        isRtl,
        setLanguage,
        toggleLanguage,
        t,
        getLocalized,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
