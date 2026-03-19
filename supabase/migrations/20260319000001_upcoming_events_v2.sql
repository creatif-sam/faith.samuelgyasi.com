-- Extend upcoming_events with new rich fields
alter table public.upcoming_events
  add column if not exists event_date        date,
  add column if not exists flyer_url         text,
  add column if not exists format            text default 'in-person'
    check (format in ('online', 'in-person', 'both')),
  add column if not exists needs_registration boolean not null default false,
  add column if not exists join_url          text,
  add column if not exists facebook_url      text,
  add column if not exists host_name         text,
  add column if not exists host_url          text,
  add column if not exists recording_signup  boolean not null default false;

-- Event registrations (attendance + recording signups)
create table if not exists public.event_registrations (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references public.upcoming_events(id) on delete cascade,
  type       text not null default 'attendance'
    check (type in ('attendance', 'recording')),
  name       text,
  email      text not null,
  phone      text,
  message    text,
  created_at timestamptz not null default now()
);

alter table public.event_registrations enable row level security;

create policy "Anyone can register for an event"
  on public.event_registrations for insert
  with check (true);

create policy "Authenticated users can view registrations"
  on public.event_registrations for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete registrations"
  on public.event_registrations for delete
  using (auth.role() = 'authenticated');

-- Storage bucket for event flyers
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-flyers',
  'event-flyers',
  true,
  15728640,  -- 15 MB
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

create policy "Authenticated can upload event flyers"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'event-flyers');

create policy "Authenticated can update event flyers"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'event-flyers');

create policy "Authenticated can delete event flyers"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'event-flyers');

create policy "Public can read event flyers"
  on storage.objects for select
  to public
  using (bucket_id = 'event-flyers');
