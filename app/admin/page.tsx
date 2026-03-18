"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  LayoutDashboard, BarChart3, FileText, Users, MessageSquare,
  Mail, Phone, Send, Inbox, Clock, BookOpen, Eye, Trash2,
  Pencil, Plus, CheckCheck, X, Globe, ExternalLink,
  Code, AlignLeft, Reply, Menu, Copy, Star, LogOut, Calendar,
} from "lucide-react";

// ── TYPES ──────────────────────────────────────────────────────────────────
interface BlogPost {
  id: string; title: string; slug: string; category: string;
  published: boolean; excerpt: string | null; content: string | null;
  read_time_minutes: number; featured_image_url: string | null;
  created_at: string;
}
interface Subscriber {
  id: string; email: string; name: string | null;
  created_at: string; confirmed: boolean;
  interests?: string[] | null;
}
interface Message {
  id: string; name: string; email: string; subject: string | null;
  message: string; read: boolean; created_at: string;
}
interface EmailLog {
  id: string; resend_id: string | null; to_email: string;
  from_email: string; subject: string; body_html: string | null;
  body_text: string | null; status: string; opened_at: string | null;
  sent_at: string; template_id: string | null;
}
interface EmailTemplate {
  id: string; name: string; subject: string;
  body_html: string; body_text: string; created_at: string;
}
interface InboundEmail {
  id: string; from_email: string; from_name: string | null;
  to_email: string | null; subject: string | null;
  body_text: string | null; body_html: string | null;
  read: boolean; received_at: string;
}
interface PageViewRow {
  page_path: string; visitor_id: string; created_at: string;
}
interface AnalyticsData {
  totalViews: number; uniqueVisitors: number;
  topPages: { path: string; count: number }[];
  dailyViews: { date: string; count: number }[];
}
interface Testimonial {
  id: string; name: string; role: string | null; company: string | null;
  avatar_url: string | null; quote: string; rating: number;
  published: boolean; sort_order: number; created_at: string;
}

interface LibraryItem {
  id: string;
  title: string;
  author: string | null;
  category: "ebook" | "review";
  description: string | null;
  rating: number | null;
  download_url: string | null;
  cover_url: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  description: string | null;
  date_text: string | null;
  location: string | null;
  tag: string | null;
  category: "intervention" | "masterclass" | "session";
  published: boolean;
  sort_order: number;
  created_at: string;
}

type Tab = "overview" | "analytics" | "posts" | "subscribers" | "messages" | "mail" | "whatsapp" | "testimonials" | "library" | "upcoming";
type MailSubTab = "compose" | "inbox" | "sent" | "templates";

const CATEGORIES = ["faith", "leadership", "intellectuality", "transformation"] as const;

function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 80);
}

const NAV: { id: Tab; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "overview",     label: "Overview",      Icon: LayoutDashboard },
  { id: "analytics",   label: "Analytics",     Icon: BarChart3       },
  { id: "posts",       label: "Blog Posts",    Icon: FileText        },
  { id: "subscribers", label: "Subscribers",   Icon: Users           },
  { id: "messages",    label: "Messages",      Icon: MessageSquare   },
  { id: "mail",        label: "Mail",          Icon: Mail            },
  { id: "whatsapp",    label: "WhatsApp",      Icon: Phone           },
  { id: "testimonials",label: "Testimonials",  Icon: Star            },
  { id: "library",     label: "Library",       Icon: BookOpen        },
  { id: "upcoming",    label: "Upcoming",      Icon: Calendar        },
];

