-- =========================================================
-- ARISE — Supabase schema
-- Run this entire file in the Supabase SQL Editor.
-- =========================================================

-- Extensions
create extension if not exists "pgcrypto";

-- =========================================================
-- PROFILES
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  age integer check (age is null or (age between 13 and 100)),
  gender text,
  height_cm numeric check (height_cm is null or (height_cm between 100 and 250)),
  weight_kg numeric check (weight_kg is null or (weight_kg between 30 and 300)),
  fitness_goal text check (fitness_goal in ('muscle_gain','fat_loss','strength','general_fitness','endurance','mobility')),
  experience_level text check (experience_level in ('beginner','intermediate','advanced')),
  training_days_per_week integer check (training_days_per_week between 2 and 7),
  preferred_duration_minutes integer check (preferred_duration_minutes in (20,30,45,60,90)),
  available_equipment text[] default '{}',
  preferred_training_style text check (preferred_training_style in ('push_pull_legs','upper_lower','full_body','strength_conditioning','cardio','flexibility_mobility')),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_id on public.profiles (id);

-- =========================================================
-- EXERCISES  (public read-only reference data)
-- =========================================================
create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('strength','conditioning','cardio','flexibility')),
  muscle_group text not null check (muscle_group in ('chest','back','shoulders','biceps','triceps','legs','glutes','core','full_body','cardio','mobility')),
  equipment text not null default 'bodyweight',
  difficulty text not null check (difficulty in ('beginner','intermediate','advanced')),
  instructions text not null,
  default_sets integer,
  default_reps integer,
  default_duration_seconds integer,
  rest_seconds integer not null default 60,
  workout_type text not null check (workout_type in ('push','pull','legs','upper','lower','full_body','cardio','conditioning','mobility','rest'))
);

create index if not exists idx_exercises_workout_type on public.exercises (workout_type);
create index if not exists idx_exercises_muscle_group on public.exercises (muscle_group);

-- =========================================================
-- WORKOUT PLANS
-- =========================================================
create table if not exists public.workout_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null default 'My Plan',
  training_style text not null check (training_style in ('push_pull_legs','upper_lower','full_body','strength_conditioning','cardio','flexibility_mobility')),
  is_manual boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_workout_plans_user on public.workout_plans (user_id);
create index if not exists idx_workout_plans_active on public.workout_plans (user_id, is_active);

-- Only one active plan per user at a time.
create unique index if not exists uniq_one_active_plan_per_user
  on public.workout_plans (user_id)
  where (is_active);

-- =========================================================
-- WORKOUT DAYS  (one row per day-of-week in a plan)
-- =========================================================
create table if not exists public.workout_days (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.workout_plans (id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6), -- 0 = Sunday
  workout_type text not null check (workout_type in ('push','pull','legs','upper','lower','full_body','cardio','conditioning','mobility','rest')),
  label text not null
);

create index if not exists idx_workout_days_plan on public.workout_days (plan_id);
create unique index if not exists uniq_day_per_plan on public.workout_days (plan_id, day_of_week);

-- =========================================================
-- WORKOUT EXERCISES  (exercises scheduled within a workout day)
-- =========================================================
create table if not exists public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_day_id uuid not null references public.workout_days (id) on delete cascade,
  exercise_id uuid not null references public.exercises (id) on delete restrict,
  sets integer not null default 3,
  reps integer,
  duration_seconds integer,
  rest_seconds integer not null default 60,
  order_index integer not null default 0
);

create index if not exists idx_workout_exercises_day on public.workout_exercises (workout_day_id);

-- =========================================================
-- WORKOUT COMPLETIONS
-- =========================================================
create table if not exists public.workout_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  workout_day_id uuid references public.workout_days (id) on delete set null,
  scheduled_date date not null,
  completed_at timestamptz not null default now()
);

create index if not exists idx_completions_user on public.workout_completions (user_id);

-- Prevents duplicate completion records for the same user/date.
create unique index if not exists uniq_completion_per_user_per_day
  on public.workout_completions (user_id, scheduled_date);

-- =========================================================
-- MEASUREMENTS  (weight history over time)
-- =========================================================
create table if not exists public.measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  weight_kg numeric,
  recorded_at timestamptz not null default now()
);

create index if not exists idx_measurements_user on public.measurements (user_id, recorded_at);

-- =========================================================
-- updated_at trigger for profiles
-- =========================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================
alter table public.profiles enable row level security;
alter table public.exercises enable row level security;
alter table public.workout_plans enable row level security;
alter table public.workout_days enable row level security;
alter table public.workout_exercises enable row level security;
alter table public.workout_completions enable row level security;
alter table public.measurements enable row level security;

