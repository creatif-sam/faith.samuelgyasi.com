-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query)

create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('bar', 'popup')),
  title text,
  message text not null,
  cta_text text,
  cta_url text,
  dismissible boolean not null default true,
  active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table announcements enable row level security;

-- Anyone can read active announcements (needed for the public site to display them)
create policy "Public can read announcements"
  on announcements for select
  using (true);

-- Only authenticated admins can write (mirrors the pattern used by other admin tables)
create policy "Admins can manage announcements"
  on announcements for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
