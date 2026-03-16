import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 1×1 transparent GIF
const PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (id) {
    const supabase = await createClient();
    // Only record first open
    await supabase
      .from("email_logs")
      .update({
        opened_at: new Date().toISOString(),
        status: "opened",
      })
      .eq("id", id)
      .is("opened_at", null);
  }

  return new NextResponse(PIXEL, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
