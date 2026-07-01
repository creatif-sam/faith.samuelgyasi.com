"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { localizedHref } from "@/lib/i18n/locale";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Link2, MessageCircle, ArrowLeft, ArrowRight, Check } from "lucide-react";
import Breadcrumbs from "@/components/atoms/Breadcrumbs";
import { BibleEnhancedContent } from "@/components/BibleEnhancedContent";
import { EvaluationModal } from "./EvaluationModal";
import { articleCss } from "../articleStyles";

type AdjacentPost = { title: string; title_fr?: string | null; slug: string } | null;

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

type BlogComment = {
  id: string;
  commenter_name: string;
  comment_text: string;
  created_at: string;
};

export function ArticleClient({
  post,
  related,
  newerPost,
  olderPost,
}: {
  post: DbPost;
  related: RelatedPost[];
  newerPost?: AdjacentPost;
  olderPost?: AdjacentPost;
}) {
  const { lang } = useLang();
  const [userId, setUserId] = useState<string | null>(null);
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
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
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentBusy, setCommentBusy] = useState(false);

  // Get language-aware content
  const title = lang === "fr" && post.title_fr ? post.title_fr : post.title;
  const excerpt = lang === "fr" && post.excerpt_fr ? post.excerpt_fr : post.excerpt;
  const content = lang === "fr" && post.content_fr ? post.content_fr : post.content;

  const translations = {
    minRead: lang === "fr" ? "min de lecture" : "min read",
    moreInCategory: lang === "fr" ? "Plus dans cette catégorie" : "More in this Category",
    allReflections: lang === "fr" ? "← Toutes les réflexions" : "← All Reflections",
    shareLabel: lang === "fr" ? "Partager cette réflexion" : "Share this reflection",
    copyLink: lang === "fr" ? "Copier le lien" : "Copy link",
    linkCopied: lang === "fr" ? "Lien copié !" : "Link copied!",
    olderLabel: lang === "fr" ? "Réflexion précédente" : "Older reflection",
    newerLabel: lang === "fr" ? "Réflexion suivante" : "Newer reflection",
    authorTagline: lang === "fr" ? "Ministre, Facilitateur et Leader" : "Minister, Facilitator and Leader",
    authorBio: lang === "fr"
      ? "Je vous aide à trouver votre BUT de vie, maximiser votre POTENTIEL et développer un ESPRIT Christocentrique."
      : "I help you find your PURPOSE, maximize your POTENTIAL and develop Christlike MIND.",
    visitStory: lang === "fr" ? "Découvrir mon histoire →" : "Read my story →",
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
    commentsTitle: lang === "fr" ? "Commentaires" : "Comments",
    commentsSub: lang === "fr" ? "Partagez votre réflexion sur cet article." : "Share your thoughts about this article.",
    noComments: lang === "fr" ? "Pas encore de commentaires." : "No comments yet.",
    nameLabel: lang === "fr" ? "Nom" : "Name",
    emailLabel: lang === "fr" ? "Email" : "Email",
    commentLabel2: lang === "fr" ? "Votre commentaire" : "Your comment",
    postComment: lang === "fr" ? "Publier" : "Post Comment",
    commentPending: lang === "fr" ? "Merci, votre commentaire est en attente de validation." : "Thanks, your comment is awaiting approval.",
  };

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("blog_comments")
        .select("id,commenter_name,comment_text,created_at")
        .eq("blog_post_id", post.id)
        .eq("approved", true)
        .order("created_at", { ascending: false });
      setComments((data as BlogComment[]) ?? []);
    };
    run();
  }, [post.id]);

  // Logged-in disciples get this post counted toward "Blogs Read" on their
  // dashboard once they've actually scrolled through it (see the 80%-scroll
  // effect below), not just on page load.
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  async function markAsRead() {
    if (!userId) return;
    const supabase = createClient();
    await supabase
      .from("blog_reads")
      .upsert({ user_id: userId, blog_post_id: post.id }, { onConflict: "user_id,blog_post_id", ignoreDuplicates: true });
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;
    setCommentBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from("blog_comments").insert({
      blog_post_id: post.id,
      commenter_name: commentName.trim(),
      commenter_email: commentEmail.trim() || null,
      comment_text: commentText.trim(),
    });
    setCommentBusy(false);
    if (error) {
      toast.error(translations.errorMsg);
      return;
    }
    setCommentName("");
    setCommentEmail("");
    setCommentText("");
    toast.success(translations.commentPending);
  }

  // Scroll tracking to show modal when scrolled to 80% of blog
  useEffect(() => {
    const handleScroll = () => {
      if (hasShownModal) return;

      const article = document.querySelector(".fa-body");
      if (!article) return;

      const articleRect = article.getBoundingClientRect();
      const articleTop = articleRect.top + window.scrollY;
      const articleHeight = articleRect.height;
      const scrollPosition = window.scrollY + window.innerHeight;
      const eightyPercentOfArticle = articleTop + (articleHeight * 0.8);

      if (scrollPosition >= eightyPercentOfArticle) {
        setShowEvalModal(true);
        setHasShownModal(true);
        markAsRead();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasShownModal, userId]);

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
    document.body.classList.add("on-article");
    return () => document.body.classList.remove("on-article");
  }, []);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    toast.success(translations.linkCopied);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  function shareTo(target: "x" | "facebook" | "whatsapp") {
    const url = window.location.href;
    const text = title;
    const shareUrls = {
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    };
    window.open(shareUrls[target], "_blank", "noopener,noreferrer,width=600,height=500");
  }

  const olderTitle = olderPost ? (lang === "fr" && olderPost.title_fr ? olderPost.title_fr : olderPost.title) : null;
  const newerTitle = newerPost ? (lang === "fr" && newerPost.title_fr ? newerPost.title_fr : newerPost.title) : null;

  return (
    <div className="fdp" style={{ minHeight: "100vh" }}>
      <style>{articleCss}</style>

      {/* NAV */}
      <nav className="fdp-article-nav">
        <Link href={localizedHref(lang, "/blog")} className="nav-back">← Journal</Link>
        <div className="nav-logo">Samuel Kobina Gyasi</div>
        <span />
      </nav>

      {/* ARTICLE */}
      <article className="fa-article">
        <Breadcrumbs
          items={[
            { label: lang === "fr" ? "Accueil" : "Home", href: localizedHref(lang, "/") },
            { label: lang === "fr" ? "Foi" : "Faith", href: localizedHref(lang, "/faith") },
            { label: lang === "fr" ? "Journal" : "Journal", href: localizedHref(lang, "/blog") },
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
          <div className="fa-share">
            <span className="fa-share-label">{translations.shareLabel}</span>
            <div className="fa-share-buttons">
              <button className="fa-share-btn" onClick={copyLink} aria-label={translations.copyLink} title={translations.copyLink}>
                {linkCopied ? <Check size={14} /> : <Link2 size={14} />}
              </button>
              <button className="fa-share-btn" onClick={() => shareTo("x")} aria-label="X">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.7 8.8L23.5 22h-7.1l-5.6-7.3L4.4 22H1.2l8.2-9.4L1 2h7.3l5 6.7L18.9 2Zm-1.2 18h1.9L7.4 4H5.4l12.3 16Z"/></svg>
              </button>
              <button className="fa-share-btn" onClick={() => shareTo("facebook")} aria-label="Facebook">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
              <button className="fa-share-btn" onClick={() => shareTo("whatsapp")} aria-label="WhatsApp">
                <MessageCircle size={14} />
              </button>
            </div>
          </div>
        </header>

        {content && <BibleEnhancedContent content={content} />}

        <div className="fa-author">
          <img src="/photo-hero.png" alt="Samuel Kobina Gyasi" className="fa-author-photo" />
          <div className="fa-author-body">
            <div className="fa-author-name">Samuel Kobina Gyasi</div>
            <div className="fa-author-tagline">{translations.authorTagline}</div>
            <p className="fa-author-bio">{translations.authorBio}</p>
            <Link href={localizedHref(lang, "/my-story")} className="fa-author-link">{translations.visitStory}</Link>
          </div>
        </div>

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
                  href={localizedHref(lang, `/blog/${p.slug}`)}
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

        <section className="fa-comments">
          <h3 className="fa-comments-title">{translations.commentsTitle}</h3>
          <p className="fa-comments-sub">{translations.commentsSub}</p>

          {comments.length === 0 ? (
            <p className="fa-comments-empty">{translations.noComments}</p>
          ) : (
            <div className="fa-comments-list">
              {comments.map((c) => (
                <div key={c.id} className="fa-comment-item">
                  <p className="fa-comment-head">
                    <strong>{c.commenter_name}</strong> · {new Date(c.created_at).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB")}
                  </p>
                  <p className="fa-comment-text">{c.comment_text}</p>
                </div>
              ))}
            </div>
          )}

          <form className="fa-comment-form" onSubmit={submitComment}>
            <div className="fa-comment-row">
              <input
                className="fa-comment-input"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                placeholder={translations.nameLabel}
                required
              />
              <input
                className="fa-comment-input"
                value={commentEmail}
                onChange={(e) => setCommentEmail(e.target.value)}
                placeholder={translations.emailLabel}
                type="email"
              />
            </div>
            <textarea
              className="fa-comment-textarea"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={translations.commentLabel2}
              rows={4}
              required
            />
            <button className="fa-comment-btn" type="submit" disabled={commentBusy}>
              {commentBusy ? "..." : translations.postComment}
            </button>
          </form>
        </section>

        <footer className="fa-footer">
          <Link href={localizedHref(lang, "/blog")} className="fa-back-link">{translations.allReflections}</Link>
          <div className="fa-adjacent-nav">
            {olderPost ? (
              <Link href={localizedHref(lang, `/blog/${olderPost.slug}`)} className="fa-adjacent-card fa-adjacent-older">
                <span className="fa-adjacent-dir"><ArrowLeft size={11} />{translations.olderLabel}</span>
                <span className="fa-adjacent-title">{olderTitle}</span>
              </Link>
            ) : <span />}
            {newerPost && (
              <Link href={localizedHref(lang, `/blog/${newerPost.slug}`)} className="fa-adjacent-card fa-adjacent-newer">
                <span className="fa-adjacent-dir">{translations.newerLabel}<ArrowRight size={11} /></span>
                <span className="fa-adjacent-title">{newerTitle}</span>
              </Link>
            )}
          </div>
        </footer>
      </article>

      {showEvalModal && (
        <EvaluationModal
          lang={lang}
          rating={rating}
          setRating={setRating}
          hoveredRating={hoveredRating}
          setHoveredRating={setHoveredRating}
          pragmatic={pragmatic}
          setPragmatic={setPragmatic}
          faithBuilding={faithBuilding}
          setFaithBuilding={setFaithBuilding}
          clear={clear}
          setClear={setClear}
          confusing={confusing}
          setConfusing={setConfusing}
          relatedToMe={relatedToMe}
          setRelatedToMe={setRelatedToMe}
          feedbackText={feedbackText}
          setFeedbackText={setFeedbackText}
          submitting={submitting}
          onClose={() => setShowEvalModal(false)}
          onSubmit={handleSubmitEvaluation}
          translations={translations}
        />
      )}
    </div>
  );
}
