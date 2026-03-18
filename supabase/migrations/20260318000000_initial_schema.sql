-- ============================================================
-- faith.samuelcom — Full Supabase Schema
-- Run this entire script in the Supabase SQL Editor
-- on a fresh project (Dashboard → SQL Editor → New Query)
-- ============================================================


-- ============================================================
-- 1. EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================
-- 2. CUSTOM TYPES / ENUMS
-- ============================================================

CREATE TYPE public.event_category   AS ENUM ('intervention', 'masterclass', 'session');
CREATE TYPE public.library_category AS ENUM ('ebook', 'review');
CREATE TYPE public.email_status     AS ENUM ('sending', 'sent', 'failed', 'opened');


-- ============================================================
-- 3. TABLES
-- (email_templates first because email_logs has a FK to it)
-- ============================================================

-- ─── email_templates ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.email_templates (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  subject    text        NOT NULL,
  body_html  text        NOT NULL DEFAULT '',
  body_text  text        NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

COMMENT ON TABLE public.email_templates IS 'Reusable email templates managed from the admin panel.';

-- ─── email_logs ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.email_logs (
  id          uuid              PRIMARY KEY DEFAULT gen_random_uuid(),
  resend_id   text,
  to_email    text              NOT NULL,
  from_email  text              NOT NULL,
  subject     text              NOT NULL,
  body_html   text,
  body_text   text,
  status      public.email_status NOT NULL DEFAULT 'sending',
  opened_at   timestamptz,
  sent_at     timestamptz       NOT NULL DEFAULT now(),
  template_id uuid              REFERENCES public.email_templates (id) ON DELETE SET NULL
);

COMMENT ON TABLE public.email_logs IS 'Log of every outbound email. Status updated by the send API and open-tracking pixel.';

-- ─── inbound_emails ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.inbound_emails (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  from_email  text        NOT NULL,
  from_name   text,
  to_email    text,
  subject     text,
  body_text   text,
  body_html   text,
  read        boolean     NOT NULL DEFAULT false,
  received_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.inbound_emails IS 'Emails received via inbound webhook (Resend / Postmark).';

-- ─── page_views ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.page_views (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path  text        NOT NULL,
  visitor_id text        NOT NULL,
  referrer   text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.page_views IS 'Analytics: one row per page visit recorded by the /api/analytics/pageview route.';

-- ─── testimonials ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.testimonials (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  role       text,
  company    text,
  avatar_url text,
  quote      text        NOT NULL,
  rating     smallint    NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  published  boolean     NOT NULL DEFAULT false,
  sort_order integer     NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.testimonials IS 'Client testimonials displayed on the site.';

-- ─── blog_posts ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title               text        NOT NULL,
  slug                text        NOT NULL UNIQUE,
  category            text        NOT NULL,
  excerpt             text,
  content             text,
  read_time_minutes   integer     NOT NULL DEFAULT 5,
  featured_image_url  text,
  published           boolean     NOT NULL DEFAULT false,
  author              text        NOT NULL DEFAULT 'Samuel Kobina Gyasi',
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz
);

COMMENT ON TABLE public.blog_posts IS 'Blog posts. category = faith | leadership | intellectuality | transformation';

-- ─── newsletter_subscribers ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text        NOT NULL UNIQUE,
  name       text,
  interests  text[],
  confirmed  boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.newsletter_subscribers IS 'Newsletter subscribers. Inserted client-side from SiteFooter.';

-- ─── contact_messages ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  email      text        NOT NULL,
  subject    text,
  message    text        NOT NULL,
  read       boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.contact_messages IS 'Contact form submissions. Read and managed from the admin panel.';

-- ─── library_items ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.library_items (
  id           uuid                     PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text                     NOT NULL,
  author       text,
  category     public.library_category  NOT NULL,
  description  text,
  rating       smallint                 CHECK (rating BETWEEN 1 AND 5),
  download_url text,
  cover_url    text,
  published    boolean                  NOT NULL DEFAULT false,
  sort_order   integer                  NOT NULL DEFAULT 0,
  created_at   timestamptz              NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.library_items IS 'Ebooks and book reviews. category = ebook | review';

-- ─── upcoming_events ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.upcoming_events (
  id          uuid                    PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text                    NOT NULL,
  description text,
  date_text   text                    DEFAULT 'Coming Soon',
  location    text,
  tag         text,
  category    public.event_category   NOT NULL,
  published   boolean                 NOT NULL DEFAULT false,
  sort_order  integer                 NOT NULL DEFAULT 0,
  created_at  timestamptz             NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.upcoming_events IS 'Upcoming events. category = intervention | masterclass | session';


-- ============================================================
-- 4. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_page_views_created_at   ON public.page_views             (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor       ON public.page_views             (visitor_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at       ON public.email_logs             (sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_status        ON public.email_logs             (status);
CREATE INDEX IF NOT EXISTS idx_inbound_emails_read      ON public.inbound_emails         (read, received_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_published   ON public.testimonials           (published, sort_order);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug          ON public.blog_posts             (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_pub  ON public.blog_posts             (category, published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_library_items_category   ON public.library_items          (category, published, sort_order);
CREATE INDEX IF NOT EXISTS idx_upcoming_events_pub      ON public.upcoming_events        (published, sort_order);
CREATE INDEX IF NOT EXISTS idx_newsletter_email         ON public.newsletter_subscribers (email);


-- ============================================================
-- 5. ROW LEVEL SECURITY — Enable
-- ============================================================

ALTER TABLE public.email_templates        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inbound_emails         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upcoming_events        ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 6. RLS POLICIES
-- ============================================================
-- Strategy:
--   • Public content (testimonials, blog, library, events):
--       anon  → SELECT WHERE published = true
--       admin → full CRUD (authenticated)
--   • User-submitted data (newsletter, contact, page_views):
--       anon  → INSERT only
--       admin → SELECT / UPDATE / DELETE (authenticated)
--   • Admin-only data (email_logs, email_templates, inbound_emails):
--       authenticated → full access
--       anon → INSERT for webhooks; UPDATE on email_logs for open-pixel
-- ============================================================


-- ─── email_templates ─────────────────────────────────────────

CREATE POLICY "admin_all_email_templates"
  ON public.email_templates
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ─── email_logs ──────────────────────────────────────────────

-- Admin: full access
CREATE POLICY "admin_all_email_logs"
  ON public.email_logs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Open-tracking pixel: the email recipient (unauthenticated) makes a GET to
-- /api/track/open/[id] which runs a server-side UPDATE. No auth cookie is
-- present, so this runs as anon. Policy is tightly scoped: only rows where
-- opened_at IS NULL can be updated, and the new state must have opened_at set.
-- NOTE: For extra security, add a SERVICE_ROLE_KEY to the tracking route
-- and remove this anon policy once you set that up.
CREATE POLICY "anon_track_open_pixel"
  ON public.email_logs
  FOR UPDATE
  TO anon
  USING   (opened_at IS NULL)
  WITH CHECK (opened_at IS NOT NULL);


-- ─── inbound_emails ──────────────────────────────────────────

-- Admin: full access
CREATE POLICY "admin_all_inbound_emails"
  ON public.inbound_emails
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Inbound webhook from Resend/Postmark hits /api/mail/inbound without auth.
-- NOTE: Verify the webhook signature inside the API route (already server-side)
-- and replace this with SERVICE_ROLE_KEY when available.
CREATE POLICY "anon_insert_inbound_emails"
  ON public.inbound_emails
  FOR INSERT
  TO anon
  WITH CHECK (true);


-- ─── page_views ──────────────────────────────────────────────

-- Analytics API route is called from the client (no auth), so anon INSERT needed.
CREATE POLICY "anon_insert_page_views"
  ON public.page_views
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Admin reads analytics
CREATE POLICY "admin_select_page_views"
  ON public.page_views
  FOR SELECT
  TO authenticated
  USING (true);


-- ─── testimonials ────────────────────────────────────────────

-- Public: read published only
CREATE POLICY "anon_read_testimonials"
  ON public.testimonials
  FOR SELECT
  TO anon
  USING (published = true);

-- Admin: full access (includes reading unpublished drafts)
CREATE POLICY "admin_all_testimonials"
  ON public.testimonials
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ─── blog_posts ──────────────────────────────────────────────

-- Public: read published only
CREATE POLICY "anon_read_blog_posts"
  ON public.blog_posts
  FOR SELECT
  TO anon
  USING (published = true);

-- Admin: full access
CREATE POLICY "admin_all_blog_posts"
  ON public.blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ─── newsletter_subscribers ──────────────────────────────────

-- Anyone can subscribe (client-side insert from SiteFooter)
CREATE POLICY "anon_insert_newsletter"
  ON public.newsletter_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Admin: full access (read list, delete, mark confirmed)
CREATE POLICY "admin_all_newsletter"
  ON public.newsletter_subscribers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ─── contact_messages ────────────────────────────────────────

-- Anyone can submit a contact message
CREATE POLICY "anon_insert_contact"
  ON public.contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Admin: full access (read, mark as read, delete)
CREATE POLICY "admin_all_contact"
  ON public.contact_messages
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ─── library_items ───────────────────────────────────────────

-- Public: read published only
CREATE POLICY "anon_read_library"
  ON public.library_items
  FOR SELECT
  TO anon
  USING (published = true);

-- Admin: full access
CREATE POLICY "admin_all_library"
  ON public.library_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ─── upcoming_events ─────────────────────────────────────────

-- Public: read published only
CREATE POLICY "anon_read_events"
  ON public.upcoming_events
  FOR SELECT
  TO anon
  USING (published = true);

-- Admin: full access
CREATE POLICY "admin_all_events"
  ON public.upcoming_events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ============================================================
-- 7. STORAGE BUCKETS
-- ============================================================
-- All buckets are public (files are readable without auth).
-- Only authenticated users (admin) can upload/update/delete.
-- ============================================================

-- Blog post featured images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880,  -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
) ON CONFLICT (id) DO NOTHING;

-- Testimonial avatar photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'testimonial-avatars',
  'testimonial-avatars',
  true,
  2097152,  -- 2 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Library item cover images (ebooks & reviews)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'library-covers',
  'library-covers',
  true,
  2097152,  -- 2 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Downloadable ebook/resource files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'library-files',
  'library-files',
  true,
  52428800,  -- 50 MB
  ARRAY['application/pdf', 'application/epub+zip', 'application/zip']
) ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 8. STORAGE RLS POLICIES
-- ============================================================

-- ─── blog-images ─────────────────────────────────────────────
CREATE POLICY "blog_images_public_read"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'blog-images');

CREATE POLICY "blog_images_admin_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "blog_images_admin_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-images')
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "blog_images_admin_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'blog-images');


-- ─── testimonial-avatars ─────────────────────────────────────
CREATE POLICY "avatars_public_read"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'testimonial-avatars');

CREATE POLICY "avatars_admin_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'testimonial-avatars');

CREATE POLICY "avatars_admin_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'testimonial-avatars')
  WITH CHECK (bucket_id = 'testimonial-avatars');

CREATE POLICY "avatars_admin_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'testimonial-avatars');


-- ─── library-covers ──────────────────────────────────────────
CREATE POLICY "covers_public_read"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'library-covers');

CREATE POLICY "covers_admin_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'library-covers');

CREATE POLICY "covers_admin_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'library-covers')
  WITH CHECK (bucket_id = 'library-covers');

CREATE POLICY "covers_admin_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'library-covers');


-- ─── library-files ───────────────────────────────────────────
CREATE POLICY "files_public_read"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'library-files');

CREATE POLICY "files_admin_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'library-files');

CREATE POLICY "files_admin_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'library-files')
  WITH CHECK (bucket_id = 'library-files');

CREATE POLICY "files_admin_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'library-files');


-- ============================================================
-- 9. BUG FIX — library_items category column
-- ============================================================
-- app/resources/ebooks/page.tsx and app/resources/reviews/page.tsx
-- currently query: .eq("category_type", "ebook" | "review")
-- but the column is named `category`.
-- The pages will always return 0 rows until that code is changed to:
--   .eq("category", "ebook")
--   .eq("category", "review")
-- This is a code bug, not a schema bug. See those two files.


-- ============================================================
-- DONE
-- ============================================================
-- Tables created:
--   email_templates, email_logs, inbound_emails, page_views,
--   testimonials, blog_posts, newsletter_subscribers,
--   contact_messages, library_items, upcoming_events
--
-- Storage buckets created:
--   blog-images, testimonial-avatars, library-covers, library-files
--
-- All RLS policies applied.
-- ============================================================
