"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/lib/i18n";
import { localizedHref } from "@/lib/i18n/locale";
import { upcomingTranslations as t } from "../translations";

interface ShareEventButtonProps {
  eventId: string;
  title: string;
  className?: string;
}

export function ShareEventButton({ eventId, title, className }: ShareEventButtonProps) {
  const { lang } = useLang();
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}${localizedHref(lang, `/upcoming/${eventId}`)}`;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled the native share sheet — not an error.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(t.card.linkCopied[lang]);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t.card.copyFailed[lang]);
    }
  }

  return (
    <button type="button" className={className ?? "up-btn up-btn--ghost"} onClick={handleShare}>
      {copied ? <Check size={12} style={{ marginRight: 5, flexShrink: 0 }} /> : <Share2 size={12} style={{ marginRight: 5, flexShrink: 0 }} />}
      {t.card.share[lang]}
    </button>
  );
}
