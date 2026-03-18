import { updateSession } from "@/lib/supabase/proxy";
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
  "/api",
  "/auth",
  "/admin",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
