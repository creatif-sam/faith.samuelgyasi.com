import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { AnalyticsData } from "../types";
import MiniBarChart from "../MiniBarChart";

interface AnalyticsTabProps {
  analytics: AnalyticsData | null;
}

export default function AnalyticsTab({ analytics }: AnalyticsTabProps) {
  if (!analytics) return <p className={TW.empty}>No analytics data. Visit the site to start tracking.</p>;
  const { totalViews, uniqueVisitors, topPages, dailyViews } = analytics;

  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div><div className={TW.pgTitle}>Analytics</div><p className={TW.pgSub}>Last 30 days · samuelgyasi.com</p></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {[
          { num: totalViews,     label: "Total Page Views" },
          { num: uniqueVisitors, label: "Unique Visitors"  },
          { num: totalViews > 0 ? (totalViews / 30).toFixed(1) : "—", label: "Avg Views / Day" },
          { num: topPages[0]?.count ?? "—",  label: "Top Page Views"  },
        ].map(({ num, label }) => (
          <div key={label} className={TW.stat}>
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[rgba(212,168,67,.5)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className={TW.statNum}>{num}</div>
            <div className={TW.statLbl}>{label}</div>
          </div>
        ))}
      </div>

      <div className={cn(TW.sHead, "mb-3")}>
        <div className={TW.sTitle}>Daily Views <span className="text-xs font-mono text-white/30">— 14d</span></div>
      </div>
      <MiniBarChart data={dailyViews} />

      <div className="mt-12">
        <div className={cn(TW.sHead, "mb-4")}>
          <div className={TW.sTitle}>Top Pages</div>
        </div>
        {topPages.length === 0 ? <p className={TW.empty}>No data yet.</p> : (
          <div className={TW.tWrap}>
            <table className="w-full border-collapse">
              <thead><tr><th className={TW.th}>Page</th><th className={TW.th}>Views</th><th className={TW.th}>Share</th></tr></thead>
              <tbody>
                {topPages.map(({ path, count }) => (
                  <tr key={path} className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                    <td className={TW.td} style={{ color: "#f0ece4", fontFamily: "'Poppins',sans-serif", fontSize: "11px" }}>
                      <span className="flex items-center gap-2">
                        {path}
                        <a href={path} target="_blank" rel="noreferrer" style={{ color: "rgba(240,236,228,.25)", lineHeight: 0 }}><ExternalLink size={10} /></a>
                      </span>
                    </td>
                    <td className={TW.td} style={{ color: "#c9a84c", fontFamily: "'Poppins',sans-serif", fontSize: "22px", fontWeight: 700 }}>{count}</td>
                    <td className={TW.td}>
                      <div className="flex items-center gap-2.5 font-mono text-[9px] text-white/35 min-w-[120px]">
                        <div className="h-[3px] bg-gradient-to-r from-[#d4a843] to-[#f0cc7a] rounded-full flex-shrink-0 transition-all max-w-[100px]" style={{ width: `${(count / totalViews) * 100}%` }} />
                        <span>{((count / totalViews) * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
