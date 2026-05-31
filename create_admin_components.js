// Create admin sub-components to bring page.tsx below 400 lines
const fs = require("fs");
const path = require("path");

// ===================== useAdminPage.ts =====================
const useAdminPageContent = `"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type {
  BlogPost, BlogSeries, BlogTag, Subscriber, Message, EmailLog,
  InboundEmail, EmailTemplate, AnalyticsData, Testimonial, LibraryItem,
  UpcomingEvent, Feedback, Training, BlogComment, GalleryTheme,
  EventRegistration, PrayerSubmission, DiscipleshipContent, Disciple,
  FaithTest, Tab, MailSubTab, PageViewRow, AuthUserRow,
} from "./types";

export type AdminNotification = {
  id: string; kind: string; title: string; body: string | null;
  read: boolean; created_at: string;
};

export interface ModalOpeners {
  openPost: (p: BlogPost | null) => void;
  openSeries: (s: BlogSeries | null) => void;
  openViewSeries: (s: BlogSeries | null) => void;
  openTag: (t: BlogTag | null) => void;
  openReviews: (p: BlogPost) => void;
  openTpl: (t: EmailTemplate | null) => void;
  openTestimonial: (t: Testimonial | null) => void;
  openLibItem: (item: LibraryItem | null) => void;
  openUpcoming: (ev: UpcomingEvent | null) => void;
  openTraining: (t: Training | null) => void;
  openGallery: (t: GalleryTheme | null) => void;
  openFaithTest: (t: FaithTest | null) => void;
  openDisciple: (d: Disciple | null) => void;
  openProgress: (d: Disciple) => void;
}

export function useAdminPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mailSub, setMailSub] = useState<MailSubTab>("compose");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [blogSeries, setBlogSeries] = useState<BlogSeries[]>([]);
  const [blogTags, setBlogTags] = useState<BlogTag[]>([]);
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [inbox, setInbox] = useState<InboundEmail[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPost, setShowPost] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [showSeries, setShowSeries] = useState(false);
  const [editSeries, setEditSeries] = useState<BlogSeries | null>(null);
  const [viewSeries, setViewSeries] = useState<BlogSeries | null>(null);
  const [showTag, setShowTag] = useState(false);
  const [editTag, setEditTag] = useState<BlogTag | null>(null);
  const [showReviews, setShowReviews] = useState(false);
  const [reviewPost, setReviewPost] = useState<BlogPost | null>(null);
  const [showTpl, setShowTpl] = useState(false);
  const [editTpl, setEditTpl] = useState<EmailTemplate | null>(null);
  const [showTestimonial, setShowTestimonial] = useState(false);
  const [editTestimonial, setEditTestimonial] = useState<Testimonial | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [showLibItem, setShowLibItem] = useState(false);
  const [editLibItem, setEditLibItem] = useState<LibraryItem | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [editUpcoming, setEditUpcoming] = useState<UpcomingEvent | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [blogComments, setBlogComments] = useState<BlogComment[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [showTraining, setShowTraining] = useState(false);
  const [editTraining, setEditTraining] = useState<Training | null>(null);
  const [galleryThemes, setGalleryThemes] = useState<GalleryTheme[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [editGallery, setEditGallery] = useState<GalleryTheme | null>(null);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const [prayerSubmissions, setPrayerSubmissions] = useState<PrayerSubmission[]>([]);
  const [discipleshipContent, setDiscipleshipContent] = useState<DiscipleshipContent | null>(null);
  const [disciples, setDisciples] = useState<Disciple[]>([]);
  const [showDisciple, setShowDisciple] = useState(false);
  const [editDisciple, setEditDisciple] = useState<Disciple | null>(null);
  const [viewProgressDisciple, setViewProgressDisciple] = useState<Disciple | null>(null);
  const [faithTests, setFaithTests] = useState<FaithTest[]>([]);
  const [users, setUsers] = useState<AuthUserRow[]>([]);
  const [showFaithTest, setShowFaithTest] = useState(false);
  const [editFaithTest, setEditFaithTest] = useState<FaithTest | null>(null);
  const [confirm, setConfirm] = useState<{ msg: string; fn: () => Promise<void> } | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [adminEmail, setAdminEmail] = useState("admin@samuelgyasi.com");
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const router = useRouter();
  const db = createClient();

  useEffect(() => {
    const saved = window.localStorage.getItem("sg-admin-theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("sg-admin-theme", theme);
  }, [theme]);

  const handleLogout = async () => { await db.auth.signOut(); router.push("/auth/login"); };

  const load = useCallback(async () => {
    const { data: { session } } = await db.auth.getSession();
    if (!session) { router.push("/auth/login"); return; }
    setAdminEmail(session.user.email ?? "admin@samuelgyasi.com");
    setLoading(true);
    const [pR,serR,tagR,sR,mR,lR,iR,tR,aR,tsR,libR,upR,fbR,cmtR,trnR,galR,evRegR,prayR,discR,ftR,discipR,usersRes] = await Promise.all([
      db.from("blog_posts").select("*").order("created_at",{ascending:false}),
      db.from("blog_series").select("*").order("sort_order",{ascending:true}).order("created_at",{ascending:false}),
      db.from("blog_tags").select("*").order("sort_order",{ascending:true}).order("created_at",{ascending:false}),
      db.from("newsletter_subscribers").select("*").order("created_at",{ascending:false}),
      db.from("contact_messages").select("*").order("created_at",{ascending:false}),
      db.from("email_logs").select("*").order("sent_at",{ascending:false}),
      db.from("inbound_emails").select("*").order("received_at",{ascending:false}),
      db.from("email_templates").select("*").order("created_at",{ascending:false}),
      db.from("page_views").select("page_path,visitor_id,created_at").gte("created_at",new Date(Date.now()-30*86400000).toISOString()),
      db.from("testimonials").select("*").order("sort_order",{ascending:true}).order("created_at",{ascending:false}),
      db.from("library_items").select("*").order("sort_order",{ascending:true}).order("created_at",{ascending:false}),
      db.from("upcoming_events").select("*").order("sort_order",{ascending:true}).order("created_at",{ascending:false}),
      db.from("feedback").select("*").order("created_at",{ascending:false}),
      db.from("blog_comments").select("*").order("created_at",{ascending:false}),
      db.from("trainings").select("*").order("sort_order",{ascending:true}).order("created_at",{ascending:false}),
      db.from("gallery_themes").select("*, photos:gallery_photos(*)").order("sort_order",{ascending:true}),
      db.from("event_registrations").select("*").order("registered_at",{ascending:false}),
      db.from("prayer_submissions").select("*").order("created_at",{ascending:false}),
      db.from("discipleship_content").select("*").single(),
      db.from("faith_tests").select("*").order("sort_order",{ascending:true}).order("created_at",{ascending:false}),
      db.from("disciples").select("*").order("started_at",{ascending:false}),
      fetch("/api/admin/users",{cache:"no-store"}),
    ]);
    setPosts(pR.data??[]); setBlogSeries((serR.data as BlogSeries[])??[]);
    setBlogTags((tagR.data as BlogTag[])??[]); setSubs(sR.data??[]);
    setMsgs(mR.data??[]); setLogs(lR.data??[]); setInbox(iR.data??[]);
    setTemplates(tR.data??[]); setTestimonials(tsR.data??[]);
    setLibraryItems(libR.data??[]); setUpcomingEvents(upR.data??[]);
    setFeedbacks(fbR.data??[]); setBlogComments((cmtR.data as BlogComment[])??[]);
    setTrainings((trnR.data as Training[])??[]); setGalleryThemes((galR.data as GalleryTheme[])??[]);
    setEventRegistrations((evRegR.data as EventRegistration[])??[]);
    setPrayerSubmissions((prayR.data as PrayerSubmission[])??[]);
    setDiscipleshipContent(discR.data??null); setFaithTests((ftR.data as FaithTest[])??[]);
    setDisciples((discipR.data as Disciple[])??[]);
    if (usersRes.ok) { const b = await usersRes.json() as {users?:AuthUserRow[]}; setUsers(b.users??[]); } else setUsers([]);
    const {data:notifData} = await db.from("admin_notifications").select("id,kind,title,body,read,created_at").order("created_at",{ascending:false}).limit(30);
    setNotifications((notifData as AdminNotification[])??[]);
    const views: PageViewRow[] = aR.data??[];
    const totalViews = views.length;
    const uniqueVisitors = new Set(views.map(v=>v.visitor_id)).size;
    const pc = views.reduce((a,v)=>{a[v.page_path]=(a[v.page_path]??0)+1;return a;},{} as Record<string,number>);
    const topPages = Object.entries(pc).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([path,count])=>({path,count}));
    const dailyViews: {date:string;count:number}[] = [];
    for (let i=13;i>=0;i--) { const d=new Date(Date.now()-i*86400000); const str=d.toISOString().slice(0,10); dailyViews.push({date:str,count:views.filter(v=>v.created_at.slice(0,10)===str).length}); }
    setAnalytics({totalViews,uniqueVisitors,topPages,dailyViews});
    setLoading(false);
  }, [db, router]);

  useEffect(() => { load(); }, [load]);

  const unreadMsgs = msgs.filter(m=>!m.read).length;
  const unreadInbox = inbox.filter(e=>!e.read).length;
  const unreadFeedback = feedbacks.filter(f=>!f.resolved).length;
  const unprayedSubmissions = prayerSubmissions.filter(p=>!p.prayed_for).length;
  const unapprovedComments = blogComments.filter(c=>!c.approved).length;
  const unreadNotifCount = notifications.filter(n=>!n.read).length;

  async function markAllNotificationsRead() {
    const ids = notifications.filter(n=>!n.read).map(n=>n.id);
    if (!ids.length) return;
    const {error} = await db.from("admin_notifications").update({read:true}).in("id",ids);
    if (error) { toast.error("Failed to mark notifications as read"); return; }
    setNotifications(prev=>prev.map(n=>({...n,read:true})));
  }

  function ask(msg: string, fn: () => Promise<void>) { setConfirm({msg,fn}); }
  function go(t: Tab) { setTab(t); setNavOpen(false); }

  const modals: ModalOpeners = {
    openPost: (p) => { setEditPost(p); setShowPost(true); },
    openSeries: (s) => { setEditSeries(s); setShowSeries(true); },
    openViewSeries: (s) => setViewSeries(s),
    openTag: (t) => { setEditTag(t); setShowTag(true); },
    openReviews: (p) => { setReviewPost(p); setShowReviews(true); },
    openTpl: (t) => { setEditTpl(t); setShowTpl(true); },
    openTestimonial: (t) => { setEditTestimonial(t); setShowTestimonial(true); },
    openLibItem: (item) => { setEditLibItem(item); setShowLibItem(true); },
    openUpcoming: (ev) => { setEditUpcoming(ev); setShowUpcoming(true); },
    openTraining: (t) => { setEditTraining(t); setShowTraining(true); },
    openGallery: (t) => { setEditGallery(t); setShowGallery(true); },
    openFaithTest: (t) => { setEditFaithTest(t); setShowFaithTest(true); },
    openDisciple: (d) => { setEditDisciple(d); setShowDisciple(true); },
    openProgress: (d) => setViewProgressDisciple(d),
  };

  return {
    tab, setTab, searchQuery, setSearchQuery, searchOpen, setSearchOpen,
    mailSub, setMailSub, navOpen, setNavOpen, theme, setTheme,
    adminEmail, loading, notifications, notifOpen, setNotifOpen,
    posts, blogSeries, blogTags, subs, msgs, logs, inbox, templates,
    analytics, testimonials, libraryItems, upcomingEvents, feedbacks,
    blogComments, trainings, galleryThemes, eventRegistrations,
    prayerSubmissions, discipleshipContent, disciples, faithTests, users,
    showPost, editPost, setShowPost, setEditPost,
    showSeries, editSeries, setShowSeries,
    viewSeries, setViewSeries,
    showTag, editTag, setShowTag,
    showReviews, reviewPost, setShowReviews,
    showTpl, editTpl, setShowTpl,
    showTestimonial, editTestimonial, setShowTestimonial,
    showLibItem, editLibItem, setShowLibItem,
    showUpcoming, editUpcoming, setShowUpcoming,
    showTraining, editTraining, setShowTraining,
    showGallery, editGallery, setShowGallery,
    showFaithTest, editFaithTest, setShowFaithTest,
    showDisciple, editDisciple, setShowDisciple,
    viewProgressDisciple, setViewProgressDisciple,
    confirm, setConfirm,
    db, unreadMsgs, unreadInbox, unreadFeedback,
    unprayedSubmissions, unapprovedComments, unreadNotifCount,
    markAllNotificationsRead, ask, go, handleLogout, modals,
  };
}
`;

