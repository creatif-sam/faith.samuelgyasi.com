"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface PublicAnnouncement {
  id: string;
  title: string | null;
  message: string;
  cta_text: string | null;
  cta_url: string | null;
  dismissible: boolean;
  sort_order: number;
}

export function useAnnouncements(type: "bar" | "popup") {
  const [announcement, setAnnouncement] = useState<PublicAnnouncement | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const db = createClient();
      const nowIso = new Date().toISOString();
      const { data } = await db
        .from("announcements")
        .select("id,title,message,cta_text,cta_url,dismissible,sort_order,starts_at,ends_at")
        .eq("type", type)
        .eq("active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (cancelled || !data) return;

      const live = (data as (PublicAnnouncement & { starts_at: string | null; ends_at: string | null })[]).find((a) => {
        if (a.starts_at && a.starts_at > nowIso) return false;
        if (a.ends_at && a.ends_at < nowIso) return false;
        return true;
      });

      if (!live) return;

      try {
        const dismissed = localStorage.getItem(`sg_ann_${type}_${live.id}`);
        if (dismissed) return;
      } catch { /* private browsing */ }

      setAnnouncement(live);
    })();
    return () => { cancelled = true; };
  }, [type]);

  function dismiss() {
    if (!announcement) return;
    try { localStorage.setItem(`sg_ann_${type}_${announcement.id}`, "1"); } catch { /* ignore */ }
    setAnnouncement(null);
  }

  return { announcement, dismiss };
}
