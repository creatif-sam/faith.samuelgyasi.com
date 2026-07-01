import { updateSession } from "@/lib/supabase/proxy";
import {
  LOCALE_COOKIE,
  detectLocaleFromAcceptLanguage,
  isPublicContentPath,
  isSupportedLocale,
  stripLocalePrefix,
} from "@/lib/i18n/locale";
import { NextResponse, type NextRequest } from "next/server";

const ALLOWED_PREFIXES = [
  "/",
  "/faith",
  "/blog",
  "/my-story",
  "/credo",
  "/upcoming",
  "/resources",
  "/testimonials",
  "/privacy",
  "/api",
  "/auth",
  "/admin",
  "/dashboard",
  "/faith-analyzer",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { locale, rest } = stripLocalePrefix(pathname);

  // Public, translatable routes get /en or /fr prefixing. Everything else
  // (admin, dashboard, auth, api) is evaluated on its original path, unchanged.
  if (isPublicContentPath(rest)) {
    if (!locale) {
      const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
      const targetLocale = isSupportedLocale(cookieLocale)
        ? cookieLocale
        : detectLocaleFromAcceptLanguage(request.headers.get("accept-language"));

      const url = request.nextUrl.clone();
      url.pathname = `/${targetLocale}${rest === "/" ? "" : rest}`;
      return NextResponse.redirect(url, 307);
    }

    // Valid locale prefix present — run the existing Supabase session proxy
    // (harmless no-op for these public paths, but keeps auth cookies fresh),
    // then rewrite to the unprefixed file and tag the request with the locale
    // so server components can read it via headers().
    const sessionResponse = await updateSession(request);
    if (sessionResponse.status >= 300 && sessionResponse.status < 400) {
      return sessionResponse;
    }

    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = rest;
    const headers = new Headers(request.headers);
    headers.set("x-locale", locale);

    const response = NextResponse.rewrite(rewriteUrl, { request: { headers } });
    sessionResponse.cookies.getAll().forEach((c) => response.cookies.set(c));
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  const allowed =
    pathname === "/" ||
    ALLOWED_PREFIXES.some((p) => p !== "/" && pathname.startsWith(p));

  if (!allowed) {
    return NextResponse.redirect(new URL("/", request.url), 307);
  }

  // Run Supabase session proxy for all allowed routes
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?)$).*)",
  ],
};
