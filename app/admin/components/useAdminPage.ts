"use client";
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
    db, load, unreadMsgs, unreadInbox, unreadFeedback,
    unprayedSubmissions, unapprovedComments, unreadNotifCount,
    markAllNotificationsRead, ask, go, handleLogout, modals,
  };
}
