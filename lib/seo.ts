// lib/seo.ts — shared SEO constants/helpers used across metadata, sitemap, and robots.
import { isSupportedLocale } from "@/lib/i18n/locale";
import type { Lang } from "@/lib/i18n/types";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://faith.samuelgyasi.com";

/** Resolves the x-locale header (set by proxy.ts) to a supported Lang, defaulting to "en". */
export function resolveLocale(headerValue: string | undefined | null): Lang {
  return isSupportedLocale(headerValue) ? headerValue : "en";
}

/**
 * Builds `alternates` for a page's Metadata: the canonical URL for the current
 * locale plus hreflang links to every locale variant of the same path.
 * `path` is root-relative and locale-free, e.g. "/blog/my-post" or "" for home.
 */
export function pageAlternates(locale: Lang, path: string = "") {
  const clean = path === "/" ? "" : path;
  return {
    canonical: `${SITE_URL}/${locale}${clean}`,
    languages: {
      en: `${SITE_URL}/en${clean}`,
      fr: `${SITE_URL}/fr${clean}`,
    },
  };
}
