// lib/i18n/index.ts — barrel export for all translations
export type { Lang } from "./types";
export { LangProvider, useLang } from "./context";
export { localizedHref, SUPPORTED_LOCALES, DEFAULT_LOCALE } from "./locale";
export { navTranslations }  from "./nav";
export { heroTranslations } from "./hero";
export { aboutTranslations } from "./about";