// ── ADMIN PAGE ─────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab]             = useState<Tab>("overview");
  const [mailSub, setMailSub]     = useState<MailSubTab>("compose");
  const [posts, setPosts]         = useState<BlogPost[]>([]);
  const [subs, setSubs]           = useState<Subscriber[]>([]);
  const [msgs, setMsgs]           = useState<Message[]>([]);
  const [logs, setLogs]           = useState<EmailLog[]>([]);
  const [inbox, setInbox]         = useState<InboundEmail[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading]     = useState(true);
  const [showPost, setShowPost]   = useState(false);
  const [editPost, setEditPost]   = useState<BlogPost | null>(null);
  const [showTpl, setShowTpl]     = useState(false);
  const [editTpl, setEditTpl]     = useState<EmailTemplate | null>(null);
  const [showTestimonial, setShowTestimonial] = useState(false);
  const [editTestimonial, setEditTestimonial] = useState<Testimonial | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [showLibItem, setShowLibItem] = useState(false);
  const [editLibItem, setEditLibItem] = useState<LibraryItem | null>(null);
  const [upcomingEvents, setUpcomingEvents]   = useState<UpcomingEvent[]>([]);
  const [showUpcoming, setShowUpcoming]       = useState(false);
  const [editUpcoming, setEditUpcoming]       = useState<UpcomingEvent | null>(null);
  const [confirm, setConfirm]     = useState<{ msg: string; fn: () => Promise<void> } | null>(null);
  const [navOpen, setNavOpen]     = useState(false);
  const router = useRouter();

  const db = createClient();

  const handleLogout = async () => {
    await db.auth.signOut();
    router.push("/auth/login");
  };

  const load = useCallback(async () => {
    setLoading(true);
    const [pR, sR, mR, lR, iR, tR, aR, tsR, libR, upR] = await Promise.all([
      db.from("blog_posts").select("*").order("created_at", { ascending: false }),
      db.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
      db.from("contact_messages").select("*").order("created_at", { ascending: false }),
      db.from("email_logs").select("*").order("sent_at", { ascending: false }),
      db.from("inbound_emails").select("*").order("received_at", { ascending: false }),
      db.from("email_templates").select("*").order("created_at", { ascending: false }),
      db.from("page_views").select("page_path,visitor_id,created_at")
        .gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString()),
      db.from("testimonials").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
      db.from("library_items").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
      db.from("upcoming_events").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
    ]);
    setPosts(pR.data ?? []);
    setSubs(sR.data ?? []);
    setMsgs(mR.data ?? []);
    setLogs(lR.data ?? []);
    setInbox(iR.data ?? []);
    setTemplates(tR.data ?? []);
    setTestimonials(tsR.data ?? []);
    setLibraryItems(libR.data ?? []);
    setUpcomingEvents(upR.data ?? []);

    const views: PageViewRow[] = aR.data ?? [];
    const totalViews     = views.length;
    const uniqueVisitors = new Set(views.map((v) => v.visitor_id)).size;
    const pc = views.reduce((a, v) => { a[v.page_path] = (a[v.page_path] ?? 0) + 1; return a; }, {} as Record<string, number>);
    const topPages = Object.entries(pc).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([path, count]) => ({ path, count }));
    const dailyViews: { date: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d   = new Date(Date.now() - i * 86400000);
      const str = d.toISOString().slice(0, 10);
      dailyViews.push({ date: str, count: views.filter((v) => v.created_at.slice(0, 10) === str).length });
    }
    setAnalytics({ totalViews, uniqueVisitors, topPages, dailyViews });
    setLoading(false);
  }, [db]);

  useEffect(() => { load(); }, [load]);

  const unreadMsgs   = msgs.filter((m) => !m.read).length;
  const unreadInbox  = inbox.filter((e) => !e.read).length;

  function ask(msg: string, fn: () => Promise<void>) { setConfirm({ msg, fn }); }
  function go(t: Tab) { setTab(t); setNavOpen(false); }

  return (
    <div className="adm-layout">
      {/* Mobile header */}
      <div className="adm-mobile-header">
        <button className="adm-hamburger" onClick={() => setNavOpen(!navOpen)} aria-label="Menu">
          <Menu size={18} />
        </button>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "14px", fontWeight: 700, color: "#f0ece4", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#c9a84c", fontSize: "12px" }}>✦</span>Samuel Gyasi
        </span>
        <Link href="/" style={{ color: "rgba(240,236,228,.35)", lineHeight: 0 }}><Globe size={16} /></Link>
      </div>

      {/* Sidebar */}
      <aside className={`adm-sidebar${navOpen ? " adm-sidebar--open" : ""}`}>
        <div className="adm-logo">
          <span>Admin</span>
          Samuel Gyasi
        </div>
        <nav className="adm-nav">
          {NAV.map(({ id, label, Icon }) => {
            const badge = id === "messages" && unreadMsgs > 0 ? unreadMsgs
                        : id === "mail"     && unreadInbox > 0 ? unreadInbox
                        : null;
            return (
              <button key={id} className={`adm-nav-item${tab === id ? " active" : ""}`} onClick={() => go(id)}>
                <Icon size={13} />
                <span style={{ flex: 1 }}>{label}</span>
                {badge !== null && <span className="adm-nav-badge">{badge}</span>}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: "0 28px 24px", marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link href="/" style={{ fontFamily: "'Space Mono',monospace", fontSize: "9px", letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(240,236,228,.3)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
            <Globe size={10} /> Back to Site
          </Link>
          <button
            onClick={handleLogout}
            style={{ fontFamily: "'Space Mono',monospace", fontSize: "9px", letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(240,236,228,.35)", background: "none", border: "1px solid rgba(240,236,228,.1)", padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", width: "100%", transition: "border-color .2s, color .2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,168,76,.4)"; (e.currentTarget as HTMLButtonElement).style.color = "#c9a84c"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(240,236,228,.1)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(240,236,228,.35)"; }}
          >
            <LogOut size={10} /> Log Out
          </button>
        </div>
      </aside>

      {navOpen && <div className="adm-overlay-backdrop" onClick={() => setNavOpen(false)} />}

      {/* Main */}
      <main className="adm-main">
        {loading ? (
          <div className="adm-loading"><div className="adm-loading-dot"/><div className="adm-loading-dot"/><div className="adm-loading-dot"/></div>
        ) : (
          <>
            {tab === "overview"     && <OverviewTab posts={posts} subs={subs} msgs={msgs} logs={logs} analytics={analytics} onNav={go} />}
            {tab === "analytics"    && <AnalyticsTab analytics={analytics} />}
            {tab === "posts"        && (
              <PostsTab
                posts={posts}
                onNew={() => { setEditPost(null); setShowPost(true); }}
                onEdit={(p) => { setEditPost(p); setShowPost(true); }}
                onDelete={(id, title) => ask(`Delete "${title}"?`, async () => {
                  const { error } = await db.from("blog_posts").delete().eq("id", id);
                  if (error) { toast.error("Delete failed"); return; }
                  toast.success("Post deleted"); await load();
                })}
                onToggle={async (id, val) => {
                  const { error } = await db.from("blog_posts").update({ published: val }).eq("id", id);
                  if (error) { toast.error("Update failed"); return; }
                  toast.success(val ? "Published" : "Unpublished"); await load();
                }}
              />
            )}
            {tab === "subscribers"  && (
              <SubsTab
                subs={subs}
                onDelete={(id, email) => ask(`Remove ${email}?`, async () => {
                  const { error } = await db.from("newsletter_subscribers").delete().eq("id", id);
                  if (error) { toast.error("Remove failed"); return; }
                  toast.success("Removed"); await load();
                })}
              />
            )}
            {tab === "messages"     && (
              <MsgsTab
                msgs={msgs}
                templates={templates}
                onRead={async (id) => { await db.from("contact_messages").update({ read: true }).eq("id", id); await load(); }}
              />
            )}
            {tab === "mail"         && (
              <MailTab
                sub={mailSub} setSub={setMailSub}
                logs={logs} inbox={inbox} templates={templates}
                onReload={load} db={db}
                onEditTpl={(t) => { setEditTpl(t); setShowTpl(true); }}
                onNewTpl={() => { setEditTpl(null); setShowTpl(true); }}
                onDeleteTpl={(id, name) => ask(`Delete template "${name}"?`, async () => {
                  const r = await fetch(`/api/mail/templates?id=${id}`, { method: "DELETE" });
                  if (!r.ok) { toast.error("Delete failed"); return; }
                  toast.success("Template deleted"); await load();
                })}
              />
            )}
            {tab === "whatsapp"     && <WhatsApp />}
            {tab === "testimonials" && (
              <TestimonialsTab
                testimonials={testimonials}
                onNew={() => { setEditTestimonial(null); setShowTestimonial(true); }}
                onEdit={(t) => { setEditTestimonial(t); setShowTestimonial(true); }}
                onDelete={(id, name) => ask(`Delete testimonial from "${name}"?`, async () => {
                  const { error } = await db.from("testimonials").delete().eq("id", id);
                  if (error) { toast.error("Delete failed"); return; }
                  toast.success("Deleted"); await load();
                })}
                onToggle={async (id, val) => {
                  const { error } = await db.from("testimonials").update({ published: val }).eq("id", id);
                  if (error) { toast.error("Update failed"); return; }
                  toast.success(val ? "Published" : "Unpublished"); await load();
                }}
              />
            )}
            {tab === "library" && (
              <LibraryTab
                items={libraryItems}
                onNew={() => { setEditLibItem(null); setShowLibItem(true); }}
                onEdit={(item) => { setEditLibItem(item); setShowLibItem(true); }}
                onDelete={(id, title) => ask(`Delete "${title}"?`, async () => {
                  const { error } = await db.from("library_items").delete().eq("id", id);
                  if (error) { toast.error("Delete failed"); return; }
                  toast.success("Deleted"); await load();
                })}
                onToggle={async (id, val) => {
                  const { error } = await db.from("library_items").update({ published: val }).eq("id", id);
                  if (error) { toast.error("Update failed"); return; }
                  toast.success(val ? "Published" : "Unpublished"); await load();
                }}
              />
            )}
            {tab === "upcoming" && (
              <UpcomingTab
                events={upcomingEvents}
                onNew={() => { setEditUpcoming(null); setShowUpcoming(true); }}
                onEdit={(ev) => { setEditUpcoming(ev); setShowUpcoming(true); }}
                onDelete={(id, title) => ask(`Delete "${title}"?`, async () => {
                  const { error } = await db.from("upcoming_events").delete().eq("id", id);
                  if (error) { toast.error("Delete failed"); return; }
                  toast.success("Deleted"); await load();
                })}
                onToggle={async (id, val) => {
                  const { error } = await db.from("upcoming_events").update({ published: val }).eq("id", id);
                  if (error) { toast.error("Update failed"); return; }
                  toast.success(val ? "Published" : "Unpublished"); await load();
                }}
              />
            )}
          </>
        )}
      </main>

      {showTestimonial && (
        <TestimonialModal
          testimonial={editTestimonial}
          onClose={() => setShowTestimonial(false)}
          onSave={async () => { setShowTestimonial(false); await load(); }}
          db={db}
        />
      )}
      {showLibItem && (
        <LibraryItemModal
          item={editLibItem}
          onClose={() => setShowLibItem(false)}
          onSave={async () => { setShowLibItem(false); await load(); }}
          db={db}
        />
      )}
      {showUpcoming && (
        <UpcomingEventModal
          event={editUpcoming}
          onClose={() => setShowUpcoming(false)}
          onSave={async () => { setShowUpcoming(false); await load(); }}
          db={db}
        />
      )}
      {showPost && (
        <PostModal post={editPost} onClose={() => setShowPost(false)} onSave={async () => { setShowPost(false); await load(); }} db={db} />
      )}
      {showTpl && (
        <TplModal tpl={editTpl} onClose={() => setShowTpl(false)} onSave={async () => { setShowTpl(false); await load(); }} />
      )}
      {confirm && (
        <div className="adm-form-overlay" onClick={() => setConfirm(null)}>
          <div className="adm-confirm-box" onClick={(e) => e.stopPropagation()}>
            <p className="adm-confirm-msg">{confirm.msg}</p>
            <div className="adm-form-actions" style={{ marginTop: 0, paddingTop: 0, border: "none" }}>
              <button className="adm-btn adm-btn--ghost" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="adm-btn adm-btn--danger" onClick={async () => { await confirm.fn(); setConfirm(null); }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MINI BAR CHART ─────────────────────────────────────────────────────────
function MiniBarChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="adm-chart">
      {data.map((d) => (
        <div key={d.date} className="adm-chart-col" title={`${d.date}: ${d.count}`}>
          <div className="adm-chart-bar" style={{ height: `${Math.max((d.count / max) * 100, 2)}%` }} />
          <div className="adm-chart-lbl">
            {new Date(d.date + "T12:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── OVERVIEW ──────────────────────────────────────────────────────────────
function OverviewTab({ posts, subs, msgs, logs, analytics, onNav }: {
  posts: BlogPost[]; subs: Subscriber[]; msgs: Message[];
  logs: EmailLog[]; analytics: AnalyticsData | null;
  onNav: (t: Tab) => void;
}) {
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
      <div className="adm-header">
        <div>
          <div className="adm-page-title">Dashboard</div>
          <p className="adm-page-sub">Welcome back, Samuel.</p>
        </div>
        <a href="/" target="_blank" rel="noreferrer" className="adm-btn adm-btn--ghost" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 18px", fontSize: "8px" }}>
          <Globe size={10} /> View Site
        </a>
      </div>

      <div className="adm-stats-row">
        {STATS.map(({ num, label, nav }) => (
          <div key={label} className="adm-stat" style={{ cursor: "pointer" }} role="button" onClick={() => onNav(nav)}>
            <div className="adm-stat-num">{num}</div>
            <div className="adm-stat-label">{label}</div>
          </div>
        ))}
      </div>

      {analytics && (
        <div style={{ marginBottom: "48px" }}>
          <div className="adm-section-header">
            <div className="adm-section-title">Page Views — Last 14 Days</div>
            <button className="adm-btn adm-btn--ghost" onClick={() => onNav("analytics")}>Full Report</button>
          </div>
          <MiniBarChart data={analytics.dailyViews} />
        </div>
      )}

      <div className="adm-section-header">
        <div className="adm-section-title">Recent Posts</div>
        <button className="adm-btn adm-btn--ghost" onClick={() => onNav("posts")}>View All</button>
      </div>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {posts.slice(0, 5).map((p) => (
              <tr key={p.id}>
                <td style={{ color: "#f0ece4" }}>{p.title}</td>
                <td style={{ textTransform: "capitalize" }}>{p.category}</td>
                <td><span className={`adm-badge ${p.published ? "adm-badge--published" : "adm-badge--draft"}`}>{p.published ? "Published" : "Draft"}</span></td>
                <td>{new Date(p.created_at).toLocaleDateString("en-GB")}</td>
              </tr>
            ))}
            {posts.length === 0 && <tr><td colSpan={4} className="adm-empty" style={{ padding: "30px", textAlign: "center" }}>No posts yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ── ANALYTICS ─────────────────────────────────────────────────────────────
function AnalyticsTab({ analytics }: { analytics: AnalyticsData | null }) {
  if (!analytics) return <p className="adm-empty">No analytics data. Visit the site to start tracking.</p>;
  const { totalViews, uniqueVisitors, topPages, dailyViews } = analytics;

  return (
    <>
      <div className="adm-header">
        <div><div className="adm-page-title">Analytics</div><p className="adm-page-sub">Last 30 days · samuelgyasi.com</p></div>
      </div>

      <div className="adm-stats-row" style={{ marginBottom: "40px" }}>
        {[
          { num: totalViews,     label: "Total Page Views" },
          { num: uniqueVisitors, label: "Unique Visitors"  },
          { num: totalViews > 0 ? (totalViews / 30).toFixed(1) : "—", label: "Avg Views / Day" },
          { num: topPages[0]?.count ?? "—",  label: "Top Page Views"  },
        ].map(({ num, label }) => (
          <div key={label} className="adm-stat">
            <div className="adm-stat-num">{num}</div>
            <div className="adm-stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="adm-section-header" style={{ marginBottom: "12px" }}>
        <div className="adm-section-title">Daily Views <span style={{ fontSize: "12px", fontFamily: "'Space Mono',monospace", color: "rgba(240,236,228,.3)" }}>— 14d</span></div>
      </div>
      <MiniBarChart data={dailyViews} />

      <div style={{ marginTop: "48px" }}>
        <div className="adm-section-header" style={{ marginBottom: "16px" }}>
          <div className="adm-section-title">Top Pages</div>
        </div>
        {topPages.length === 0 ? <p className="adm-empty">No data yet.</p> : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>Page</th><th>Views</th><th>Share</th></tr></thead>
              <tbody>
                {topPages.map(({ path, count }) => (
                  <tr key={path}>
                    <td style={{ color: "#f0ece4", fontFamily: "'Space Mono',monospace", fontSize: "11px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {path}
                        <a href={path} target="_blank" rel="noreferrer" style={{ color: "rgba(240,236,228,.25)", lineHeight: 0 }}><ExternalLink size={10} /></a>
                      </span>
                    </td>
                    <td style={{ color: "#c9a84c", fontFamily: "'Playfair Display',serif", fontSize: "22px" }}>{count}</td>
                    <td style={{ minWidth: "140px" }}>
                      <div className="adm-progress-row">
                        <div className="adm-progress" style={{ width: `${(count / totalViews) * 100}%` }} />
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

// ── POSTS TAB ─────────────────────────────────────────────────────────────
function PostsTab({ posts, onNew, onEdit, onDelete, onToggle }: {
  posts: BlogPost[]; onNew: () => void;
  onEdit: (p: BlogPost) => void;
  onDelete: (id: string, title: string) => void;
  onToggle: (id: string, val: boolean) => Promise<void>;
}) {
  return (
    <>
      <div className="adm-header">
        <div><div className="adm-page-title">Blog Posts</div><p className="adm-page-sub">{posts.length} post{posts.length !== 1 ? "s" : ""}</p></div>
        <button className="adm-btn adm-btn--gold" onClick={onNew} style={{ display: "flex", alignItems: "center", gap: "6px" }}><Plus size={10} />New Post</button>
      </div>
      {posts.length === 0 ? <p className="adm-empty">No posts yet.</p> : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Title</th><th>Cat.</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td style={{ color: "#f0ece4", maxWidth: "240px" }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                    <div style={{ fontSize: "10px", color: "rgba(240,236,228,.25)", fontFamily: "'Space Mono',monospace", marginTop: "2px" }}>/{p.category}/blog/{p.slug}</div>
                  </td>
                  <td style={{ textTransform: "capitalize" }}>{p.category}</td>
                  <td><span className={`adm-badge ${p.published ? "adm-badge--published" : "adm-badge--draft"}`}>{p.published ? "Published" : "Draft"}</span></td>
                  <td>{new Date(p.created_at).toLocaleDateString("en-GB")}</td>
                  <td>
                    <div className="adm-action-row">
                      <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => onToggle(p.id, !p.published)}>{p.published ? "Unpublish" : "Publish"}</button>
                      <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => onEdit(p)}><Pencil size={9} /></button>
                      <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => onDelete(p.id, p.title)}><Trash2 size={9} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ── SUBSCRIBERS ───────────────────────────────────────────────────────────
function SubsTab({ subs, onDelete }: { subs: Subscriber[]; onDelete: (id: string, email: string) => void }) {
  return (
    <>
      <div className="adm-header">
        <div><div className="adm-page-title">Newsletter</div><p className="adm-page-sub">{subs.length} subscriber{subs.length !== 1 ? "s" : ""}</p></div>
      </div>
      {subs.length === 0 ? <p className="adm-empty">No subscribers yet.</p> : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Email</th><th>Name</th><th>Interests</th><th>Confirmed</th><th>Joined</th><th></th></tr></thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id}>
                  <td style={{ color: "#f0ece4" }}>{s.email}</td>
                  <td>{s.name ?? "—"}</td>
                  <td style={{ maxWidth: 220 }}>
                    {s.interests && s.interests.length > 0
                      ? s.interests.map((i) => (
                          <span key={i} className="adm-badge adm-badge--draft" style={{ marginRight: 4, marginBottom: 2, display: "inline-block", textTransform: "capitalize" }}>
                            {i.replace(/_/g, " ")}
                          </span>
                        ))
                      : <span style={{ color: "rgba(245,243,239,0.3)" }}>—</span>}
                  </td>
                  <td><span className={`adm-badge ${s.confirmed ? "adm-badge--published" : "adm-badge--draft"}`}>{s.confirmed ? "Yes" : "Pending"}</span></td>
                  <td>{new Date(s.created_at).toLocaleDateString("en-GB")}</td>
                  <td><button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => onDelete(s.id, s.email)}><Trash2 size={9} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ── MESSAGES ──────────────────────────────────────────────────────────────
function MsgsTab({ msgs, templates, onRead }: {
  msgs: Message[]; templates: EmailTemplate[];
  onRead: (id: string) => Promise<void>;
}) {
  const [exp, setExp]   = useState<string | null>(null);
  const [rply, setRply] = useState<Message | null>(null);

  return (
    <>
      <div className="adm-header">
        <div><div className="adm-page-title">Messages</div><p className="adm-page-sub">{msgs.filter((m) => !m.read).length} unread</p></div>
      </div>
      {msgs.length === 0 ? <p className="adm-empty">No messages yet.</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {msgs.map((m) => (
            <div key={m.id} className={`adm-msg-card${m.read ? "" : " adm-msg-card--new"}`}>
              <div className="adm-msg-header">
                <div>
                  <div className="adm-msg-name">{m.name}{!m.read && <span className="adm-badge adm-badge--new" style={{ marginLeft: 8 }}>NEW</span>}</div>
                  <div className="adm-msg-meta">{m.email} · {new Date(m.created_at).toLocaleDateString("en-GB")}</div>
                  {m.subject && <div className="adm-msg-subject">Re: {m.subject}</div>}
                </div>
                <div className="adm-action-row" style={{ flexShrink: 0 }}>
                  <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setExp(exp === m.id ? null : m.id)}>{exp === m.id ? "Collapse" : "Read"}</button>
                  {!m.read && <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => onRead(m.id)}><CheckCheck size={9} /></button>}
                  <button className="adm-btn adm-btn--gold adm-btn--sm" onClick={() => setRply(rply?.id === m.id ? null : m)} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Reply size={9} />Reply
                  </button>
                </div>
              </div>
              {exp === m.id && <div className="adm-msg-body">{m.message}</div>}
              {rply?.id === m.id && (
                <QuickReply to={m.email} subject={`Re: ${m.subject ?? "Your message"}`} templates={templates} onClose={() => setRply(null)} />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ── QUICK REPLY ────────────────────────────────────────────────────────────
function QuickReply({ to, subject, templates, onClose }: {
  to: string; subject: string; templates: EmailTemplate[]; onClose: () => void;
}) {
  const [body, setBody]   = useState("");
  const [mode, setMode]   = useState<"text" | "html">("text");
  const [busy, setBusy]   = useState(false);
  const [tpl, setTpl]     = useState("");

  function applyTpl(id: string) {
    const t = templates.find((t) => t.id === id);
    if (t) setBody(mode === "html" ? t.body_html : t.body_text);
    setTpl(id);
  }

  async function send() {
    if (!body.trim()) { toast.error("Body required"); return; }
    setBusy(true);
    const r = await fetch("/api/mail/send", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, bodyHtml: mode === "html" ? body : undefined, bodyText: mode === "text" ? body : undefined }),
    });
    setBusy(false);
    if (!r.ok) { const d = await r.json(); toast.error(d.error ?? "Failed"); return; }
    toast.success(`Reply sent to ${to}`);
    onClose();
  }

  return (
    <div className="adm-quick-reply">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "9px", color: "rgba(240,236,228,.45)", letterSpacing: ".1em", textTransform: "uppercase" }}>Reply to {to}</span>
        <button style={{ background: "none", border: "none", color: "rgba(240,236,228,.35)", cursor: "pointer" }} onClick={onClose}><X size={13} /></button>
      </div>
      {templates.length > 0 && (
        <select className="adm-select" value={tpl} onChange={(e) => applyTpl(e.target.value)} style={{ fontSize: "12px", padding: "7px 10px", marginBottom: "8px" }}>
          <option value="">— Load template —</option>
          {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      )}
      <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
        <button className={`adm-btn adm-btn--sm ${mode === "text" ? "adm-btn--gold" : "adm-btn--ghost"}`} onClick={() => setMode("text")}><AlignLeft size={9} style={{ marginRight: 4 }} />Text</button>
        <button className={`adm-btn adm-btn--sm ${mode === "html" ? "adm-btn--gold" : "adm-btn--ghost"}`} onClick={() => setMode("html")}><Code size={9} style={{ marginRight: 4 }} />HTML</button>
      </div>
      <textarea className="adm-textarea" style={{ minHeight: "110px" }} value={body} onChange={(e) => setBody(e.target.value)} placeholder={mode === "html" ? "<p>Your reply…</p>" : "Your reply…"} />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
        <button className="adm-btn adm-btn--gold" onClick={send} disabled={busy} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Send size={10} />{busy ? "Sending…" : "Send Reply"}
        </button>
      </div>
    </div>
  );
}

// ── MAIL TAB ──────────────────────────────────────────────────────────────
function MailTab({ sub, setSub, logs, inbox, templates, onReload, db, onEditTpl, onNewTpl, onDeleteTpl }: {
  sub: MailSubTab; setSub: (t: MailSubTab) => void;
  logs: EmailLog[]; inbox: InboundEmail[]; templates: EmailTemplate[];
  onReload: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any;
  onEditTpl: (t: EmailTemplate) => void;
  onNewTpl: () => void;
  onDeleteTpl: (id: string, name: string) => void;
}) {
  const unread = inbox.filter((e) => !e.read).length;
  const SUBS: { id: MailSubTab; label: string; Icon: React.ComponentType<{ size?: number }>; badge?: number }[] = [
    { id: "compose",   label: "Compose",   Icon: Send     },
    { id: "inbox",     label: "Inbox",     Icon: Inbox,    badge: unread },
    { id: "sent",      label: "Sent",      Icon: Clock    },
    { id: "templates", label: "Templates", Icon: BookOpen },
  ];

  return (
    <>
      <div className="adm-header">
        <div><div className="adm-page-title">Mail</div><p className="adm-page-sub">impact@samuelgyasi.com · via Resend</p></div>
      </div>
      <div className="adm-mail-subnav">
        {SUBS.map(({ id, label, Icon, badge }) => (
          <button key={id} className={`adm-mail-subtab${sub === id ? " active" : ""}`} onClick={() => setSub(id)}>
            <Icon size={12} />{label}
            {badge ? <span className="adm-nav-badge">{badge}</span> : null}
          </button>
        ))}
      </div>
      {sub === "compose"   && <ComposeView templates={templates} onReload={onReload} />}
      {sub === "inbox"     && <InboxView emails={inbox} db={db} onReload={onReload} templates={templates} />}
      {sub === "sent"      && <SentView logs={logs} />}
      {sub === "templates" && <TplsView templates={templates} onNew={onNewTpl} onEdit={onEditTpl} onDelete={onDeleteTpl} />}
    </>
  );
}

// ── COMPOSE ───────────────────────────────────────────────────────────────
function ComposeView({ templates, onReload }: { templates: EmailTemplate[]; onReload: () => Promise<void> }) {
  const [to, setTo]       = useState("");
  const [sub, setSub]     = useState("");
  const [body, setBody]   = useState("");
  const [mode, setMode]   = useState<"html" | "text">("html");
  const [prev, setPrev]   = useState(false);
  const [busy, setBusy]   = useState(false);
  const [tpl, setTpl]     = useState("");

  function loadTpl(id: string) {
    const t = templates.find((t) => t.id === id);
    if (t) { setSub(t.subject); setBody(mode === "html" ? t.body_html : t.body_text); }
    setTpl(id);
  }

  async function send() {
    if (!to.trim()) { toast.error("Recipient required"); return; }
    if (!sub.trim()) { toast.error("Subject required"); return; }
    if (!body.trim()) { toast.error("Body required"); return; }
    setBusy(true);
    const r = await fetch("/api/mail/send", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject: sub, bodyHtml: mode === "html" ? body : undefined, bodyText: mode === "text" ? body : undefined, templateId: tpl || undefined }),
    });
    const d = await r.json();
    setBusy(false);
    if (!r.ok) { toast.error(d.error ?? "Failed"); return; }
    toast.success(`Email sent to ${to}`);
    setTo(""); setSub(""); setBody(""); setTpl("");
    await onReload();
  }

  return (
    <div className="adm-compose">
      <div className="adm-compose-toolbar">
        {templates.length > 0 && (
          <select className="adm-select" style={{ flex: 1, maxWidth: "260px", fontSize: "12px", padding: "8px 11px" }} value={tpl} onChange={(e) => loadTpl(e.target.value)}>
            <option value="">— Load template —</option>
            {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        )}
        <div style={{ display: "flex", gap: "6px", marginLeft: "auto" }}>
          <button className={`adm-btn adm-btn--sm ${mode === "text" ? "adm-btn--gold" : "adm-btn--ghost"}`} onClick={() => setMode("text")}><AlignLeft size={9} style={{ marginRight: 4 }} />Plain text</button>
          <button className={`adm-btn adm-btn--sm ${mode === "html" ? "adm-btn--gold" : "adm-btn--ghost"}`} onClick={() => setMode("html")}><Code size={9} style={{ marginRight: 4 }} />HTML</button>
          {mode === "html" && <button className={`adm-btn adm-btn--sm ${prev ? "adm-btn--gold" : "adm-btn--ghost"}`} onClick={() => setPrev(!prev)}><Eye size={9} style={{ marginRight: 4 }} />Preview</button>}
        </div>
      </div>

      <div className="adm-field"><label className="adm-label">To</label><input className="adm-input" type="email" value={to} onChange={(e) => setTo(e.target.value)} placeholder="recipient@email.com" /></div>
      <div className="adm-field"><label className="adm-label">Subject</label><input className="adm-input" value={sub} onChange={(e) => setSub(e.target.value)} placeholder="Email subject" /></div>
      <div className="adm-field">
        <label className="adm-label">{mode === "html" ? "Body (HTML)" : "Body (Plain text)"} <span style={{ color: "rgba(240,236,228,.2)", marginLeft: 6 }}>{body.length} chars</span></label>
        {prev && mode === "html"
          ? <div className="adm-html-preview" dangerouslySetInnerHTML={{ __html: body }} />
          : <textarea className="adm-textarea" style={{ minHeight: "300px", fontFamily: mode === "html" ? "'Space Mono',monospace" : undefined, fontSize: mode === "html" ? "13px" : undefined }} value={body} onChange={(e) => setBody(e.target.value)} placeholder={mode === "html" ? "<h1>Hello,</h1>\n<p>Your message here.</p>" : "Hello,\n\nYour message here."} />
        }
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="adm-btn adm-btn--gold" onClick={send} disabled={busy} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Send size={11} />{busy ? "Sending…" : "Send Email"}
        </button>
      </div>
    </div>
  );
}

// ── INBOX ─────────────────────────────────────────────────────────────────
function InboxView({ emails, db, onReload, templates }: {
  emails: InboundEmail[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any;
  onReload: () => Promise<void>;
  templates: EmailTemplate[];
}) {
  const [exp, setExp]     = useState<string | null>(null);
  const [rply, setRply]   = useState<InboundEmail | null>(null);
  const [showHtml, setShowHtml] = useState<string | null>(null);

  async function markRead(id: string) {
    await db.from("inbound_emails").update({ read: true }).eq("id", id);
    await onReload();
  }

  return emails.length === 0 ? (
    <div>
      <p className="adm-empty">No inbound emails yet.</p>
      <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "9px", color: "rgba(240,236,228,.2)", textAlign: "center", letterSpacing: ".08em", lineHeight: 2.2, maxWidth: "440px", margin: "0 auto" }}>
        To receive emails here, configure Resend inbound routing<br />
        with webhook → /api/mail/inbound
      </p>
    </div>
  ) : (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {emails.map((e) => (
        <div key={e.id} className={`adm-msg-card${e.read ? "" : " adm-msg-card--new"}`}>
          <div className="adm-msg-header">
            <div>
              <div className="adm-msg-name">{e.from_name ?? e.from_email}{!e.read && <span className="adm-badge adm-badge--new" style={{ marginLeft: 8 }}>NEW</span>}</div>
              <div className="adm-msg-meta">{e.from_email} · {new Date(e.received_at).toLocaleDateString("en-GB")}</div>
              {e.subject && <div className="adm-msg-subject">{e.subject}</div>}
            </div>
            <div className="adm-action-row" style={{ flexShrink: 0 }}>
              <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setExp(exp === e.id ? null : e.id)}>{exp === e.id ? "Collapse" : "Read"}</button>
              {e.body_html && <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setShowHtml(showHtml === e.id ? null : e.id)}><Code size={9} /></button>}
              {!e.read && <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => markRead(e.id)}><CheckCheck size={9} /></button>}
              <button className="adm-btn adm-btn--gold adm-btn--sm" onClick={() => setRply(rply?.id === e.id ? null : e)} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Reply size={9} />Reply
              </button>
            </div>
          </div>
          {exp === e.id && (
            <div className="adm-msg-body">
              {showHtml === e.id
                ? <div dangerouslySetInnerHTML={{ __html: e.body_html ?? "" }} />
                : (e.body_text ?? e.body_html ?? "(empty)")}
            </div>
          )}
          {rply?.id === e.id && (
            <QuickReply to={e.from_email} subject={`Re: ${e.subject ?? "Your email"}`} templates={templates} onClose={() => setRply(null)} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── SENT VIEW ─────────────────────────────────────────────────────────────
function SentView({ logs }: { logs: EmailLog[] }) {
  const [exp, setExp] = useState<string | null>(null);

  function statusBadge(l: EmailLog) {
    if (l.opened_at)      return <span className="adm-badge adm-badge--opened"><Eye size={8} style={{ marginRight: 3 }} />Opened</span>;
    if (l.status === "failed") return <span className="adm-badge adm-badge--draft">Failed</span>;
    return <span className="adm-badge adm-badge--sent">Sent</span>;
  }

  return logs.length === 0 ? <p className="adm-empty">No emails sent yet.</p> : (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {logs.map((l) => (
        <div key={l.id} className="adm-msg-card">
          <div className="adm-msg-header">
            <div>
              <div className="adm-msg-name" style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                {l.subject}{statusBadge(l)}
              </div>
              <div className="adm-msg-meta">
                To: {l.to_email} · {new Date(l.sent_at).toLocaleDateString("en-GB")}
                {l.opened_at && ` · Opened ${new Date(l.opened_at).toLocaleDateString("en-GB")}`}
              </div>
            </div>
            <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setExp(exp === l.id ? null : l.id)}>{exp === l.id ? "Collapse" : "View"}</button>
          </div>
          {exp === l.id && (
            <div className="adm-msg-body">
              {l.body_html ? <div dangerouslySetInnerHTML={{ __html: l.body_html }} /> : (l.body_text ?? "(no body)")}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── TEMPLATES VIEW ────────────────────────────────────────────────────────
function TplsView({ templates, onNew, onEdit, onDelete }: {
  templates: EmailTemplate[]; onNew: () => void;
  onEdit: (t: EmailTemplate) => void;
  onDelete: (id: string, name: string) => void;
}) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div className="adm-section-title">Email Templates</div>
        <button className="adm-btn adm-btn--gold" onClick={onNew} style={{ display: "flex", alignItems: "center", gap: "6px" }}><Plus size={10} />New Template</button>
      </div>
      {templates.length === 0 ? <p className="adm-empty">No templates. Create reusable email layouts.</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {templates.map((t) => (
            <div key={t.id} className="adm-msg-card">
              <div className="adm-msg-header">
                <div>
                  <div className="adm-msg-name">{t.name}</div>
                  <div className="adm-msg-subject" style={{ marginTop: 3 }}>{t.subject}</div>
                  <div className="adm-msg-meta" style={{ marginTop: 3 }}>Created {new Date(t.created_at).toLocaleDateString("en-GB")} · {t.body_html.length} HTML chars</div>
                </div>
                <div className="adm-action-row" style={{ flexShrink: 0 }}>
                  <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => onEdit(t)}><Pencil size={9} /></button>
                  <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => onDelete(t.id, t.name)}><Trash2 size={9} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ── TEMPLATE MODAL ────────────────────────────────────────────────────────
function TplModal({ tpl, onClose, onSave }: {
  tpl: EmailTemplate | null; onClose: () => void; onSave: () => Promise<void>;
}) {
  const [name, setName]     = useState(tpl?.name    ?? "");
  const [subj, setSubj]     = useState(tpl?.subject ?? "");
  const [html, setHtml]     = useState(tpl?.body_html ?? "");
  const [text, setText]     = useState(tpl?.body_text ?? "");
  const [tab, setTab]       = useState<"html" | "text">("html");
  const [prev, setPrev]     = useState(false);
  const [busy, setBusy]     = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name required"); return; }
    if (!subj.trim()) { toast.error("Subject required"); return; }
    setBusy(true);
    const r = await fetch("/api/mail/templates", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: tpl?.id, name, subject: subj, bodyHtml: html, bodyText: text }),
    });
    setBusy(false);
    if (!r.ok) { toast.error("Save failed"); return; }
    toast.success(tpl ? "Template updated" : "Template created");
    await onSave();
  }

  return (
    <div className="adm-form-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="adm-form-modal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div className="adm-form-title" style={{ margin: 0 }}>{tpl ? "Edit Template" : "New Template"}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(240,236,228,.4)", cursor: "pointer" }}><X size={16} /></button>
        </div>
        <form onSubmit={save}>
          <div className="adm-field"><label className="adm-label">Template Name *</label><input className="adm-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Welcome Email" required /></div>
          <div className="adm-field"><label className="adm-label">Subject *</label><input className="adm-input" value={subj} onChange={(e) => setSubj(e.target.value)} placeholder="Email subject line" required /></div>

          <div style={{ display: "flex", gap: "6px", marginBottom: "12px", alignItems: "center" }}>
            <button type="button" className={`adm-btn adm-btn--sm ${tab === "html" ? "adm-btn--gold" : "adm-btn--ghost"}`} onClick={() => setTab("html")}><Code size={9} style={{ marginRight: 4 }} />HTML Body</button>
            <button type="button" className={`adm-btn adm-btn--sm ${tab === "text" ? "adm-btn--gold" : "adm-btn--ghost"}`} onClick={() => setTab("text")}><AlignLeft size={9} style={{ marginRight: 4 }} />Plain Text</button>
            {tab === "html" && <button type="button" className={`adm-btn adm-btn--sm ${prev ? "adm-btn--gold" : "adm-btn--ghost"}`} onClick={() => setPrev(!prev)} style={{ marginLeft: "auto" }}><Eye size={9} style={{ marginRight: 4 }} />Preview</button>}
          </div>

          {tab === "html" && (
            <div className="adm-field">
              <label className="adm-label">HTML <span style={{ color: "rgba(240,236,228,.2)" }}>{html.length} chars</span></label>
              {prev
                ? <div className="adm-html-preview" dangerouslySetInnerHTML={{ __html: html }} />
                : <textarea className="adm-textarea" style={{ fontFamily: "'Space Mono',monospace", fontSize: "13px" }} value={html} onChange={(e) => setHtml(e.target.value)} placeholder="<h1>Hello,</h1><p>Your content here.</p>" />
              }
            </div>
          )}
          {tab === "text" && (
            <div className="adm-field">
              <label className="adm-label">Plain Text Fallback <span style={{ color: "rgba(240,236,228,.2)" }}>{text.length} chars</span></label>
              <textarea className="adm-textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder={"Hello,\n\nYour content here."} />
            </div>
          )}

          <div className="adm-form-actions">
            <button type="button" className="adm-btn adm-btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="adm-btn adm-btn--gold" disabled={busy}>{busy ? "Saving…" : tpl ? "Save Changes" : "Create Template"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── WHATSAPP ──────────────────────────────────────────────────────────────
function WhatsApp() {
  const DEFAULT_NUM = "233244000000";
  const [num, setNum]     = useState(DEFAULT_NUM);
  const [saved, setSaved] = useState(DEFAULT_NUM);
  const [recip, setRecip] = useState("");
  const [msg, setMsg]     = useState("Hello Samuel, I'd like to connect.");
  const [copied, setCopied] = useState(false);

  const chatLink    = `https://wa.me/${saved.replace(/\D/g, "")}`;
  const composeLink = recip
    ? `https://wa.me/${recip.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`
    : "";

  const QUICK = [
    "Hello! I'd love to connect with you.",
    "Hi Samuel, I'm interested in your speaking services.",
    "Hi, I'd like to discuss a collaboration.",
    "Hello Samuel, I have a question about your work.",
  ];

  async function copy() {
    await navigator.clipboard.writeText(chatLink);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <div className="adm-header">
        <div><div className="adm-page-title">WhatsApp</div><p className="adm-page-sub">Manage your WhatsApp presence</p></div>
      </div>

      <div className="adm-wa-grid">
        {/* Your number */}
        <div className="adm-wa-card">
          <div className="adm-wa-card-title"><Phone size={13} style={{ marginRight: 8 }} />Your WhatsApp Number</div>
          <div className="adm-field">
            <label className="adm-label">Phone (with country code)</label>
            <input className="adm-input" value={num} onChange={(e) => setNum(e.target.value)} placeholder="233XXXXXXXXX" />
          </div>
          <div className="adm-action-row" style={{ flexWrap: "wrap" }}>
            <button className="adm-btn adm-btn--gold adm-btn--sm" onClick={() => { setSaved(num); toast.success("Number saved"); }}>Save</button>
            <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={copy} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              {copied ? <CheckCheck size={9} /> : <Copy size={9} />}{copied ? "Copied!" : "Copy Link"}
            </button>
            <a href={chatLink} target="_blank" rel="noreferrer" className="adm-btn adm-btn--ghost adm-btn--sm" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "5px" }}>
              <ExternalLink size={9} />Open WhatsApp
            </a>
          </div>
          <div className="adm-wa-link-preview">
            <span style={{ display: "block", fontFamily: "'Space Mono',monospace", fontSize: "9px", color: "rgba(240,236,228,.35)", marginBottom: "4px" }}>Your chat link:</span>
            <a href={chatLink} target="_blank" rel="noreferrer" style={{ color: "#25d366", fontFamily: "'Space Mono',monospace", fontSize: "11px", wordBreak: "break-all" }}>{chatLink}</a>
          </div>
        </div>

        {/* Compose / send */}
        <div className="adm-wa-card">
          <div className="adm-wa-card-title"><Send size={13} style={{ marginRight: 8 }} />Send Quick Message</div>
          <div className="adm-field">
            <label className="adm-label">Recipient Number</label>
            <input className="adm-input" value={recip} onChange={(e) => setRecip(e.target.value)} placeholder="233XXXXXXXXX" />
          </div>
          <div className="adm-field">
            <label className="adm-label">Message</label>
            <textarea className="adm-textarea" style={{ minHeight: "90px" }} value={msg} onChange={(e) => setMsg(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
            {QUICK.map((q) => (
              <button key={q} className="adm-btn adm-btn--ghost adm-btn--sm" style={{ fontSize: "9px" }} onClick={() => setMsg(q)}>
                {q.slice(0, 30)}…
              </button>
            ))}
          </div>
          {composeLink
            ? <a href={composeLink} target="_blank" rel="noreferrer" className="adm-btn adm-btn--gold" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}><Phone size={11} />Open in WhatsApp</a>
            : <button className="adm-btn adm-btn--ghost" disabled style={{ opacity: .35 }}>Enter recipient first</button>
          }
        </div>
      </div>

      {/* Preview */}
      <div style={{ marginTop: "40px" }}>
        <div className="adm-section-title" style={{ marginBottom: "16px" }}>Chat Button Preview</div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <a href={chatLink} target="_blank" rel="noreferrer" style={{ background: "#25d366", color: "#fff", padding: "14px 24px", display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: "'Space Mono',monospace", fontSize: "10px", letterSpacing: ".15em", textDecoration: "none" }}>
            <Phone size={14} />Chat on WhatsApp
          </a>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "9px", color: "rgba(240,236,228,.25)", letterSpacing: ".1em" }}>
            Site-visible chat button
          </span>
        </div>
      </div>
    </>
  );
}

// ── POST MODAL ────────────────────────────────────────────────────────────
// ── TESTIMONIALS TAB ──────────────────────────────────────────────────────
function TestimonialsTab({ testimonials, onNew, onEdit, onDelete, onToggle }: {
  testimonials: Testimonial[];
  onNew: () => void;
  onEdit: (t: Testimonial) => void;
  onDelete: (id: string, name: string) => void;
  onToggle: (id: string, val: boolean) => Promise<void>;
}) {
  const published = testimonials.filter((t) => t.published).length;
  return (
    <>
      <div className="adm-header">
        <div>
          <div className="adm-page-title">Testimonials</div>
          <p className="adm-page-sub">{published} published · {testimonials.length} total</p>
        </div>
        <button className="adm-btn adm-btn--gold" onClick={onNew} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <Plus size={12} /> Add Testimonial
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className="adm-empty" style={{ padding: "60px 0", textAlign: "center" }}>
          No testimonials yet. Add the first one.
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role / Company</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.id}>
                  <td style={{ color: "#f0ece4", maxWidth: "200px" }}>
                    <div style={{ fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: "11px", color: "rgba(240,236,228,.4)", marginTop: "2px", fontStyle: "italic" }}>
                      {t.quote.slice(0, 60)}{t.quote.length > 60 ? "…" : ""}
                    </div>
                  </td>
                  <td style={{ fontSize: "12px", color: "rgba(240,236,228,.5)" }}>
                    {[t.role, t.company].filter(Boolean).join(" · ") || "—"}
                  </td>
                  <td>
                    <span style={{ color: "#c9a84c", letterSpacing: "2px" }}>
                      {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`adm-badge ${t.published ? "adm-badge--published" : "adm-badge--draft"}`}
                      style={{ cursor: "pointer", background: "none", border: "none" }}
                      onClick={() => onToggle(t.id, !t.published)}
                      title={t.published ? "Click to unpublish" : "Click to publish"}
                    >
                      {t.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td>
                    <div className="adm-action-row">
                      <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => onEdit(t)}>
                        <Pencil size={10} />
                      </button>
                      <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => onDelete(t.id, t.name)}>
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ── TESTIMONIAL MODAL ─────────────────────────────────────────────────────
function TestimonialModal({ testimonial, onClose, onSave, db }: {
  testimonial: Testimonial | null;
  onClose: () => void;
  onSave: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any;
}) {
  const [name,      setName]      = useState(testimonial?.name       ?? "");
  const [role,      setRole]      = useState(testimonial?.role       ?? "");
  const [company,   setCompany]   = useState(testimonial?.company    ?? "");
  const [avatarUrl, setAvatarUrl] = useState(testimonial?.avatar_url ?? "");
  const [quote,     setQuote]     = useState(testimonial?.quote      ?? "");
  const [rating,    setRating]    = useState(testimonial?.rating     ?? 5);
  const [published, setPub]       = useState(testimonial?.published  ?? false);
  const [sortOrder, setSort]       = useState(testimonial?.sort_order ?? 0);
  const [saving,    setSaving]    = useState(false);

  async function handleSave() {
    if (!name.trim() || !quote.trim()) { toast.error("Name and quote are required"); return; }
    setSaving(true);
    const payload = {
      name: name.trim(),
      role: role.trim() || null,
      company: company.trim() || null,
      avatar_url: avatarUrl.trim() || null,
      quote: quote.trim(),
      rating,
      published,
      sort_order: sortOrder,
    };
    const { error } = testimonial
      ? await db.from("testimonials").update(payload).eq("id", testimonial.id)
      : await db.from("testimonials").insert(payload);
    setSaving(false);
    if (error) { toast.error("Save failed: " + error.message); return; }
    toast.success(testimonial ? "Testimonial updated" : "Testimonial added");
    await onSave();
  }

  return (
    <div className="adm-form-overlay" onClick={onClose}>
      <div className="adm-form-panel" onClick={(e) => e.stopPropagation()}>
        <div className="adm-form-header">
          <div className="adm-form-title">{testimonial ? "Edit Testimonial" : "New Testimonial"}</div>
          <button className="adm-icon-btn" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="adm-form-body">
          <div className="adm-form-row">
            <div className="adm-field">
              <label className="adm-label">Name *</label>
              <input className="adm-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
            </div>
            <div className="adm-field">
              <label className="adm-label">Role</label>
              <input className="adm-input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Professor, Director" />
            </div>
          </div>
          <div className="adm-form-row">
            <div className="adm-field">
              <label className="adm-label">Company / Organisation</label>
              <input className="adm-input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. UM6P, World Bank" />
            </div>
            <div className="adm-field">
              <label className="adm-label">Avatar URL</label>
              <input className="adm-input" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://…" />
            </div>
          </div>
          <div className="adm-field">
            <label className="adm-label">Quote *</label>
            <textarea className="adm-textarea" style={{ minHeight: "100px" }} value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="What did they say about Samuel?" />
          </div>
          <div className="adm-form-row">
            <div className="adm-field">
              <label className="adm-label">Rating (1–5)</label>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                {[1,2,3,4,5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "24px", color: n <= rating ? "#c9a84c" : "rgba(201,168,76,.2)", padding: "0" }}>
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="adm-field">
              <label className="adm-label">Sort Order (lower = first)</label>
              <input className="adm-input" type="number" min={0} value={sortOrder} onChange={(e) => setSort(Number(e.target.value))} />
            </div>
          </div>
          <div className="adm-field" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input type="checkbox" id="ts-pub" checked={published} onChange={(e) => setPub(e.target.checked)}
              style={{ width: "16px", height: "16px", accentColor: "#c9a84c", cursor: "pointer" }} />
            <label htmlFor="ts-pub" className="adm-label" style={{ margin: 0, cursor: "pointer" }}>
              Publish immediately (visible on site)
            </label>
          </div>
        </div>
        <div className="adm-form-actions">
          <button className="adm-btn adm-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="adm-btn adm-btn--gold" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : testimonial ? "Update" : "Add Testimonial"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── LIBRARY TAB ────────────────────────────────────────────────────────────
function LibraryTab({ items, onNew, onEdit, onDelete, onToggle }: {
  items: LibraryItem[];
  onNew: () => void;
  onEdit: (item: LibraryItem) => void;
  onDelete: (id: string, title: string) => void;
  onToggle: (id: string, val: boolean) => Promise<void>;
}) {
  const [subTab, setSubTab] = useState<"ebook" | "review">("ebook");
  const filtered = items.filter((i) => i.category === subTab);
  const published = filtered.filter((i) => i.published).length;

  return (
    <>
      <div className="adm-header">
        <div>
          <div className="adm-page-title">Library</div>
          <p className="adm-page-sub">{published} published · {filtered.length} {subTab === "ebook" ? "eBooks" : "Reviews"}</p>
        </div>
        <button className="adm-btn adm-btn--gold" onClick={onNew} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <Plus size={12} /> Add {subTab === "ebook" ? "eBook" : "Review"}
        </button>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: "0", borderBottom: "1px solid rgba(240,236,228,.08)", marginBottom: "24px" }}>
        {(["ebook", "review"] as const).map((t) => (
          <button key={t} onClick={() => setSubTab(t)} style={{
            fontFamily: "'Space Mono',monospace", fontSize: "9px", letterSpacing: ".2em", textTransform: "uppercase",
            padding: "12px 20px", background: "none", border: "none", cursor: "pointer",
            color: subTab === t ? "#c9a84c" : "rgba(240,236,228,.35)",
            borderBottom: subTab === t ? "2px solid #c9a84c" : "2px solid transparent",
            transition: "color .2s",
          }}>
            {t === "ebook" ? "eBooks" : "Book Reviews"} ({items.filter((i) => i.category === t).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="adm-empty" style={{ padding: "60px 0", textAlign: "center" }}>
          No {subTab === "ebook" ? "eBooks" : "reviews"} yet. Add the first one.
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Title</th>
                {subTab === "review" && <th>Author</th>}
                {subTab === "review" && <th>Rating</th>}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td style={{ color: "#f0ece4", maxWidth: "260px" }}>
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    {item.description && (
                      <div style={{ fontSize: "11px", color: "rgba(240,236,228,.4)", marginTop: "2px", fontStyle: "italic" }}>
                        {item.description.slice(0, 70)}{item.description.length > 70 ? "…" : ""}
                      </div>
                    )}
                  </td>
                  {subTab === "review" && (
                    <td style={{ fontSize: "12px", color: "rgba(240,236,228,.5)" }}>{item.author ?? "—"}</td>
                  )}
                  {subTab === "review" && (
                    <td>
                      {item.rating !== null ? (
                        <span style={{ color: "#c9a84c", letterSpacing: "2px" }}>
                          {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                        </span>
                      ) : "—"}
                    </td>
                  )}
                  <td>
                    <button
                      className={`adm-badge ${item.published ? "adm-badge--published" : "adm-badge--draft"}`}
                      style={{ cursor: "pointer", background: "none", border: "none" }}
                      onClick={() => onToggle(item.id, !item.published)}
                    >
                      {item.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td>
                    <div className="adm-action-row">
                      <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => onEdit(item)}><Pencil size={10} /></button>
                      <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => onDelete(item.id, item.title)}><Trash2 size={10} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ── LIBRARY ITEM MODAL ─────────────────────────────────────────────────────
function LibraryItemModal({ item, onClose, onSave, db }: {
  item: LibraryItem | null;
  onClose: () => void;
  onSave: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any;
}) {
  const [title,       setTitle]      = useState(item?.title        ?? "");
  const [author,      setAuthor]     = useState(item?.author       ?? "");
  const [category,    setCategory]   = useState<"ebook" | "review">(item?.category ?? "ebook");
  const [description, setDesc]       = useState(item?.description  ?? "");
  const [rating,      setRating]     = useState(item?.rating       ?? 5);
  const [downloadUrl, setDlUrl]      = useState(item?.download_url ?? "");
  const [coverUrl,    setCoverUrl]   = useState(item?.cover_url    ?? "");
  const [published,   setPub]        = useState(item?.published    ?? false);
  const [sortOrder,   setSort]       = useState(item?.sort_order   ?? 0);
  const [saving,      setSaving]     = useState(false);

  async function handleSave() {
    if (!title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const payload = {
      title: title.trim(),
      author: author.trim() || null,
      category,
      description: description.trim() || null,
      rating: category === "review" ? rating : null,
      download_url: category === "ebook" ? (downloadUrl.trim() || null) : null,
      cover_url: coverUrl.trim() || null,
      published,
      sort_order: sortOrder,
    };
    const { error } = item
      ? await db.from("library_items").update(payload).eq("id", item.id)
      : await db.from("library_items").insert(payload);
    setSaving(false);
    if (error) { toast.error("Save failed: " + error.message); return; }
    toast.success(item ? "Item updated" : "Item added");
    await onSave();
  }

  return (
    <div className="adm-form-overlay" onClick={onClose}>
      <div className="adm-form-panel" onClick={(e) => e.stopPropagation()}>
        <div className="adm-form-header">
          <div className="adm-form-title">{item ? "Edit Library Item" : "New Library Item"}</div>
          <button className="adm-icon-btn" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="adm-form-body">
          <div className="adm-field">
            <label className="adm-label">Type</label>
            <div style={{ display: "flex", gap: "0", border: "1px solid rgba(240,236,228,.08)" }}>
              {(["ebook", "review"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setCategory(t)} style={{
                  flex: 1, padding: "8px", fontFamily: "'Space Mono',monospace", fontSize: "9px",
                  letterSpacing: ".2em", textTransform: "uppercase", border: "none", cursor: "pointer",
                  background: category === t ? "rgba(201,168,76,.12)" : "transparent",
                  color: category === t ? "#c9a84c" : "rgba(240,236,228,.35)",
                }}>
                  {t === "ebook" ? "eBook" : "Book Review"}
                </button>
              ))}
            </div>
          </div>
          <div className="adm-form-row">
            <div className="adm-field">
              <label className="adm-label">Title *</label>
              <input className="adm-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
            </div>
            <div className="adm-field">
              <label className="adm-label">{category === "ebook" ? "Author (optional)" : "Author"}</label>
              <input className="adm-input" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author name" />
            </div>
          </div>
          <div className="adm-field">
            <label className="adm-label">Description</label>
            <textarea className="adm-textarea" style={{ minHeight: "80px" }} value={description} onChange={(e) => setDesc(e.target.value)} placeholder="Short description or review excerpt…" />
          </div>
          <div className="adm-form-row">
            <div className="adm-field">
              <label className="adm-label">Cover Image URL</label>
              <input className="adm-input" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="https://…" />
            </div>
            {category === "ebook" ? (
              <div className="adm-field">
                <label className="adm-label">Download URL</label>
                <input className="adm-input" value={downloadUrl} onChange={(e) => setDlUrl(e.target.value)} placeholder="https://…" />
              </div>
            ) : (
              <div className="adm-field">
                <label className="adm-label">Rating (1–5)</label>
                <div style={{ display: "flex", gap: "4px", alignItems: "center", paddingTop: "6px" }}>
                  {[1,2,3,4,5].map((n) => (
                    <button key={n} type="button" onClick={() => setRating(n)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "22px", color: n <= rating ? "#c9a84c" : "rgba(201,168,76,.2)", padding: "0" }}>★</button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="adm-form-row">
            <div className="adm-field">
              <label className="adm-label">Sort Order (lower = first)</label>
              <input className="adm-input" type="number" min={0} value={sortOrder} onChange={(e) => setSort(Number(e.target.value))} />
            </div>
          </div>
          <div className="adm-field" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input type="checkbox" id="lib-pub" checked={published} onChange={(e) => setPub(e.target.checked)}
              style={{ width: "16px", height: "16px", accentColor: "#c9a84c", cursor: "pointer" }} />
            <label htmlFor="lib-pub" className="adm-label" style={{ margin: 0, cursor: "pointer" }}>
              Publish immediately (visible on site)
            </label>
          </div>
        </div>
        <div className="adm-form-actions">
          <button className="adm-btn adm-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="adm-btn adm-btn--gold" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : item ? "Update" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── UPCOMING TAB ──────────────────────────────────────────────────────────
function UpcomingTab({ events, onNew, onEdit, onDelete, onToggle }: {
  events: UpcomingEvent[];
  onNew: () => void;
  onEdit: (ev: UpcomingEvent) => void;
  onDelete: (id: string, title: string) => void;
  onToggle: (id: string, val: boolean) => Promise<void>;
}) {
  const [subTab, setSubTab] = useState<"intervention" | "masterclass" | "session">("intervention");
  const filtered  = events.filter((e) => e.category === subTab);
  const published = filtered.filter((e) => e.published).length;

  const SUB_TABS: { id: "intervention" | "masterclass" | "session"; label: string }[] = [
    { id: "intervention", label: "Interventions"  },
    { id: "masterclass",  label: "Masterclass"    },
    { id: "session",      label: "Sessions"       },
  ];

  return (
    <>
      <div className="adm-header">
        <div>
          <div className="adm-page-title">Upcoming</div>
          <p className="adm-page-sub">{published} published · {filtered.length} {SUB_TABS.find((t) => t.id === subTab)?.label}</p>
        </div>
        <button className="adm-btn adm-btn--gold" onClick={onNew} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <Plus size={12} /> Add Event
        </button>
      </div>

      <div style={{ display: "flex", gap: "0", borderBottom: "1px solid rgba(240,236,228,.08)", marginBottom: "24px" }}>
        {SUB_TABS.map((t) => (
          <button key={t.id} onClick={() => setSubTab(t.id)} style={{
            fontFamily: "'Space Mono',monospace", fontSize: "9px", letterSpacing: ".2em", textTransform: "uppercase",
            padding: "12px 20px", background: "none", border: "none", cursor: "pointer",
            color: subTab === t.id ? "#c9a84c" : "rgba(240,236,228,.35)",
            borderBottom: subTab === t.id ? "2px solid #c9a84c" : "2px solid transparent",
            transition: "color .2s",
          }}>
            {t.label} ({events.filter((e) => e.category === t.id).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="adm-empty" style={{ padding: "60px 0", textAlign: "center" }}>
          No {SUB_TABS.find((t) => t.id === subTab)?.label ?? "events"} yet. Add the first one.
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>Title</th><th>Date</th><th>Location</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((ev) => (
                <tr key={ev.id}>
                  <td style={{ color: "#f0ece4", maxWidth: "260px" }}>
                    <div style={{ fontWeight: 600 }}>{ev.title}</div>
                    {ev.description && (
                      <div style={{ fontSize: "11px", color: "rgba(240,236,228,.4)", marginTop: "2px", fontStyle: "italic" }}>
                        {ev.description.slice(0, 70)}{ev.description.length > 70 ? "…" : ""}
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: "11px", fontFamily: "'Space Mono',monospace", color: "rgba(240,236,228,.5)", whiteSpace: "nowrap" }}>{ev.date_text ?? "—"}</td>
                  <td style={{ fontSize: "11px", color: "rgba(240,236,228,.4)" }}>{ev.location ?? "—"}</td>
                  <td>
                    <button className={`adm-badge ${ev.published ? "adm-badge--published" : "adm-badge--draft"}`}
                      style={{ cursor: "pointer", background: "none", border: "none" }}
                      onClick={() => onToggle(ev.id, !ev.published)}>
                      {ev.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td>
                    <div className="adm-action-row">
                      <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => onEdit(ev)}><Pencil size={10} /></button>
                      <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => onDelete(ev.id, ev.title)}><Trash2 size={10} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ── UPCOMING EVENT MODAL ──────────────────────────────────────────────────
function UpcomingEventModal({ event, onClose, onSave, db }: {
  event: UpcomingEvent | null;
  onClose: () => void;
  onSave: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any;
}) {
  const [title,     setTitle]    = useState(event?.title        ?? "");
  const [desc,      setDesc]     = useState(event?.description  ?? "");
  const [dateText,  setDateText] = useState(event?.date_text    ?? "Coming Soon");
  const [location,  setLocation] = useState(event?.location     ?? "");
  const [tag,       setTag]      = useState(event?.tag          ?? "");
  const [category,  setCategory] = useState<"intervention" | "masterclass" | "session">(event?.category ?? "intervention");
  const [published, setPub]      = useState(event?.published    ?? false);
  const [sortOrder, setSort]     = useState(event?.sort_order   ?? 0);
  const [saving,    setSaving]   = useState(false);

  const CAT_LABELS = { intervention: "Intervention", masterclass: "Masterclass", session: "Session" };

  async function handleSave() {
    if (!title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const payload = {
      title: title.trim(),
      description: desc.trim() || null,
      date_text: dateText.trim() || "Coming Soon",
      location: location.trim() || null,
      tag: tag.trim() || null,
      category,
      published,
      sort_order: sortOrder,
    };
    const { error } = event
      ? await db.from("upcoming_events").update(payload).eq("id", event.id)
      : await db.from("upcoming_events").insert(payload);
    setSaving(false);
    if (error) { toast.error("Save failed: " + error.message); return; }
    toast.success(event ? "Event updated" : "Event added");
    await onSave();
  }

  return (
    <div className="adm-form-overlay" onClick={onClose}>
      <div className="adm-form-panel" onClick={(e) => e.stopPropagation()}>
        <div className="adm-form-header">
          <div className="adm-form-title">{event ? "Edit Event" : "New Upcoming Event"}</div>
          <button className="adm-icon-btn" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="adm-form-body">
          <div className="adm-field">
            <label className="adm-label">Type</label>
            <div style={{ display: "flex", gap: "0", border: "1px solid rgba(240,236,228,.08)" }}>
              {(["intervention", "masterclass", "session"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setCategory(t)} style={{
                  flex: 1, padding: "8px", fontFamily: "'Space Mono',monospace", fontSize: "9px",
                  letterSpacing: ".2em", textTransform: "uppercase", border: "none", cursor: "pointer",
                  background: category === t ? "rgba(201,168,76,.12)" : "transparent",
                  color: category === t ? "#c9a84c" : "rgba(240,236,228,.35)",
                }}>
                  {CAT_LABELS[t]}
                </button>
              ))}
            </div>
          </div>
          <div className="adm-field">
            <label className="adm-label">Title *</label>
            <input className="adm-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" />
          </div>
          <div className="adm-field">
            <label className="adm-label">Description</label>
            <textarea className="adm-textarea" style={{ minHeight: "80px" }} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Short description…" />
          </div>
          <div className="adm-form-row">
            <div className="adm-field">
              <label className="adm-label">Date / Period</label>
              <input className="adm-input" value={dateText} onChange={(e) => setDateText(e.target.value)} placeholder="e.g. March 2026 or Coming Soon" />
            </div>
            <div className="adm-field">
              <label className="adm-label">Tag label</label>
              <input className="adm-input" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="e.g. Intervention" />
            </div>
          </div>
          <div className="adm-form-row">
            <div className="adm-field">
              <label className="adm-label">Location</label>
              <input className="adm-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" />
            </div>
            <div className="adm-field">
              <label className="adm-label">Sort Order (lower = first)</label>
              <input className="adm-input" type="number" min={0} value={sortOrder} onChange={(e) => setSort(Number(e.target.value))} />
            </div>
          </div>
          <div className="adm-field" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input type="checkbox" id="up-pub" checked={published} onChange={(e) => setPub(e.target.checked)}
              style={{ width: "16px", height: "16px", accentColor: "#c9a84c", cursor: "pointer" }} />
            <label htmlFor="up-pub" className="adm-label" style={{ margin: 0, cursor: "pointer" }}>
              Publish immediately (visible on site)
            </label>
          </div>
        </div>
        <div className="adm-form-actions">
          <button className="adm-btn adm-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="adm-btn adm-btn--gold" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : event ? "Update" : "Add Event"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── POST MODAL (original) ─────────────────────────────────────────────────
function PostModal({ post, onClose, onSave, db }: {
  post: BlogPost | null; onClose: () => void;
  onSave: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any;
}) {
  const [form, setForm] = useState({
    title:              post?.title              ?? "",
    slug:               post?.slug               ?? "",
    category:           post?.category           ?? "faith",
    excerpt:            post?.excerpt            ?? "",
    content:            post?.content            ?? "",
    read_time_minutes:  post?.read_time_minutes  ?? 5,
    featured_image_url: post?.featured_image_url ?? "",
    published:          post?.published          ?? false,
  });
  const [busy, setBusy] = useState(false);

  function setF<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title required"); return; }
    if (!form.slug.trim())  { toast.error("Slug required"); return; }
    setBusy(true);
    const { error } = post
      ? await db.from("blog_posts").update({ ...form, updated_at: new Date().toISOString() }).eq("id", post.id)
      : await db.from("blog_posts").insert({ ...form, author: "Samuel Kobina Gyasi" });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(post ? "Post updated" : "Post created");
    await onSave();
  }

  return (
    <div className="adm-form-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="adm-form-modal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div className="adm-form-title" style={{ margin: 0 }}>{post ? "Edit Post" : "New Blog Post"}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(240,236,228,.4)", cursor: "pointer" }}><X size={16} /></button>
        </div>
        <form onSubmit={save}>
          <div className="adm-field"><label className="adm-label">Title *</label>
            <input className="adm-input" value={form.title} onChange={(e) => { setF("title", e.target.value); if (!post) setF("slug", slugify(e.target.value)); }} placeholder="Post title" required />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="adm-field"><label className="adm-label">Slug *</label><input className="adm-input" value={form.slug} onChange={(e) => setF("slug", e.target.value)} placeholder="url-slug" required /></div>
            <div className="adm-field"><label className="adm-label">Category *</label>
              <select className="adm-select" value={form.category} onChange={(e) => setF("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="adm-field"><label className="adm-label">Excerpt</label><textarea className="adm-textarea" style={{ minHeight: "80px" }} value={form.excerpt} onChange={(e) => setF("excerpt", e.target.value)} placeholder="Short summary…" /></div>
          <div className="adm-field"><label className="adm-label">Content (HTML)</label><textarea className="adm-textarea" value={form.content} onChange={(e) => setF("content", e.target.value)} placeholder="<p>Full article…</p>" /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="adm-field"><label className="adm-label">Featured Image URL</label><input className="adm-input" value={form.featured_image_url} onChange={(e) => setF("featured_image_url", e.target.value)} placeholder="https://…" /></div>
            <div className="adm-field"><label className="adm-label">Read Time (min)</label><input className="adm-input" type="number" min={1} max={60} value={form.read_time_minutes} onChange={(e) => setF("read_time_minutes", parseInt(e.target.value, 10) || 5)} /></div>
          </div>
          <div className="adm-toggle-row">
            <button type="button" className={`adm-toggle${form.published ? " on" : ""}`} onClick={() => setF("published", !form.published)} aria-label="Toggle published" />
            <span className="adm-toggle-label">{form.published ? "Published — visible on site" : "Draft — not visible"}</span>
          </div>
          <div className="adm-form-actions">
            <button type="button" className="adm-btn adm-btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="adm-btn adm-btn--gold" disabled={busy}>{busy ? "Saving…" : post ? "Save Changes" : "Create Post"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
