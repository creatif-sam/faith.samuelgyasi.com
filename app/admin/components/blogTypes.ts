// Blog-related types
export interface BlogPost {
  id: string;
  title: string;
  title_fr?: string | null;
  slug: string;
  category: string;
  published: boolean;
  excerpt: string | null;
  excerpt_fr?: string | null;
  content: string | null;
  content_fr?: string | null;
  read_time_minutes: number;
  featured_image_url: string | null;
  youtube_url?: string | null;
  infographie_url_en: string | null;
  infographie_url_fr: string | null;
  series_id?: string | null;
  series_order?: number;
  created_at: string;
}

export interface BlogSeries {
  id: string;
  name_en: string;
  name_fr: string;
  slug: string;
  description_en: string | null;
  description_fr: string | null;
  image_url: string | null;
  show_dates: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogTag {
  id: string;
  name_en: string;
  name_fr: string;
  slug: string;
  description_en: string | null;
  description_fr: string | null;
  color: string;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogReview {
  id: string;
  blog_post_id: string;
  reviewer_name: string;
  reviewer_email: string | null;
  rating: number;
  comment: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogComment {
  id: string;
  blog_post_id: string;
  commenter_name: string;
  commenter_email: string | null;
  comment_text: string;
  approved: boolean;
  created_at: string;
  updated_at: string;
}
