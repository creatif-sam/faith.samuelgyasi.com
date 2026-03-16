import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Resend sends inbound email events as POST to this route.
// Configure in Resend Dashboard → Inbound → set webhook URL to:
// https://samuelgyasi.com/api/mail/inbound
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Resend inbound email payload fields
  const { from, to, subject, text, html } = body as {
    from?: string | { email: string; name?: string };
    to?: string | { email: string }[];
    subject?: string;
    text?: string;
    html?: string;
  };

  const fromEmail =
    typeof from === "string" ? from : (from as { email: string })?.email ?? "";
  const fromName =
    typeof from === "object" && from !== null
      ? (from as { name?: string }).name ?? null
      : null;
  const toEmail = Array.isArray(to)
    ? typeof to[0] === "string"
      ? to[0]
      : (to[0] as { email: string })?.email
    : typeof to === "string"
    ? to
    : null;

  const supabase = await createClient();
  await supabase.from("inbound_emails").insert({
    from_email: fromEmail,
    from_name: fromName,
    to_email: toEmail ?? null,
    subject: subject ?? null,
    body_text: text ?? null,
    body_html: html ?? null,
    read: false,
  });

  return NextResponse.json({ success: true });
}
