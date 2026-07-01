import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  let body: { path?: string; visitorId?: string; referrer?: string } = {};
  try {
    const text = await req.text();
    if (text) body = JSON.parse(text);
  } catch {
    return NextResponse.json({ ok: true });
  }
  const { path, visitorId, referrer } = body;

  if (!path || !visitorId) {
    return NextResponse.json({ ok: true }); // silent ignore
  }

  // Skip admin & auth pages from analytics
  if (path.startsWith("/admin") || path.startsWith("/auth")) {
    return NextResponse.json({ ok: true });
  }

  const supabase = await createClient();
  await supabase.from("page_views").insert({
    page_path: path,
    visitor_id: visitorId,
    referrer: referrer || null,
    user_agent: req.headers.get("user-agent") ?? null,
    country: await getVisitorCountry(req),
  });

  return NextResponse.json({ ok: true });
}

// Vercel injects this header at the edge; no lookup needed when deployed there.
async function getVisitorCountry(req: NextRequest): Promise<string | null> {
  const vercelCountry = req.headers.get("x-vercel-ip-country");
  if (vercelCountry) return vercelCountry;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip");
  if (!ip || ip === "::1" || ip === "127.0.0.1") return null;

  try {
    const res = await fetch(`https://ipapi.co/${ip}/country/`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) return null;
    const code = (await res.text()).trim();
    return /^[A-Z]{2}$/.test(code) ? code : null;
  } catch {
    return null;
  }
}
