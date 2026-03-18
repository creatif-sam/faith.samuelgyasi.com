-- Feedback table for the floating widget (bugs & ideas)
create table if not exists public.feedback (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('bug', 'idea')),
  message     text not null,
  email       text,
  page_url    text,
  resolved    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Allow anonymous inserts (widget submits without auth)
alter table public.feedback enable row level security;

create policy "Anyone can submit feedback"
  on public.feedback for insert
  with check (true);

create policy "Service role reads feedback"
  on public.feedback for select
  using (auth.role() = 'authenticated');

create policy "Service role updates feedback"
  on public.feedback for update
  using (auth.role() = 'authenticated');

create policy "Service role deletes feedback"
  on public.feedback for delete
  using (auth.role() = 'authenticated');
