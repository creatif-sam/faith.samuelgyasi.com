"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useAnnouncements } from "@/lib/useAnnouncements";

export function AnnouncementBar() {
  const pathname = usePathname();
  const { announcement, dismiss } = useAnnouncements("bar");
  const ref = useRef<HTMLDivElement>(null);
  const hidden = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");

  useEffect(() => {
    const h = !hidden && announcement && ref.current ? ref.current.offsetHeight : 0;
    document.documentElement.style.setProperty("--ann-bar-h", `${h}px`);
    return () => { document.documentElement.style.setProperty("--ann-bar-h", "0px"); };
  }, [announcement, hidden]);

  if (hidden || !announcement) return null;

  const isExternal = announcement.cta_url?.startsWith("http");

  return (
    <div className="an-bar" ref={ref}>
      <div className="an-bar-inner">
        <span>{announcement.message}</span>
        {announcement.cta_text && announcement.cta_url && (
          <a
            href={announcement.cta_url}
            className="an-bar-cta"
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {announcement.cta_text}
          </a>
        )}
      </div>
      {announcement.dismissible && (
        <button className="an-bar-close" onClick={dismiss} aria-label="Dismiss announcement">
          <X size={15} />
        </button>
      )}
    </div>
  );
}
