-- Add infographie_url column to blog_posts
alter table public.blog_posts
  add column if not exists infographie_url text;

-- Create public storage bucket for blog images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  10485760,  -- 10 MB max per file
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Allow authenticated users (admin) to upload
create policy "Authenticated users can upload blog images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog-images');

-- Allow authenticated users to update/replace
create policy "Authenticated users can update blog images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'blog-images');

-- Allow authenticated users to delete
create policy "Authenticated users can delete blog images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog-images');

-- Allow public read access
create policy "Public can read blog images"
  on storage.objects for select
  to public
  using (bucket_id = 'blog-images');
