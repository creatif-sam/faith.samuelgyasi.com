// lib/i18n/context.tsx — global bilingual language context
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import type { Lang } from "./types";

const STORAGE_KEY = "fdp-lang";

interface LangContextValue {
  lang: Lang;
  toggleLang: () => void;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  toggleLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === "en" || stored === "fr") setLang(stored);
    } catch {}
  }, []);

  // Sync to localStorage and broadcast whenever lang changes
  const toggleLang = () => {
    setLang((current) => {
      const next: Lang = current === "en" ? "fr" : "en";
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      return next;
    });
  };

  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}
