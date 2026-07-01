"use client";
import { SupabaseClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import type {
  BlogPost, BlogSeries, BlogTag, Subscriber, Message, EmailLog,
  InboundEmail, EmailTemplate, EmailCampaign, AnalyticsData, Testimonial, LibraryItem,
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
  inbox: InboundEmail[]; templates: EmailTemplate[]; campaigns: EmailCampaign[]; analytics: AnalyticsData | null;
  testimonials: Testimonial[]; libraryItems: LibraryItem[];
  upcomingEvents: UpcomingEvent[]; feedbacks: Feedback[]; blogComments: BlogComment[];
  trainings: Training[]; galleryThemes: GalleryTheme[];
  eventRegistrations: EventRegistration[]; prayerSubmissions: PrayerSubmission[];
  discipleshipContent: DiscipleshipContent | null; disciples: Disciple[];
  faithTests: FaithTest[]; users: AuthUserRow[];
}

export default function AdminTabContent({ tab, db, load, ask, modals, setConfirm, onNav, mailSub, setMailSub, posts, blogSeries, blogTags, subs, msgs, logs, inbox, templates, campaigns, analytics, testimonials, libraryItems, upcomingEvents, feedbacks, blogComments, trainings, galleryThemes, eventRegistrations, prayerSubmissions, discipleshipContent, disciples, faithTests, users }: Props) {
  return (
    <>
      {tab === "overview" && <OverviewTab posts={posts} subs={subs} msgs={msgs} logs={logs} analytics={analytics} onNav={onNav} />}
      {tab === "analytics" && <AnalyticsTab analytics={analytics} />}
      {tab === "users" && <UsersTab users={users} />}
      {tab === "logs" && <LogsTab logs={logs} />}
      {tab === "posts" && (
        <PostsTab posts={posts}
          onNew={() => modals.openPost(null)} onEdit={(p) => modals.openPost(p)}
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
          onViewReviews={(p) => modals.openReviews(p)}
        />
      )}
      {tab === "series" && (
        <BlogSeriesTab series={blogSeries}
          onNew={() => modals.openSeries(null)} onEdit={(s) => modals.openSeries(s)}
          onView={(s) => modals.openViewSeries(s)}
          onDelete={(id, name) => ask(`Delete series "${name}"?`, async () => {
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
          onDelete={(id, email) => ask(`Remove ${email}?`, async () => {
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
        <MailTab sub={mailSub} setSub={setMailSub} logs={logs} inbox={inbox} templates={templates} campaigns={campaigns} onReload={load} db={db}
          onEditTpl={(t) => modals.openTpl(t)} onNewTpl={() => modals.openTpl(null)}
          onDeleteTpl={(id, name) => ask(`Delete template "${name}"?`, async () => {
            const r = await fetch(`/api/mail/templates?id=${id}`, { method: "DELETE" });
            if (!r.ok) { toast.error("Delete failed"); return; }
            toast.success("Template deleted"); await load();
          })}
          onNewCampaign={() => modals.openCampaign(null)} onEditCampaign={(c) => modals.openCampaign(c)}
          onDeleteCampaign={(id, subject) => ask(`Delete campaign "${subject}"?`, async () => {
            const r = await fetch(`/api/mail/campaigns?id=${id}`, { method: "DELETE" });
            if (!r.ok) { toast.error("Delete failed"); return; }
            toast.success("Campaign deleted"); await load();
          })}
        />
      )}
      {tab === "testimonials" && (
        <TestimonialsTab testimonials={testimonials}
          onNew={() => modals.openTestimonial(null)} onEdit={(t) => modals.openTestimonial(t)}
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
        <LibraryTab items={libraryItems}
          onNew={() => modals.openLibItem(null)} onEdit={(item) => modals.openLibItem(item)}
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
        <UpcomingTab events={upcomingEvents}
          onNew={() => modals.openUpcoming(null)} onEdit={(ev) => modals.openUpcoming(ev)}
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
            setConfirm({ msg: `Delete disciple "${name}"? This will also remove all progress entries.`,
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
        <GalleryTab themes={galleryThemes}
          onNew={() => modals.openGallery(null)} onEdit={(t) => modals.openGallery(t)}
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
        <FaithTestsTab tests={faithTests}
          onNew={() => modals.openFaithTest(null)} onEdit={(t) => modals.openFaithTest(t)}
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
      {tab === "participant-habits" && <HabitsTab />}
    </>
  );
}
