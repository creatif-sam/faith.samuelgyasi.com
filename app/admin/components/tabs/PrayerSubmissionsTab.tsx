import { useState } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";

interface PrayerSubmission {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  prayer_topic: string;
  details: string | null;
  is_urgent: boolean;
  prayed_for: boolean;
  created_at: string;
}

interface PrayerSubmissionsTabProps {
  prayers: PrayerSubmission[];
  onTogglePrayed: (id: string, val: boolean) => Promise<void>;
  onDelete: (id: string) => void;
}

export default function PrayerSubmissionsTab({ prayers, onTogglePrayed, onDelete }: PrayerSubmissionsTabProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "prayed">("all");

  const filtered = prayers.filter(p => {
    if (filter === "pending") return !p.prayed_for;
    if (filter === "prayed") return p.prayed_for;
    return true;
  });

  const pendingCount = prayers.filter(p => !p.prayed_for).length;

  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Prayer Submissions</div>
          <p className={TW.pgSub}>{pendingCount} pending · {prayers.length} total</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setFilter("all")}
          className={cn(TW.btn, TW.sm, filter === "all" ? TW.gold : TW.ghost)}
        >
          All ({prayers.length})
        </button>
        <button 
          onClick={() => setFilter("pending")}
          className={cn(TW.btn, TW.sm, filter === "pending" ? TW.gold : TW.ghost)}
        >
          Pending ({pendingCount})
        </button>
        <button 
          onClick={() => setFilter("prayed")}
          className={cn(TW.btn, TW.sm, filter === "prayed" ? TW.gold : TW.ghost)}
        >
          Prayed For ({prayers.filter(p => p.prayed_for).length})
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className={TW.empty}>No prayer submissions found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((prayer) => (
            <div 
              key={prayer.id} 
              className={cn(
                TW.msgCard,
                !prayer.prayed_for && TW.msgNew,
                prayer.is_urgent && "!border-l-red-500/60"
              )}
            >
              <div className={TW.msgHead}>
                <div className="flex-1">
                  <div className={TW.msgName}>
                    {prayer.name}
                    {prayer.is_urgent && (
                      <span className="text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                        URGENT
                      </span>
                    )}
                    {prayer.prayed_for && (
                      <span className="text-[9px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                        PRAYED FOR
                      </span>
                    )}
                  </div>
                  <div className={TW.msgMeta}>
                    {prayer.email && <span>{prayer.email}</span>}
                    {prayer.phone && <span> · {prayer.phone}</span>}
                    <span> · {new Date(prayer.created_at).toLocaleString()}</span>
                  </div>
                  <div className={cn(TW.msgSubj, "!text-[#d4a843] !font-semibold !not-italic")}>
                    {prayer.prayer_topic}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => onTogglePrayed(prayer.id, !prayer.prayed_for)}
                    className={cn(TW.btn, TW.sm, prayer.prayed_for ? TW.ghost : TW.gold)}
                    title={prayer.prayed_for ? "Mark as pending" : "Mark as prayed for"}
                  >
                    {prayer.prayed_for ? <Circle size={12} /> : <CheckCircle size={12} />}
                    {prayer.prayed_for ? "Pending" : "Prayed"}
                  </button>
                  <button
                    onClick={() => onDelete(prayer.id)}
                    className={cn(TW.btn, TW.danger, TW.sm)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {prayer.details && (
                <div className={TW.msgBody}>
                  {prayer.details}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
