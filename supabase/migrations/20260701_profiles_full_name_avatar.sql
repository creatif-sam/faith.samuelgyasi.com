-- ============================================================
-- Add full_name, avatar_url, updated_at to public.profiles
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
--
-- The dashboard (ProfileTab, dashboard page) was written against a
-- "user_profiles" table that was never actually created — the real
-- table is "profiles" (id, role, created_at). This migration adds the
-- missing columns there and the RLS policies needed for users to read
-- and update their own profile.
-- ============================================================

alter table public.profiles
  add column if not exists full_name text,
  add column if not exists avatar_url text,
  add column if not exists updated_at timestamptz not null default now();

-- RLS: users may read and manage only their own profile row.
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
