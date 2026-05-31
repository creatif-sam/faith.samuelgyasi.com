export type DbPost = {
  id: string;
  title: string;
  title_fr: string | null;
  slug: string;
  category: string;
  excerpt: string | null;
  excerpt_fr: string | null;
  read_time_minutes: number;
  featured_image_url: string | null;
  youtube_url: string | null;
  created_at: string;
  series_id: string | null;
  series_order: number | null;
};

export type BlogSeries = {
  id: string;
  name_en: string;
  name_fr: string;
  slug: string;
  description_en: string | null;
  description_fr: string | null;
  image_url: string | null;
  show_dates: boolean;
};

export const CATEGORY_LABELS: Record<string, { en: string; fr: string }> = {
  "faith": { en: "Faith", fr: "Foi" },
  "problems-and-solutions": { en: "Problems & Solutions", fr: "Problèmes & Solutions" },
  "wisdom": { en: "Wisdom", fr: "Sagesse" },
  "leadership": { en: "Leadership", fr: "Leadership" },
};

export function formatCategorySlug(slug: string): string {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function getPostImage(post: DbPost): { url: string; isYoutube: boolean } | null {
  if (post.featured_image_url) {
    const ytId = getYouTubeId(post.featured_image_url);
    if (ytId) return { url: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`, isYoutube: true };
    return { url: post.featured_image_url, isYoutube: false };
  }
  if (post.youtube_url) {
    const ytId = getYouTubeId(post.youtube_url);
    if (ytId) return { url: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`, isYoutube: true };
  }
  return null;
}
