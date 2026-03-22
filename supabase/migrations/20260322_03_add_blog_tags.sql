-- Migration: Add blog tags system
-- Date: 2026-03-22
-- Description: Adds blog_tags table and blog_post_tags junction table

-- =============================================
-- 1. Create blog_tags table
-- =============================================
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description_en TEXT,
  description_fr TEXT,
  color TEXT DEFAULT '#c9a84c',
  published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);
CREATE INDEX IF NOT EXISTS idx_blog_tags_published ON blog_tags(published);
CREATE INDEX IF NOT EXISTS idx_blog_tags_sort_order ON blog_tags(sort_order);

-- Add comments
COMMENT ON TABLE blog_tags IS 'Tags for categorizing blog posts';
COMMENT ON COLUMN blog_tags.color IS 'Hex color code for tag badge display';

-- =============================================
-- 2. Create blog_post_tags junction table
-- =============================================
CREATE TABLE IF NOT EXISTS blog_post_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  blog_tag_id UUID NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique post-tag combinations
  UNIQUE(blog_post_id, blog_tag_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_post ON blog_post_tags(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_tag ON blog_post_tags(blog_tag_id);

-- Add comments
COMMENT ON TABLE blog_post_tags IS 'Many-to-many relationship between blog posts and tags';

-- =============================================
-- 3. Update trigger for blog_tags
-- =============================================
DROP TRIGGER IF EXISTS update_blog_tags_updated_at ON blog_tags;
CREATE TRIGGER update_blog_tags_updated_at
  BEFORE UPDATE ON blog_tags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 4. Insert default tags
-- =============================================
INSERT INTO blog_tags (name_en, name_fr, slug, description_en, description_fr, color, sort_order) VALUES
  ('Faith', 'Foi', 'faith', 'Posts about faith and trust in God', 'Articles sur la foi et la confiance en Dieu', '#c9a84c', 1),
  ('Prayer', 'Prière', 'prayer', 'Posts about prayer and intercession', 'Articles sur la prière et l''intercession', '#4a90e2', 2),
  ('Holiness', 'Sainteté', 'holiness', 'Posts about living a holy life', 'Articles sur la vie de sainteté', '#9b59b6', 3),
  ('Leadership', 'Leadership', 'leadership', 'Posts about spiritual and practical leadership', 'Articles sur le leadership spirituel et pratique', '#e74c3c', 4),
  ('Wisdom', 'Sagesse', 'wisdom', 'Posts about biblical wisdom and discernment', 'Articles sur la sagesse biblique et le discernement', '#16a085', 5),
  ('Testimonies', 'Témoignages', 'testimonies', 'Personal testimonies and stories', 'Témoignages personnels et histoires', '#f39c12', 6),
  ('Bible Study', 'Étude Biblique', 'bible-study', 'In-depth Bible study and analysis', 'Études bibliques approfondies et analyses', '#8e44ad', 7),
  ('Spiritual Growth', 'Croissance Spirituelle', 'spiritual-growth', 'Posts about growing in faith', 'Articles sur la croissance dans la foi', '#27ae60', 8)
ON CONFLICT (slug) DO NOTHING;
