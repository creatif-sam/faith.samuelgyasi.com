import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { UpcomingEvent } from "../components/types";
import { slugify } from "../components/slug";
import { EventDetailClient } from "./EventDetailClient";
import { resolveLocale, pageAlternates, SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

const FALLBACK_IMAGE = "/photo-hero.png";

const EVENT_COLUMNS =
  "id,title,description,date_text,event_date,location,tag,category,format,needs_registration,join_url,facebook_url,host_name,host_url,flyer_url,recording_signup";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = resolveLocale((await headers()).get("x-locale"));
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("upcoming_events")
    .select("title, description, flyer_url")
    .eq("published", true);

  const event = (events ?? []).find((e) => slugify(e.title) === slug);

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
    alternates: pageAlternates(locale, `/upcoming/${slug}`),
  };
}

export default async function UpcomingEventPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("upcoming_events")
    .select(EVENT_COLUMNS)
    .eq("published", true);

  const event = (events ?? []).find((e) => slugify(e.title) === slug);

  if (!event) notFound();

  const otherEvents = (events ?? []).filter((e) => e.id !== event.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description ?? undefined,
    startDate: event.event_date ?? undefined,
    eventAttendanceMode:
      event.format === "online"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : event.format === "in-person"
        ? "https://schema.org/OfflineEventAttendanceMode"
        : "https://schema.org/MixedEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: event.join_url
      ? { "@type": "VirtualLocation", url: event.join_url }
      : { "@type": "Place", name: event.location ?? "TBA" },
    image: event.flyer_url ? [event.flyer_url] : [`${SITE_URL}${FALLBACK_IMAGE}`],
    organizer: { "@type": "Person", name: event.host_name ?? "Samuel Kobina Gyasi", url: event.host_url ?? SITE_URL },
    url: `${SITE_URL}/en/upcoming/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EventDetailClient event={event as UpcomingEvent} otherEvents={otherEvents as UpcomingEvent[]} />
    </>
  );
}
