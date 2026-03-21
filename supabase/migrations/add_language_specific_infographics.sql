-- Add language-specific infographic fields for blog posts
-- This allows different infographics for English and French versions

-- Rename existing infographie_url to infographie_url_fr (assuming it was French)
ALTER TABLE blog_posts 
RENAME COLUMN infographie_url TO infographie_url_fr;

-- Add new column for English infographic
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS infographie_url_en TEXT;

-- Add comments for clarity
COMMENT ON COLUMN blog_posts.infographie_url_en IS 'URL for English version infographic/summary image';
COMMENT ON COLUMN blog_posts.infographie_url_fr IS 'URL for French version infographic/summary image';

-- If you want to keep both (old and new names), uncomment below:
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS infographie_url_en TEXT;
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS infographie_url_fr TEXT;
