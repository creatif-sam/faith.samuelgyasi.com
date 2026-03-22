-- Migration: Redesign discipleship system for tracking individuals
-- Date: 2026-03-22
-- Description: Creates disciples table and disciple_progress table for tracking spiritual growth

-- =============================================
-- 1. Create disciples table
-- =============================================
CREATE TABLE IF NOT EXISTS disciples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  current_course TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_disciples_status ON disciples(status);
CREATE INDEX IF NOT EXISTS idx_disciples_started_at ON disciples(started_at);

-- Add comments
COMMENT ON TABLE disciples IS 'Track individuals in discipleship program';
COMMENT ON COLUMN disciples.current_course IS 'Current course or module the disciple is following';
COMMENT ON COLUMN disciples.status IS 'Current status: active, inactive, or graduated';
COMMENT ON COLUMN disciples.notes IS 'General notes about the disciple';

-- =============================================
-- 2. Create disciple_progress table
-- =============================================
CREATE TABLE IF NOT EXISTS disciple_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disciple_id UUID NOT NULL REFERENCES disciples(id) ON DELETE CASCADE,
  entry_date TIMESTAMPTZ DEFAULT NOW(),
  changes_observed TEXT,
  challenges TEXT,
  next_steps TEXT,
  course_milestone TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_disciple_progress_disciple_id ON disciple_progress(disciple_id);
CREATE INDEX IF NOT EXISTS idx_disciple_progress_entry_date ON disciple_progress(entry_date DESC);

-- Add comments
COMMENT ON TABLE disciple_progress IS 'Track progress entries and notes for each disciple';
COMMENT ON COLUMN disciple_progress.changes_observed IS 'Positive changes or growth observed';
COMMENT ON COLUMN disciple_progress.challenges IS 'Challenges or struggles the disciple is facing';
COMMENT ON COLUMN disciple_progress.next_steps IS 'Recommended next steps or action items';
COMMENT ON COLUMN disciple_progress.course_milestone IS 'Course-related milestone or achievement';

-- =============================================
-- 3. Update trigger for disciples
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_disciples_updated_at ON disciples;
CREATE TRIGGER update_disciples_updated_at
  BEFORE UPDATE ON disciples
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 4. Sample courses for reference (optional)
-- =============================================
-- You can maintain a list of available courses elsewhere, 
-- but here are some suggestions:
-- - Foundations of Faith
-- - Prayer & Worship
-- - Bible Study Methods
-- - Spiritual Leadership
-- - Evangelism & Outreach
-- - Character Development
