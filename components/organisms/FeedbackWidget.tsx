"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { MessageSquarePlus, X, Bug, Lightbulb, Send, Check } from "lucide-react";

type FeedbackType = "bug" | "idea";
type Stage = "closed" | "form" | "done";

export function FeedbackWidget() {
  const [stage, setStage] = useState<Stage>("closed");
  const [type, setType]   = useState<FeedbackType>("idea");
  const [msg, setMsg]     = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy]   = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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
      return;
    }
    setStage("done");
  }

  return (
    <div className="fixed bottom-6 right-6 z-[8000] flex flex-col items-end gap-3">
      {/* Card */}
      {stage !== "closed" && (
        <div
          ref={cardRef}
          className={cn(
            "w-[320px] rounded-2xl border border-white/[.08] bg-[#0d0e15]",
            "shadow-[0_24px_64px_rgba(0,0,0,.7),0_0_0_1px_rgba(255,255,255,.04)]",
            "overflow-hidden transition-all duration-300"
          )}
        >
          {stage === "done" ? (
            <div className="flex flex-col items-center justify-center gap-3 px-7 py-10 text-center">
              <div className="w-12 h-12 rounded-full bg-[rgba(212,168,67,.12)] border border-[rgba(212,168,67,.2)] flex items-center justify-center">
                <Check size={20} className="text-[#d4a843]" />
              </div>
              <p className="font-[family-name:'Playfair_Display',serif] text-[17px] text-[#eef0f5]">
                Thank you!
              </p>
              <p className="font-mono text-[9px] tracking-[.12em] text-white/40 uppercase">
                Your feedback was received
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[.06]">
                <span className="font-[family-name:'Playfair_Display',serif] text-[15px] text-[#eef0f5]">
                  Share Feedback
                </span>
                <button
                  onClick={() => setStage("closed")}
                  className="text-white/30 hover:text-white/70 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col gap-4">
                {/* Type toggle */}
                <div className="flex gap-2">
                  {([
                    { id: "bug"  as FeedbackType, Icon: Bug,       label: "Bug Report"  },
                    { id: "idea" as FeedbackType, Icon: Lightbulb, label: "Idea / Improvement" },
                  ] as const).map(({ id, Icon, label }) => (
                    <button
                      key={id}
                      onClick={() => setType(id)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-[9px] font-mono tracking-[.15em] uppercase transition-all cursor-pointer",
                        type === id
                          ? "bg-[rgba(212,168,67,.1)] border-[rgba(212,168,67,.3)] text-[#d4a843]"
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
                  <label className="font-mono text-[8px] tracking-[.2em] uppercase text-white/30 block mb-1.5">
                    {type === "bug" ? "Describe the bug" : "Describe your idea"}
                  </label>
                  <textarea
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder={type === "bug" ? "What happened? What did you expect?" : "What would make this better?"}
                    rows={4}
                    className="w-full bg-white/[.04] border border-white/[.09] rounded-lg text-[#eef0f5] font-serif text-sm px-3.5 py-2.5 outline-none transition-all focus:border-[rgba(212,168,67,.4)] focus:bg-white/[.06] resize-none placeholder:text-white/20"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="font-mono text-[8px] tracking-[.2em] uppercase text-white/30 block mb-1.5">
                    Email <span className="text-white/20 normal-case tracking-normal">(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white/[.04] border border-white/[.09] rounded-lg text-[#eef0f5] font-serif text-sm px-3.5 py-2.5 outline-none transition-all focus:border-[rgba(212,168,67,.4)] focus:bg-white/[.06] placeholder:text-white/20"
                  />
                </div>

                {/* Submit */}
                <button
                  onClick={submit}
                  disabled={busy || !msg.trim()}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 font-mono text-[9px] tracking-[.18em] uppercase rounded-lg px-5 py-3 transition-all border-0 cursor-pointer",
                    msg.trim()
                      ? "bg-gradient-to-br from-[#d4a843] to-[#c49838] text-[#09090d] hover:from-[#e0b84e] hover:to-[#d4a843] shadow-[0_2px_12px_rgba(212,168,67,.25)]"
                      : "bg-white/[.05] text-white/25 cursor-not-allowed"
                  )}
                >
                  <Send size={11} />
                  {busy ? "Sending…" : "Send Feedback"}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* FAB toggle button */}
      <button
        onClick={() => setStage(stage === "closed" ? "form" : "closed")}
        aria-label="Share feedback"
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,.5)] border-0 cursor-pointer",
          stage !== "closed"
            ? "bg-white/10 text-white/60 hover:bg-white/15"
            : "bg-gradient-to-br from-[#d4a843] to-[#c49838] text-[#09090d] hover:from-[#e0b84e] hover:to-[#d4a843] hover:shadow-[0_6px_24px_rgba(212,168,67,.4)] hover:scale-110"
        )}
      >
        {stage !== "closed" ? <X size={18} /> : <MessageSquarePlus size={19} />}
      </button>
    </div>
  );
}
