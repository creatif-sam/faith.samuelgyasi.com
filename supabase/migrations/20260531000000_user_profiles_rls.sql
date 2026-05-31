-- ============================================================
-- user_profiles table + RLS
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Create the table if it doesn't already exist
create table if not exists public.user_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  updated_at  timestamptz default now()
);

-- 2. Enable Row Level Security
alter table public.user_profiles enable row level security;

-- 3. Drop any old/broken policies before recreating them
drop policy if exists "user_profiles_select_own"  on public.user_profiles;
drop policy if exists "user_profiles_insert_own"  on public.user_profiles;
drop policy if exists "user_profiles_update_own"  on public.user_profiles;
drop policy if exists "user_profiles_delete_own"  on public.user_profiles;

-- 4. Allow each user to read their own row
create policy "user_profiles_select_own"
  on public.user_profiles
  for select
  using ( auth.uid() = id );

-- 5. Allow each user to insert their own row
create policy "user_profiles_insert_own"
  on public.user_profiles
  for insert
  with check ( auth.uid() = id );

-- 6. Allow each user to update their own row
create policy "user_profiles_update_own"
  on public.user_profiles
  for update
  using ( auth.uid() = id )
  with check ( auth.uid() = id );

-- 7. Allow each user to delete their own row (needed for account deletion)
create policy "user_profiles_delete_own"
  on public.user_profiles
  for delete
  using ( auth.uid() = id );

-- 8. Grant table access to authenticated role
grant select, insert, update, delete
  on public.user_profiles
  to authenticated;