// ===================== AdminSidebar.tsx =====================
const adminSidebarContent = `"use client";
import Link from "next/link";
import { Globe, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_SORTED } from "./constants";
import type { Tab } from "./types";

interface Props {
  tab: Tab;
  navOpen: boolean;
  setNavOpen: (v: boolean) => void;
  unreadMsgs: number;
  unreadInbox: number;
  unreadFeedback: number;
  unprayedSubmissions: number;
  unapprovedComments: number;
  onGo: (t: Tab) => void;
  onLogout: () => void;
}

export default function AdminSidebar({ tab, navOpen, setNavOpen, unreadMsgs, unreadInbox, unreadFeedback, unprayedSubmissions, unapprovedComments, onGo, onLogout }: Props) {
  return (
    <>
      {/* Mobile header */}
      <div className="adm-mobile-header flex md:hidden fixed top-0 left-0 right-0 z-[600] border-b px-5 py-3.5 items-center justify-between shadow-[0_2px_20px_rgba(0,0,0,.4)]">
        <button
          className="bg-white/[.06] border border-white/[.09] rounded-lg text-white/60 cursor-pointer flex items-center justify-center p-1.5 transition-all hover:bg-white/10"
          onClick={() => setNavOpen(!navOpen)} aria-label="Menu"
        >
          <Menu size={18} />
        </button>
        <span className="font-poppins text-[14px] font-semibold text-[#f0ece4] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#d4a843] to-[#c49838] flex items-center justify-center text-[9px] font-bold text-[#09090d]">SG</span>
          Samuel Gyasi
        </span>
        <div className="flex items-center gap-2">
          <Link href="/" className="text-white/30 hover:text-white/60 transition-colors leading-none"><Globe size={16} /></Link>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "adm-sidebar w-[260px] flex-shrink-0 border-r border-white/[.055]",
        "fixed md:sticky top-0 h-screen flex flex-col z-[500]",
        "shadow-[1px_0_0_0_rgba(255,255,255,.04),10px_0_50px_rgba(0,0,0,.5)]",
        "transition-transform duration-300 -translate-x-full md:translate-x-0",
        navOpen && "translate-x-0"
      )}>
        <div className="px-5 py-5 border-b border-white/[.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d4a843] to-[#c49838] flex items-center justify-center flex-shrink-0 shadow-[0_4px_14px_rgba(212,168,67,.3)]">
              <span className="font-poppins text-[13px] font-bold text-[#09090d]">SG</span>
            </div>
            <div>
              <div className="font-poppins text-[14px] font-semibold text-[#eef0f5] leading-tight">Samuel Gyasi</div>
              <div className="font-poppins text-[10px] font-medium text-[rgba(212,168,67,.7)] mt-0.5">Admin Dashboard</div>
            </div>
          </div>
        </div>
        <nav className="px-3 pt-3 flex-1 overflow-y-auto">
          {NAV_SORTED.map(({ id, label, Icon }) => {
            const badge = id==="messages"&&unreadMsgs>0 ? unreadMsgs
              : id==="mail"&&unreadInbox>0 ? unreadInbox
              : id==="feedback"&&unreadFeedback>0 ? unreadFeedback
              : id==="prayer-submissions"&&unprayedSubmissions>0 ? unprayedSubmissions
              : id==="comments"&&unapprovedComments>0 ? unapprovedComments
              : null;
            const isActive = tab === id;
            return (
              <button key={id} onClick={() => onGo(id)}
                className={cn("flex items-center gap-3 px-4 py-2.5 font-poppins text-[13px] font-medium cursor-pointer border-0 w-full text-left transition-all duration-200 rounded-lg relative mb-1",
                  isActive ? "text-[#d4a843] bg-[rgba(212,168,67,.12)]" : "text-white/[.42] bg-transparent hover:text-white/[.80] hover:bg-white/[.05]"
                )}
              >
                <Icon size={15} />
                <span className="flex-1">{label}</span>
                {badge !== null && (
                  <span className="bg-gradient-to-br from-[#d4a843] to-[#f0cc7a] text-[#07080c] font-poppins text-[9px] font-bold px-2 py-0.5 rounded-full leading-tight ml-auto">{badge}</span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="px-4 pb-5 pt-3 mt-auto border-t border-white/[.06] flex flex-col gap-2">
          <Link href="/" className="font-poppins text-[11px] font-medium text-white/30 no-underline flex items-center gap-2 hover:text-white/60 transition-colors py-1.5">
            <Globe size={13} /> Back to Site
          </Link>
          <button onClick={onLogout}
            className="font-poppins text-[11px] font-medium text-white/40 bg-transparent border border-white/[.1] px-3 py-2.5 cursor-pointer flex items-center gap-2 w-full rounded-lg transition-all hover:border-[rgba(201,168,76,.4)] hover:text-[#c9a84c]"
          >
            <LogOut size={13} /> Log Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {navOpen && <div className="fixed inset-0 bg-black/65 backdrop-blur z-[490] md:hidden" onClick={() => setNavOpen(false)} />}
    </>
  );
}
`;

