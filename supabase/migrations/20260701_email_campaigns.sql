-- ============================================================
-- Email campaigns (bulk sends) + template categories
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Template categories
alter table public.email_templates
  add column if not exists category text;

-- 2. Campaigns table
create table if not exists public.email_campaigns (
  id                uuid primary key default gen_random_uuid(),
  subject           text not null,
  body_html         text not null default '',
  body_text         text,
  template_id       uuid references public.email_templates(id) on delete set null,
  recipient_type    text not null default 'custom' check (recipient_type in ('custom', 'subscribers')),
  recipient_filter  text,
  recipient_emails  text[],
  total_recipients  int not null default 0,
  sent_count        int not null default 0,
  failed_count      int not null default 0,
  status            text not null default 'draft' check (status in ('draft', 'sending', 'sent', 'failed')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  sent_at           timestamptz
);

create index if not exists email_campaigns_created_at_idx on public.email_campaigns (created_at desc);

-- 3. RLS — single-admin site: any authenticated user has full access
alter table public.email_campaigns enable row level security;

drop policy if exists "email_campaigns_all_authenticated" on public.email_campaigns;
create policy "email_campaigns_all_authenticated"
  on public.email_campaigns
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

grant select, insert, update, delete
  on public.email_campaigns
  to authenticated;
