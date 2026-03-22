"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Breadcrumbs from "@/components/atoms/Breadcrumbs";
import { BibleEnhancedContent } from "@/components/BibleEnhancedContent";

type DbPost = {
  id: string;
  title: string;
  title_fr?: string | null;
  slug: string;
  category: string;
  excerpt: string | null;
  excerpt_fr?: string | null;
  content: string | null;
  content_fr?: string | null;
  read_time_minutes: number;
  featured_image_url: string | null;
  infographie_url: string | null;
  created_at: string;
};

type RelatedPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  read_time_minutes: number;
  created_at: string;
};

export function ArticleClient({
  post,
  related,
}: {
  post: DbPost;
  related: RelatedPost[];
}) {
  const { lang } = useLang();
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [pragmatic, setPragmatic] = useState(false);
  const [faithBuilding, setFaithBuilding] = useState(false);
  const [clear, setClear] = useState(false);
  const [confusing, setConfusing] = useState(false);
  const [relatedToMe, setRelatedToMe] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Get language-aware content
  const title = lang === "fr" && post.title_fr ? post.title_fr : post.title;
  const excerpt = lang === "fr" && post.excerpt_fr ? post.excerpt_fr : post.excerpt;
  const content = lang === "fr" && post.content_fr ? post.content_fr : post.content;

  const translations = {
    minRead: lang === "fr" ? "min de lecture" : "min read",
    moreInCategory: lang === "fr" ? "Plus dans cette catégorie" : "More in this Category",
    allReflections: lang === "fr" ? "← Toutes les réflexions" : "← All Reflections",
    myStory: lang === "fr" ? "Mon Histoire →" : "My Story →",
    evalTitle: lang === "fr" ? "Évaluez cette réflexion" : "Rate this Reflection",
    evalSub: lang === "fr" ? "Votre feedback nous aide à créer un meilleur contenu" : "Your feedback helps us create better content",
    rateLabel: lang === "fr" ? "Note (1-5 étoiles)" : "Rating (1-5 stars)",
    categoriesLabel: lang === "fr" ? "Cette réflexion était:" : "This reflection was:",
    pragmaticLabel: lang === "fr" ? "Pragmatique" : "Pragmatic",
    faithLabel: lang === "fr" ? "A renforcé ma foi" : "Built my faith",
    clearLabel: lang === "fr" ? "Claire" : "Clear",
    confusingLabel: lang === "fr" ? "Confus" : "Confusing",
    relatedLabel: lang === "fr" ? "Pertinent" : "Related",
    commentLabel: lang === "fr" ? "Commentaires additionnels (optionnel)" : "Additional comments (optional)",
    submitBtn: lang === "fr" ? "Soumettre l'évaluation" : "Submit Evaluation",
    skipBtn: lang === "fr" ? "Passer" : "Skip",
    thankYou: lang === "fr" ? "Merci pour votre feedback!" : "Thank you for your feedback!",
    errorMsg: lang === "fr" ? "Erreur lors de la soumission" : "Error submitting feedback",
    rateRequired: lang === "fr" ? "Veuillez sélectionner une note" : "Please select a rating",
  };

  // Scroll tracking to show modal when scrolled to middle of blog
  useEffect(() => {
    const handleScroll = () => {
      if (hasShownModal) return;

      const article = document.querySelector(".fa-body");
      if (!article) return;

      const articleRect = article.getBoundingClientRect();
      const articleTop = articleRect.top + window.scrollY;
      const articleHeight = articleRect.height;
      const scrollPosition = window.scrollY + window.innerHeight;
      const middleOfArticle = articleTop + articleHeight / 2;

      if (scrollPosition >= middleOfArticle) {
        setShowEvalModal(true);
        setHasShownModal(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasShownModal]);

  const handleSubmitEvaluation = async () => {
    if (rating === 0) {
      toast.error(translations.rateRequired);
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    
    const { error } = await supabase.from("blog_evaluations").insert({
      blog_post_id: post.id,
      rating,
      is_pragmatic: pragmatic,
      built_faith: faithBuilding,
      is_clear: clear,
      is_confusing: confusing,
      is_related: relatedToMe,
      feedback_text: feedbackText.trim() || null,
    });

    setSubmitting(false);

    if (error) {
      toast.error(translations.errorMsg);
      return;
    }

    toast.success(translations.thankYou);
    setShowEvalModal(false);
  };

  useEffect(() => {
    document.body.classList.add("on-fdp");
    return () => document.body.classList.remove("on-fdp");
  }, []);

  return (
    <div className="fdp" style={{ minHeight: "100vh" }}>
      <style>{articleCss}</style>

      {/* NAV */}
      <nav className="fdp-article-nav">
        <Link href="/blog" className="nav-back">← Journal</Link>
        <div className="nav-logo">Samuel Kobina Gyasi</div>
        <span />
      </nav>

      {/* ARTICLE */}
      <article className="fa-article">
        <Breadcrumbs
          items={[
            { label: lang === "fr" ? "Accueil" : "Home", href: "/" },
            { label: lang === "fr" ? "Foi" : "Faith", href: "/faith" },
            { label: lang === "fr" ? "Journal" : "Journal", href: "/blog" },
            { label: title },
          ]}
        />

        <header className="fa-header">
          <div className="fa-tag">{post.category}</div>
          <h1 className="fa-title">{title}</h1>
          <div className="fa-meta">
            <span>
              {new Date(post.created_at).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span>·</span>
            <span>{post.read_time_minutes} {translations.minRead}</span>
            <span>·</span>
            <span>Samuel Kobina Gyasi</span>
          </div>
          {excerpt && <p className="fa-lead">{excerpt}</p>}
          {post.featured_image_url && (
            <div className="fa-cover">
              <img src={post.featured_image_url} alt={title} className="fa-cover-img" />
            </div>
          )}
        </header>

        {content && <BibleEnhancedContent content={content} />}

        {post.infographie_url && (
          <div className="fa-infographie">
            <div className="fa-infographie-label">Summary Infographie</div>
            <img src={post.infographie_url} alt="Summary infographie" className="fa-infographie-img" />
          </div>
        )}

        {related.length > 0 && (

          <aside className="fa-related">
            <div className="fa-related-label">{translations.moreInCategory}</div>
            <div className="fa-related-grid">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="fa-related-card"
                >
                  <div className="fa-rc-tag">{p.category}</div>
                  <div className="fa-rc-title">{p.title}</div>
                  <div className="fa-rc-meta">{p.read_time_minutes} {translations.minRead}</div>
                </Link>
              ))}
            </div>
          </aside>
        )}

        <footer className="fa-footer">
          <Link href="/blog" className="fa-back-link">{translations.allReflections}</Link>
          <Link href="/my-story" className="fa-credo-link">{translations.myStory}</Link>
        </footer>
      </article>

      {/* EVALUATION MODAL */}
      {showEvalModal && (
        <div className="eval-modal-overlay" onClick={() => setShowEvalModal(false)}>
          <div className="eval-modal" onClick={(e) => e.stopPropagation()}>
            <button className="eval-close" onClick={() => setShowEvalModal(false)}>×</button>
            
            <div className="eval-header">
              <h3>{translations.evalTitle}</h3>
              <p>{translations.evalSub}</p>
            </div>

            <div className="eval-body">
              <label className="eval-label">{translations.rateLabel} <span className="eval-required">*</span></label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={star <= (hoveredRating || rating) ? 'star-active' : ''}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    aria-label={`Rate ${star} stars`}
                  >
                    {star <= (hoveredRating || rating) ? '★' : '☆'}
                  </button>
                ))}
              </div>

              <label className="eval-label eval-label-categories">{translations.categoriesLabel || "What resonated with you?"}</label>
              <div className="eval-checkboxes">
                <label className="eval-checkbox-label">
                  <input
                    type="checkbox"
                    checked={pragmatic}
                    onChange={(e) => setPragmatic(e.target.checked)}
                  />
                  <span>{translations.pragmaticLabel}</span>
                </label>
                <label className="eval-checkbox-label">
                  <input
                    type="checkbox"
                    checked={faithBuilding}
                    onChange={(e) => setFaithBuilding(e.target.checked)}
                  />
                  <span>{translations.faithLabel}</span>
                </label>
                <label className="eval-checkbox-label">
                  <input
                    type="checkbox"
                    checked={clear}
                    onChange={(e) => setClear(e.target.checked)}
                  />
                  <span>{translations.clearLabel}</span>
                </label>
                <label className="eval-checkbox-label">
                  <input
                    type="checkbox"
                    checked={confusing}
                    onChange={(e) => setConfusing(e.target.checked)}
                  />
                  <span>{translations.confusingLabel}</span>
                </label>
                <label className="eval-checkbox-label">
                  <input
                    type="checkbox"
                    checked={relatedToMe}
                    onChange={(e) => setRelatedToMe(e.target.checked)}
                  />
                  <span>{translations.relatedLabel}</span>
                </label>
              </div>

              <label className="eval-label eval-label-comment">{translations.commentLabel}</label>
              <textarea
                className="eval-textarea"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={lang === "fr" ? "Partagez vos réflexions (optionnel)..." : "Share your thoughts (optional)..."}
                rows={4}
              />
            </div>

            <div className="eval-actions">
              <button
                type="button"
                className="eval-btn eval-btn-skip"
                onClick={() => setShowEvalModal(false)}
              >
                {translations.skipBtn}
              </button>
              <button
                type="button"
                className="eval-btn eval-btn-submit"
                onClick={handleSubmitEvaluation}
                disabled={submitting}
              >
                {submitting ? "..." : translations.submitBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const articleCss = `
.fdp {
  --bg:#080807; --bg2:#0e0d0b; --white:#f0ece4; --cream:#e8e0d0;
  --gold:#c9a84c; --dim:#7a7060; --dimmer:#3e3830;
  --line:rgba(240,236,228,.06); --card:#111009; min-height:100vh;
}
body.on-fdp { background:#080807; color:#f0ece4; font-family:'Cormorant Garamond',serif; }
.fdp-article-nav { position:fixed; top:0; left:0; right:0; z-index:200; padding:22px 56px; display:flex; justify-content:space-between; align-items:center; background:rgba(6,6,5,.96); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px); border-bottom:1px solid rgba(255,222,89,.08); }
.nav-back { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.22em; text-transform:uppercase; color:var(--dim); text-decoration:none; transition:color .3s; }
.nav-back:hover { color:#ffde59; }
.nav-logo { font-family:var(--font-playfair),'Playfair Display',serif; font-size:17px; color:var(--white); letter-spacing:.06em; }
.fa-article { max-width:760px; margin:0 auto; padding:140px 40px 80px; }
.fa-header { margin-bottom:64px; }
.fa-tag { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.3em; text-transform:uppercase; background:linear-gradient(90deg,#ffde59,#ff914d); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:24px; }
.fa-title { font-family:var(--font-playfair),'Playfair Display',serif; font-size:clamp(32px,5vw,62px); color:var(--white); line-height:1.08; margin-bottom:24px; }
.fa-meta { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.15em; text-transform:uppercase; color:var(--dim); display:flex; gap:12px; align-items:center; margin-bottom:40px; flex-wrap:wrap; }
.fa-lead { font-family:var(--font-playfair),'Playfair Display',serif; font-size:clamp(18px,2.2vw,24px); font-style:italic; color:var(--cream); line-height:1.55; padding:28px 36px; border-left:3px solid transparent; border-image:linear-gradient(180deg,#ffde59,#ff914d) 1; background:rgba(255,222,89,.04); }
.fa-body { font-family:var(--font-cormorant),'Cormorant Garamond',serif; font-size:clamp(17px,1.8vw,21px); line-height:1.9; color:var(--dim); font-weight:300; }
.fa-body h2 { font-family:var(--font-playfair),'Playfair Display',serif; font-size:clamp(22px,3vw,32px); color:var(--white); margin:52px 0 20px; font-weight:700; }
.fa-body h3 { font-family:var(--font-playfair),'Playfair Display',serif; font-size:22px; color:var(--white); margin:40px 0 16px; }
.fa-body p { margin-bottom:28px; }
.fa-body em { color:var(--cream); }
.fa-body strong { color:var(--white); }
.fa-body blockquote { border-left:3px solid transparent; border-image:linear-gradient(180deg,#ffde59,#ff914d) 1; padding:20px 32px; background:rgba(255,222,89,.04); font-style:italic; font-size:19px; color:var(--cream); margin:40px 0; }
.fa-related { margin-top:80px; padding-top:56px; border-top:1px solid var(--line); }
.fa-related-label { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.3em; text-transform:uppercase; background:linear-gradient(90deg,#ffde59,#ff914d); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:32px; display:flex; align-items:center; gap:16px; }
.fa-related-label::before { content:''; width:36px; height:1px; background:linear-gradient(90deg,#ffde59,#ff914d); }
.fa-related-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:2px; }
.fa-related-card { background:var(--card); border:1px solid var(--line); padding:32px 28px; text-decoration:none; color:var(--white); display:flex; flex-direction:column; gap:10px; transition:border-color .3s,padding-left .3s; }
.fa-related-card:hover { border-color:rgba(201,168,76,.25); padding-left:36px; }
.fa-rc-tag { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.25em; text-transform:uppercase; color:var(--gold); }
.fa-rc-title { font-family:var(--font-playfair),'Playfair Display',serif; font-size:18px; color:var(--white); line-height:1.25; flex:1; }
.fa-rc-meta { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.15em; text-transform:uppercase; color:var(--dimmer); }
.fa-footer { margin-top:64px; padding-top:40px; border-top:1px solid var(--line); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; }
.fa-back-link { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:var(--dim); text-decoration:none; transition:color .3s; }
.fa-back-link:hover { color:var(--gold); }
.fa-credo-link { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:var(--gold); text-decoration:none; transition:opacity .3s; }
.fa-credo-link:hover { opacity:.7; }
.fa-cover { margin:40px 0 56px; overflow:hidden; }
.fa-cover-img { width:100%; max-height:520px; object-fit:cover; display:block; }
.fa-infographie { margin:56px 0 0; padding-top:56px; border-top:1px solid var(--line); }
.fa-infographie-label { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:.3em; text-transform:uppercase; color:var(--gold); margin-bottom:28px; }
.fa-infographie-img { width:100%; display:block; border:1px solid var(--line); }

/* EVALUATION MODAL */
.eval-modal-overlay { position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.88); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); display:flex; align-items:center; justify-content:center; padding:20px; animation:fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
.eval-modal { background:var(--bg2); border:1px solid var(--line); border-radius:12px; max-width:480px; width:100%; max-height:85vh; overflow-y:auto; padding:32px 28px; position:relative; animation:slideUp 0.3s ease; box-shadow:0 20px 60px rgba(0,0,0,0.6); }
@keyframes slideUp { from { transform:translateY(30px); opacity:0; } to { transform:translateY(0); opacity:1; } }
.eval-close { position:absolute; top:12px; right:12px; background:transparent; border:none; color:var(--dim); font-size:24px; line-height:1; cursor:pointer; transition:color 0.2s, transform 0.2s; width:28px; height:28px; display:flex; align-items:center; justify-content:center; }
.eval-close:hover { color:var(--white); transform:rotate(90deg); }
.eval-header { margin-bottom:24px; }
.eval-header h3 { font-family:var(--font-poppins),'Poppins',sans-serif; font-size:22px; font-weight:600; color:var(--white); margin-bottom:8px; line-height:1.2; }
.eval-header p { font-family:var(--font-poppins),'Poppins',sans-serif; font-size:14px; font-weight:300; color:var(--dim); line-height:1.5; }
.eval-body { margin-bottom:24px; }
.eval-label { font-family:var(--font-poppins),'Poppins',sans-serif; font-size:11px; font-weight:500; letter-spacing:0.05em; text-transform:uppercase; color:var(--gold); display:block; margin-bottom:10px; }
.eval-label-categories { margin-top:20px; }
.eval-label-comment { margin-top:18px; }
.eval-required { color:#ff914d; }
.star-rating { display:flex; gap:6px; margin-bottom:18px; }
.star-rating button { background:transparent; border:none; cursor:pointer; font-size:32px; color:var(--dimmer); transition:all 0.2s ease; padding:0; line-height:1; }
.star-rating button:hover, .star-rating button.star-active { color:var(--gold); transform:scale(1.1); }
.eval-checkboxes { display:flex; flex-direction:column; gap:10px; }
.eval-checkbox-label { display:flex; align-items:center; gap:10px; font-family:var(--font-poppins),'Poppins',sans-serif; font-size:14px; font-weight:300; color:var(--cream); cursor:pointer; transition:color 0.2s; }
.eval-checkbox-label:hover { color:var(--white); }
.eval-checkbox-label input[type="checkbox"] { width:18px; height:18px; border:1px solid var(--dim); background:transparent; cursor:pointer; appearance:none; -webkit-appearance:none; border-radius:3px; position:relative; transition:all 0.2s; }
.eval-checkbox-label input[type="checkbox"]:checked { background:var(--gold); border-color:var(--gold); }
.eval-checkbox-label input[type="checkbox"]:checked::after { content:'✓'; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); color:var(--bg); font-size:14px; font-weight:bold; }
.eval-textarea { width:100%; background:var(--card); border:1px solid var(--line); border-radius:6px; padding:12px 14px; font-family:var(--font-poppins),'Poppins',sans-serif; font-size:14px; font-weight:300; color:var(--white); resize:vertical; min-height:80px; transition:border-color 0.2s; }
.eval-textarea:focus { outline:none; border-color:var(--gold); }
.eval-textarea::placeholder { color:var(--dimmer); }
.eval-actions { display:flex; gap:10px; justify-content:flex-end; }
.eval-btn { font-family:var(--font-poppins),'Poppins',sans-serif; font-size:11px; font-weight:500; letter-spacing:0.05em; text-transform:uppercase; padding:12px 22px; border-radius:6px; cursor:pointer; transition:all 0.2s; border:none; }
.eval-btn-skip { background:transparent; color:var(--dim); border:1px solid var(--line); }
.eval-btn-skip:hover { color:var(--white); border-color:var(--dim); }
.eval-btn-submit { background:linear-gradient(135deg,#ffde59,#ff914d); color:var(--bg); border:none; }
.eval-btn-submit:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(255,222,89,0.3); }
.eval-btn-submit:disabled { opacity:0.5; cursor:not-allowed; transform:none; }

/* BIBLE VERSE STYLES */
.bible-ref { 
  text-decoration:underline; 
  text-decoration-color:var(--gold); 
  text-decoration-thickness:1px; 
  text-underline-offset:3px; 
  cursor:help; 
  color:var(--cream); 
  transition:all 0.2s ease;
  position:relative;
}
.bible-ref:hover { 
  color:var(--gold); 
  text-decoration-thickness:2px;
}
.bible-tooltip { 
  position:fixed; 
  z-index:10000; 
  background:linear-gradient(135deg, rgba(15,15,13,0.98), rgba(25,25,23,0.98)); 
  border:1px solid var(--gold); 
  border-radius:8px; 
  padding:16px 20px; 
  max-width:420px; 
  width:max-content;
  box-shadow:0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,222,89,0.1); 
  transform:translateX(-50%) translateY(-100%) translateY(-12px); 
  pointer-events:none;
  animation:tooltipFadeIn 0.2s ease;
  backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px);
}
@keyframes tooltipFadeIn { from { opacity:0; transform:translateX(-50%) translateY(-100%) translateY(-8px); } to { opacity:1; transform:translateX(-50%) translateY(-100%) translateY(-12px); } }
.bible-tooltip::after { 
  content:''; 
  position:absolute; 
  bottom:-8px; 
  left:50%; 
  transform:translateX(-50%); 
  width:0; 
  height:0; 
  border-left:8px solid transparent; 
  border-right:8px solid transparent; 
  border-top:8px solid var(--gold);
}
.bible-tooltip-text { 
  font-family:var(--font-cormorant),'Cormorant Garamond',serif; 
  font-size:16px; 
  line-height:1.7; 
  color:var(--cream); 
  font-weight:300;
  margin-bottom:8px;
}
.bible-tooltip-ref { 
  font-family:'Space Mono',monospace; 
  font-size:10px; 
  letter-spacing:0.1em; 
  text-transform:uppercase; 
  color:var(--gold); 
  font-weight:400;
}

@media(max-width:768px) {
  .fdp-article-nav { padding:18px 24px; }
  .fa-article { padding:130px 24px 60px; }
  .fa-related-grid { grid-template-columns:1fr; }
  .fa-footer { flex-direction:column; align-items:flex-start; }
  .eval-modal { padding:24px 20px; max-width:calc(100vw - 32px); }
  .eval-header h3 { font-size:20px; }
  .star-rating { gap:4px; }
  .star-rating button { font-size:28px; }
  .eval-actions { flex-direction:column; }
  .eval-btn { width:100%; }
  .bible-tooltip { 
    max-width:calc(100vw - 40px); 
    font-size:14px; 
    padding:12px 16px;
    left:50% !important;
  }
  .bible-tooltip-text { font-size:14px; line-height:1.6; }
}
`;
