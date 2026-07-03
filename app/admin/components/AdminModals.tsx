"use client";
import { SupabaseClient } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { TW } from "./constants";
import type {
  BlogPost, BlogSeries, BlogTag, EmailTemplate, EmailCampaign, Subscriber, Testimonial,
  LibraryItem, UpcomingEvent, Training, GalleryTheme, FaithTest, Disciple,
} from "./types";
import PostModal from "./modals/PostModal";
import BlogSeriesModal from "./modals/BlogSeriesModal";
import BlogSeriesDetailModal from "./modals/BlogSeriesDetailModal";
import BlogTagModal from "./modals/BlogTagModal";
import TplModal from "./modals/TplModal";
import CampaignModal from "./modals/CampaignModal";
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
  showCampaign: boolean; editCampaign: EmailCampaign | null; setShowCampaign: (v: boolean) => void;
  templates: EmailTemplate[]; subs: Subscriber[];
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

export default function AdminModals({ db, load, showPost, editPost, setShowPost, showSeries, editSeries, setShowSeries, viewSeries, setViewSeries, setEditPost, showTag, editTag, setShowTag, showReviews, reviewPost, setShowReviews, showTpl, editTpl, setShowTpl, showCampaign, editCampaign, setShowCampaign, templates, subs, showTestimonial, editTestimonial, setShowTestimonial, showLibItem, editLibItem, setShowLibItem, showUpcoming, editUpcoming, setShowUpcoming, showTraining, editTraining, setShowTraining, showGallery, editGallery, setShowGallery, showFaithTest, editFaithTest, setShowFaithTest, showDisciple, editDisciple, setShowDisciple, viewProgressDisciple, setViewProgressDisciple, confirm, setConfirm }: Props) {
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
      {showCampaign && <CampaignModal campaign={editCampaign} templates={templates} subs={subs} onClose={() => setShowCampaign(false)} onSave={async () => onSave(() => setShowCampaign(false))} />}
      {showTraining && <TrainingModal training={editTraining} onClose={() => setShowTraining(false)} onSave={async () => onSave(() => setShowTraining(false))} db={db} />}
      {showGallery && <GalleryThemeModal theme={editGallery} onClose={() => setShowGallery(false)} onSave={async () => onSave(() => setShowGallery(false))} db={db} />}
      {showFaithTest && <FaithTestModal test={editFaithTest} onClose={() => setShowFaithTest(false)} onSave={async () => onSave(() => setShowFaithTest(false))} db={db} />}
      {showDisciple && <DiscipleModal disciple={editDisciple} onClose={() => setShowDisciple(false)} onSave={async () => onSave(() => setShowDisciple(false))} db={db} />}
      {viewProgressDisciple && <DiscipleProgressModal disciple={viewProgressDisciple} onClose={() => setViewProgressDisciple(null)} db={db} load={load} />}
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
