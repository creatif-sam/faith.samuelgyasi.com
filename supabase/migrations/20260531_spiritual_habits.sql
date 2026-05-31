-- ============================================================
-- Spiritual Habits: tables, RLS policies
-- ============================================================

-- 1. Habits (habit definitions per user)
create table if not exists spiritual_habits (
  id          uuid        default gen_random_uuid() primary key,
  user_id     uuid        references auth.users(id) on delete cascade not null,
  name        text        not null,
  description text,
  icon        text        default '🙏',
  color       text        default '#d4a843',
  frequency   text        default 'daily' check (frequency in ('daily','weekly')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 2. Habit logs (daily check-ins)
create table if not exists habit_logs (
  id          uuid  default gen_random_uuid() primary key,
  habit_id    uuid  references spiritual_habits(id) on delete cascade not null,
  user_id     uuid  references auth.users(id) on delete cascade not null,
  logged_date date  not null,
  note        text,
  created_at  timestamptz default now(),
  unique (habit_id, logged_date)
);

-- 3. Row Level Security
alter table spiritual_habits enable row level security;
alter table habit_logs       enable row level security;

-- Users manage their own habits
create policy "users_manage_own_habits"
  on spiritual_habits for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users manage their own habit logs
create policy "users_manage_own_habit_logs"
  on habit_logs for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Service-role / admin can read everything (for admin dashboard)
create policy "service_read_habits"
  on spiritual_habits for select
  using (true);

create policy "service_read_habit_logs"
  on habit_logs for select
  using (true);

-- 4. Indexes for performance
create index if not exists habit_logs_habit_id_idx   on habit_logs (habit_id);
create index if not exists habit_logs_user_id_idx    on habit_logs (user_id);
create index if not exists habit_logs_date_idx       on habit_logs (logged_date);
create index if not exists spiritual_habits_user_idx on spiritual_habits (user_id);
