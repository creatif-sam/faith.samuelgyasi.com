"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Globe, LogOut, Menu } from "lucide-react";

// Import types
import type {
  BlogPost,
  BlogSeries,
  BlogTag,
  Subscriber,
  Message,
  EmailLog,
  InboundEmail,
  EmailTemplate,
  AnalyticsData,
  Testimonial,
  LibraryItem,
  UpcomingEvent,
  Feedback,
  MyStoryContent,
  Training,
  GalleryTheme,
  EventRegistration,
  PrayerSubmission,
  DiscipleshipContent,
  Disciple,
  DiscipleProgress,
  FaithTest,
  FaithTestQuestion,
  Tab,
  MailSubTab,
  PageViewRow,
} from "./components/types";

// Import constants
import { NAV_SORTED, TW } from "./components/constants";

// Import tab components
import OverviewTab from "./components/tabs/OverviewTab";
import AnalyticsTab from "./components/tabs/AnalyticsTab";
import PostsTab from "./components/tabs/PostsTab";
import BlogSeriesTab from "./components/tabs/BlogSeriesTab";
import BlogTagsTab from "./components/tabs/BlogTagsTab";
import SubsTab from "./components/tabs/SubsTab";
import MsgsTab from "./components/tabs/MsgsTab";
import MailTab from "./components/tabs/MailTab";
import TestimonialsTab from "./components/tabs/TestimonialsTab";
import LibraryTab from "./components/tabs/LibraryTab";
import UpcomingTab from "./components/tabs/UpcomingTab";
import EventRegistrationsTab from "./components/tabs/EventRegistrationsTab";
import FeedbackTab from "./components/tabs/FeedbackTab";
import MyStoryEditorTab from "./components/tabs/MyStoryEditorTab";
import DiscipleshipTab from "./components/tabs/DiscipleshipTab";
import PrayerSubmissionsTab from "./components/tabs/PrayerSubmissionsTab";
import TrainingsTab from "./components/tabs/TrainingsTab";
import GalleryTab from "./components/tabs/GalleryTab";
import FaithTestsTab from "./components/tabs/FaithTestsTab";

// Import modal components
import PostModal from "./components/modals/PostModal";
import BlogSeriesModal from "./components/modals/BlogSeriesModal";
import BlogTagModal from "./components/modals/BlogTagModal";
import TplModal from "./components/modals/TplModal";
import TestimonialModal from "./components/modals/TestimonialModal";
import LibraryItemModal from "./components/modals/LibraryItemModal";
import UpcomingEventModal from "./components/modals/UpcomingEventModal";
import BlogReviewsModal from "./components/modals/BlogReviewsModal";
import TrainingModal from "./components/modals/TrainingModal";
import GalleryThemeModal from "./components/modals/GalleryThemeModal";
import FaithTestModal from "./components/modals/FaithTestModal";
import DiscipleModal from "./components/modals/DiscipleModal";
import DiscipleProgressModal from "./components/modals/DiscipleProgressModal";

