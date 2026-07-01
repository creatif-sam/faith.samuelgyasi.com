import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export const maxDuration = 300;

const FROM = process.env.RESEND_FROM_EMAIL ?? "impact@samuelgyasi.com";
const BATCH_SIZE = 100;

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase: null };
  return { supabase };
}

type RecipientType = "custom" | "subscribers";

async function resolveRecipients(
  supabase: SupabaseClient,
  recipientType: RecipientType,
  recipientFilter: string | null,
  recipientEmails: string[] | null
): Promise<string[]> {
  if (recipientType === "custom") {
    return Array.from(
      new Set((recipientEmails ?? []).map((e) => e.trim().toLowerCase()).filter(Boolean))
    );
  }
  let query = supabase.from("newsletter_subscribers").select("email").eq("confirmed", true);
  if (recipientFilter && recipientFilter !== "all") {
    query = query.contains("interests", [recipientFilter]);
  }
  const { data } = await query;
  return Array.from(new Set((data ?? []).map((r: { email: string }) => r.email.trim().toLowerCase())));
}

export async function GET() {
  const { supabase } = await requireAuth();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("email_campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { supabase } = await requireAuth();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    id, subject, bodyHtml, bodyText, templateId,
    recipientType, recipientFilter, recipientEmails, action,
  } = body as {
    id?: string;
    subject: string;
    bodyHtml: string;
    bodyText?: string;
    templateId?: string | null;
    recipientType: RecipientType;
    recipientFilter?: string | null;
    recipientEmails?: string[];
    action: "draft" | "send";
  };

  if (!subject?.trim()) return NextResponse.json({ error: "Subject is required" }, { status: 400 });
  if (!bodyHtml?.trim()) return NextResponse.json({ error: "Email body is required" }, { status: 400 });

  const recipients = await resolveRecipients(
    supabase, recipientType, recipientFilter ?? null, recipientEmails ?? null
  );

  const baseFields = {
    subject,
    body_html: bodyHtml,
    body_text: bodyText ?? null,
    template_id: templateId ?? null,
    recipient_type: recipientType,
    recipient_filter: recipientFilter ?? null,
    recipient_emails: recipientType === "custom" ? recipients : null,
    total_recipients: recipients.length,
    updated_at: new Date().toISOString(),
  };

  if (action === "draft") {
    const { data, error } = id
      ? await supabase.from("email_campaigns").update(baseFields).eq("id", id).select().single()
      : await supabase.from("email_campaigns").insert({ ...baseFields, status: "draft" }).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  // action === "send"
  if (recipients.length === 0) {
    return NextResponse.json({ error: "No recipients found for this campaign" }, { status: 400 });
  }

  const { data: campaign, error: upsertErr } = id
    ? await supabase.from("email_campaigns")
        .update({ ...baseFields, status: "sending", sent_count: 0, failed_count: 0 })
        .eq("id", id).select().single()
    : await supabase.from("email_campaigns")
        .insert({ ...baseFields, status: "sending", sent_count: 0, failed_count: 0 })
        .select().single();

  if (upsertErr || !campaign) {
    return NextResponse.json({ error: upsertErr?.message ?? "Failed to create campaign" }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  let sentCount = 0;
  let failedCount = 0;

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const chunk = recipients.slice(i, i + BATCH_SIZE);
    const payload = chunk.map((to) => ({
      from: `Samuel Gyasi <${FROM}>`,
      to: [to],
      subject,
      html: bodyHtml,
      ...(bodyText ? { text: bodyText } : {}),
    }));

    const { data: batchData, error: batchError } = await resend.batch.send(payload);

    if (batchError) {
      failedCount += chunk.length;
    } else {
      const results = batchData?.data ?? [];
      sentCount += results.filter((r) => r?.id).length;
      failedCount += chunk.length - results.filter((r) => r?.id).length;
    }

    await supabase
      .from("email_campaigns")
      .update({ sent_count: sentCount, failed_count: failedCount })
      .eq("id", campaign.id);
  }

  const { data: finalCampaign } = await supabase
    .from("email_campaigns")
    .update({
      status: sentCount === 0 ? "failed" : "sent",
      sent_at: new Date().toISOString(),
    })
    .eq("id", campaign.id)
    .select()
    .single();

  return NextResponse.json(finalCampaign ?? campaign);
}

export async function DELETE(req: NextRequest) {
  const { supabase } = await requireAuth();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabase.from("email_campaigns").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
