// lib/i18n/context.tsx — global bilingual language context
"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Lang } from "./types";
import { LOCALE_COOKIE, SUPPORTED_LOCALES } from "./locale";

const STORAGE_KEY = "fdp-lang";

interface LangContextValue {
  lang: Lang;
  toggleLang: () => void;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  toggleLang: () => {},
});

interface LangProviderProps {
  children: React.ReactNode;
  /** Server-resolved locale for URL-prefixed routes (/en, /fr). */
  initialLang?: Lang;
  /**
   * True on routes served under an /en or /fr prefix, where the URL is the
   * source of truth and toggling must navigate. False on unprefixed areas
   * (admin/dashboard) which keep the original localStorage-backed toggle.
   */
  urlControlled?: boolean;
}

export function LangProvider({ children, initialLang, urlControlled = false }: LangProviderProps) {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>(initialLang ?? "en");

  // Unprefixed areas (admin/dashboard): hydrate from localStorage once on mount.
  useEffect(() => {
    if (urlControlled) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === "en" || stored === "fr") setLang(stored);
    } catch {}
  }, [urlControlled]);

  const toggleLang = useCallback(() => {
    if (urlControlled) {
      const current = lang;
      const next: Lang = current === "en" ? "fr" : "en";
      const pathname = window.location.pathname;
      const segments = pathname.split("/");
      const hasLocaleSegment = SUPPORTED_LOCALES.includes(segments[1] as Lang);
      if (hasLocaleSegment) {
        segments[1] = next;
      } else {
        segments.splice(1, 0, next);
      }
      const newPath = segments.join("/") || `/${next}`;
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      router.push(`${newPath}${window.location.search}`);
      return;
    }

    setLang((current) => {
      const next: Lang = current === "en" ? "fr" : "en";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {}
      return next;
    });
  }, [lang, router, urlControlled]);

  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}
