"use client";

import { useEffect } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/atoms/Breadcrumbs";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { useLang } from "@/lib/i18n";
import { localizedHref } from "@/lib/i18n/locale";
import { type UpcomingEvent, isPast } from "../components/types";
import { upcomingStyles } from "../components/styles";
import { EventCard } from "../components/EventCard";
import { upcomingTranslations as t } from "../translations";

interface EventDetailClientProps {
  event: UpcomingEvent;
}

export function EventDetailClient({ event }: EventDetailClientProps) {
  const { lang } = useLang();

  // .up-card/.up-section start at opacity:0 and only reveal once JS adds
  // .up-visible — on the listing page an IntersectionObserver does that as
  // each card scrolls into view. Here there's exactly one card and it's
  // already on screen, so just mark it visible immediately instead of
  // wiring up scroll-based observation for something that isn't scrolling.
  useEffect(() => {
    document.querySelectorAll(".up-section, .up-card").forEach((el) => el.classList.add("up-visible"));
  }, [event.id]);

  return (
    <>
      <div className="up-pg">
        <style>{upcomingStyles}</style>

        <div className="up-detail-wrap">
          <Breadcrumbs
            items={[
              { label: t.detail.breadcrumbHome[lang], href: localizedHref(lang, "/") },
              { label: t.detail.breadcrumbUpcoming[lang], href: localizedHref(lang, "/upcoming") },
              { label: event.title },
            ]}
          />

          <div className="up-detail-card">
            <EventCard item={event} delay={0} isPastEvent={isPast(event)} />
          </div>

          <Link href={localizedHref(lang, "/upcoming")} className="up-detail-back">
            {t.detail.backToUpcoming[lang]}
          </Link>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
