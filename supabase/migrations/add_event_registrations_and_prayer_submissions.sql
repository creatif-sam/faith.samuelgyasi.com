-- Create event_registrations table for Task 1
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES upcoming_events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster queries by event
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_created_at ON event_registrations(created_at DESC);

-- Create prayer_submissions table for Task 6
CREATE TABLE IF NOT EXISTS prayer_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  prayer_topic TEXT NOT NULL,
  details TEXT,
  is_urgent BOOLEAN DEFAULT FALSE,
  prayed_for BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX idx_prayer_submissions_created_at ON prayer_submissions(created_at DESC);
CREATE INDEX idx_prayer_submissions_prayed_for ON prayer_submissions(prayed_for);

-- Create discipleship_content table for Task 5
CREATE TABLE IF NOT EXISTS discipleship_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_fr TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments for clarity
COMMENT ON TABLE event_registrations IS 'Stores participant registrations for upcoming events';
COMMENT ON TABLE prayer_submissions IS 'Stores prayer requests submitted by visitors';
COMMENT ON TABLE discipleship_content IS 'Stores discipleship content managed by admin';
