import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

const FROM = process.env.RESEND_FROM_EMAIL ?? "impact@samuelgyasi.com";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://samuelgyasi.com";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { to, subject, bodyHtml, bodyText, templateId } = body as {
    to: string;
    subject: string;
    bodyHtml?: string;
    bodyText?: string;
    templateId?: string;
  };

  if (!to || !subject) {
    return NextResponse.json(
      { error: "`to` and `subject` are required" },
      { status: 400 }
    );
  }

  // Insert log entry first so we get an id for the tracking pixel
  const { data: logEntry } = await supabase
    .from("email_logs")
    .insert({
      to_email: to,
      from_email: FROM,
      subject,
      body_html: bodyHtml ?? null,
      body_text: bodyText ?? null,
      template_id: templateId ?? null,
      status: "sending",
    })
    .select()
    .single();

  const trackingPixel = logEntry
    ? `<img src="${BASE_URL}/api/track/open/${logEntry.id}" width="1" height="1" alt="" style="display:none" />`
    : "";

  const htmlBody = bodyHtml ? bodyHtml + trackingPixel : undefined;

  // Build send options — Resend requires at least one of html | text | react
  const sendOptions = {
    from: `Samuel Gyasi <${FROM}>`,
    to: [to] as string[],
    subject,
    ...(htmlBody  ? { html: htmlBody } : {}),
    ...(bodyText  ? { text: bodyText } : {}),
    // Fallback so Resend always has a body
    ...(!htmlBody && !bodyText ? { text: subject } : {}),
  } as Parameters<typeof resend.emails.send>[0];

  const { data, error } = await resend.emails.send(sendOptions);

  if (error) {
    if (logEntry) {
      await supabase
        .from("email_logs")
        .update({ status: "failed" })
        .eq("id", logEntry.id);
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (logEntry) {
    await supabase
      .from("email_logs")
      .update({
        resend_id: data?.id ?? null,
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .eq("id", logEntry.id);
  }

  return NextResponse.json({ success: true, id: data?.id });
}
