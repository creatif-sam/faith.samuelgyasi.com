"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sparkle, X } from "lucide-react";
import { useAnnouncements } from "@/lib/useAnnouncements";

export function AnnouncementPopup() {
  const pathname = usePathname();
  const { announcement, dismiss } = useAnnouncements("popup");
  const [visible, setVisible] = useState(false);
  const hidden = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");

  useEffect(() => {
    if (!announcement || hidden) { setVisible(false); return; }
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, [announcement, hidden]);

  if (hidden || !announcement || !visible) return null;

  const isExternal = announcement.cta_url?.startsWith("http");

  function close() {
    setVisible(false);
    dismiss();
  }

  return (
    <div className="an-pop-overlay" role="dialog" aria-modal="true" onClick={announcement?.dismissible ? close : undefined}>
      <div className="an-pop-card" onClick={(e) => e.stopPropagation()}>
        {announcement.dismissible && (
          <button className="an-pop-close" onClick={close} aria-label="Close">
            <X size={15} />
          </button>
        )}
        <div className="an-pop-emblem"><Sparkle size={18} fill="currentColor" /></div>
        {announcement.title && <h2 className="an-pop-title">{announcement.title}</h2>}
        <p className="an-pop-message">{announcement.message}</p>
        {announcement.cta_text && announcement.cta_url && (
          <a
            href={announcement.cta_url}
            className="an-pop-cta"
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            onClick={() => { try { localStorage.setItem(`sg_ann_popup_${announcement.id}`, "1"); } catch { /* ignore */ } }}
          >
            {announcement.cta_text}
          </a>
        )}
        {announcement.dismissible && (
          <button className="an-pop-dismiss" onClick={close}>Not now</button>
        )}
      </div>
    </div>
  );
}
