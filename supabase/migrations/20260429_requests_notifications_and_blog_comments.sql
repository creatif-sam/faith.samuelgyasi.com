create table if not exists public.notify_requests (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  source text not null default 'upcoming',
  note text,
  created_at timestamptz not null default now()
);

create index if not exists notify_requests_created_at_idx on public.notify_requests (created_at desc);

alter table public.notify_requests enable row level security;

drop policy if exists "Anyone can insert notify requests" on public.notify_requests;
create policy "Anyone can insert notify requests"
  on public.notify_requests
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Authenticated can read notify requests" on public.notify_requests;
create policy "Authenticated can read notify requests"
  on public.notify_requests
  for select
  to authenticated
  using (true);

create table if not exists public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  blog_post_id uuid not null references public.blog_posts(id) on delete cascade,
  commenter_name text not null,
  commenter_email text,
  comment_text text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_comments_post_created_idx on public.blog_comments (blog_post_id, created_at desc);
create index if not exists blog_comments_approved_idx on public.blog_comments (approved);

alter table public.blog_comments enable row level security;

drop policy if exists "Anyone can insert blog comments" on public.blog_comments;
create policy "Anyone can insert blog comments"
  on public.blog_comments
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Anyone can read approved blog comments" on public.blog_comments;
create policy "Anyone can read approved blog comments"
  on public.blog_comments
  for select
  to anon, authenticated
  using (approved = true);

drop policy if exists "Authenticated can moderate blog comments" on public.blog_comments;
create policy "Authenticated can moderate blog comments"
  on public.blog_comments
  for update
  to authenticated
  using (true)
  with check (true);

create table if not exists public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  source_table text not null,
  source_id text,
  kind text not null,
  title text not null,
  body text,
  payload jsonb not null default '{}'::jsonb,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists admin_notifications_read_created_idx on public.admin_notifications (read, created_at desc);

alter table public.admin_notifications enable row level security;

drop policy if exists "Authenticated can read admin notifications" on public.admin_notifications;
create policy "Authenticated can read admin notifications"
  on public.admin_notifications
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can update admin notifications" on public.admin_notifications;
create policy "Authenticated can update admin notifications"
  on public.admin_notifications
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "System can insert admin notifications" on public.admin_notifications;
create policy "System can insert admin notifications"
  on public.admin_notifications
  for insert
  to anon, authenticated
  with check (true);

create or replace function public.push_admin_notification(
  p_source_table text,
  p_source_id text,
  p_kind text,
  p_title text,
  p_body text,
  p_payload jsonb default '{}'::jsonb
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.admin_notifications(source_table, source_id, kind, title, body, payload)
  values (p_source_table, p_source_id, p_kind, p_title, p_body, coalesce(p_payload, '{}'::jsonb));
end;
$$;

create or replace function public.notify_on_feedback_insert()
returns trigger
language plpgsql
as $$
begin
  perform public.push_admin_notification(
    'feedback',
    new.id::text,
    'feedback',
    'New feedback submitted',
    coalesce(new.message, ''),
    jsonb_build_object('type', new.type, 'email', new.email, 'page_url', new.page_url)
  );
  return new;
end;
$$;

do $$
begin
  if to_regclass('public.feedback') is not null then
    drop trigger if exists trg_notify_feedback_insert on public.feedback;
    create trigger trg_notify_feedback_insert
    after insert on public.feedback
    for each row execute function public.notify_on_feedback_insert();
  end if;
end
$$;

create or replace function public.notify_on_prayer_insert()
returns trigger
language plpgsql
as $$
begin
  perform public.push_admin_notification(
    'prayer_submissions',
    new.id::text,
    'prayer',
    'New prayer request',
    coalesce(new.prayer_topic, 'Prayer request'),
    jsonb_build_object('name', new.name, 'email', new.email, 'is_urgent', new.is_urgent)
  );
  return new;
end;
$$;

do $$
begin
  if to_regclass('public.prayer_submissions') is not null then
    drop trigger if exists trg_notify_prayer_insert on public.prayer_submissions;
    create trigger trg_notify_prayer_insert
    after insert on public.prayer_submissions
    for each row execute function public.notify_on_prayer_insert();
  end if;
end
$$;

create or replace function public.notify_on_event_registration_insert()
returns trigger
language plpgsql
as $$
begin
  if coalesce(new.type, '') = 'recording' then
    perform public.push_admin_notification(
      'event_registrations',
      new.id::text,
      'transcript-request',
      'New recording/transcript request',
      coalesce(new.email, 'No email'),
      jsonb_build_object('event_id', new.event_id, 'type', new.type)
    );
  else
    perform public.push_admin_notification(
      'event_registrations',
      new.id::text,
      'event-registration',
      'New event registration',
      coalesce(new.email, 'No email'),
      jsonb_build_object('event_id', new.event_id, 'type', new.type)
    );
  end if;
  return new;
end;
$$;

do $$
begin
  if to_regclass('public.event_registrations') is not null then
    drop trigger if exists trg_notify_event_registration_insert on public.event_registrations;
    create trigger trg_notify_event_registration_insert
    after insert on public.event_registrations
    for each row execute function public.notify_on_event_registration_insert();
  end if;
end
$$;

create or replace function public.notify_on_notify_request_insert()
returns trigger
language plpgsql
as $$
begin
  perform public.push_admin_notification(
    'notify_requests',
    new.id::text,
    'notify-me',
    'New notify-me request',
    coalesce(new.email, ''),
    jsonb_build_object('name', new.name, 'source', new.source, 'note', new.note)
  );
  return new;
end;
$$;

drop trigger if exists trg_notify_notify_request_insert on public.notify_requests;
create trigger trg_notify_notify_request_insert
after insert on public.notify_requests
for each row execute function public.notify_on_notify_request_insert();
