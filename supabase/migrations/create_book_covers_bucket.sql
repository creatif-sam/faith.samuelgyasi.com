-- SQL to create storage bucket for book covers
-- Run this in your Supabase SQL editor

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'book-covers',
  'book-covers',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- Set up RLS policies for the bucket
-- Allow public read access
CREATE POLICY "Public read access for book covers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'book-covers');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload book covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'book-covers');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update book covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'book-covers');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete book covers"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'book-covers');

-- Optional: If you want to reuse existing buckets instead
-- You can use the 'blog-covers' bucket if it already exists
-- Just change the upload code in the admin panel from:
-- db.storage.from("book-covers")
-- to:
-- db.storage.from("blog-covers")
