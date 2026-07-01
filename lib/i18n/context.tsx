// lib/i18n/context.tsx — global bilingual language context
"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Lang } from "./types";
import { LOCALE_COOKIE, stripLocalePrefix } from "./locale";

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
  /** Server-resolved locale, used only to seed the very first paint. */
  initialLang?: Lang;
}

export function LangProvider({ children, initialLang }: LangProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { locale: urlLocale, rest } = stripLocalePrefix(pathname);

  const [lang, setLang] = useState<Lang>(initialLang ?? urlLocale ?? "en");

  // On /en or /fr routes the URL is the single source of truth. usePathname()
  // updates on every navigation (Link clicks, back/forward, router.push), so
  // re-deriving from it here keeps `lang` correct even though this provider
  // lives in the root layout and never remounts between navigations.
  useEffect(() => {
    if (urlLocale && urlLocale !== lang) setLang(urlLocale);
  }, [urlLocale]); // eslint-disable-line react-hooks/exhaustive-deps

  // Unprefixed areas (admin/dashboard): hydrate from localStorage once on mount.
  useEffect(() => {
    if (urlLocale) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === "en" || stored === "fr") setLang(stored);
    } catch {}
  }, [urlLocale]);

  const toggleLang = useCallback(() => {
    if (urlLocale) {
      const next: Lang = urlLocale === "en" ? "fr" : "en";
      const newPath = `/${next}${rest === "/" ? "" : rest}`;
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
  }, [urlLocale, rest, router]);

  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}
