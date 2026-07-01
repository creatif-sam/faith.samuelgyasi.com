-- ============================================================
-- Track which blog posts a logged-in disciple has actually read,
-- so it can be surfaced as a "Blogs Read" stat on their dashboard.
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

create table if not exists public.blog_reads (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  blog_post_id  uuid not null references public.blog_posts(id) on delete cascade,
  read_at       timestamptz not null default now(),
  unique (user_id, blog_post_id)
);

create index if not exists blog_reads_user_id_idx on public.blog_reads (user_id);

alter table public.blog_reads enable row level security;

-- A disciple can only see and record their own reads.
drop policy if exists "blog_reads_select_own" on public.blog_reads;
create policy "blog_reads_select_own"
  on public.blog_reads
  for select
  using (auth.uid() = user_id);

drop policy if exists "blog_reads_insert_own" on public.blog_reads;
create policy "blog_reads_insert_own"
  on public.blog_reads
  for insert
  with check (auth.uid() = user_id);
