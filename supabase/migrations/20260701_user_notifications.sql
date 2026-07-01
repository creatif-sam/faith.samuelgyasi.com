-- ============================================================
-- Participant notifications (admin-sendable messages to a user)
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

create table if not exists public.user_notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  body        text,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists user_notifications_user_id_idx on public.user_notifications (user_id, created_at desc);

alter table public.user_notifications enable row level security;

-- Each participant can only see and mark-as-read their own notifications.
drop policy if exists "user_notifications_select_own" on public.user_notifications;
create policy "user_notifications_select_own"
  on public.user_notifications
  for select
  using (auth.uid() = user_id);

drop policy if exists "user_notifications_update_own" on public.user_notifications;
create policy "user_notifications_update_own"
  on public.user_notifications
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Only admins can send a notification to a (possibly different) user.
drop policy if exists "user_notifications_admin_insert" on public.user_notifications;
create policy "user_notifications_admin_insert"
  on public.user_notifications
  for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
