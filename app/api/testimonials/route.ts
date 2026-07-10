import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { isBotSubmission } from "@/lib/bot-protection";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("id,name,role,company,avatar_url,quote,rating")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(12);
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  let body: { name?: string; role?: string; quote?: string; rating?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = (body.name ?? "").trim().slice(0, 200);
  const role = (body.role ?? "").trim().slice(0, 200);
  const quote = (body.quote ?? "").trim().slice(0, 2000);
  const rating = Math.min(5, Math.max(1, Math.round(Number(body.rating) || 5)));

  if (!name || !role || !quote) {
    return NextResponse.json({ error: "Name, profession, and testimony are required." }, { status: 400 });
  }

  if (isBotSubmission(body as Record<string, unknown>)) {
    // Pretend success so the bot doesn't learn it was caught.
    return NextResponse.json({ ok: true });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert({
    name,
    role,
    quote,
    rating,
    published: false,
    sort_order: 0,
  });

  if (error) {
    return NextResponse.json({ error: "Could not save your testimony. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
