-- =========================================================
-- ARISE — Migration: Add video_url to exercises, add Core workout exercises
-- Run this in the Supabase SQL Editor.
-- This is safe to re-run (idempotent).
-- =========================================================

-- 1. Add video_url column to exercises (if it doesn't already exist)
alter table public.exercises
  add column if not exists video_url text;

-- 2. Update the workout_type CHECK constraint to allow 'core' workout type
--    We do this by dropping and recreating the constraint.
--    This is safe — it doesn't affect existing data.
alter table public.exercises
  drop constraint if exists exercises_workout_type_check;

alter table public.exercises
  add constraint exercises_workout_type_check
  check (workout_type in (
    'push','pull','legs','upper','lower','full_body',
    'cardio','conditioning','mobility','rest','core'
  ));

-- Also update workout_days constraint to allow 'core'
alter table public.workout_days
  drop constraint if exists workout_days_workout_type_check;

alter table public.workout_days
  add constraint workout_days_workout_type_check
  check (workout_type in (
    'push','pull','legs','upper','lower','full_body',
    'cardio','conditioning','mobility','rest','core'
  ));

-- 3. Insert Core exercises (idempotent — skips existing names)
insert into public.exercises (
  name, category, muscle_group, equipment, difficulty,
  instructions, default_sets, default_reps, default_duration_seconds,
  rest_seconds, workout_type, video_url
)
select * from (values
  (
    'Plank', 'conditioning', 'core', 'bodyweight', 'beginner',
    'Support your body on forearms and toes, keeping a straight line from head to heels. Brace your core and breathe steadily. Do not let your hips sag or rise.',
    3, null, 45, 30, 'core',
    'https://www.youtube.com/results?search_query=plank+exercise+tutorial+form'
  ),
  (
    'Side Plank', 'conditioning', 'core', 'bodyweight', 'beginner',
    'Lie on your side. Support your body on one forearm and the side of your foot. Keep your body in a straight line and hold the position, keeping your hips lifted.',
    3, null, 30, 30, 'core',
    'https://www.youtube.com/results?search_query=side+plank+exercise+tutorial'
  ),
  (
    'Crunch', 'conditioning', 'core', 'bodyweight', 'beginner',
    'Lie on your back with knees bent. Curl your shoulders toward your pelvis by contracting your abs. Lower slowly without letting your head touch the floor.',
    3, 20, null, 30, 'core',
    'https://www.youtube.com/results?search_query=crunch+exercise+tutorial+form'
  ),
  (
    'Reverse Crunch', 'conditioning', 'core', 'bodyweight', 'beginner',
    'Lie on your back with knees bent at 90 degrees. Drive your knees toward your chest by curling your hips off the floor, then lower with control.',
    3, 15, null, 30, 'core',
    'https://www.youtube.com/results?search_query=reverse+crunch+exercise+tutorial'
  ),
  (
    'Leg Raise', 'conditioning', 'core', 'bodyweight', 'intermediate',
    'Lie flat on your back with legs straight. Keeping your lower back pressed into the floor, raise your legs to 90 degrees, then lower slowly without touching the floor.',
    3, 12, null, 45, 'core',
    'https://www.youtube.com/results?search_query=leg+raise+exercise+tutorial+form'
  ),
  (
    'Bicycle Crunch', 'conditioning', 'core', 'bodyweight', 'beginner',
    'Lie on your back with hands behind your head. Alternate bringing opposite elbow to opposite knee in a cycling motion, keeping your lower back flat.',
    3, 20, null, 30, 'core',
    'https://www.youtube.com/results?search_query=bicycle+crunch+exercise+tutorial'
  ),
  (
    'Russian Twist', 'conditioning', 'core', 'bodyweight', 'intermediate',
    'Sit with knees bent and feet lifted slightly off the floor. Lean back to a 45-degree angle. Rotate your torso from side to side, keeping your core braced.',
    3, 20, null, 30, 'core',
    'https://www.youtube.com/results?search_query=russian+twist+exercise+tutorial'
  ),
  (
    'Dead Bug', 'conditioning', 'core', 'bodyweight', 'intermediate',
    'Lie on your back, arms pointing to the ceiling, knees at 90 degrees. Lower your opposite arm and leg toward the floor simultaneously while keeping your lower back flat. Return and switch sides.',
    3, 10, null, 30, 'core',
    'https://www.youtube.com/results?search_query=dead+bug+exercise+tutorial+form'
  ),
  (
    'Bird Dog', 'conditioning', 'core', 'bodyweight', 'beginner',
    'Start on hands and knees. Extend your opposite arm and leg simultaneously until both are parallel to the floor. Hold briefly, return, and switch sides.',
    3, 10, null, 30, 'core',
    'https://www.youtube.com/results?search_query=bird+dog+exercise+tutorial+form'
  )
) as v(
  name, category, muscle_group, equipment, difficulty,
  instructions, default_sets, default_reps, default_duration_seconds,
  rest_seconds, workout_type, video_url
)
where not exists (
  select 1 from public.exercises e where e.name = v.name
);

-- 4. Update Mountain Climbers (already exists as 'conditioning') to also have video_url
update public.exercises
set video_url = 'https://www.youtube.com/results?search_query=mountain+climbers+exercise+tutorial'
where name = 'Mountain Climbers' and video_url is null;

-- 5. Add target_weight_kg column to profiles for the Progress page target weight feature
alter table public.profiles
  add column if not exists target_weight_kg numeric
  check (target_weight_kg is null or (target_weight_kg between 30 and 300));

-- Done! The app is now ready for Core workouts and video guides.