-- PROFILES: users manage only their own row
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- EXERCISES: readable by any authenticated user, not writable from the client
drop policy if exists "exercises_select_authenticated" on public.exercises;
create policy "exercises_select_authenticated" on public.exercises
  for select using (auth.role() = 'authenticated');

-- WORKOUT PLANS
drop policy if exists "plans_select_own" on public.workout_plans;
create policy "plans_select_own" on public.workout_plans
  for select using (auth.uid() = user_id);

drop policy if exists "plans_insert_own" on public.workout_plans;
create policy "plans_insert_own" on public.workout_plans
  for insert with check (auth.uid() = user_id);

drop policy if exists "plans_update_own" on public.workout_plans;
create policy "plans_update_own" on public.workout_plans
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "plans_delete_own" on public.workout_plans;
create policy "plans_delete_own" on public.workout_plans
  for delete using (auth.uid() = user_id);

-- WORKOUT DAYS: access via ownership of the parent plan
drop policy if exists "days_select_own" on public.workout_days;
create policy "days_select_own" on public.workout_days
  for select using (exists (select 1 from public.workout_plans p where p.id = plan_id and p.user_id = auth.uid()));

drop policy if exists "days_insert_own" on public.workout_days;
create policy "days_insert_own" on public.workout_days
  for insert with check (exists (select 1 from public.workout_plans p where p.id = plan_id and p.user_id = auth.uid()));

drop policy if exists "days_update_own" on public.workout_days;
create policy "days_update_own" on public.workout_days
  for update using (exists (select 1 from public.workout_plans p where p.id = plan_id and p.user_id = auth.uid()));

drop policy if exists "days_delete_own" on public.workout_days;
create policy "days_delete_own" on public.workout_days
  for delete using (exists (select 1 from public.workout_plans p where p.id = plan_id and p.user_id = auth.uid()));

-- WORKOUT EXERCISES: access via ownership of the parent day -> plan
drop policy if exists "wex_select_own" on public.workout_exercises;
create policy "wex_select_own" on public.workout_exercises
  for select using (
    exists (
      select 1 from public.workout_days d
      join public.workout_plans p on p.id = d.plan_id
      where d.id = workout_day_id and p.user_id = auth.uid()
    )
  );

drop policy if exists "wex_insert_own" on public.workout_exercises;
create policy "wex_insert_own" on public.workout_exercises
  for insert with check (
    exists (
      select 1 from public.workout_days d
      join public.workout_plans p on p.id = d.plan_id
      where d.id = workout_day_id and p.user_id = auth.uid()
    )
  );

drop policy if exists "wex_update_own" on public.workout_exercises;
create policy "wex_update_own" on public.workout_exercises
  for update using (
    exists (
      select 1 from public.workout_days d
      join public.workout_plans p on p.id = d.plan_id
      where d.id = workout_day_id and p.user_id = auth.uid()
    )
  );

drop policy if exists "wex_delete_own" on public.workout_exercises;
create policy "wex_delete_own" on public.workout_exercises
  for delete using (
    exists (
      select 1 from public.workout_days d
      join public.workout_plans p on p.id = d.plan_id
      where d.id = workout_day_id and p.user_id = auth.uid()
    )
  );

-- WORKOUT COMPLETIONS
drop policy if exists "completions_select_own" on public.workout_completions;
create policy "completions_select_own" on public.workout_completions
  for select using (auth.uid() = user_id);

drop policy if exists "completions_insert_own" on public.workout_completions;
create policy "completions_insert_own" on public.workout_completions
  for insert with check (auth.uid() = user_id);

drop policy if exists "completions_update_own" on public.workout_completions;
create policy "completions_update_own" on public.workout_completions
  for update using (auth.uid() = user_id);

drop policy if exists "completions_delete_own" on public.workout_completions;
create policy "completions_delete_own" on public.workout_completions
  for delete using (auth.uid() = user_id);

-- MEASUREMENTS
drop policy if exists "measurements_select_own" on public.measurements;
create policy "measurements_select_own" on public.measurements
  for select using (auth.uid() = user_id);

drop policy if exists "measurements_insert_own" on public.measurements;
create policy "measurements_insert_own" on public.measurements
  for insert with check (auth.uid() = user_id);

drop policy if exists "measurements_update_own" on public.measurements;
create policy "measurements_update_own" on public.measurements
  for update using (auth.uid() = user_id);

drop policy if exists "measurements_delete_own" on public.measurements;
create policy "measurements_delete_own" on public.measurements
  for delete using (auth.uid() = user_id);
