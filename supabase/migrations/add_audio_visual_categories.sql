-- SQL to add audio and visual categories to library_items table
-- Run this in your Supabase SQL editor

-- Add duration column to library_items table
ALTER TABLE library_items
ADD COLUMN IF NOT EXISTS duration TEXT;

-- Update the category check constraint to include audio and visual
-- First, drop the existing constraint if it exists
ALTER TABLE library_items DROP CONSTRAINT IF EXISTS library_items_category_check;

-- Add new constraint with all four categories
ALTER TABLE library_items 
ADD CONSTRAINT library_items_category_check 
CHECK (category IN ('ebook', 'review', 'audio', 'visual'));

-- Optional: Add some comments for documentation
COMMENT ON COLUMN library_items.duration IS 'Duration for audio/visual items (e.g., "45 min", "1hr 20min")';
COMMENT ON COLUMN library_items.category IS 'Type of library item: ebook, review, audio, or visual';
