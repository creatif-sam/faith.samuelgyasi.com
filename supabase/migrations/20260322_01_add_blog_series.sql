-- Migration: Add blog series
-- Date: 2026-03-22
-- Description: Adds blog_series table for organizing blog posts into series

-- =============================================
-- 1. Create blog_series table
-- =============================================
CREATE TABLE IF NOT EXISTS blog_series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description_en TEXT,
  description_fr TEXT,
  image_url TEXT,
  show_dates BOOLEAN DEFAULT true,
  published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_blog_series_slug ON blog_series(slug);
CREATE INDEX IF NOT EXISTS idx_blog_series_published ON blog_series(published);
CREATE INDEX IF NOT EXISTS idx_blog_series_sort_order ON blog_series(sort_order);

-- Add comments
COMMENT ON TABLE blog_series IS 'Blog post series for organizing related content';
COMMENT ON COLUMN blog_series.name_en IS 'Series name in English';
COMMENT ON COLUMN blog_series.name_fr IS 'Series name in French';
COMMENT ON COLUMN blog_series.image_url IS 'URL of the series banner/cover image';
COMMENT ON COLUMN blog_series.show_dates IS 'Whether to show dates for posts in this series';

-- =============================================
-- 2. Add series fields to blog_posts
-- =============================================
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS series_id UUID REFERENCES blog_series(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS series_order INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_blog_posts_series_id ON blog_posts(series_id);

COMMENT ON COLUMN blog_posts.series_id IS 'Reference to blog series';
COMMENT ON COLUMN blog_posts.series_order IS 'Order of post within series';

-- =============================================
-- 3. Update trigger for blog_series
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_blog_series_updated_at ON blog_series;
CREATE TRIGGER update_blog_series_updated_at
  BEFORE UPDATE ON blog_series
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
