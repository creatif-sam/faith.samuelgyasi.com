// lib/i18n/locale.ts — URL-prefix locale helpers, shared by proxy.ts (server) and client components.
// Framework-agnostic: no next/server or next/navigation imports here.
import type { Lang } from "./types";

export const SUPPORTED_LOCALES: readonly Lang[] = ["en", "fr"];
export const DEFAULT_LOCALE: Lang = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

// Routes that get an /en or /fr prefix. Admin, dashboard, auth, and api are
// deliberately excluded — they're internal/gated areas with their own
// (unprefixed) language handling or no translations at all.
export const PUBLIC_LOCALE_PATHS = [
  "/faith",
  "/blog",
  "/my-story",
  "/credo",
  "/upcoming",
  "/resources",
  "/testimonials",
  "/faith-analyzer",
  "/privacy",
] as const;

export function isSupportedLocale(value: string | undefined | null): value is Lang {
  return value === "en" || value === "fr";
}

/** Splits a pathname like "/fr/blog/foo" into { locale: "fr", rest: "/blog/foo" }. */
export function stripLocalePrefix(pathname: string): { locale: Lang | null; rest: string } {
  const [, maybeLocale, ...remainder] = pathname.split("/");
  if (isSupportedLocale(maybeLocale)) {
    const rest = "/" + remainder.join("/");
    return { locale: maybeLocale, rest: rest === "/" ? "/" : rest.replace(/\/$/, "") || "/" };
  }
  return { locale: null, rest: pathname };
}

export function isPublicContentPath(rest: string): boolean {
  return rest === "/" || PUBLIC_LOCALE_PATHS.some((p) => rest === p || rest.startsWith(p + "/") || rest.startsWith(p + "?"));
}

/** Picks the best supported locale from an Accept-Language header (reflects the visitor's device/browser language setting). */
export function detectLocaleFromAcceptLanguage(header: string | null): Lang {
  if (!header) return DEFAULT_LOCALE;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, qPart] = part.trim().split(";q=");
      const q = qPart ? parseFloat(qPart) : 1;
      return { tag: tag.toLowerCase(), q: Number.isNaN(q) ? 1 : q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (tag.startsWith("fr")) return "fr";
    if (tag.startsWith("en")) return "en";
  }
  return DEFAULT_LOCALE;
}

/** Prefixes a root-relative path with the given locale, e.g. localizedHref("fr", "/blog") -> "/fr/blog". */
export function localizedHref(lang: Lang, path: string): string {
  if (path === "/") return `/${lang}`;
  return `/${lang}${path}`;
}
