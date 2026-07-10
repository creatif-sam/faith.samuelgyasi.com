import type { Metadata } from "next";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { resolveLocale, pageAlternates } from "@/lib/seo";
import type { UpcomingEvent } from "./components/types";
import UpcomingListClient from "./UpcomingListClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = resolveLocale((await headers()).get("x-locale"));
  const title = lang === "fr" ? "À Venir" : "Upcoming";
  const description =
    lang === "fr"
      ? "Interventions, masterclasses et sessions à venir avec Samuel Kobina Gyasi — foi, leadership et croissance spirituelle."
      : "Upcoming interventions, masterclasses, and sessions with Samuel Kobina Gyasi — faith, leadership, and spiritual growth.";
  return {
    title,
    description,
    openGraph: { title: `${title} — Samuel Kobina Gyasi`, description },
    alternates: pageAlternates(lang, "/upcoming"),
  };
}

export default async function UpcomingPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("upcoming_events")
    .select(
      "id,title,description,date_text,event_date,location,tag,category,format,needs_registration,join_url,facebook_url,host_name,host_url,flyer_url,recording_signup"
    )
    .eq("published", true);

  return <UpcomingListClient initialEvents={(events as UpcomingEvent[]) ?? []} />;
}
