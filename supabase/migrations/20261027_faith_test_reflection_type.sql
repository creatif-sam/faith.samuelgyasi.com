-- Adds a second Faith Analyzer test type: "reflection" (scored self-assessment,
-- e.g. "Three Islands of Life") alongside the existing "quiz" type
-- (correct/incorrect biblical questions). A reflection test has no right
-- answer — each question's options each point at a "profile" (e.g. an
-- "island"), and the result is whichever profile the person's answers
-- landed on most.

-- 1. Tag each test with its type.
alter table public.faith_tests
  add column if not exists test_type text not null default 'quiz'
    check (test_type in ('quiz', 'reflection'));

-- Optional long-form "learn more" content shown before a reflection test
-- starts (e.g. the island explanations + comparison table from the
-- original prototype). Free-form text, admin-editable, shown as-is.
alter table public.faith_tests
  add column if not exists learn_en text,
  add column if not exists learn_fr text;

-- 2. Result profiles for reflection tests (e.g. the three islands).
create table if not exists public.faith_test_profiles (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.faith_tests(id) on delete cascade,
  name_en text not null,
  name_fr text not null,
  interpretation_en text,
  interpretation_fr text,
  advice_en text,
  advice_fr text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.faith_test_profiles enable row level security;

create policy "Public can view profiles of published tests"
  on public.faith_test_profiles for select
  using (
    exists (
      select 1 from public.faith_tests ft
      where ft.id = test_id and ft.published = true
    )
  );

create policy "Admins can manage faith test profiles"
  on public.faith_test_profiles for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- 3. Reflection-type questions map each option to a profile instead of a
-- single correct answer. correct_option stays required for quiz-type
-- questions, so it's relaxed to nullable and each option gets its own
-- nullable profile reference used only when the parent test is a reflection.
alter table public.faith_test_questions
  alter column correct_option drop not null;

-- The admin question editor already treats explanations as optional
-- (sends null when left blank) for both quiz and reflection questions —
-- relax the column to match, since reflection questions in particular
-- usually won't have one.
alter table public.faith_test_questions
  alter column explanation_en drop not null,
  alter column explanation_fr drop not null;

alter table public.faith_test_questions
  add column if not exists option_a_profile_id uuid references public.faith_test_profiles(id) on delete set null,
  add column if not exists option_b_profile_id uuid references public.faith_test_profiles(id) on delete set null,
  add column if not exists option_c_profile_id uuid references public.faith_test_profiles(id) on delete set null;
