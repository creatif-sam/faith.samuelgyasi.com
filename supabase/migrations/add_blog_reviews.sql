-- Add blog reviews functionality
-- This allows tracking reviews and ratings for blog posts

-- Create blog_reviews table
CREATE TABLE IF NOT EXISTS blog_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  reviewer_name VARCHAR(100) NOT NULL,
  reviewer_email VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_reviews_post_id ON blog_reviews(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_reviews_published ON blog_reviews(published);

-- Add RLS (Row Level Security) policies
ALTER TABLE blog_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published reviews
CREATE POLICY "Published reviews are publicly readable"
  ON blog_reviews FOR SELECT
  USING (published = true);

-- Policy: Authenticated users (admin) can do everything
CREATE POLICY "Authenticated users can manage reviews"
  ON blog_reviews FOR ALL
  USING (auth.role() = 'authenticated');

-- Add comments for documentation
COMMENT ON TABLE blog_reviews IS 'Reviews and ratings for blog posts';
COMMENT ON COLUMN blog_reviews.blog_post_id IS 'Reference to the blog post being reviewed';
COMMENT ON COLUMN blog_reviews.rating IS 'Rating from 1-5 stars';
COMMENT ON COLUMN blog_reviews.published IS 'Whether the review is visible to the public';
