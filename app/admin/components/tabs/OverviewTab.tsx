import Link from "next/link";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { BlogPost, Subscriber, Message, EmailLog, AnalyticsData, Tab } from "../types";
import MiniBarChart from "../MiniBarChart";

interface OverviewTabProps {
  posts: BlogPost[];
  subs: Subscriber[];
  msgs: Message[];
  logs: EmailLog[];
  analytics: AnalyticsData | null;
  onNav: (t: Tab) => void;
}

export default function OverviewTab({ posts, subs, msgs, logs, analytics, onNav }: OverviewTabProps) {
  const pub      = posts.filter((p) => p.published).length;
  const unread   = msgs.filter((m) => !m.read).length;
  const opened   = logs.filter((l) => l.opened_at).length;
  const openRate = logs.length ? Math.round((opened / logs.length) * 100) : 0;

  const STATS: { num: string | number; label: string; nav: Tab }[] = [
    { num: posts.length,                  label: "Total Posts",      nav: "posts"       },
    { num: pub,                           label: "Published",        nav: "posts"       },
    { num: subs.length,                   label: "Subscribers",      nav: "subscribers" },
    { num: unread,                        label: "Unread Messages",  nav: "messages"    },
    { num: analytics?.totalViews   ?? "—", label: "Page Views (30d)", nav: "analytics"  },
    { num: analytics?.uniqueVisitors ?? "—", label: "Visitors (30d)", nav: "analytics"  },
    { num: logs.length,                   label: "Emails Sent",      nav: "mail"        },
    { num: `${openRate}%`,                label: "Open Rate",        nav: "mail"        },
  ];

  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Dashboard</div>
          <p className={TW.pgSub}>Welcome back, Samuel.</p>
        </div>
        <a href="/" target="_blank" rel="noreferrer" className={cn(TW.btn, TW.ghost)} style={{ textDecoration: "none", padding: "10px 18px", fontSize: "8px" }}>
          <Globe size={10} /> View Site
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        {STATS.map(({ num, label, nav }) => (
          <div key={label} className={TW.stat} role="button" onClick={() => onNav(nav)}>
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[rgba(212,168,67,.5)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[250ms]" />
            <div className={TW.statNum}>{num}</div>
            <div className={TW.statLbl}>{label}</div>
          </div>
        ))}
      </div>

      {analytics && (
        <div className="mb-12">
          <div className={TW.sHead}>
            <div className={TW.sTitle}>Page Views — Last 14 Days</div>
            <button className={cn(TW.btn, TW.ghost)} onClick={() => onNav("analytics")}>Full Report</button>
          </div>
          <MiniBarChart data={analytics.dailyViews} />
        </div>
      )}

      <div className={TW.sHead}>
        <div className={TW.sTitle}>Recent Posts</div>
        <button className={cn(TW.btn, TW.ghost)} onClick={() => onNav("posts")}>View All</button>
      </div>
      <div className={TW.tWrap}>
        <table className="w-full border-collapse">
          <thead><tr><th className={TW.th}>Title</th><th className={TW.th}>Category</th><th className={TW.th}>Status</th><th className={TW.th}>Date</th></tr></thead>
          <tbody>
            {posts.slice(0, 5).map((p) => (
              <tr key={p.id} className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                <td className={TW.td} style={{ color: "#f0ece4" }}>{p.title}</td>
                <td className={TW.td} style={{ textTransform: "capitalize" }}>{p.category}</td>
                <td className={TW.td}><span className={cn(TW.badge, p.published ? TW.bPub : TW.bDft)}>{p.published ? "Published" : "Draft"}</span></td>
                <td className={TW.td}>{new Date(p.created_at).toLocaleDateString("en-GB")}</td>
              </tr>
            ))}
            {posts.length === 0 && <tr><td colSpan={4} className={TW.empty}>No posts yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
