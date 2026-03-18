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
  });

  return NextResponse.json({ ok: true });
}