export default function AdminPage() {
  //State management
  const [tab, setTab] = useState<Tab>("overview");
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
  const [myStory, setMyStory] = useState<MyStoryContent | null>(null);
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
  const [showFaithTest, setShowFaithTest] = useState(false);
  const [editFaithTest, setEditFaithTest] = useState<FaithTest | null>(null);
  const [confirm, setConfirm] = useState<{ msg: string; fn: () => Promise<void> } | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  
  const router = useRouter();
  const db = createClient();

  // Handlers
  const handleLogout = async () => {
    await db.auth.signOut();
    router.push("/auth/login");
  };

  const load = useCallback(async () => {
    const { data: { session } } = await db.auth.getSession();
    if (!session) {
      router.push("/auth/login");
      return;
    }
    setLoading(true);
    
    const [pR, serR, tagR, sR, mR, lR, iR, tR, aR, tsR, libR, upR, fbR, msR, trnR, galR, evRegR, prayR, discR, ftR, discipR] = await Promise.all([
      db.from("blog_posts").select("*").order("created_at", { ascending: false }),
      db.from("blog_series").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
      db.from("blog_tags").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
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
      db.from("feedback").select("*").order("created_at", { ascending: false }),
      db.from("my_story").select("*").single(),
      db.from("trainings").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
      db.from("gallery_themes").select("*, photos:gallery_photos(*)").order("sort_order", { ascending: true }),
      db.from("event_registrations").select("*").order("registered_at", { ascending: false }),
      db.from("prayer_submissions").select("*").order("created_at", { ascending: false }),
      db.from("discipleship_content").select("*").single(),
      db.from("faith_tests").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
      db.from("disciples").select("*").order("started_at", { ascending: false }),
    ]);

    setPosts(pR.data ?? []);
    setBlogSeries((serR.data as BlogSeries[]) ?? []);
    setBlogTags((tagR.data as BlogTag[]) ?? []);
    setSubs(sR.data ?? []);
    setMsgs(mR.data ?? []);
    setLogs(lR.data ?? []);
    setInbox(iR.data ?? []);
    setTemplates(tR.data ?? []);
    setTestimonials(tsR.data ?? []);
    setLibraryItems(libR.data ?? []);
    setUpcomingEvents(upR.data ?? []);
    setFeedbacks(fbR.data ?? []);
    setMyStory(msR.data ?? null);
    setTrainings((trnR.data as Training[]) ?? []);
    setGalleryThemes((galR.data as GalleryTheme[]) ?? []);
    setEventRegistrations((evRegR.data as EventRegistration[]) ?? []);
    setPrayerSubmissions((prayR.data as PrayerSubmission[]) ?? []);
    setDiscipleshipContent(discR.data ?? null);
    setFaithTests((ftR.data as FaithTest[]) ?? []);
    setDisciples((discipR.data as Disciple[]) ?? []);

    // Calculate analytics
    const views: PageViewRow[] = aR.data ?? [];
    const totalViews = views.length;
    const uniqueVisitors = new Set(views.map((v) => v.visitor_id)).size;
    const pc = views.reduce((a, v) => { 
      a[v.page_path] = (a[v.page_path] ?? 0) + 1; 
      return a; 
    }, {} as Record<string, number>);
    const topPages = Object.entries(pc)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));
    
    const dailyViews: { date: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const str = d.toISOString().slice(0, 10);
      dailyViews.push({ 
        date: str, 
        count: views.filter((v) => v.created_at.slice(0, 10) === str).length 
      });
    }
    
    setAnalytics({ totalViews, uniqueVisitors, topPages, dailyViews });
    setLoading(false);
  }, [db, router]);

  useEffect(() => { load(); }, [load]);

  const unreadMsgs = msgs.filter((m) => !m.read).length;
  const unreadInbox = inbox.filter((e) => !e.read).length;
  const unreadFeedback = feedbacks.filter((f) => !f.resolved).length;
  const unprayedSubmissions = prayerSubmissions.filter((p) => !p.prayed_for).length;

  function ask(msg: string, fn: () => Promise<void>) { 
    setConfirm({ msg, fn }); 
  }
  
  function go(t: Tab) { 
    setTab(t); 
    setNavOpen(false); 
  }

  return (
    <div className="min-h-screen flex bg-[#07080c] text-[#eef0f5] font-poppins">
      {/* Mobile header */}
      <div className="flex md:hidden fixed top-0 left-0 right-0 z-[600] bg-[#0b0c12] border-b border-white/[.06] px-5 py-3.5 items-center justify-between shadow-[0_2px_20px_rgba(0,0,0,.4)]">
        <button
          className="bg-white/[.06] border border-white/[.09] rounded-lg text-white/60 cursor-pointer flex items-center justify-center p-1.5 transition-all hover:bg-white/10"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Menu"
        >
          <Menu size={18} />
        </button>
        <span className="font-poppins text-[14px] font-semibold text-[#f0ece4] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#d4a843] to-[#c49838] flex items-center justify-center text-[9px] font-bold text-[#09090d]">SG</span>
          Samuel Gyasi
        </span>
        <Link href="/" className="text-white/30 hover:text-white/60 transition-colors leading-none">
          <Globe size={16} />
        </Link>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "w-[260px] flex-shrink-0 bg-[#0b0c12] border-r border-white/[.055]",
        "fixed md:sticky top-0 h-screen flex flex-col z-[500]",
        "shadow-[1px_0_0_0_rgba(255,255,255,.04),10px_0_50px_rgba(0,0,0,.5)]",
        "transition-transform duration-300 -translate-x-full md:translate-x-0",
        navOpen && "translate-x-0"
      )}>
        {/* Brand */}
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

        {/* Navigation */}
        <nav className="px-3 pt-3 flex-1 overflow-y-auto">
          {NAV_SORTED.map(({ id, label, Icon }) => {
            const badge = id === "messages" && unreadMsgs > 0 ? unreadMsgs
              : id === "mail" && unreadInbox > 0 ? unreadInbox
              : id === "feedback" && unreadFeedback > 0 ? unreadFeedback
              : id === "prayer-submissions" && unprayedSubmissions > 0 ? unprayedSubmissions
              : null;
            const isActive = tab === id;
            
            return (
              <button
                key={id}
                onClick={() => go(id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5",
                  "font-poppins text-[13px] font-medium",
                  "cursor-pointer border-0 w-full text-left transition-all duration-200 rounded-lg relative mb-1",
                  isActive
                    ? "text-[#d4a843] bg-[rgba(212,168,67,.12)]"
                    : "text-white/[.42] bg-transparent hover:text-white/[.80] hover:bg-white/[.05]"
                )}
              >
                <Icon size={15} />
                <span className="flex-1">{label}</span>
                {badge !== null && (
                  <span className="bg-gradient-to-br from-[#d4a843] to-[#f0cc7a] text-[#07080c] font-poppins text-[9px] font-bold px-2 py-0.5 rounded-full leading-tight ml-auto">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 pb-5 pt-3 mt-auto border-t border-white/[.06] flex flex-col gap-2">
          <Link 
            href="/" 
            className="font-poppins text-[11px] font-medium text-white/30 no-underline flex items-center gap-2 hover:text-white/60 transition-colors py-1.5"
          >
            <Globe size={13} /> Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="font-poppins text-[11px] font-medium text-white/40 bg-transparent border border-white/[.1] px-3 py-2.5 cursor-pointer flex items-center gap-2 w-full rounded-lg transition-all hover:border-[rgba(201,168,76,.4)] hover:text-[#c9a84c]"
          >
            <LogOut size={13} /> Log Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {navOpen && (
        <div 
          className="fixed inset-0 bg-black/65 backdrop-blur z-[490] md:hidden" 
          onClick={() => setNavOpen(false)} 
        />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto px-4 pt-20 pb-8 md:px-12 md:py-10 bg-[#07080c]">
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
            {tab === "overview" && (
              <OverviewTab 
                posts={posts} 
                subs={subs} 
                msgs={msgs} 
                logs={logs} 
                analytics={analytics} 
                onNav={go} 
              />
            )}
            
            {tab === "analytics" && <AnalyticsTab analytics={analytics} />}
            
            {tab === "posts" && (
              <PostsTab
                posts={posts}
                onNew={() => { setEditPost(null); setShowPost(true); }}
                onEdit={(p) => { setEditPost(p); setShowPost(true); }}
                onDelete={(id, title) => ask(`Delete "${title}"?`, async () => {
                  const { error } = await db.from("blog_posts").delete().eq("id", id);
                  if (error) { toast.error("Delete failed"); return; }
                  toast.success("Post deleted"); 
                  await load();
                })}
                onToggle={async (id, val) => {
                  const { error } = await db.from("blog_posts").update({ published: val }).eq("id", id);
                  if (error) { toast.error("Update failed"); return; }
                  toast.success(val ? "Published" : "Unpublished"); 
                  await load();
                }}
                onViewReviews={(p) => { setReviewPost(p); setShowReviews(true); }}
              />
            )}
            
            {tab === "series" && (
              <BlogSeriesTab
                series={blogSeries}
                onNew={() => { setEditSeries(null); setShowSeries(true); }}
                onEdit={(s) => { setEditSeries(s); setShowSeries(true); }}
                onDelete={(id, name) => ask(`Delete series "${name}"?`, async () => {
                  const { error } = await db.from("blog_series").delete().eq("id", id);
                  if (error) { toast.error("Delete failed"); return; }
                  toast.success("Series deleted"); 
                  await load();
                })}
                onToggle={async (id, val) => {
                  const { error } = await db.from("blog_series").update({ published: val }).eq("id", id);
                  if (error) { toast.error("Update failed"); return; }
                  toast.success(val ? "Published" : "Unpublished"); 
                  await load();
                }}
              />
            )}
            
            {tab === "tags" && (
              <BlogTagsTab
                tags={blogTags}
                onNew={() => { setEditTag(null); setShowTag(true); }}
                onEdit={(t) => { setEditTag(t); setShowTag(true); }}
                onDelete={async (id) => {
                  const { error } = await db.from("blog_tags").delete().eq("id", id);
                  if (error) { toast.error("Delete failed"); return; }
                  toast.success("Tag deleted"); 
                  await load();
                }}
                onToggle={async (id, field, val) => {
                  const { error } = await db.from("blog_tags").update({ [field]: !val }).eq("id", id);
                  if (error) { toast.error("Update failed"); return; }
                  toast.success("Tag updated"); 
                  await load();
                }}
              />
            )}
            
            {tab === "subscribers" && (
              <SubsTab
                subs={subs}
                onDelete={(id, email) => ask(`Remove ${email}?`, async () => {
                  const { error } = await db.from("newsletter_subscribers").delete().eq("id", id);
                  if (error) { toast.error("Remove failed"); return; }
                  toast.success("Removed"); 
                  await load();
                })}
              />
            )}
            
            {tab === "messages" && (
              <MsgsTab
                msgs={msgs}
                templates={templates}
                onRead={async (id) => { 
                  await db.from("contact_messages").update({ read: true }).eq("id", id); 
                  await load(); 
                }}
              />
            )}
            
            {tab === "mail" && (
              <MailTab
                sub={mailSub}
                setSub={setMailSub}
                logs={logs}
                inbox={inbox}
                templates={templates}
                onReload={load}
                db={db}
                onEditTpl={(t) => { setEditTpl(t); setShowTpl(true); }}
                onNewTpl={() => { setEditTpl(null); setShowTpl(true); }}
                onDeleteTpl={(id, name) => ask(`Delete template "${name}"?`, async () => {
                  const r = await fetch(`/api/mail/templates?id=${id}`, { method: "DELETE" });
                  if (!r.ok) { toast.error("Delete failed"); return; }
                  toast.success("Template deleted"); 
                  await load();
                })}
              />
            )}
            
            {tab === "testimonials" && (
              <TestimonialsTab
                testimonials={testimonials}
                onNew={() => { setEditTestimonial(null); setShowTestimonial(true); }}
                onEdit={(t) => { setEditTestimonial(t); setShowTestimonial(true); }}
                onDelete={(id, name) => ask(`Delete testimonial from "${name}"?`, async () => {
                  const { error } = await db.from("testimonials").delete().eq("id", id);
                  if (error) { toast.error("Delete failed"); return; }
                  toast.success("Deleted"); 
                  await load();
                })}
                onToggle={async (id, val) => {
                  const { error } = await db.from("testimonials").update({ published: val }).eq("id", id);
                  if (error) { toast.error("Update failed"); return; }
                  toast.success(val ? "Published" : "Unpublished"); 
                  await load();
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
                  toast.success("Deleted"); 
                  await load();
                })}
                onToggle={async (id, val) => {
                  const { error } = await db.from("library_items").update({ published: val }).eq("id", id);
                  if (error) { toast.error("Update failed"); return; }
                  toast.success(val ? "Published" : "Unpublished"); 
                  await load();
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
                  toast.success("Deleted"); 
                  await load();
                })}
                onToggle={async (id, val) => {
                  const { error } = await db.from("upcoming_events").update({ published: val }).eq("id", id);
                  if (error) { toast.error("Update failed"); return; }
                  toast.success(val ? "Published" : "Unpublished"); 
                  await load();
                }}
              />
            )}
            
            {tab === "feedback" && (
              <FeedbackTab
                feedbacks={feedbacks}
                onToggleResolved={async (id, val) => {
                  const { error } = await db.from("feedback").update({ resolved: val }).eq("id", id);
                  if (error) { toast.error("Update failed"); return; }
                  await load();
                }}
                onDelete={(id) => ask("Delete this feedback?", async () => {
                  const { error } = await db.from("feedback").delete().eq("id", id);
                  if (error) { toast.error("Delete failed"); return; }
                  toast.success("Deleted"); 
                  await load();
                })}
              />
            )}
            
            {tab === "my-story" && (
              <MyStoryEditorTab
                story={myStory}
                onSave={async () => { await load(); }}
                db={db}
              />
            )}
            
            {tab === "discipleship" && (
              <DiscipleshipTab
                disciples={disciples}
                onNew={() => { setEditDisciple(null); setShowDisciple(true); }}
                onEdit={(d) => { setEditDisciple(d); setShowDisciple(true); }}
                onDelete={async (id, name) => {
                  setConfirm({
                    msg: `Delete disciple "${name}"? This will also remove all progress entries.`,
                    fn: async () => {
                      const { error } = await db.from("disciples").delete().eq("id", id);
                      if (error) { 
                        toast.error("Failed to delete disciple");
                        console.error(error);
                        return;
                      }
                      toast.success("Disciple deleted successfully");
                      await load();
                    }
                  });
                }}
                onViewProgress={(d) => setViewProgressDisciple(d)}
              />
            )}

            {tab === "event-registrations" && (
              <EventRegistrationsTab
                events={upcomingEvents}
                db={db}
              />
            )}

            {tab === "prayer-submissions" && (
              <PrayerSubmissionsTab
                prayers={prayerSubmissions}
                onTogglePrayed={async (id, val) => {
                  const { error } = await db.from("prayer_submissions").update({ prayed_for: val }).eq("id", id);
                  if (error) { toast.error("Update failed"); return; }
                  await load();
                }}
                onDelete={(id) => ask("Delete this prayer submission?", async () => {
                  const { error } = await db.from("prayer_submissions").delete().eq("id", id);
                  if (error) { toast.error("Delete failed"); return; }
                  toast.success("Deleted"); 
                  await load();
                })}
              />
            )}

            {tab === "trainings" && (
              <TrainingsTab
                trainings={trainings}
                onNew={() => { setEditTraining(null); setShowTraining(true); }}
                onEdit={(t) => { setEditTraining(t); setShowTraining(true); }}
                onDelete={(id, title) => ask(`Delete training "${title}"?`, async () => {
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
              <GalleryTab
                themes={galleryThemes}
                onNew={() => { setEditGallery(null); setShowGallery(true); }}
                onEdit={(t) => { setEditGallery(t); setShowGallery(true); }}
                onDelete={(id, title) => ask(`Delete gallery "${title}"?`, async () => {
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
              <FaithTestsTab
                tests={faithTests}
                onNew={() => { setEditFaithTest(null); setShowFaithTest(true); }}
                onEdit={(t) => { setEditFaithTest(t); setShowFaithTest(true); }}
                onDelete={(id, name) => ask(`Delete test "${name}"?`, async () => {
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
          </>
        )}
      </main>

      {/* Modals */}
      {showTestimonial && (
        <TestimonialModal
          testimonial={editTestimonial}
          onClose={() => setShowTestimonial(false)}
          onSave={async () => { 
            setShowTestimonial(false); 
            await load(); 
          }}
          db={db}
        />
      )}
      
      {showLibItem && (
        <LibraryItemModal
          item={editLibItem}
          onClose={() => setShowLibItem(false)}
          onSave={async () => { 
            setShowLibItem(false); 
            await load(); 
          }}
          db={db}
        />
      )}
      
      {showUpcoming && (
        <UpcomingEventModal
          event={editUpcoming}
          onClose={() => setShowUpcoming(false)}
          onSave={async () => { 
            setShowUpcoming(false); 
            await load(); 
          }}
          db={db}
        />
      )}
      
      {showPost && (
        <PostModal
          post={editPost}
          onClose={() => setShowPost(false)}
          onSave={async () => { 
            setShowPost(false); 
            await load(); 
          }}
          db={db}
        />
      )}
      
      {showSeries && (
        <BlogSeriesModal
          series={editSeries}
          onClose={() => setShowSeries(false)}
          onSave={async () => { 
            setShowSeries(false); 
            await load(); 
          }}
          db={db}
        />
      )}
      
      {showTag && (
        <BlogTagModal
          tag={editTag}
          onClose={() => setShowTag(false)}
          onSave={async () => { 
            setShowTag(false); 
            await load(); 
          }}
          db={db}
        />
      )}
      
      {showReviews && reviewPost && (
        <BlogReviewsModal
          postId={reviewPost.id}
          postTitle={reviewPost.title}
          onClose={() => setShowReviews(false)}
          db={db}
        />
      )}
      
      {showTpl && (
        <TplModal
          tpl={editTpl}
          onClose={() => setShowTpl(false)}
          onSave={async () => { 
            setShowTpl(false); 
            await load(); 
          }}
        />
      )}

      {showTraining && (
        <TrainingModal
          training={editTraining}
          onClose={() => setShowTraining(false)}
          onSave={async () => { setShowTraining(false); await load(); }}
          db={db}
        />
      )}

      {showGallery && (
        <GalleryThemeModal
          theme={editGallery}
          onClose={() => setShowGallery(false)}
          onSave={async () => { setShowGallery(false); await load(); }}
          db={db}
        />
      )}

      {showFaithTest && (
        <FaithTestModal
          test={editFaithTest}
          onClose={() => setShowFaithTest(false)}
          onSave={async () => { setShowFaithTest(false); await load(); }}
          db={db}
        />
      )}

      {showDisciple && (
        <DiscipleModal
          disciple={editDisciple}
          onClose={() => setShowDisciple(false)}
          onSave={async () => {
            setShowDisciple(false);
            await load();
          }}
          db={db}
        />
      )}

      {viewProgressDisciple && (
        <DiscipleProgressModal
          disciple={viewProgressDisciple}
          onClose={() => setViewProgressDisciple(null)}
          db={db}
        />
      )}

      {/* Confirmation Dialog */}
      {confirm && (
        <div className={TW.overlay} onClick={() => setConfirm(null)}>
          <div 
            className="bg-[#0d0e15] border border-white/10 rounded-lg p-8 w-[min(440px,92vw)] shadow-[0_28px_60px_rgba(0,0,0,.6)]" 
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-poppins text-lg font-medium text-[#eef0f5] mb-6 leading-relaxed">
              {confirm.msg}
            </p>
            <div className="flex gap-2.5 justify-end">
              <button 
                className={cn(TW.btn, TW.ghost)} 
                onClick={() => setConfirm(null)}
              >
                Cancel
              </button>
              <button 
                className={cn(TW.btn, TW.danger)} 
                onClick={async () => { 
                  await confirm.fn(); 
                  setConfirm(null); 
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