// ===================== AdminTopbar.tsx =====================
const adminTopbarContent = `"use client";
import { Bell, Mail, Moon, Search, Sun } from "lucide-react";
import { NAV_SORTED } from "./constants";
import type { AdminNotification } from "./useAdminPage";
import type { Tab } from "./types";

interface Props {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  notifOpen: boolean;
  setNotifOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  notifications: AdminNotification[];
  unreadNotifCount: number;
  markAllNotificationsRead: () => void;
  theme: "dark" | "light";
  setTheme: (v: "dark" | "light" | ((p: "dark" | "light") => "dark" | "light")) => void;
  adminEmail: string;
  onGo: (t: Tab) => void;
}

export default function AdminTopbar({ searchQuery, setSearchQuery, searchOpen, setSearchOpen, notifOpen, setNotifOpen, notifications, unreadNotifCount, markAllNotificationsRead, theme, setTheme, adminEmail, onGo }: Props) {
  return (
    <div className="adm-topbar mx-4 md:mx-12 mt-[62px] md:mt-6">
      <div className="adm-topbar-left">
        <div className="adm-search-wrap">
          <Search size={15} />
          <input className="adm-search" placeholder="Search tab, post, user..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 160)}
          />
        </div>
        {searchOpen && searchQuery.trim().length > 0 && (() => {
          const results = NAV_SORTED.filter(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()));
          return (
            <div className="adm-search-results">
              {results.length === 0 ? (
                <p className="adm-search-no-results">No matching tabs found</p>
              ) : results.map(({ id, label, Icon }) => (
                <div key={id} className="adm-search-result-item"
                  onMouseDown={() => { onGo(id as Tab); setSearchQuery(""); setSearchOpen(false); }}
                >
                  <Icon size={14} /><span>{label}</span>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
      <div className="adm-topbar-right">
        <span className="adm-icon-btn"><Mail size={14} /></span>
        <div className="adm-notif-wrap">
          <button className="adm-icon-btn" onClick={() => setNotifOpen(v => !v)} aria-label="Notifications">
            <Bell size={14} />
            {unreadNotifCount > 0 && <span className="adm-notif-badge">{unreadNotifCount > 9 ? "9+" : unreadNotifCount}</span>}
          </button>
          {notifOpen && (
            <div className="adm-notif-panel">
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-[12px] font-semibold" style={{ color: "var(--adm-text)" }}>Notifications</p>
                <button className="text-[11px]" style={{ color: "#d4a843" }} onClick={markAllNotificationsRead}>Mark all read</button>
              </div>
              {notifications.length === 0 ? (
                <p className="text-[12px] px-1" style={{ color: "var(--adm-text-muted)" }}>No notifications yet.</p>
              ) : notifications.map(n => (
                <div key={n.id} className="adm-notif-item" style={{ opacity: n.read ? 0.7 : 1 }}>
                  <p className="adm-notif-title">{n.title}</p>
                  {n.body && <p className="adm-notif-body">{n.body}</p>}
                  <p className="adm-notif-time">{new Date(n.created_at).toLocaleString("en-GB")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <button type="button" className="adm-icon-btn"
          onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
          aria-label="Toggle theme" title={theme === "dark" ? "Switch to light" : "Switch to dark"}
        >
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <div className="adm-profile">
          <span className="adm-avatar">{(adminEmail[0] || "A").toUpperCase()}</span>
          <div>
            <p className="adm-pname">Admin</p>
            <p className="adm-pmail">{adminEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

// ===================== AdminTabContent.tsx =====================
const adminTabContentContent = `"use client";
import { SupabaseClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import type {
  BlogPost, BlogSeries, BlogTag, Subscriber, Message, EmailLog,
  InboundEmail, EmailTemplate, AnalyticsData, Testimonial, LibraryItem,
  UpcomingEvent, Feedback, Training, BlogComment, GalleryTheme,
  EventRegistration, PrayerSubmission, DiscipleshipContent, Disciple,
  FaithTest, Tab, MailSubTab, AuthUserRow,
} from "./types";
import type { ModalOpeners } from "./useAdminPage";
import OverviewTab from "./tabs/OverviewTab";
import AnalyticsTab from "./tabs/AnalyticsTab";
import PostsTab from "./tabs/PostsTab";
import BlogSeriesTab from "./tabs/BlogSeriesTab";
import BlogTagsTab from "./tabs/BlogTagsTab";
import SubsTab from "./tabs/SubsTab";
import MsgsTab from "./tabs/MsgsTab";
import MailTab from "./tabs/MailTab";
import TestimonialsTab from "./tabs/TestimonialsTab";
import LibraryTab from "./tabs/LibraryTab";
import UpcomingTab from "./tabs/UpcomingTab";
import EventRegistrationsTab from "./tabs/EventRegistrationsTab";
import FeedbackTab from "./tabs/FeedbackTab";
import DiscipleshipTab from "./tabs/DiscipleshipTab";
import PrayerSubmissionsTab from "./tabs/PrayerSubmissionsTab";
import TrainingsTab from "./tabs/TrainingsTab";
import GalleryTab from "./tabs/GalleryTab";
import FaithTestsTab from "./tabs/FaithTestsTab";
import UsersTab from "./tabs/UsersTab";
import LogsTab from "./tabs/LogsTab";
import CommentsTab from "./tabs/CommentsTab";
import HabitsTab from "./tabs/HabitsTab";

interface Props {
  tab: Tab; db: SupabaseClient; load: () => Promise<void>; ask: (msg: string, fn: () => Promise<void>) => void;
  modals: ModalOpeners;
  setConfirm: (v: { msg: string; fn: () => Promise<void> } | null) => void;
  onNav: (t: Tab) => void;
  mailSub: MailSubTab; setMailSub: (v: MailSubTab) => void;
  posts: BlogPost[]; blogSeries: BlogSeries[]; blogTags: BlogTag[];
  subs: Subscriber[]; msgs: Message[]; logs: EmailLog[];
  inbox: InboundEmail[]; templates: EmailTemplate[]; analytics: AnalyticsData | null;
  testimonials: Testimonial[]; libraryItems: LibraryItem[];
  upcomingEvents: UpcomingEvent[]; feedbacks: Feedback[]; blogComments: BlogComment[];
  trainings: Training[]; galleryThemes: GalleryTheme[];
  eventRegistrations: EventRegistration[]; prayerSubmissions: PrayerSubmission[];
  discipleshipContent: DiscipleshipContent | null; disciples: Disciple[];
  faithTests: FaithTest[]; users: AuthUserRow[];
}

export default function AdminTabContent({ tab, db, load, ask, modals, setConfirm, onNav, mailSub, setMailSub, posts, blogSeries, blogTags, subs, msgs, logs, inbox, templates, analytics, testimonials, libraryItems, upcomingEvents, feedbacks, blogComments, trainings, galleryThemes, eventRegistrations, prayerSubmissions, discipleshipContent, disciples, faithTests, users }: Props) {
  return (
    <>
      {tab === "overview" && <OverviewTab posts={posts} subs={subs} msgs={msgs} logs={logs} analytics={analytics} onNav={onNav} />}
      {tab === "analytics" && <AnalyticsTab analytics={analytics} />}
      {tab === "users" && <UsersTab users={users} />}
      {tab === "logs" && <LogsTab logs={logs} />}
      {tab === "posts" && (
        <PostsTab posts={posts}
          onNew={() => modals.openPost(null)} onEdit={(p) => modals.openPost(p)}
          onDelete={(id, title) => ask(\`Delete "\${title}"?\`, async () => {
            const { error } = await db.from("blog_posts").delete().eq("id", id);
            if (error) { toast.error("Delete failed"); return; }
            toast.success("Post deleted"); await load();
          })}
          onToggle={async (id, val) => {
            const { error } = await db.from("blog_posts").update({ published: val }).eq("id", id);
            if (error) { toast.error("Update failed"); return; }
            toast.success(val ? "Published" : "Unpublished"); await load();
          }}
          onViewReviews={(p) => modals.openReviews(p)}
        />
      )}
      {tab === "series" && (
        <BlogSeriesTab series={blogSeries}
          onNew={() => modals.openSeries(null)} onEdit={(s) => modals.openSeries(s)}
          onView={(s) => modals.openViewSeries(s)}
          onDelete={(id, name) => ask(\`Delete series "\${name}"?\`, async () => {
            const { error } = await db.from("blog_series").delete().eq("id", id);
            if (error) { toast.error("Delete failed"); return; }
            toast.success("Series deleted"); await load();
          })}
          onToggle={async (id, val) => {
            const { error } = await db.from("blog_series").update({ published: val }).eq("id", id);
            if (error) { toast.error("Update failed"); return; }
            toast.success(val ? "Published" : "Unpublished"); await load();
          }}
        />
      )}
      {tab === "tags" && (
        <BlogTagsTab tags={blogTags}
          onNew={() => modals.openTag(null)} onEdit={(t) => modals.openTag(t)}
          onDelete={async (id) => {
            const { error } = await db.from("blog_tags").delete().eq("id", id);
            if (error) { toast.error("Delete failed"); return; }
            toast.success("Tag deleted"); await load();
          }}
          onToggle={async (id, field, val) => {
            const { error } = await db.from("blog_tags").update({ [field]: !val }).eq("id", id);
            if (error) { toast.error("Update failed"); return; }
            toast.success("Tag updated"); await load();
          }}
        />
      )}
      {tab === "subscribers" && (
        <SubsTab subs={subs}
          onDelete={(id, email) => ask(\`Remove \${email}?\`, async () => {
            const { error } = await db.from("newsletter_subscribers").delete().eq("id", id);
            if (error) { toast.error("Remove failed"); return; }
            toast.success("Removed"); await load();
          })}
        />
      )}
      {tab === "messages" && (
        <MsgsTab msgs={msgs} templates={templates}
          onRead={async (id) => { await db.from("contact_messages").update({ read: true }).eq("id", id); await load(); }}
        />
      )}
      {tab === "mail" && (
        <MailTab sub={mailSub} setSub={setMailSub} logs={logs} inbox={inbox} templates={templates} onReload={load} db={db}
          onEditTpl={(t) => modals.openTpl(t)} onNewTpl={() => modals.openTpl(null)}
          onDeleteTpl={(id, name) => ask(\`Delete template "\${name}"?\`, async () => {
            const r = await fetch(\`/api/mail/templates?id=\${id}\`, { method: "DELETE" });
            if (!r.ok) { toast.error("Delete failed"); return; }
            toast.success("Template deleted"); await load();
          })}
        />
      )}
      {tab === "testimonials" && (
        <TestimonialsTab testimonials={testimonials}
          onNew={() => modals.openTestimonial(null)} onEdit={(t) => modals.openTestimonial(t)}
          onDelete={(id, name) => ask(\`Delete testimonial from "\${name}"?\`, async () => {
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
        <LibraryTab items={libraryItems}
          onNew={() => modals.openLibItem(null)} onEdit={(item) => modals.openLibItem(item)}
          onDelete={(id, title) => ask(\`Delete "\${title}"?\`, async () => {
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
        <UpcomingTab events={upcomingEvents}
          onNew={() => modals.openUpcoming(null)} onEdit={(ev) => modals.openUpcoming(ev)}
          onDelete={(id, title) => ask(\`Delete "\${title}"?\`, async () => {
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
      {tab === "feedback" && (
        <FeedbackTab feedbacks={feedbacks}
          onToggleResolved={async (id, val) => {
            const { error } = await db.from("feedback").update({ resolved: val }).eq("id", id);
            if (error) { toast.error("Update failed"); return; }
            await load();
          }}
          onDelete={async (id) => {
            const { error } = await db.from("feedback").delete().eq("id", id);
            if (error) { toast.error("Delete failed"); return; }
            toast.success("Deleted"); await load();
          }}
        />
      )}
      {tab === "comments" && (
        <CommentsTab comments={blogComments} posts={posts}
          onApprove={async (id) => {
            const { error } = await db.from("blog_comments").update({ approved: true }).eq("id", id);
            if (error) { toast.error("Approval failed"); return; }
            toast.success("Comment approved"); await load();
          }}
          onDelete={async (id) => {
            const { error } = await db.from("blog_comments").delete().eq("id", id);
            if (error) { toast.error("Delete failed"); return; }
            toast.success("Comment deleted"); await load();
          }}
        />
      )}
      {tab === "discipleship" && (
        <DiscipleshipTab disciples={disciples}
          onNew={() => modals.openDisciple(null)} onEdit={(d) => modals.openDisciple(d)}
          onDelete={async (id, name) => {
            setConfirm({ msg: \`Delete disciple "\${name}"? This will also remove all progress entries.\`,
              fn: async () => {
                const { error } = await db.from("disciples").delete().eq("id", id);
                if (error) { toast.error("Failed to delete disciple"); console.error(error); return; }
                toast.success("Disciple deleted successfully"); await load();
              }
            });
          }}
          onViewProgress={(d) => modals.openProgress(d)}
        />
      )}
      {tab === "event-registrations" && <EventRegistrationsTab events={upcomingEvents} db={db} />}
      {tab === "prayer-submissions" && (
        <PrayerSubmissionsTab prayers={prayerSubmissions}
          onTogglePrayed={async (id, val) => {
            const { error } = await db.from("prayer_submissions").update({ prayed_for: val }).eq("id", id);
            if (error) { toast.error("Update failed"); return; }
            await load();
          }}
          onDelete={async (id) => {
            const { error } = await db.from("prayer_submissions").delete().eq("id", id);
            if (error) { toast.error("Delete failed"); return; }
            toast.success("Deleted"); await load();
          }}
        />
      )}
      {tab === "trainings" && (
        <TrainingsTab trainings={trainings}
          onNew={() => modals.openTraining(null)} onEdit={(t) => modals.openTraining(t)}
          onDelete={(id, title) => ask(\`Delete training "\${title}"?\`, async () => {
            const { error } = await db.from("trainings").delete().eq("id", id);
            if (error) { toast.error("Delete failed"); return; }
            toast.success("Deleted"); await load();
          })}
          onToggle={async (id, val) => {
            await db.from("trainings").update({ published: val }).eq("id", id);
            toast.success(val ? "Published" : "Unpublished"); await load();
          }}
        />
      )}
      {tab === "gallery" && (
        <GalleryTab themes={galleryThemes}
          onNew={() => modals.openGallery(null)} onEdit={(t) => modals.openGallery(t)}
          onDelete={(id, title) => ask(\`Delete gallery "\${title}"?\`, async () => {
            const { error } = await db.from("gallery_themes").delete().eq("id", id);
            if (error) { toast.error("Delete failed"); return; }
            toast.success("Deleted"); await load();
          })}
          onToggle={async (id, val) => {
            await db.from("gallery_themes").update({ published: val }).eq("id", id);
            toast.success(val ? "Published" : "Unpublished"); await load();
          }}
        />
      )}
      {tab === "faith-tests" && (
        <FaithTestsTab tests={faithTests}
          onNew={() => modals.openFaithTest(null)} onEdit={(t) => modals.openFaithTest(t)}
          onDelete={(id, name) => ask(\`Delete test "\${name}"?\`, async () => {
            const { error } = await db.from("faith_tests").delete().eq("id", id);
            if (error) { toast.error("Delete failed"); return; }
            toast.success("Deleted"); await load();
          })}
          onToggle={async (id, val) => {
            await db.from("faith_tests").update({ published: val }).eq("id", id);
            toast.success(val ? "Published" : "Unpublished"); await load();
          }}
          db={db}
        />
      )}
      {tab === "participant-habits" && <HabitsTab />}
    </>
  );
}
`;

// ===================== AdminModals.tsx =====================
const adminModalsContent = `"use client";
import { SupabaseClient } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { TW } from "./constants";
import type {
  BlogPost, BlogSeries, BlogTag, EmailTemplate, Testimonial,
  LibraryItem, UpcomingEvent, Training, GalleryTheme, FaithTest, Disciple,
} from "./types";
import PostModal from "./modals/PostModal";
import BlogSeriesModal from "./modals/BlogSeriesModal";
import BlogSeriesDetailModal from "./modals/BlogSeriesDetailModal";
import BlogTagModal from "./modals/BlogTagModal";
import TplModal from "./modals/TplModal";
import TestimonialModal from "./modals/TestimonialModal";
import LibraryItemModal from "./modals/LibraryItemModal";
import UpcomingEventModal from "./modals/UpcomingEventModal";
import BlogReviewsModal from "./modals/BlogReviewsModal";
import TrainingModal from "./modals/TrainingModal";
import GalleryThemeModal from "./modals/GalleryThemeModal";
import FaithTestModal from "./modals/FaithTestModal";
import DiscipleModal from "./modals/DiscipleModal";
import DiscipleProgressModal from "./modals/DiscipleProgressModal";

interface Props {
  db: SupabaseClient; load: () => Promise<void>;
  showPost: boolean; editPost: BlogPost | null; setShowPost: (v: boolean) => void;
  showSeries: boolean; editSeries: BlogSeries | null; setShowSeries: (v: boolean) => void;
  viewSeries: BlogSeries | null; setViewSeries: (v: BlogSeries | null) => void;
  setEditPost: (v: BlogPost | null) => void;
  showTag: boolean; editTag: BlogTag | null; setShowTag: (v: boolean) => void;
  showReviews: boolean; reviewPost: BlogPost | null; setShowReviews: (v: boolean) => void;
  showTpl: boolean; editTpl: EmailTemplate | null; setShowTpl: (v: boolean) => void;
  showTestimonial: boolean; editTestimonial: Testimonial | null; setShowTestimonial: (v: boolean) => void;
  showLibItem: boolean; editLibItem: LibraryItem | null; setShowLibItem: (v: boolean) => void;
  showUpcoming: boolean; editUpcoming: UpcomingEvent | null; setShowUpcoming: (v: boolean) => void;
  showTraining: boolean; editTraining: Training | null; setShowTraining: (v: boolean) => void;
  showGallery: boolean; editGallery: GalleryTheme | null; setShowGallery: (v: boolean) => void;
  showFaithTest: boolean; editFaithTest: FaithTest | null; setShowFaithTest: (v: boolean) => void;
  showDisciple: boolean; editDisciple: Disciple | null; setShowDisciple: (v: boolean) => void;
  viewProgressDisciple: Disciple | null; setViewProgressDisciple: (v: Disciple | null) => void;
  confirm: { msg: string; fn: () => Promise<void> } | null;
  setConfirm: (v: { msg: string; fn: () => Promise<void> } | null) => void;
}

export default function AdminModals({ db, load, showPost, editPost, setShowPost, showSeries, editSeries, setShowSeries, viewSeries, setViewSeries, setEditPost, showTag, editTag, setShowTag, showReviews, reviewPost, setShowReviews, showTpl, editTpl, setShowTpl, showTestimonial, editTestimonial, setShowTestimonial, showLibItem, editLibItem, setShowLibItem, showUpcoming, editUpcoming, setShowUpcoming, showTraining, editTraining, setShowTraining, showGallery, editGallery, setShowGallery, showFaithTest, editFaithTest, setShowFaithTest, showDisciple, editDisciple, setShowDisciple, viewProgressDisciple, setViewProgressDisciple, confirm, setConfirm }: Props) {
  const onSave = async (close: () => void) => { close(); await load(); };
  return (
    <>
      {showTestimonial && <TestimonialModal testimonial={editTestimonial} onClose={() => setShowTestimonial(false)} onSave={async () => onSave(() => setShowTestimonial(false))} db={db} />}
      {showLibItem && <LibraryItemModal item={editLibItem} onClose={() => setShowLibItem(false)} onSave={async () => onSave(() => setShowLibItem(false))} db={db} />}
      {showUpcoming && <UpcomingEventModal event={editUpcoming} onClose={() => setShowUpcoming(false)} onSave={async () => onSave(() => setShowUpcoming(false))} db={db} />}
      {showPost && <PostModal post={editPost} onClose={() => setShowPost(false)} onSave={async () => onSave(() => setShowPost(false))} db={db} />}
      {showSeries && <BlogSeriesModal series={editSeries} onClose={() => setShowSeries(false)} onSave={async () => onSave(() => setShowSeries(false))} db={db} />}
      {viewSeries && (
        <BlogSeriesDetailModal series={viewSeries} onClose={() => setViewSeries(null)}
          onEditPost={(post) => { setEditPost(post); setShowPost(true); setViewSeries(null); }} db={db} />
      )}
      {showTag && <BlogTagModal tag={editTag} onClose={() => setShowTag(false)} onSave={async () => onSave(() => setShowTag(false))} db={db} />}
      {showReviews && reviewPost && <BlogReviewsModal postId={reviewPost.id} postTitle={reviewPost.title} onClose={() => setShowReviews(false)} db={db} />}
      {showTpl && <TplModal tpl={editTpl} onClose={() => setShowTpl(false)} onSave={async () => onSave(() => setShowTpl(false))} />}
      {showTraining && <TrainingModal training={editTraining} onClose={() => setShowTraining(false)} onSave={async () => onSave(() => setShowTraining(false))} db={db} />}
      {showGallery && <GalleryThemeModal theme={editGallery} onClose={() => setShowGallery(false)} onSave={async () => onSave(() => setShowGallery(false))} db={db} />}
      {showFaithTest && <FaithTestModal test={editFaithTest} onClose={() => setShowFaithTest(false)} onSave={async () => onSave(() => setShowFaithTest(false))} db={db} />}
      {showDisciple && <DiscipleModal disciple={editDisciple} onClose={() => setShowDisciple(false)} onSave={async () => onSave(() => setShowDisciple(false))} db={db} />}
      {viewProgressDisciple && <DiscipleProgressModal disciple={viewProgressDisciple} onClose={() => setViewProgressDisciple(null)} db={db} />}
      {confirm && (
        <div className={TW.overlay} onClick={() => setConfirm(null)}>
          <div className="bg-[#0d0e15] border border-white/10 rounded-lg p-8 w-[min(440px,92vw)] shadow-[0_28px_60px_rgba(0,0,0,.6)]" onClick={e => e.stopPropagation()}>
            <p className="font-poppins text-lg font-medium text-[#eef0f5] mb-6 leading-relaxed">{confirm.msg}</p>
            <div className="flex gap-2.5 justify-end">
              <button className={cn(TW.btn, TW.ghost)} onClick={() => setConfirm(null)}>Cancel</button>
              <button className={cn(TW.btn, TW.danger)} onClick={async () => { await confirm.fn(); setConfirm(null); }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
`;

// ===================== New page.tsx =====================
const newPageContent = `"use client";
export const dynamic = "force-dynamic";

import { cn } from "@/lib/utils";
import { adminThemeCss } from "./components/adminThemeCss";
import { useAdminPage } from "./components/useAdminPage";
import AdminSidebar from "./components/AdminSidebar";
import AdminTopbar from "./components/AdminTopbar";
import AdminTabContent from "./components/AdminTabContent";
import AdminModals from "./components/AdminModals";

export default function AdminPage() {
  const state = useAdminPage();

  return (
    <div className={cn("adm-root h-screen overflow-hidden flex font-poppins", state.theme === "light" ? "adm-light" : "adm-dark")}>
      <style>{adminThemeCss}</style>

      <AdminSidebar
        tab={state.tab} navOpen={state.navOpen} setNavOpen={state.setNavOpen}
        unreadMsgs={state.unreadMsgs} unreadInbox={state.unreadInbox}
        unreadFeedback={state.unreadFeedback} unprayedSubmissions={state.unprayedSubmissions}
        unapprovedComments={state.unapprovedComments}
        onGo={state.go} onLogout={state.handleLogout}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopbar
          searchQuery={state.searchQuery} setSearchQuery={state.setSearchQuery}
          searchOpen={state.searchOpen} setSearchOpen={state.setSearchOpen}
          notifOpen={state.notifOpen} setNotifOpen={state.setNotifOpen}
          notifications={state.notifications} unreadNotifCount={state.unreadNotifCount}
          markAllNotificationsRead={state.markAllNotificationsRead}
          theme={state.theme} setTheme={state.setTheme}
          adminEmail={state.adminEmail} onGo={state.go}
        />

        <main className="adm-main flex-1 overflow-y-auto px-4 pb-8 md:px-12 md:pb-10">
          {state.loading ? (
            <div className="flex gap-2.5 justify-center py-[140px]">
              {[0, 200, 400].map((delay) => (
                <div key={delay} className="w-2 h-2 bg-[#d4a843] rounded-full animate-[adm-pulse_1.2s_ease-in-out_infinite]" style={{ animationDelay: \`\${delay}ms\` }} />
              ))}
            </div>
          ) : (
            <AdminTabContent
              tab={state.tab} db={state.db} load={state.load}
              ask={state.ask} modals={state.modals} setConfirm={state.setConfirm}
              onNav={state.go} mailSub={state.mailSub} setMailSub={state.setMailSub}
              posts={state.posts} blogSeries={state.blogSeries} blogTags={state.blogTags}
              subs={state.subs} msgs={state.msgs} logs={state.logs}
              inbox={state.inbox} templates={state.templates} analytics={state.analytics}
              testimonials={state.testimonials} libraryItems={state.libraryItems}
              upcomingEvents={state.upcomingEvents} feedbacks={state.feedbacks}
              blogComments={state.blogComments} trainings={state.trainings}
              galleryThemes={state.galleryThemes} eventRegistrations={state.eventRegistrations}
              prayerSubmissions={state.prayerSubmissions} discipleshipContent={state.discipleshipContent}
              disciples={state.disciples} faithTests={state.faithTests} users={state.users}
            />
          )}
        </main>
      </div>

      <AdminModals
        db={state.db} load={state.load}
        showPost={state.showPost} editPost={state.editPost} setShowPost={state.setShowPost}
        showSeries={state.showSeries} editSeries={state.editSeries} setShowSeries={state.setShowSeries}
        viewSeries={state.viewSeries} setViewSeries={state.setViewSeries} setEditPost={state.setEditPost}
        showTag={state.showTag} editTag={state.editTag} setShowTag={state.setShowTag}
        showReviews={state.showReviews} reviewPost={state.reviewPost} setShowReviews={state.setShowReviews}
        showTpl={state.showTpl} editTpl={state.editTpl} setShowTpl={state.setShowTpl}
        showTestimonial={state.showTestimonial} editTestimonial={state.editTestimonial} setShowTestimonial={state.setShowTestimonial}
        showLibItem={state.showLibItem} editLibItem={state.editLibItem} setShowLibItem={state.setShowLibItem}
        showUpcoming={state.showUpcoming} editUpcoming={state.editUpcoming} setShowUpcoming={state.setShowUpcoming}
        showTraining={state.showTraining} editTraining={state.editTraining} setShowTraining={state.setShowTraining}
        showGallery={state.showGallery} editGallery={state.editGallery} setShowGallery={state.setShowGallery}
        showFaithTest={state.showFaithTest} editFaithTest={state.editFaithTest} setShowFaithTest={state.setShowFaithTest}
        showDisciple={state.showDisciple} editDisciple={state.editDisciple} setShowDisciple={state.setShowDisciple}
        viewProgressDisciple={state.viewProgressDisciple} setViewProgressDisciple={state.setViewProgressDisciple}
        confirm={state.confirm} setConfirm={state.setConfirm}
      />
    </div>
  );
}
`;

// Write all files
const dir = "app/admin/components";
fs.writeFileSync(`${dir}/useAdminPage.ts`, useAdminPageContent);
console.log("✓ useAdminPage.ts:", useAdminPageContent.split("\n").length, "lines");

fs.writeFileSync(`${dir}/AdminSidebar.tsx`, adminSidebarContent);
console.log("✓ AdminSidebar.tsx:", adminSidebarContent.split("\n").length, "lines");

fs.writeFileSync(`${dir}/AdminTopbar.tsx`, adminTopbarContent);
console.log("✓ AdminTopbar.tsx:", adminTopbarContent.split("\n").length, "lines");

fs.writeFileSync(`${dir}/AdminTabContent.tsx`, adminTabContentContent);
console.log("✓ AdminTabContent.tsx:", adminTabContentContent.split("\n").length, "lines");

fs.writeFileSync(`${dir}/AdminModals.tsx`, adminModalsContent);
console.log("✓ AdminModals.tsx:", adminModalsContent.split("\n").length, "lines");

fs.writeFileSync("app/admin/page.tsx", newPageContent);
console.log("✓ page.tsx:", newPageContent.split("\n").length, "lines");
