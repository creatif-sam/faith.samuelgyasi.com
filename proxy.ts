import { updateSession } from "@/lib/supabase/proxy";
import { NextResponse, type NextRequest } from "next/server";

// Only these route prefixes are live — everything else redirects to /faith
const ALLOWED_PREFIXES = [
  "/faith",
  "/blog",
  "/my-story",
  "/api",
  "/auth",
  "/admin",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Root → faith landing
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/faith", request.url), 301);
  }

  const allowed = ALLOWED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!allowed) {
    return NextResponse.redirect(new URL("/faith", request.url), 301);
  }

  // Run Supabase session proxy for all allowed routes
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?)$).*)",
  ],
};
