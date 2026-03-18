"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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

// ── TAILWIND CLASS CONSTANTS ───────────────────────────────────────────────
const TW = {
  // Buttons
  btn:     "inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[.18em] uppercase cursor-pointer rounded-lg transition-all duration-200 active:scale-[.97] border-0",
  gold:    "bg-gradient-to-br from-[#d4a843] to-[#c49838] text-[#09090d] px-[22px] py-[11px] shadow-[0_2px_12px_rgba(212,168,67,.25)] hover:from-[#e0b84e] hover:to-[#d4a843] hover:shadow-[0_4px_18px_rgba(212,168,67,.4)]",
  ghost:   "bg-white/5 text-white/50 border border-white/10 px-[22px] py-[11px] hover:bg-white/[.09] hover:text-white/85 hover:border-white/[.18]",
  danger:  "bg-red-500/10 text-red-400 border border-red-500/20 px-[22px] py-[11px] hover:bg-red-500/[.18] hover:border-red-500/30",
  sm:      "!px-3 !py-1.5 !text-[8px] !rounded-md gap-1",
  // Badges
  badge:   "font-mono text-[7px] tracking-[.14em] uppercase px-2.5 py-1 inline-block rounded-full",
  bPub:    "bg-[rgba(212,168,67,.12)] text-[#d4a843] border border-[rgba(212,168,67,.2)]",
  bDft:    "bg-white/[.06] text-white/40 border border-white/[.08]",
  bSent:   "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  bOpen:   "bg-green-500/10 text-green-400 border border-green-500/20",
  bNew:    "bg-[rgba(212,168,67,.16)] text-[#d4a843] border border-[rgba(212,168,67,.25)]",
  // Form
  field:   "mb-5",
  label:   "font-mono text-[8px] tracking-[.22em] uppercase text-white/35 block mb-2",
  input:   "w-full bg-white/[.04] border border-white/[.09] rounded-lg text-[#eef0f5] font-serif text-base px-3.5 py-[11px] outline-none transition-all focus:border-[rgba(212,168,67,.5)] focus:bg-white/[.06] focus:shadow-[0_0_0_3px_rgba(212,168,67,.08)]",
  select:  "w-full bg-white/[.04] border border-white/[.09] rounded-lg text-[#eef0f5] font-serif text-base px-3.5 py-[11px] outline-none transition-all focus:border-[rgba(212,168,67,.5)] focus:bg-white/[.06] focus:shadow-[0_0_0_3px_rgba(212,168,67,.08)]",
  tarea:   "w-full bg-white/[.04] border border-white/[.09] rounded-lg text-[#eef0f5] font-serif text-base px-3.5 py-[11px] outline-none transition-all focus:border-[rgba(212,168,67,.5)] focus:bg-white/[.06] focus:shadow-[0_0_0_3px_rgba(212,168,67,.08)] resize-y min-h-[200px]",
  // Typography
  pgTitle: "font-[family-name:'Playfair_Display',serif] text-[34px] font-bold text-[#eef0f5] leading-[1.1] tracking-[-0.3px]",
  pgSub:   "font-mono text-[10px] tracking-[.12em] text-white/30 mt-2.5",
  sTitle:  "font-[family-name:'Playfair_Display',serif] text-[21px] text-[#eef0f5]",
  sHead:   "flex justify-between items-center mb-5",
  // Table
  tWrap:   "overflow-x-auto rounded-xl border border-white/[.06] overflow-hidden",
  th:      "font-mono text-[8px] tracking-[.22em] uppercase text-white/[.28] px-[18px] py-3.5 text-left border-b border-white/[.06] bg-white/[.02] whitespace-nowrap",
  td:      "px-[18px] py-[15px] text-sm text-white/60 border-b border-white/[.04] align-middle",
  // Actions
  actRow:  "flex gap-1.5 items-center flex-wrap",
  // Empty
  empty:   "font-serif text-lg italic text-white/25 py-[60px] text-center",
  // Overlay / modal
  overlay: "fixed inset-0 bg-black/[.82] backdrop-blur-xl z-[9000] flex items-center justify-center p-5",
  modal:   "bg-[#0d0e15] border border-white/[.08] rounded-2xl w-full max-w-[720px] max-h-[90vh] overflow-y-auto p-10 shadow-[0_32px_80px_rgba(0,0,0,.7),0_0_0_1px_rgba(255,255,255,.04)]",
  panel:   "bg-[#0d0e15] border border-white/[.08] rounded-2xl w-full max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col shadow-[0_32px_80px_rgba(0,0,0,.7),0_0_0_1px_rgba(255,255,255,.04)]",
  pHead:   "flex justify-between items-center px-7 py-6 border-b border-white/[.06] flex-shrink-0",
  pBody:   "p-7 flex-1 overflow-y-auto",
  pFoot:   "flex gap-2.5 justify-end px-7 py-[18px] border-t border-white/[.055] bg-black/[.12] flex-shrink-0 rounded-b-2xl",
  fTitle:  "font-[family-name:'Playfair_Display',serif] text-[22px] font-bold text-[#eef0f5]",
  // Message cards
  msgCard: "bg-[#0d0e15] border border-white/[.06] border-l-[3px] border-l-transparent rounded-[10px] p-[18px_22px] transition-all duration-200 mb-2 hover:border-l-[rgba(212,168,67,.35)] hover:shadow-[0_4px_20px_rgba(0,0,0,.25)]",
  msgNew:  "!bg-[rgba(212,168,67,.03)] !border-[rgba(212,168,67,.15)] !border-l-[rgba(212,168,67,.6)]",
  msgHead: "flex justify-between items-start gap-4 flex-wrap",
  msgName: "font-[family-name:'Playfair_Display',serif] text-[15px] text-[#eef0f5] flex items-center gap-2 flex-wrap",
  msgMeta: "font-mono text-[9px] text-white/[.28] mt-1 tracking-[.07em]",
  msgSubj: "font-serif text-[13px] italic text-white/45 mt-1",
  msgBody: "mt-3.5 pt-3.5 border-t border-white/[.05] font-serif text-base leading-[1.8] text-white/[.62] break-words",
  // Mail sub-nav
  mNav:    "flex gap-1 mb-8 overflow-x-auto bg-white/[.03] border border-white/[.06] rounded-[10px] p-1",
  mTab:    "flex items-center gap-[7px] px-[18px] py-2.5 font-mono text-[9px] tracking-[.12em] uppercase text-white/38 bg-transparent border-0 cursor-pointer rounded-[7px] flex-shrink-0 transition-all whitespace-nowrap hover:text-white/75 hover:bg-white/5",
  mAct:    "!text-[#d4a843] !bg-[rgba(212,168,67,.1)]",
  // Stats
  stat:    "bg-[#0d0e15] p-6 border border-white/[.06] rounded-xl relative overflow-hidden cursor-default transition-all duration-[250ms] group hover:border-[rgba(212,168,67,.2)] hover:-translate-y-[3px] hover:shadow-[0_12px_32px_rgba(0,0,0,.35),0_0_0_1px_rgba(212,168,67,.08)]",
  statNum: "font-[family-name:'Playfair_Display',serif] text-[40px] font-bold leading-none mb-2.5 bg-gradient-to-br from-[#d4a843] to-[#f0cc7a] bg-clip-text text-transparent",
  statLbl: "font-mono text-[8px] tracking-[.24em] uppercase text-white/[.32]",
  // Icon button
  iconBtn: "bg-white/5 border border-white/[.08] text-white/40 cursor-pointer p-[7px] rounded-lg flex items-center transition-all hover:bg-white/10 hover:text-white/80",
  // Quick reply
  qReply:  "mt-4 p-[18px] bg-white/[.02] border-t border-white/5 border-l-[3px] border-l-[rgba(212,168,67,.25)] rounded-b-lg",
  // WA
  waCard:  "bg-[#0d0e15] border border-white/[.06] rounded-xl p-7",
  // Compose
  compose: "max-w-[780px]",
  // Form row
  fRow:    "grid grid-cols-2 gap-4",
} as const;

