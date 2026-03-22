// Types for Admin Dashboard

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
  created_at: string;
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

export interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  confirmed: boolean;
  interests?: string[] | null;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

export interface EmailLog {
  id: string;
  resend_id: string | null;
  to_email: string;
  from_email: string;
  subject: string;
  body_html: string | null;
  body_text: string | null;
  status: string;
  opened_at: string | null;
  sent_at: string;
  template_id: string | null;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  body_text: string;
  created_at: string;
}

export interface InboundEmail {
  id: string;
  from_email: string;
  from_name: string | null;
  to_email: string | null;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  read: boolean;
  received_at: string;
}

export interface PageViewRow {
  page_path: string;
  visitor_id: string;
  created_at: string;
}

export interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  topPages: { path: string; count: number }[];
  dailyViews: { date: string; count: number }[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  avatar_url: string | null;
  quote: string;
  rating: number;
  published: boolean;
  sort_order: number;
  created_at: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  author: string | null;
  category: "ebook" | "review" | "audio" | "visual";
  description: string | null;
  rating: number | null;
  download_url: string | null;
  cover_url: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  duration?: string | null;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  description: string | null;
  date_text: string | null;
  event_date: string | null;
  location: string | null;
  tag: string | null;
  category: "intervention" | "masterclass" | "session";
  format: "online" | "in-person" | "both";
  needs_registration: boolean;
  join_url: string | null;
  facebook_url: string | null;
  host_name: string | null;
  host_url: string | null;
  flyer_url: string | null;
  recording_signup: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
}

export interface Feedback {
  id: string;
  type: "bug" | "idea";
  message: string;
  email: string | null;
  page_url: string | null;
  resolved: boolean;
  created_at: string;
}

export interface MyStoryContent {
  id: string;
  title_en: string;
  title_fr: string;
  content_en: string;
  content_fr: string;
  images: string[];
  updated_at: string;
  created_at: string;
}

export interface CredoContent {
  id: string;
  title_en: string;
  title_fr: string;
  content_en: string;
  content_fr: string;
  updated_at: string;
  created_at: string;
}

export interface Training {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  category: string;
  total_lessons: number;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TrainingLesson {
  id: string;
  training_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  duration: string | null;
  sort_order: number;
  created_at: string;
}

export interface GalleryTheme {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  photos?: GalleryPhoto[];
}

export interface GalleryPhoto {
  id: string;
  theme_id: string;
  photo_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  registered_at: string;
}

export interface PrayerSubmission {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  prayer_topic: string;
  details: string | null;
  is_urgent: boolean;
  prayed_for: boolean;
  created_at: string;
}

export interface DiscipleshipContent {
  id: string;
  title_en: string;
  title_fr: string;
  content_en: string;
  content_fr: string;
  published: boolean;
  sort_order: number;
  updated_at: string;
  created_at: string;
}

export type Tab = 
  | "overview" 
  | "analytics" 
  | "posts" 
  | "subscribers" 
  | "messages" 
  | "mail" 
  | "testimonials" 
  | "library" 
  | "upcoming" 
  | "event-registrations"
  | "feedback" 
  | "my-story" 
  | "trainings"
  | "gallery"
  | "discipleship"
  | "prayer-submissions";

export type MailSubTab = "compose" | "inbox" | "sent" | "templates";
