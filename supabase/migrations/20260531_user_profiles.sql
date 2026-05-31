-- ============================================================
-- User Profiles: table + avatar storage bucket
-- ============================================================

-- 0. Helper RPC: delete_user — lets a user delete their own auth account
--    Called from the client with db.rpc("delete_user")
create or replace function public.delete_user()
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;

-- 1. Profiles table
create table if not exists user_profiles (
  id           uuid        primary key references auth.users(id) on delete cascade,
  full_name    text,
  avatar_url   text,
  updated_at   timestamptz default now()
);

-- 2. Row Level Security
alter table user_profiles enable row level security;

-- Users read/write only their own profile
create policy "users_read_own_profile"
  on user_profiles for select
  using (auth.uid() = id);

create policy "users_upsert_own_profile"
  on user_profiles for insert
  with check (auth.uid() = id);

create policy "users_update_own_profile"
  on user_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins can read all profiles (uses service role key on server side)
-- No explicit policy needed; service-role bypasses RLS automatically.

-- 3. Auto-create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop if exists then recreate to be idempotent
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Backfill existing users (no-op if already exists)
insert into public.user_profiles (id)
select id from auth.users
on conflict (id) do nothing;

-- ============================================================
-- Storage bucket: avatars
-- Run these in the Supabase Dashboard > Storage > New Bucket
-- OR via SQL using the storage schema helpers below.
-- ============================================================

-- Create the avatars bucket (public so avatar URLs are directly accessible)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152,                         -- 2 MB limit
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do nothing;

-- Storage RLS: users can upload/update/delete only their own avatar
-- Files should be stored as: avatars/{user_id}/avatar.{ext}
create policy "avatar_upload_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatar_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatar_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Public read (bucket is public so this is supplemental)
create policy "avatar_read_public"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');
