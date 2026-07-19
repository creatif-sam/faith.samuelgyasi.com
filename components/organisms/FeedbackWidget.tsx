"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { MessageSquarePlus, X, Bug, Lightbulb, Send, Check } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { feedbackTranslations as t } from "@/lib/i18n/feedback";
import { HoneypotField } from "@/components/HoneypotField";
import { useHoneypot } from "@/lib/useHoneypot";

type FeedbackType = "bug" | "idea";
type Stage = "closed" | "form" | "done";

export function FeedbackWidget() {
  const pathname = usePathname();
  const { lang } = useLang();
  const [stage, setStage] = useState<Stage>("closed");
  const [type, setType]   = useState<FeedbackType>("idea");
  const [msg, setMsg]     = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy]   = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const honeypot = useHoneypot();

  // Close on outside click
  useEffect(() => {
    if (stage === "closed") return;
    function handler(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setStage("closed");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [stage]);

  // Close on Escape
  useEffect(() => {
    if (stage === "closed") return;
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") setStage("closed");
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [stage]);

  // Auto-reset after "done" pause
  useEffect(() => {
    if (stage !== "done") return;
    const t = setTimeout(() => {
      setStage("closed");
      setMsg("");
      setEmail("");
      setType("idea");
    }, 3500);
    return () => clearTimeout(t);
  }, [stage]);

  async function submit() {
    if (!msg.trim()) return;
    if (honeypot.isBot()) {
      // Pretend success so the bot doesn't learn it was caught.
      toast.success(type === "bug" ? t.toasts.bugSuccess[lang] : t.toasts.ideaSuccess[lang]);
      setStage("done");
      return;
    }
    setBusy(true);
    const db = createClient();
    const { error } = await db.from("feedback").insert({
      type,
      message: msg.trim(),
      email: email.trim() || null,
      page_url: window.location.pathname,
    });
    setBusy(false);
    if (error) {
      console.error("Feedback error:", error.message);
      toast.error(t.toasts.error[lang]);
      return;
    }
    toast.success(
      type === "bug" ? t.toasts.bugSuccess[lang] : t.toasts.ideaSuccess[lang]
    );
    setStage("done");
  }

  // Hidden inside the admin control panel — this is a public-site affordance only.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-[8000] flex flex-col items-end gap-3">
      {/* Card */}
      {stage !== "closed" && (
        <div
          ref={cardRef}
          className={cn(
            "w-[calc(100vw-32px)] max-w-[336px] rounded-xl border border-white/[.08] bg-[#0d0e15]",
            "shadow-[0_24px_64px_rgba(0,0,0,.7),0_0_0_1px_rgba(255,255,255,.04)]",
            "overflow-hidden origin-bottom-right",
            "animate-in fade-in slide-in-from-bottom-3 zoom-in-95 duration-300 ease-out"
          )}
        >
          {/* Gold accent bar */}
          <div className="h-[3px] w-full bg-[linear-gradient(90deg,#546cfa,#546cfa)]" />

          {stage === "done" ? (
            <div className="flex flex-col items-center justify-center gap-3 px-7 py-11 text-center">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#546cfa]/25 blur-xl animate-pulse" />
                <div className="relative w-14 h-14 rounded-full bg-[rgba(84,108,250,.14)] border border-[rgba(84,108,250,.3)] flex items-center justify-center animate-in zoom-in-50 duration-500 ease-out">
                  <Check size={22} className="text-[#546cfa]" strokeWidth={2.5} />
                </div>
              </div>
              <p className="font-[family-name:'Playfair_Display',serif] text-[19px] text-[#eef0f5] mt-1">
                {t.success.title[lang]}
              </p>
              <p className="font-[family-name:'Poppins',sans-serif] text-[9px] tracking-[.12em] text-white/40 uppercase font-medium">
                {t.success.message[lang]}
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3.5 border-b border-white/[.06]">
                <div>
                  <span className="font-[family-name:'Playfair_Display',serif] text-[16px] text-[#eef0f5] block">
                    {t.title[lang]}
                  </span>
                  <span className="font-[family-name:'Poppins',sans-serif] text-[11px] font-light text-white/40 block mt-1 leading-snug">
                    {t.subtitle[lang]}
                  </span>
                </div>
                <button
                  onClick={() => setStage("closed")}
                  aria-label="Close"
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white/30 hover:text-white/80 hover:bg-white/[.06] transition-colors cursor-pointer"
                >
                  <X size={13} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col gap-4">
                <HoneypotField inputRef={honeypot.inputRef} />
                {/* Type toggle */}
                <div className="flex gap-2">
                  {([
                    { id: "bug"  as FeedbackType, Icon: Bug,       label: t.types.bug[lang]  },
                    { id: "idea" as FeedbackType, Icon: Lightbulb, label: t.types.idea[lang] },
                  ] as const).map(({ id, Icon, label }) => (
                    <button
                      key={id}
                      onClick={() => setType(id)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-[9px] font-[family-name:'Poppins',sans-serif] font-semibold tracking-[.15em] uppercase transition-all cursor-pointer",
                        type === id
                          ? "bg-[rgba(84,108,250,.1)] border-[rgba(84,108,250,.35)] text-[#546cfa] shadow-[0_0_0_1px_rgba(84,108,250,.1)_inset]"
                          : "bg-white/[.03] border-white/[.07] text-white/35 hover:text-white/60 hover:border-white/15"
                      )}
                    >
                      <Icon size={10} />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Message */}
                <div>
                  <label className="font-[family-name:'Poppins',sans-serif] font-semibold text-[8px] tracking-[.2em] uppercase text-white/30 block mb-1.5">
                    {type === "bug" ? t.labels.bugDescription[lang] : t.labels.ideaDescription[lang]}
                  </label>
                  <textarea
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder={type === "bug" ? t.placeholders.bugMessage[lang] : t.placeholders.ideaMessage[lang]}
                    rows={4}
                    maxLength={1000}
                    className="w-full bg-white/[.04] border border-white/[.09] rounded-lg text-[#eef0f5] font-[family-name:'Poppins',sans-serif] font-light text-sm px-3.5 py-2.5 outline-none transition-all focus:border-[rgba(84,108,250,.45)] focus:bg-white/[.06] focus:shadow-[0_0_0_3px_rgba(84,108,250,.08)] resize-none placeholder:text-white/20"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="font-[family-name:'Poppins',sans-serif] font-semibold text-[8px] tracking-[.2em] uppercase text-white/30 block mb-1.5">
                    {t.labels.email[lang]} <span className="text-white/20 normal-case tracking-normal">{t.labels.optional[lang]}</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.placeholders.email[lang]}
                    className="w-full bg-white/[.04] border border-white/[.09] rounded-lg text-[#eef0f5] font-[family-name:'Poppins',sans-serif] font-light text-sm px-3.5 py-2.5 outline-none transition-all focus:border-[rgba(84,108,250,.45)] focus:bg-white/[.06] focus:shadow-[0_0_0_3px_rgba(84,108,250,.08)] placeholder:text-white/20"
                  />
                </div>

                {/* Submit */}
                <button
                  onClick={submit}
                  disabled={busy || !msg.trim()}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 font-[family-name:'Poppins',sans-serif] font-semibold text-[9px] tracking-[.18em] uppercase rounded-lg px-5 py-3 transition-all border-0 cursor-pointer",
                    msg.trim()
                      ? "bg-gradient-to-br from-[#546cfa] to-[#546cfa] text-[#09090d] hover:from-[#3d54e0] hover:to-[#3d54e0] shadow-[0_2px_16px_rgba(84,108,250,.3)] hover:shadow-[0_4px_20px_rgba(84,108,250,.4)] hover:-translate-y-px"
                      : "bg-white/[.05] text-white/25 cursor-not-allowed"
                  )}
                >
                  <Send size={11} />
                  {busy ? t.buttons.sending[lang] : t.buttons.send[lang]}
                </button>

                <p className="font-[family-name:'Poppins',sans-serif] text-[9px] text-white/25 text-center leading-relaxed -mt-1">
                  {t.trust[lang]}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* FAB toggle button */}
      <div className="relative">
        {stage === "closed" && (
          <span className="absolute inset-0 rounded-full bg-[#546cfa]/35 blur-md animate-pulse pointer-events-none" />
        )}
        <button
          onClick={() => setStage(stage === "closed" ? "form" : "closed")}
          aria-label="Share feedback"
          aria-expanded={stage !== "closed"}
          className={cn(
            "group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,.5)] border-0 cursor-pointer",
            stage !== "closed"
              ? "bg-white/10 text-white/60 hover:bg-white/15"
              : "bg-gradient-to-br from-[#546cfa] to-[#546cfa] text-[#09090d] hover:from-[#3d54e0] hover:to-[#3d54e0] hover:shadow-[0_6px_24px_rgba(84,108,250,.45)] hover:scale-110"
          )}
        >
          {stage !== "closed" ? <X size={18} /> : <MessageSquarePlus size={19} />}

          {stage === "closed" && (
            <span
              className={cn(
                "hidden sm:flex absolute right-full mr-3 items-center whitespace-nowrap rounded-full bg-[#0d0e15] border border-white/[.08]",
                "px-3 py-1.5 text-[10px] font-[family-name:'Poppins',sans-serif] font-medium tracking-[.05em] text-white/70",
                "opacity-0 translate-x-1 pointer-events-none transition-all duration-200",
                "group-hover:opacity-100 group-hover:translate-x-0"
              )}
            >
              {t.fab[lang]}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
