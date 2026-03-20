import { useState } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { Feedback } from "../types";

interface FeedbackTabProps {
  feedbacks: Feedback[];
  onToggleResolved: (id: string, val: boolean) => Promise<void>;
  onDelete: (id: string) => void;
}

export default function FeedbackTab({ feedbacks, onToggleResolved, onDelete }: FeedbackTabProps) {
  const [filter, setFilter] = useState<"all" | "bug" | "idea" | "open" | "resolved">("all");

  const filtered = feedbacks.filter((f) => {
    if (filter === "bug")      return f.type === "bug";
    if (filter === "idea")     return f.type === "idea";
    if (filter === "open")     return !f.resolved;
    if (filter === "resolved") return f.resolved;
    return true;
  });

  const bugs  = feedbacks.filter((f) => f.type === "bug").length;
  const ideas = feedbacks.filter((f) => f.type === "idea").length;
  const open  = feedbacks.filter((f) => !f.resolved).length;

  const FILTERS = [
    { id: "all"      as const, label: `All (${feedbacks.length})` },
    { id: "open"     as const, label: `Open (${open})` },
    { id: "bug"      as const, label: `Bugs (${bugs})` },
    { id: "idea"     as const, label: `Ideas (${ideas})` },
    { id: "resolved" as const, label: "Resolved" },
  ];

  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Feedback</div>
          <p className={TW.pgSub}>{open} open &middot; {feedbacks.length} total</p>
        </div>
      </div>

      <div className="flex gap-0 border-b border-white/[.08] mb-6 overflow-x-auto">
        {FILTERS.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={cn("font-mono text-[9px] tracking-[.2em] uppercase px-5 py-3 bg-transparent border-0 cursor-pointer transition-colors whitespace-nowrap",
              filter === f.id ? "text-[#c9a84c] border-b-2 border-[#c9a84c]" : "text-white/35 border-b-2 border-transparent"
            )}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className={TW.empty}>No feedback here yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((fb) => (
            <div key={fb.id} className={cn(TW.msgCard, fb.resolved && "opacity-50")}>
              <div className={TW.msgHead}>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={cn(TW.badge,
                    fb.type === "bug"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : "bg-[rgba(212,168,67,.12)] text-[#d4a843] border border-[rgba(212,168,67,.2)]"
                  )}>
                    {fb.type === "bug" ? "Bug" : "Idea"}
                  </span>
                  {fb.email && (
                    <span className="font-mono text-[9px] text-white/40">{fb.email}</span>
                  )}
                  {fb.page_url && (
                    <span className="font-mono text-[9px] text-white/25 italic">{fb.page_url}</span>
                  )}
                </div>
                <span className="font-mono text-[9px] text-white/25">
                  {new Date(fb.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <p className={TW.msgBody}>{fb.message}</p>
              <div className={cn(TW.actRow, "mt-3")}>
                <button
                  className={cn(TW.btn, fb.resolved ? TW.ghost : TW.gold, TW.sm)}
                  onClick={() => onToggleResolved(fb.id, !fb.resolved)}
                >
                  {fb.resolved ? "Reopen" : "Mark Resolved"}
                </button>
                <button className={cn(TW.btn, TW.danger, TW.sm)} onClick={() => onDelete(fb.id)}>
                  <Trash2 size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