// ── ADMIN PAGE ─────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab]             = useState<Tab>("overview");
  bNew:    "bg-[rgba(212,168,67,.16)] text-[#d4a843] border border-[rgba(212,168,67,.25)]",
  // Form
  field:   "mb-5",
  label:   "font-mono text-[8px] tracking-[.22em] uppercase text-white/35 block mb-2",
  input:   "w-full bg-white/[.04] border border-white/[.09] rounded-lg text-[#eef0f5] font-serif text-base px-3.5 py-[11px] outline-none transition-all focus:border-[rgba(212,168,67,.5)] focus:bg-white/[.06] focus:shadow-[0_0_0_3px_rgba(212,168,67,.08)]",
  select:  "w-full bg-white/[.04] border border-white/[.09] rounded-lg text-[#eef0f5] font-serif text-base px-3.5 py-[11px] outline-none transition-all focus:border-[rgba(212,168,67,.5)] focus:bg-white/[.06] focus:shadow-[0_0_0_3px_rgba(212,168,67,.08)]",
  tarea:   "w-full bg-white/[.04] border border-white/[.09] rounded-lg text-[#eef0f5] font-serif text-base px-3.5 py-[11px] outline-none transition-all focus:border-[rgba(212,168,67,.5)] focus:bg-white/[.06] focus:shadow-[0_0_0_3px_rgba(212,168,67,.08)] resize-y min-h-[200px]",
  // Typography
  pgTitle: "font-[family-name:'Playfair_Display',serif] text-[34px] font-bold text-[#eef0f5] leading-[1.1] tracking-[-0.3px]",
  pgSub:   "font-mono text-[10px] tracking-[.12em] text-white/30 mt-2.5",
  sTitle:  "font-[family-name:'Playfair_Display',serif] text-[21px] text-[#eef0f5]",
  sHead:   "flex justify-between items-center mb-5",
  // Table
  tWrap:   "overflow-x-auto rounded-xl border border-white/[.06] overflow-hidden",
  th:      "font-mono text-[8px] tracking-[.22em] uppercase text-white/[.28] px-[18px] py-3.5 text-left border-b border-white/[.06] bg-white/[.02] whitespace-nowrap",
  td:      "px-[18px] py-[15px] text-sm text-white/60 border-b border-white/[.04] align-middle",
  // Actions
  actRow:  "flex gap-1.5 items-center flex-wrap",
  // Empty
  empty:   "font-serif text-lg italic text-white/25 py-[60px] text-center",
  // Overlay / modal
  overlay: "fixed inset-0 bg-black/[.82] backdrop-blur-xl z-[9000] flex items-center justify-center p-5",
  modal:   "bg-[#0d0e15] border border-white/[.08] rounded-2xl w-full max-w-[720px] max-h-[90vh] overflow-y-auto p-10 shadow-[0_32px_80px_rgba(0,0,0,.7),0_0_0_1px_rgba(255,255,255,.04)]",
  panel:   "bg-[#0d0e15] border border-white/[.08] rounded-2xl w-full max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col shadow-[0_32px_80px_rgba(0,0,0,.7),0_0_0_1px_rgba(255,255,255,.04)]",
  pHead:   "flex justify-between items-center px-7 py-6 border-b border-white/[.06] flex-shrink-0",
  pBody:   "p-7 flex-1 overflow-y-auto",
  pFoot:   "flex gap-2.5 justify-end px-7 py-[18px] border-t border-white/[.055] bg-black/[.12] flex-shrink-0 rounded-b-2xl",
  fTitle:  "font-[family-name:'Playfair_Display',serif] text-[22px] font-bold text-[#eef0f5]",
  // Message cards
  msgCard: "bg-[#0d0e15] border border-white/[.06] border-l-[3px] border-l-transparent rounded-[10px] p-[18px_22px] transition-all duration-200 mb-2 hover:border-l-[rgba(212,168,67,.35)] hover:shadow-[0_4px_20px_rgba(0,0,0,.25)]",
  msgNew:  "!bg-[rgba(212,168,67,.03)] !border-[rgba(212,168,67,.15)] !border-l-[rgba(212,168,67,.6)]",
  msgHead: "flex justify-between items-start gap-4 flex-wrap",
  msgName: "font-[family-name:'Playfair_Display',serif] text-[15px] text-[#eef0f5] flex items-center gap-2 flex-wrap",
  msgMeta: "font-mono text-[9px] text-white/[.28] mt-1 tracking-[.07em]",
  msgSubj: "font-serif text-[13px] italic text-white/45 mt-1",
  msgBody: "mt-3.5 pt-3.5 border-t border-white/[.05] font-serif text-base leading-[1.8] text-white/[.62] break-words",
  // Mail sub-nav
  mNav:    "flex gap-1 mb-8 overflow-x-auto bg-white/[.03] border border-white/[.06] rounded-[10px] p-1",
  mTab:    "flex items-center gap-[7px] px-[18px] py-2.5 font-mono text-[9px] tracking-[.12em] uppercase text-white/38 bg-transparent border-0 cursor-pointer rounded-[7px] flex-shrink-0 transition-all whitespace-nowrap hover:text-white/75 hover:bg-white/5",
  mAct:    "!text-[#d4a843] !bg-[rgba(212,168,67,.1)]",
  // Stats
  stat:    "bg-[#0d0e15] p-6 border border-white/[.06] rounded-xl relative overflow-hidden cursor-default transition-all duration-[250ms] group hover:border-[rgba(212,168,67,.2)] hover:-translate-y-[3px] hover:shadow-[0_12px_32px_rgba(0,0,0,.35),0_0_0_1px_rgba(212,168,67,.08)]",
  statNum: "font-[family-name:'Playfair_Display',serif] text-[40px] font-bold leading-none mb-2.5 bg-gradient-to-br from-[#d4a843] to-[#f0cc7a] bg-clip-text text-transparent",
  statLbl: "font-mono text-[8px] tracking-[.24em] uppercase text-white/[.32]",
  // Icon button
  iconBtn: "bg-white/5 border border-white/[.08] text-white/40 cursor-pointer p-[7px] rounded-lg flex items-center transition-all hover:bg-white/10 hover:text-white/80",
  // Quick reply
  qReply:  "mt-4 p-[18px] bg-white/[.02] border-t border-white/5 border-l-[3px] border-l-[rgba(212,168,67,.25)] rounded-b-lg",
  // WA
  waCard:  "bg-[#0d0e15] border border-white/[.06] rounded-xl p-7",
  // Compose
  compose: "max-w-[780px]",
  // Form row
  fRow:    "grid grid-cols-2 gap-4",
} as const;

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
    <div className="min-h-screen flex bg-[#07080c] text-[#eef0f5]">
      {/* Mobile header */}
      <div className="flex md:hidden fixed top-0 left-0 right-0 z-[600] bg-[#0d0e15] border-b border-white/[.06] px-[18px] py-3.5 items-center justify-between shadow-[0_2px_20px_rgba(0,0,0,.4)]">
        <button
          className="bg-white/[.06] border border-white/[.09] rounded-lg text-white/60 cursor-pointer flex items-center justify-center p-1.5 transition-all hover:bg-white/10"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Menu"
        >
          <Menu size={18} />
        </button>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "14px", fontWeight: 700, color: "#f0ece4", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#c9a84c", fontSize: "12px" }}>✦</span>Samuel Gyasi
        </span>
        <Link href="/" style={{ color: "rgba(240,236,228,.35)", lineHeight: 0 }}><Globe size={16} /></Link>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "w-[252px] flex-shrink-0 bg-[#0d0e15] border-r border-white/[.055] py-8",
        "fixed md:sticky top-0 h-screen flex flex-col z-[500]",
        "shadow-[1px_0_0_0_rgba(255,255,255,.04),10px_0_50px_rgba(0,0,0,.5)]",
        "transition-transform duration-300 -translate-x-full md:translate-x-0",
        navOpen && "translate-x-0"
      )}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "15px", fontWeight: 700, color: "#eef0f5", padding: "0 24px 28px", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
          <div style={{ fontSize: "18px", color: "#d4a843", marginBottom: "14px", lineHeight: 1 }}>✦</div>
          <span style={{ display: "block", fontFamily: "'Space Mono',monospace", fontSize: "8px", letterSpacing: ".4em", textTransform: "uppercase", color: "rgba(212,168,67,.65)", marginBottom: "5px", fontWeight: 400 }}>Admin</span>
          Samuel Gyasi
        </div>
        <nav className="px-3 pt-4 flex-1 overflow-y-auto">
          {NAV.map(({ id, label, Icon }) => {
            const badge = id === "messages" && unreadMsgs > 0 ? unreadMsgs
                        : id === "mail"     && unreadInbox > 0 ? unreadInbox
                        : null;
            const isActive = tab === id;
            return (
              <button
                key={id}
                onClick={() => go(id)}
                className={cn(
                  "flex items-center gap-2.5 px-3.5 py-2.5 font-mono text-[9px] tracking-[.12em]",
                  "uppercase cursor-pointer border-0 w-full text-left transition-all duration-200 rounded-lg relative mb-0.5",
                  isActive
                    ? "text-[#d4a843] bg-[rgba(212,168,67,.1)] before:content-[''] before:absolute before:left-0 before:top-[20%] before:w-[3px] before:h-[60%] before:bg-[#d4a843] before:rounded-r-[2px]"
                    : "text-white/[.38] bg-transparent hover:text-white/[.78] hover:bg-white/5"
                )}
              >
                <Icon size={13} />
                <span className="flex-1">{label}</span>
                {badge !== null && (
                  <span className="bg-gradient-to-br from-[#d4a843] to-[#f0cc7a] text-[#07080c] font-mono text-[7px] font-bold px-[7px] py-0.5 rounded-full leading-[1.6] ml-auto">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="px-7 pb-6 mt-auto flex flex-col gap-2.5">
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

      {navOpen && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur z-[490] md:hidden" onClick={() => setNavOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 overflow-y-auto px-4 pt-20 pb-8 md:px-14 md:py-12 bg-[#07080c]">
        {loading ? (
          <div className="flex gap-2.5 justify-center py-[140px]">
            {[0, 200, 400].map((delay) => (
              <div
                key={delay}
                className="w-2 h-2 bg-[#d4a843] rounded-full animate-[adm-pulse_1.2s_ease-in-out_infinite]"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
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
        <div className={TW.overlay} onClick={() => setConfirm(null)}>
          <div className="bg-[#0d0e15] border border-white/10 rounded-2xl p-8 w-[min(440px,92vw)] shadow-[0_28px_60px_rgba(0,0,0,.6)]" onClick={(e) => e.stopPropagation()}>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "20px", color: "#eef0f5", marginBottom: "26px", lineHeight: 1.55 }}>{confirm.msg}</p>
            <div className="flex gap-2.5 justify-end">
              <button className={cn(TW.btn, TW.ghost)} onClick={() => setConfirm(null)}>Cancel</button>
              <button className={cn(TW.btn, TW.danger)} onClick={async () => { await confirm.fn(); setConfirm(null); }}>Confirm</button>
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
    <div className="flex items-end gap-1 h-[140px] bg-[#0d0e15] border border-white/[.06] rounded-xl px-4 pt-4 pb-8 overflow-x-auto mb-2">
      {data.map((d) => (
        <div key={d.date} className="flex-1 min-w-[20px] flex flex-col items-center justify-end h-full relative" title={`${d.date}: ${d.count}`}>
          <div
            className="w-full max-w-[28px] bg-gradient-to-t from-[#d4a843] to-[rgba(212,168,67,.25)] rounded-t-sm min-h-[3px] transition-all duration-[450ms]"
            style={{ height: `${Math.max((d.count / max) * 100, 2)}%` }}
          />
          <div className="absolute bottom-[-26px] font-mono text-[7px] text-white/20 whitespace-nowrap tracking-[.03em] text-center">
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

// ── ANALYTICS ─────────────────────────────────────────────────────────────
function AnalyticsTab({ analytics }: { analytics: AnalyticsData | null }) {
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
                    <td className={TW.td} style={{ color: "#f0ece4", fontFamily: "'Space Mono',monospace", fontSize: "11px" }}>
                      <span className="flex items-center gap-2">
                        {path}
                        <a href={path} target="_blank" rel="noreferrer" style={{ color: "rgba(240,236,228,.25)", lineHeight: 0 }}><ExternalLink size={10} /></a>
                      </span>
                    </td>
                    <td className={TW.td} style={{ color: "#c9a84c", fontFamily: "'Playfair Display',serif", fontSize: "22px" }}>{count}</td>
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

// ── POSTS TAB ─────────────────────────────────────────────────────────────
function PostsTab({ posts, onNew, onEdit, onDelete, onToggle }: {
  posts: BlogPost[]; onNew: () => void;
  onEdit: (p: BlogPost) => void;
  onDelete: (id: string, title: string) => void;
  onToggle: (id: string, val: boolean) => Promise<void>;
}) {
  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div><div className={TW.pgTitle}>Blog Posts</div><p className={TW.pgSub}>{posts.length} post{posts.length !== 1 ? "s" : ""}</p></div>
        <button className={cn(TW.btn, TW.gold)} onClick={onNew}><Plus size={10} />New Post</button>
      </div>
      {posts.length === 0 ? <p className={TW.empty}>No posts yet.</p> : (
        <div className={TW.tWrap}>
          <table className="w-full border-collapse">
            <thead><tr><th className={TW.th}>Title</th><th className={TW.th}>Cat.</th><th className={TW.th}>Status</th><th className={TW.th}>Date</th><th className={TW.th}>Actions</th></tr></thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                  <td className={TW.td} style={{ color: "#f0ece4", maxWidth: "240px" }}>
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap">{p.title}</div>
                    <div className="text-[10px] text-white/25 font-mono mt-0.5">/{p.category}/blog/{p.slug}</div>
                  </td>
                  <td className={TW.td} style={{ textTransform: "capitalize" }}>{p.category}</td>
                  <td className={TW.td}><span className={cn(TW.badge, p.published ? TW.bPub : TW.bDft)}>{p.published ? "Published" : "Draft"}</span></td>
                  <td className={TW.td}>{new Date(p.created_at).toLocaleDateString("en-GB")}</td>
                  <td className={TW.td}>
                    <div className={TW.actRow}>
                      <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => onToggle(p.id, !p.published)}>{p.published ? "Unpublish" : "Publish"}</button>
                      <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => onEdit(p)}><Pencil size={9} /></button>
                      <button className={cn(TW.btn, TW.danger, TW.sm)} onClick={() => onDelete(p.id, p.title)}><Trash2 size={9} /></button>
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
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div><div className={TW.pgTitle}>Newsletter</div><p className={TW.pgSub}>{subs.length} subscriber{subs.length !== 1 ? "s" : ""}</p></div>
      </div>
      {subs.length === 0 ? <p className={TW.empty}>No subscribers yet.</p> : (
        <div className={TW.tWrap}>
          <table className="w-full border-collapse">
            <thead><tr><th className={TW.th}>Email</th><th className={TW.th}>Name</th><th className={TW.th}>Interests</th><th className={TW.th}>Confirmed</th><th className={TW.th}>Joined</th><th className={TW.th}></th></tr></thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id} className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                  <td className={TW.td} style={{ color: "#f0ece4" }}>{s.email}</td>
                  <td className={TW.td}>{s.name ?? "—"}</td>
                  <td className={TW.td} style={{ maxWidth: 220 }}>
                    {s.interests && s.interests.length > 0
                      ? s.interests.map((i) => (
                          <span key={i} className={cn(TW.badge, TW.bDft, "mr-1 mb-0.5 capitalize")}>{i.replace(/_/g, " ")}</span>
                        ))
                      : <span className="text-white/30">—</span>}
                  </td>
                  <td className={TW.td}><span className={cn(TW.badge, s.confirmed ? TW.bPub : TW.bDft)}>{s.confirmed ? "Yes" : "Pending"}</span></td>
                  <td className={TW.td}>{new Date(s.created_at).toLocaleDateString("en-GB")}</td>
                  <td className={TW.td}><button className={cn(TW.btn, TW.danger, TW.sm)} onClick={() => onDelete(s.id, s.email)}><Trash2 size={9} /></button></td>
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
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div><div className={TW.pgTitle}>Messages</div><p className={TW.pgSub}>{msgs.filter((m) => !m.read).length} unread</p></div>
      </div>
      {msgs.length === 0 ? <p className={TW.empty}>No messages yet.</p> : (
        <div className="flex flex-col gap-0.5">
          {msgs.map((m) => (
            <div key={m.id} className={cn(TW.msgCard, !m.read && TW.msgNew)}>
              <div className={TW.msgHead}>
                <div>
                  <div className={TW.msgName}>{m.name}{!m.read && <span className={cn(TW.badge, TW.bNew, "ml-2")}>NEW</span>}</div>
                  <div className={TW.msgMeta}>{m.email} · {new Date(m.created_at).toLocaleDateString("en-GB")}</div>
                  {m.subject && <div className={TW.msgSubj}>Re: {m.subject}</div>}
                </div>
                <div className={cn(TW.actRow, "flex-shrink-0")}>
                  <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => setExp(exp === m.id ? null : m.id)}>{exp === m.id ? "Collapse" : "Read"}</button>
                  {!m.read && <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => onRead(m.id)}><CheckCheck size={9} /></button>}
                  <button className={cn(TW.btn, TW.gold, TW.sm)} onClick={() => setRply(rply?.id === m.id ? null : m)}>
                    <Reply size={9} />Reply
                  </button>
                </div>
              </div>
              {exp === m.id && <div className={TW.msgBody}>{m.message}</div>}
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
  const [body, setBody] = useState("");
  const [mode, setMode] = useState<"text" | "html">("text");
  const [busy, setBusy] = useState(false);
  const [tpl, setTpl]   = useState("");

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
    <div className={TW.qReply}>
      <div className="flex justify-between mb-2.5">
        <span className="font-mono text-[9px] text-white/45 tracking-[.1em] uppercase">Reply to {to}</span>
        <button className="bg-transparent border-0 text-white/35 cursor-pointer p-0" onClick={onClose}><X size={13} /></button>
      </div>
      {templates.length > 0 && (
        <select className={cn(TW.select, "text-xs py-[7px] px-2.5 mb-2")} value={tpl} onChange={(e) => applyTpl(e.target.value)}>
          <option value="">— Load template —</option>
          {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      )}
      <div className="flex gap-1.5 mb-2">
        <button className={cn(TW.btn, TW.sm, mode === "text" ? TW.gold : TW.ghost)} onClick={() => setMode("text")}><AlignLeft size={9} />Text</button>
        <button className={cn(TW.btn, TW.sm, mode === "html" ? TW.gold : TW.ghost)} onClick={() => setMode("html")}><Code size={9} />HTML</button>
      </div>
      <textarea className={cn(TW.tarea, "min-h-[110px]")} value={body} onChange={(e) => setBody(e.target.value)} placeholder={mode === "html" ? "<p>Your reply…</p>" : "Your reply…"} />
      <div className="flex justify-end mt-2">
        <button className={cn(TW.btn, TW.gold)} onClick={send} disabled={busy}><Send size={10} />{busy ? "Sending…" : "Send Reply"}</button>
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
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div><div className={TW.pgTitle}>Mail</div><p className={TW.pgSub}>impact@samuelgyasi.com · via Resend</p></div>
      </div>
      <div className={TW.mNav}>
        {SUBS.map(({ id, label, Icon, badge }) => (
          <button key={id} className={cn(TW.mTab, sub === id && TW.mAct)} onClick={() => setSub(id)}>
            <Icon size={12} />{label}
            {badge ? <span className="bg-[#d4a843] text-[#09090d] font-mono text-[7px] px-1.5 py-0.5 rounded-full font-bold">{badge}</span> : null}
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
  const [to, setTo]     = useState("");
  const [sub, setSub]   = useState("");
  const [body, setBody] = useState("");
  const [mode, setMode] = useState<"html" | "text">("html");
  const [prev, setPrev] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tpl, setTpl]   = useState("");

  function loadTpl(id: string) {
    const t = templates.find((t) => t.id === id);
    if (t) { setSub(t.subject); setBody(mode === "html" ? t.body_html : t.body_text); }
    setTpl(id);
  }

  async function send() {
    if (!to.trim())   { toast.error("Recipient required"); return; }
    if (!sub.trim())  { toast.error("Subject required");   return; }
    if (!body.trim()) { toast.error("Body required");      return; }
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
    <div className={TW.compose}>
      <div className="flex gap-2 items-center mb-6 flex-wrap">
        {templates.length > 0 && (
          <select className={cn(TW.select, "flex-1 max-w-[260px] text-xs py-2 px-[11px]")} value={tpl} onChange={(e) => loadTpl(e.target.value)}>
            <option value="">— Load template —</option>
            {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        )}
        <div className="flex gap-1.5 ml-auto">
          <button className={cn(TW.btn, TW.sm, mode === "text" ? TW.gold : TW.ghost)} onClick={() => setMode("text")}><AlignLeft size={9} />Plain text</button>
          <button className={cn(TW.btn, TW.sm, mode === "html" ? TW.gold : TW.ghost)} onClick={() => setMode("html")}><Code size={9} />HTML</button>
          {mode === "html" && <button className={cn(TW.btn, TW.sm, prev ? TW.gold : TW.ghost)} onClick={() => setPrev(!prev)}><Eye size={9} />Preview</button>}
        </div>
      </div>

      <div className={TW.field}><label className={TW.label}>To</label><input className={TW.input} type="email" value={to} onChange={(e) => setTo(e.target.value)} placeholder="recipient@email.com" /></div>
      <div className={TW.field}><label className={TW.label}>Subject</label><input className={TW.input} value={sub} onChange={(e) => setSub(e.target.value)} placeholder="Email subject" /></div>
      <div className={TW.field}>
        <label className={TW.label}>{mode === "html" ? "Body (HTML)" : "Body (Plain text)"} <span className="text-white/20 ml-1.5">{body.length} chars</span></label>
        {prev && mode === "html"
          ? <div className="bg-white text-black rounded-lg p-4 overflow-auto max-h-[400px]" dangerouslySetInnerHTML={{ __html: body }} />
          : <textarea className={cn(TW.tarea, "min-h-[300px]", mode === "html" && "font-mono text-[13px]")} value={body} onChange={(e) => setBody(e.target.value)} placeholder={mode === "html" ? "<h1>Hello,</h1>\n<p>Your message here.</p>" : "Hello,\n\nYour message here."} />
        }
      </div>
      <div className="flex justify-end">
        <button className={cn(TW.btn, TW.gold)} onClick={send} disabled={busy}><Send size={11} />{busy ? "Sending…" : "Send Email"}</button>
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
  const [exp, setExp]         = useState<string | null>(null);
  const [rply, setRply]       = useState<InboundEmail | null>(null);
  const [showHtml, setShowHtml] = useState<string | null>(null);

  async function markRead(id: string) {
    await db.from("inbound_emails").update({ read: true }).eq("id", id);
    await onReload();
  }

  return emails.length === 0 ? (
    <div>
      <p className={TW.empty}>No inbound emails yet.</p>
      <p className="font-mono text-[9px] text-white/20 text-center tracking-[.08em] leading-[2.2] max-w-[440px] mx-auto">
        To receive emails here, configure Resend inbound routing<br />
        with webhook → /api/mail/inbound
      </p>
    </div>
  ) : (
    <div className="flex flex-col gap-0.5">
      {emails.map((e) => (
        <div key={e.id} className={cn(TW.msgCard, !e.read && TW.msgNew)}>
          <div className={TW.msgHead}>
            <div>
              <div className={TW.msgName}>{e.from_name ?? e.from_email}{!e.read && <span className={cn(TW.badge, TW.bNew, "ml-2")}>NEW</span>}</div>
              <div className={TW.msgMeta}>{e.from_email} · {new Date(e.received_at).toLocaleDateString("en-GB")}</div>
              {e.subject && <div className={TW.msgSubj}>{e.subject}</div>}
            </div>
            <div className={cn(TW.actRow, "flex-shrink-0")}>
              <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => setExp(exp === e.id ? null : e.id)}>{exp === e.id ? "Collapse" : "Read"}</button>
              {e.body_html && <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => setShowHtml(showHtml === e.id ? null : e.id)}><Code size={9} /></button>}
              {!e.read && <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => markRead(e.id)}><CheckCheck size={9} /></button>}
              <button className={cn(TW.btn, TW.gold, TW.sm)} onClick={() => setRply(rply?.id === e.id ? null : e)}>
                <Reply size={9} />Reply
              </button>
            </div>
          </div>
          {exp === e.id && (
            <div className={TW.msgBody}>
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
    if (l.opened_at)           return <span className={cn(TW.badge, TW.bOpen)}><Eye size={8} className="inline mr-0.5" />Opened</span>;
    if (l.status === "failed") return <span className={cn(TW.badge, TW.bDft)}>Failed</span>;
    return <span className={cn(TW.badge, TW.bSent)}>Sent</span>;
  }

  return logs.length === 0 ? <p className={TW.empty}>No emails sent yet.</p> : (
    <div className="flex flex-col gap-0.5">
      {logs.map((l) => (
        <div key={l.id} className={TW.msgCard}>
          <div className={TW.msgHead}>
            <div>
              <div className={cn(TW.msgName, "gap-2.5 flex-wrap")}>
                {l.subject}{statusBadge(l)}
              </div>
              <div className={TW.msgMeta}>
                To: {l.to_email} · {new Date(l.sent_at).toLocaleDateString("en-GB")}
                {l.opened_at && ` · Opened ${new Date(l.opened_at).toLocaleDateString("en-GB")}`}
              </div>
            </div>
            <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => setExp(exp === l.id ? null : l.id)}>{exp === l.id ? "Collapse" : "View"}</button>
          </div>
          {exp === l.id && (
            <div className={TW.msgBody}>
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
      <div className={TW.sHead}>
        <div className={TW.sTitle}>Email Templates</div>
        <button className={cn(TW.btn, TW.gold)} onClick={onNew}><Plus size={10} />New Template</button>
      </div>
      {templates.length === 0 ? <p className={TW.empty}>No templates. Create reusable email layouts.</p> : (
        <div className="flex flex-col gap-0.5">
          {templates.map((t) => (
            <div key={t.id} className={TW.msgCard}>
              <div className={TW.msgHead}>
                <div>
                  <div className={TW.msgName}>{t.name}</div>
                  <div className={TW.msgSubj} style={{ marginTop: 3 }}>{t.subject}</div>
                  <div className={TW.msgMeta} style={{ marginTop: 3 }}>Created {new Date(t.created_at).toLocaleDateString("en-GB")} · {t.body_html.length} HTML chars</div>
                </div>
                <div className={cn(TW.actRow, "flex-shrink-0")}>
                  <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => onEdit(t)}><Pencil size={9} /></button>
                  <button className={cn(TW.btn, TW.danger, TW.sm)} onClick={() => onDelete(t.id, t.name)}><Trash2 size={9} /></button>
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
  const [name, setName] = useState(tpl?.name     ?? "");
  const [subj, setSubj] = useState(tpl?.subject  ?? "");
  const [html, setHtml] = useState(tpl?.body_html ?? "");
  const [text, setText] = useState(tpl?.body_text ?? "");
  const [tab, setTab]   = useState<"html" | "text">("html");
  const [prev, setPrev] = useState(false);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name required");    return; }
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
    <div className={TW.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={TW.modal}>
        <div className="flex justify-between items-center mb-6">
          <div className={TW.fTitle}>{tpl ? "Edit Template" : "New Template"}</div>
          <button onClick={onClose} className="bg-transparent border-0 text-white/40 cursor-pointer p-0"><X size={16} /></button>
        </div>
        <form onSubmit={save}>
          <div className={TW.field}><label className={TW.label}>Template Name *</label><input className={TW.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Welcome Email" required /></div>
          <div className={TW.field}><label className={TW.label}>Subject *</label><input className={TW.input} value={subj} onChange={(e) => setSubj(e.target.value)} placeholder="Email subject line" required /></div>
          <div className="flex gap-1.5 mb-3 items-center">
            <button type="button" className={cn(TW.btn, TW.sm, tab === "html" ? TW.gold : TW.ghost)} onClick={() => setTab("html")}><Code size={9} />HTML Body</button>
            <button type="button" className={cn(TW.btn, TW.sm, tab === "text" ? TW.gold : TW.ghost)} onClick={() => setTab("text")}><AlignLeft size={9} />Plain Text</button>
            {tab === "html" && <button type="button" className={cn(TW.btn, TW.sm, prev ? TW.gold : TW.ghost, "ml-auto")} onClick={() => setPrev(!prev)}><Eye size={9} />Preview</button>}
          </div>
          {tab === "html" && (
            <div className={TW.field}>
              <label className={TW.label}>HTML <span className="text-white/20">{html.length} chars</span></label>
              {prev
                ? <div className="bg-white text-black rounded-lg p-4 overflow-auto max-h-[400px]" dangerouslySetInnerHTML={{ __html: html }} />
                : <textarea className={cn(TW.tarea, "font-mono text-[13px]")} value={html} onChange={(e) => setHtml(e.target.value)} placeholder="<h1>Hello,</h1><p>Your content here.</p>" />
              }
            </div>
          )}
          {tab === "text" && (
            <div className={TW.field}>
              <label className={TW.label}>Plain Text Fallback <span className="text-white/20">{text.length} chars</span></label>
              <textarea className={TW.tarea} value={text} onChange={(e) => setText(e.target.value)} placeholder={"Hello,\n\nYour content here."} />
            </div>
          )}
          <div className="flex gap-2.5 justify-end mt-6">
            <button type="button" className={cn(TW.btn, TW.ghost)} onClick={onClose}>Cancel</button>
            <button type="submit" className={cn(TW.btn, TW.gold)} disabled={busy}>{busy ? "Saving…" : tpl ? "Save Changes" : "Create Template"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── WHATSAPP ──────────────────────────────────────────────────────────────
function WhatsApp() {
  const DEFAULT_NUM = "233244000000";
  const [num, setNum]       = useState(DEFAULT_NUM);
  const [saved, setSaved]   = useState(DEFAULT_NUM);
  const [recip, setRecip]   = useState("");
  const [msg, setMsg]       = useState("Hello Samuel, I'd like to connect.");
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
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div><div className={TW.pgTitle}>WhatsApp</div><p className={TW.pgSub}>Manage your WhatsApp presence</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className={TW.waCard}>
          <div className="font-mono text-[10px] tracking-[.2em] uppercase text-white/50 mb-5 flex items-center gap-2"><Phone size={13} />Your WhatsApp Number</div>
          <div className={TW.field}><label className={TW.label}>Phone (with country code)</label><input className={TW.input} value={num} onChange={(e) => setNum(e.target.value)} placeholder="233XXXXXXXXX" /></div>
          <div className={cn(TW.actRow, "flex-wrap")}>
            <button className={cn(TW.btn, TW.gold, TW.sm)} onClick={() => { setSaved(num); toast.success("Number saved"); }}>Save</button>
            <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={copy}>
              {copied ? <CheckCheck size={9} /> : <Copy size={9} />}{copied ? "Copied!" : "Copy Link"}
            </button>
            <a href={chatLink} target="_blank" rel="noreferrer" className={cn(TW.btn, TW.ghost, TW.sm)} style={{ textDecoration: "none" }}>
              <ExternalLink size={9} />Open WhatsApp
            </a>
          </div>
          <div className="mt-4 pt-4 border-t border-white/[.05]">
            <span className="block font-mono text-[9px] text-white/35 mb-1">Your chat link:</span>
            <a href={chatLink} target="_blank" rel="noreferrer" className="text-[#25d366] font-mono text-[11px] break-all">{chatLink}</a>
          </div>
        </div>

        <div className={TW.waCard}>
          <div className="font-mono text-[10px] tracking-[.2em] uppercase text-white/50 mb-5 flex items-center gap-2"><Send size={13} />Send Quick Message</div>
          <div className={TW.field}><label className={TW.label}>Recipient Number</label><input className={TW.input} value={recip} onChange={(e) => setRecip(e.target.value)} placeholder="233XXXXXXXXX" /></div>
          <div className={TW.field}><label className={TW.label}>Message</label><textarea className={cn(TW.tarea, "min-h-[90px]")} value={msg} onChange={(e) => setMsg(e.target.value)} /></div>
          <div className={cn(TW.actRow, "flex-wrap mb-3.5")}>
            {QUICK.map((q) => (
              <button key={q} className={cn(TW.btn, TW.ghost, TW.sm, "text-[9px]")} onClick={() => setMsg(q)}>{q.slice(0, 30)}…</button>
            ))}
          </div>
          {composeLink
            ? <a href={composeLink} target="_blank" rel="noreferrer" className={cn(TW.btn, TW.gold)} style={{ textDecoration: "none", display: "inline-flex" }}><Phone size={11} />Open in WhatsApp</a>
            : <button className={cn(TW.btn, TW.ghost, "opacity-35")} disabled>Enter recipient first</button>
          }
        </div>
      </div>

      <div className="mt-10">
        <div className={cn(TW.sTitle, "mb-4")}>Chat Button Preview</div>
        <div className="flex gap-4 flex-wrap items-center">
          <a href={chatLink} target="_blank" rel="noreferrer" className="bg-[#25d366] text-white px-6 py-3.5 inline-flex items-center gap-2.5 font-mono text-[10px] tracking-[.15em]" style={{ textDecoration: "none" }}>
            <Phone size={14} />Chat on WhatsApp
          </a>
          <span className="font-mono text-[9px] text-white/25 tracking-[.1em]">Site-visible chat button</span>
        </div>
      </div>
    </>
  );
}

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
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Testimonials</div>
          <p className={TW.pgSub}>{published} published · {testimonials.length} total</p>
        </div>
        <button className={cn(TW.btn, TW.gold)} onClick={onNew}><Plus size={12} />Add Testimonial</button>
      </div>
      {testimonials.length === 0 ? <p className={TW.empty}>No testimonials yet. Add the first one.</p> : (
        <div className={TW.tWrap}>
          <table className="w-full border-collapse">
            <thead><tr><th className={TW.th}>Name</th><th className={TW.th}>Role / Company</th><th className={TW.th}>Rating</th><th className={TW.th}>Status</th><th className={TW.th}>Actions</th></tr></thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.id} className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                  <td className={TW.td} style={{ color: "#f0ece4", maxWidth: "200px" }}>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-[11px] text-white/40 mt-0.5 italic">{t.quote.slice(0, 60)}{t.quote.length > 60 ? "…" : ""}</div>
                  </td>
                  <td className={TW.td} style={{ fontSize: "12px" }}>{[t.role, t.company].filter(Boolean).join(" · ") || "—"}</td>
                  <td className={TW.td} style={{ color: "#c9a84c", letterSpacing: "2px" }}>{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</td>
                  <td className={TW.td}>
                    <button className={cn(TW.badge, t.published ? TW.bPub : TW.bDft, "cursor-pointer bg-transparent border-none")}
                      onClick={() => onToggle(t.id, !t.published)} title={t.published ? "Click to unpublish" : "Click to publish"}>
                      {t.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className={TW.td}>
                    <div className={TW.actRow}>
                      <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => onEdit(t)}><Pencil size={10} /></button>
                      <button className={cn(TW.btn, TW.danger, TW.sm)} onClick={() => onDelete(t.id, t.name)}><Trash2 size={10} /></button>
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
    <div className={TW.overlay} onClick={onClose}>
      <div className={TW.panel} onClick={(e) => e.stopPropagation()}>
        <div className={TW.pHead}>
          <div className={TW.fTitle}>{testimonial ? "Edit Testimonial" : "New Testimonial"}</div>
          <button className={TW.iconBtn} onClick={onClose}><X size={16} /></button>
        </div>
        <div className={TW.pBody}>
          <div className={TW.fRow}>
            <div className={TW.field}><label className={TW.label}>Name *</label><input className={TW.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" /></div>
            <div className={TW.field}><label className={TW.label}>Role</label><input className={TW.input} value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Professor, Director" /></div>
          </div>
          <div className={TW.fRow}>
            <div className={TW.field}><label className={TW.label}>Company / Organisation</label><input className={TW.input} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. UM6P, World Bank" /></div>
            <div className={TW.field}><label className={TW.label}>Avatar URL</label><input className={TW.input} value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://…" /></div>
          </div>
          <div className={TW.field}><label className={TW.label}>Quote *</label><textarea className={cn(TW.tarea, "min-h-[100px]")} value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="What did they say about Samuel?" /></div>
          <div className={TW.fRow}>
            <div className={TW.field}>
              <label className={TW.label}>Rating (1–5)</label>
              <div className="flex gap-1.5 items-center">
                {[1,2,3,4,5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)}
                    className="bg-transparent border-0 cursor-pointer text-[24px] p-0"
                    style={{ color: n <= rating ? "#c9a84c" : "rgba(201,168,76,.2)" }}>★</button>
                ))}
              </div>
            </div>
            <div className={TW.field}><label className={TW.label}>Sort Order (lower = first)</label><input className={TW.input} type="number" min={0} value={sortOrder} onChange={(e) => setSort(Number(e.target.value))} /></div>
          </div>
          <div className={cn(TW.field, "flex items-center gap-2.5")}>
            <input type="checkbox" id="ts-pub" checked={published} onChange={(e) => setPub(e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-[#c9a84c]" />
            <label htmlFor="ts-pub" className={cn(TW.label, "!mb-0 cursor-pointer")}>Publish immediately (visible on site)</label>
          </div>
        </div>
        <div className={TW.pFoot}>
          <button className={cn(TW.btn, TW.ghost)} onClick={onClose}>Cancel</button>
          <button className={cn(TW.btn, TW.gold)} onClick={handleSave} disabled={saving}>
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
  const filtered  = items.filter((i) => i.category === subTab);
  const published = filtered.filter((i) => i.published).length;

  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Library</div>
          <p className={TW.pgSub}>{published} published · {filtered.length} {subTab === "ebook" ? "eBooks" : "Reviews"}</p>
        </div>
        <button className={cn(TW.btn, TW.gold)} onClick={onNew}><Plus size={12} />Add {subTab === "ebook" ? "eBook" : "Review"}</button>
      </div>

      <div className="flex gap-0 border-b border-white/[.08] mb-6">
        {(["ebook", "review"] as const).map((t) => (
          <button key={t} onClick={() => setSubTab(t)}
            className={cn("font-mono text-[9px] tracking-[.2em] uppercase px-5 py-3 bg-transparent border-0 cursor-pointer transition-colors",
              subTab === t ? "text-[#c9a84c] border-b-2 border-[#c9a84c]" : "text-white/35 border-b-2 border-transparent"
            )}>
            {t === "ebook" ? "eBooks" : "Book Reviews"} ({items.filter((i) => i.category === t).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? <p className={TW.empty}>No {subTab === "ebook" ? "eBooks" : "reviews"} yet.</p> : (
        <div className={TW.tWrap}>
          <table className="w-full border-collapse">
            <thead><tr>
              <th className={TW.th}>Title</th>
              {subTab === "review" && <th className={TW.th}>Author</th>}
              {subTab === "review" && <th className={TW.th}>Rating</th>}
              <th className={TW.th}>Status</th>
              <th className={TW.th}>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                  <td className={TW.td} style={{ color: "#f0ece4", maxWidth: "260px" }}>
                    <div className="font-semibold">{item.title}</div>
                    {item.description && <div className="text-[11px] text-white/40 mt-0.5 italic">{item.description.slice(0, 70)}{item.description.length > 70 ? "…" : ""}</div>}
                  </td>
                  {subTab === "review" && <td className={TW.td} style={{ fontSize: "12px" }}>{item.author ?? "—"}</td>}
                  {subTab === "review" && (
                    <td className={TW.td}>
                      {item.rating !== null
                        ? <span style={{ color: "#c9a84c", letterSpacing: "2px" }}>{"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}</span>
                        : "—"}
                    </td>
                  )}
                  <td className={TW.td}>
                    <button className={cn(TW.badge, item.published ? TW.bPub : TW.bDft, "cursor-pointer bg-transparent border-none")}
                      onClick={() => onToggle(item.id, !item.published)}>
                      {item.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className={TW.td}>
                    <div className={TW.actRow}>
                      <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => onEdit(item)}><Pencil size={10} /></button>
                      <button className={cn(TW.btn, TW.danger, TW.sm)} onClick={() => onDelete(item.id, item.title)}><Trash2 size={10} /></button>
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
    <div className={TW.overlay} onClick={onClose}>
      <div className={TW.panel} onClick={(e) => e.stopPropagation()}>
        <div className={TW.pHead}>
          <div className={TW.fTitle}>{item ? "Edit Library Item" : "New Library Item"}</div>
          <button className={TW.iconBtn} onClick={onClose}><X size={16} /></button>
        </div>
        <div className={TW.pBody}>
          <div className={TW.field}>
            <label className={TW.label}>Type</label>
            <div className="flex gap-0 border border-white/[.08]">
              {(["ebook", "review"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setCategory(t)}
                  className={cn("flex-1 py-2 font-mono text-[9px] tracking-[.2em] uppercase border-0 cursor-pointer transition-colors",
                    category === t ? "bg-[rgba(201,168,76,.12)] text-[#c9a84c]" : "bg-transparent text-white/35"
                  )}>
                  {t === "ebook" ? "eBook" : "Book Review"}
                </button>
              ))}
            </div>
          </div>
          <div className={TW.fRow}>
            <div className={TW.field}><label className={TW.label}>Title *</label><input className={TW.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" /></div>
            <div className={TW.field}><label className={TW.label}>{category === "ebook" ? "Author (optional)" : "Author"}</label><input className={TW.input} value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author name" /></div>
          </div>
          <div className={TW.field}><label className={TW.label}>Description</label><textarea className={cn(TW.tarea, "min-h-[80px]")} value={description} onChange={(e) => setDesc(e.target.value)} placeholder="Short description or review excerpt…" /></div>
          <div className={TW.fRow}>
            <div className={TW.field}><label className={TW.label}>Cover Image URL</label><input className={TW.input} value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="https://…" /></div>
            {category === "ebook" ? (
              <div className={TW.field}><label className={TW.label}>Download URL</label><input className={TW.input} value={downloadUrl} onChange={(e) => setDlUrl(e.target.value)} placeholder="https://…" /></div>
            ) : (
              <div className={TW.field}>
                <label className={TW.label}>Rating (1–5)</label>
                <div className="flex gap-1 items-center pt-1.5">
                  {[1,2,3,4,5].map((n) => (
                    <button key={n} type="button" onClick={() => setRating(n)} className="bg-transparent border-0 cursor-pointer text-[22px] p-0"
                      style={{ color: n <= rating ? "#c9a84c" : "rgba(201,168,76,.2)" }}>★</button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className={TW.fRow}>
            <div className={TW.field}><label className={TW.label}>Sort Order (lower = first)</label><input className={TW.input} type="number" min={0} value={sortOrder} onChange={(e) => setSort(Number(e.target.value))} /></div>
          </div>
          <div className={cn(TW.field, "flex items-center gap-2.5")}>
            <input type="checkbox" id="lib-pub" checked={published} onChange={(e) => setPub(e.target.checked)} className="w-4 h-4 cursor-pointer accent-[#c9a84c]" />
            <label htmlFor="lib-pub" className={cn(TW.label, "!mb-0 cursor-pointer")}>Publish immediately (visible on site)</label>
          </div>
        </div>
        <div className={TW.pFoot}>
          <button className={cn(TW.btn, TW.ghost)} onClick={onClose}>Cancel</button>
          <button className={cn(TW.btn, TW.gold)} onClick={handleSave} disabled={saving}>{saving ? "Saving…" : item ? "Update" : "Add Item"}</button>
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
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Upcoming</div>
          <p className={TW.pgSub}>{published} published · {filtered.length} {SUB_TABS.find((t) => t.id === subTab)?.label}</p>
        </div>
        <button className={cn(TW.btn, TW.gold)} onClick={onNew}><Plus size={12} />Add Event</button>
      </div>

      <div className="flex gap-0 border-b border-white/[.08] mb-6">
        {SUB_TABS.map((t) => (
          <button key={t.id} onClick={() => setSubTab(t.id)}
            className={cn("font-mono text-[9px] tracking-[.2em] uppercase px-5 py-3 bg-transparent border-0 cursor-pointer transition-colors",
              subTab === t.id ? "text-[#c9a84c] border-b-2 border-[#c9a84c]" : "text-white/35 border-b-2 border-transparent"
            )}>
            {t.label} ({events.filter((e) => e.category === t.id).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? <p className={TW.empty}>No {SUB_TABS.find((t) => t.id === subTab)?.label ?? "events"} yet.</p> : (
        <div className={TW.tWrap}>
          <table className="w-full border-collapse">
            <thead><tr><th className={TW.th}>Title</th><th className={TW.th}>Date</th><th className={TW.th}>Location</th><th className={TW.th}>Status</th><th className={TW.th}>Actions</th></tr></thead>
            <tbody>
              {filtered.map((ev) => (
                <tr key={ev.id} className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                  <td className={TW.td} style={{ color: "#f0ece4", maxWidth: "260px" }}>
                    <div className="font-semibold">{ev.title}</div>
                    {ev.description && <div className="text-[11px] text-white/40 mt-0.5 italic">{ev.description.slice(0, 70)}{ev.description.length > 70 ? "…" : ""}</div>}
                  </td>
                  <td className={TW.td} style={{ fontSize: "11px", fontFamily: "'Space Mono',monospace", whiteSpace: "nowrap" }}>{ev.date_text ?? "—"}</td>
                  <td className={TW.td} style={{ fontSize: "11px" }}>{ev.location ?? "—"}</td>
                  <td className={TW.td}>
                    <button className={cn(TW.badge, ev.published ? TW.bPub : TW.bDft, "cursor-pointer bg-transparent border-none")}
                      onClick={() => onToggle(ev.id, !ev.published)}>
                      {ev.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className={TW.td}>
                    <div className={TW.actRow}>
                      <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => onEdit(ev)}><Pencil size={10} /></button>
                      <button className={cn(TW.btn, TW.danger, TW.sm)} onClick={() => onDelete(ev.id, ev.title)}><Trash2 size={10} /></button>
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
    <div className={TW.overlay} onClick={onClose}>
      <div className={TW.panel} onClick={(e) => e.stopPropagation()}>
        <div className={TW.pHead}>
          <div className={TW.fTitle}>{event ? "Edit Event" : "New Upcoming Event"}</div>
          <button className={TW.iconBtn} onClick={onClose}><X size={16} /></button>
        </div>
        <div className={TW.pBody}>
          <div className={TW.field}>
            <label className={TW.label}>Type</label>
            <div className="flex gap-0 border border-white/[.08]">
              {(["intervention", "masterclass", "session"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setCategory(t)}
                  className={cn("flex-1 py-2 font-mono text-[9px] tracking-[.2em] uppercase border-0 cursor-pointer transition-colors",
                    category === t ? "bg-[rgba(201,168,76,.12)] text-[#c9a84c]" : "bg-transparent text-white/35"
                  )}>
                  {CAT_LABELS[t]}
                </button>
              ))}
            </div>
          </div>
          <div className={TW.field}><label className={TW.label}>Title *</label><input className={TW.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" /></div>
          <div className={TW.field}><label className={TW.label}>Description</label><textarea className={cn(TW.tarea, "min-h-[80px]")} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Short description…" /></div>
          <div className={TW.fRow}>
            <div className={TW.field}><label className={TW.label}>Date / Period</label><input className={TW.input} value={dateText} onChange={(e) => setDateText(e.target.value)} placeholder="e.g. March 2026 or Coming Soon" /></div>
            <div className={TW.field}><label className={TW.label}>Tag label</label><input className={TW.input} value={tag} onChange={(e) => setTag(e.target.value)} placeholder="e.g. Intervention" /></div>
          </div>
          <div className={TW.fRow}>
            <div className={TW.field}><label className={TW.label}>Location</label><input className={TW.input} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" /></div>
            <div className={TW.field}><label className={TW.label}>Sort Order (lower = first)</label><input className={TW.input} type="number" min={0} value={sortOrder} onChange={(e) => setSort(Number(e.target.value))} /></div>
          </div>
          <div className={cn(TW.field, "flex items-center gap-2.5")}>
            <input type="checkbox" id="up-pub" checked={published} onChange={(e) => setPub(e.target.checked)} className="w-4 h-4 cursor-pointer accent-[#c9a84c]" />
            <label htmlFor="up-pub" className={cn(TW.label, "!mb-0 cursor-pointer")}>Publish immediately (visible on site)</label>
          </div>
        </div>
        <div className={TW.pFoot}>
          <button className={cn(TW.btn, TW.ghost)} onClick={onClose}>Cancel</button>
          <button className={cn(TW.btn, TW.gold)} onClick={handleSave} disabled={saving}>{saving ? "Saving…" : event ? "Update" : "Add Event"}</button>
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
    <div className={TW.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={TW.modal} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <div className={TW.fTitle}>{post ? "Edit Post" : "New Blog Post"}</div>
          <button onClick={onClose} className={TW.iconBtn}><X size={16} /></button>
        </div>
        <form onSubmit={save}>
          <div className={TW.field}><label className={TW.label}>Title *</label>
            <input className={TW.input} value={form.title} onChange={(e) => { setF("title", e.target.value); if (!post) setF("slug", slugify(e.target.value)); }} placeholder="Post title" required />
          </div>
          <div className={TW.fRow}>
            <div className={TW.field}><label className={TW.label}>Slug *</label><input className={TW.input} value={form.slug} onChange={(e) => setF("slug", e.target.value)} placeholder="url-slug" required /></div>
            <div className={TW.field}><label className={TW.label}>Category *</label>
              <select className={TW.select} value={form.category} onChange={(e) => setF("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className={TW.field}><label className={TW.label}>Excerpt</label><textarea className={cn(TW.tarea, "min-h-[80px]")} value={form.excerpt} onChange={(e) => setF("excerpt", e.target.value)} placeholder="Short summary…" /></div>
          <div className={TW.field}><label className={TW.label}>Content (HTML)</label><textarea className={TW.tarea} value={form.content} onChange={(e) => setF("content", e.target.value)} placeholder="<p>Full article…</p>" /></div>
          <div className={TW.fRow}>
            <div className={TW.field}><label className={TW.label}>Featured Image URL</label><input className={TW.input} value={form.featured_image_url} onChange={(e) => setF("featured_image_url", e.target.value)} placeholder="https://…" /></div>
            <div className={TW.field}><label className={TW.label}>Read Time (min)</label><input className={TW.input} type="number" min={1} max={60} value={form.read_time_minutes} onChange={(e) => setF("read_time_minutes", parseInt(e.target.value, 10) || 5)} /></div>
          </div>
          <div className="flex items-center gap-3 mb-5 py-4 border-y border-white/[.05]">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={() => setF("published", !form.published)} className="sr-only peer" />
              <div className="w-10 h-5 bg-white/10 rounded-full peer-checked:bg-[rgba(212,168,67,.7)] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
            </label>
            <span className="font-mono text-[9px] tracking-[.1em] text-white/50">{form.published ? "Published — visible on site" : "Draft — not visible"}</span>
          </div>
          <div className="flex gap-2.5 justify-end mt-6">
            <button type="button" className={cn(TW.btn, TW.ghost)} onClick={onClose}>Cancel</button>
            <button type="submit" className={cn(TW.btn, TW.gold)} disabled={busy}>{busy ? "Saving…" : post ? "Save Changes" : "Create Post"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
