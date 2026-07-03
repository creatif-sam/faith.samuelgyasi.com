import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { UpcomingEvent } from "../components/types";
import { EventDetailClient } from "./EventDetailClient";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

const FALLBACK_IMAGE = "/photo-hero.png";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("upcoming_events")
    .select("title, description, flyer_url")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (!event) return { title: "Event Not Found" };

  const description = event.description ?? undefined;
  // Always set an explicit image (the flyer, or the site default) rather than
  // relying on Next.js to inherit the root layout's openGraph.images — that
  // inheritance behavior isn't guaranteed once a page defines its own
  // openGraph object, so this must be explicit for the flyer to actually win.
  const image = event.flyer_url || FALLBACK_IMAGE;

  return {
    title: `${event.title} — Upcoming`,
    description,
    openGraph: {
      title: event.title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: event.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
      images: [image],
    },
  };
}

export default async function UpcomingEventPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("upcoming_events")
    .select(
      "id,title,description,date_text,event_date,location,tag,category,format,needs_registration,join_url,facebook_url,host_name,host_url,flyer_url,recording_signup"
    )
    .eq("id", id)
    .eq("published", true)
    .single();

  if (!event) notFound();

  return <EventDetailClient event={event as UpcomingEvent} />;
}
