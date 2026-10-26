-- =========================================================
-- ARISE — Migration: Arms, Calisthenics, Hybrid categories
-- Also adds 'arms', 'calisthenics', 'hybrid' workout_type values.
-- Run in Supabase SQL Editor. Safe to re-run (idempotent).
-- =========================================================

-- 1. Expand workout_type CHECK constraints to include new types
alter table public.exercises
  drop constraint if exists exercises_workout_type_check;

alter table public.exercises
  add constraint exercises_workout_type_check
  check (workout_type in (
    'push','pull','legs','upper','lower','full_body',
    'cardio','conditioning','mobility','rest','core',
    'arms','calisthenics','hybrid'
  ));

alter table public.workout_days
  drop constraint if exists workout_days_workout_type_check;

alter table public.workout_days
  add constraint workout_days_workout_type_check
  check (workout_type in (
    'push','pull','legs','upper','lower','full_body',
    'cardio','conditioning','mobility','rest','core',
    'arms','calisthenics','hybrid'
  ));

-- 2. Ensure video_url column exists (idempotent with IF NOT EXISTS)
alter table public.exercises
  add column if not exists video_url text;

-- =========================================================
-- ARMS EXERCISES (biceps + triceps)
-- =========================================================
insert into public.exercises (
  name, category, muscle_group, equipment, difficulty,
  instructions, default_sets, default_reps, default_duration_seconds,
  rest_seconds, workout_type, video_url
)
select * from (values
  -- BICEPS
  ('Barbell Curl', 'strength', 'biceps', 'barbell', 'beginner',
   'Stand holding a barbell with an underhand shoulder-width grip. Keep your elbows tucked at your sides and curl the bar up to shoulder height. Lower with control.',
   4, 10, null, 60, 'arms', 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo'),

  ('Incline Dumbbell Curl', 'strength', 'biceps', 'dumbbell', 'intermediate',
   'Sit on an incline bench with a dumbbell in each hand, arms fully extended. Curl both dumbbells up while keeping your upper arms stationary, fully supinating the wrist at the top.',
   3, 12, null, 60, 'arms', 'https://www.youtube.com/watch?v=soxrZlIl35U'),

  ('Cable Curl', 'strength', 'biceps', 'cable', 'beginner',
   'Stand facing a low cable pulley with an underhand grip on the straight bar. Curl the bar up while keeping your elbows stationary. Squeeze at the top and lower slowly.',
   3, 15, null, 45, 'arms', 'https://www.youtube.com/watch?v=NFzTWp2qpiE'),

  -- TRICEPS
  ('Close-Grip Bench Press', 'strength', 'triceps', 'barbell', 'intermediate',
   'Lie on a flat bench and grip the barbell with hands shoulder-width apart. Lower the bar to your lower chest keeping your elbows tucked, press back up to full extension.',
   4, 8, null, 90, 'arms', 'https://www.youtube.com/watch?v=nEF0bv2FW94'),

  ('Dumbbell Kickback', 'strength', 'triceps', 'dumbbell', 'beginner',
   'Hinge forward at the hips with a dumbbell in one hand. Extend your arm back until it is fully straight, squeezing the tricep at full extension. Lower with control.',
   3, 15, null, 45, 'arms', 'https://www.youtube.com/watch?v=6SS6K3lAwZ8'),

  ('Cable Overhead Extension', 'strength', 'triceps', 'cable', 'beginner',
   'Stand facing away from a high cable pulley. Hold the rope overhead with both hands. Extend your arms forward and overhead, keeping your elbows close together.',
   3, 12, null, 45, 'arms', 'https://www.youtube.com/watch?v=d_KpBkno-X4')
) as v(
  name, category, muscle_group, equipment, difficulty,
  instructions, default_sets, default_reps, default_duration_seconds,
  rest_seconds, workout_type, video_url
)
where not exists (select 1 from public.exercises e where e.name = v.name);

-- =========================================================
-- CALISTHENICS EXERCISES
-- =========================================================
insert into public.exercises (
  name, category, muscle_group, equipment, difficulty,
  instructions, default_sets, default_reps, default_duration_seconds,
  rest_seconds, workout_type, video_url
)
select * from (values
  -- BEGINNER
  ('Knee Push-up', 'strength', 'chest', 'bodyweight', 'beginner',
   'Start on hands and knees. Lower your chest toward the floor keeping your core braced, then push back up. Maintain a straight line from knees to shoulders.',
   3, 15, null, 45, 'calisthenics', 'https://www.youtube.com/watch?v=jWxvty2KROs'),

  ('Dead Hang', 'strength', 'back', 'bodyweight', 'beginner',
   'Grip a pull-up bar with both hands, hang with arms fully extended. Keep your shoulders engaged (not shrugged to ears). Hold for the set time while breathing steadily.',
   3, null, 30, 45, 'calisthenics', 'https://www.youtube.com/watch?v=o_NiHqZfOH4'),

  ('Hanging Knee Raise', 'conditioning', 'core', 'bodyweight', 'intermediate',
   'Hang from a pull-up bar. Draw your knees up toward your chest by contracting your abs. Lower with control, avoiding swinging.',
   3, 12, null, 45, 'calisthenics', 'https://www.youtube.com/watch?v=hdng3Nm1x_E'),

  -- INTERMEDIATE
  ('Diamond Push-up', 'strength', 'triceps', 'bodyweight', 'intermediate',
   'Place your hands close together beneath your chest forming a diamond shape. Lower your chest to your hands keeping elbows tucked, press back up.',
   3, 10, null, 60, 'calisthenics', 'https://www.youtube.com/watch?v=J0DnG1_S92I'),

  ('Decline Push-up', 'strength', 'chest', 'bodyweight', 'intermediate',
   'Place your feet elevated on a bench or box, hands on the floor. Lower your chest toward the floor keeping your body straight, press back up.',
   3, 12, null, 60, 'calisthenics', 'https://www.youtube.com/watch?v=SKPab2tT8HM'),

  -- ADVANCED
  ('Muscle-up', 'strength', 'back', 'bodyweight', 'advanced',
   'Begin with a kipping pull-up and as you reach the bar, press through it by transitioning into a dip. Push up to full arm extension above the bar. This requires significant strength and technique.',
   3, 5, null, 120, 'calisthenics', 'https://www.youtube.com/watch?v=bt9ztqSPFCU'),

  ('Handstand Push-up', 'strength', 'shoulders', 'bodyweight', 'advanced',
   'Kick up into a handstand against a wall. Lower your head toward the floor by bending your elbows, then press back up to full extension. Keep your core tight throughout.',
   3, 5, null, 120, 'calisthenics', 'https://www.youtube.com/watch?v=vl6hOZs6rpI'),

  ('Front Lever', 'strength', 'back', 'bodyweight', 'advanced',
   'Hang from a bar and raise your body until it is parallel to the ground, arms straight. Hold your body perfectly horizontal with legs together, maintaining full tension throughout.',
   3, null, 5, 120, 'calisthenics', 'https://www.youtube.com/watch?v=tiLn0_7qNlc'),

  ('Pistol Squat', 'strength', 'legs', 'bodyweight', 'advanced',
   'Stand on one leg with the other extended in front of you. Squat down on the single leg until your hamstring touches your calf, then drive back up using only that leg.',
   3, 5, null, 90, 'calisthenics', 'https://www.youtube.com/watch?v=vq5-vdgJc0I'),

  ('Handstand', 'strength', 'shoulders', 'bodyweight', 'advanced',
   'Kick up against a wall to a full handstand position. Keep your arms straight, core tight, and body in a straight vertical line. Hold the position breathing steadily.',
   3, null, 20, 90, 'calisthenics', 'https://www.youtube.com/watch?v=i0tLNoDRHOc'),

  ('L-sit', 'conditioning', 'core', 'bodyweight', 'advanced',
   'Support yourself on parallel bars or the floor with straight arms. Raise your legs parallel to the ground forming an L shape. Hold, keeping your core and quads fully contracted.',
   3, null, 10, 90, 'calisthenics', 'https://www.youtube.com/watch?v=llKFM09vNMk')
) as v(
  name, category, muscle_group, equipment, difficulty,
  instructions, default_sets, default_reps, default_duration_seconds,
  rest_seconds, workout_type, video_url
)
where not exists (select 1 from public.exercises e where e.name = v.name);

-- =========================================================
-- HYBRID EXERCISES (combinations of strength + cardio/calisthenics)
-- =========================================================
insert into public.exercises (
  name, category, muscle_group, equipment, difficulty,
  instructions, default_sets, default_reps, default_duration_seconds,
  rest_seconds, workout_type, video_url
)
select * from (values
  ('Burpee Pull-up', 'conditioning', 'full_body', 'bodyweight', 'advanced',
   'Perform a burpee. As you jump up at the end, grab the pull-up bar overhead and perform one pull-up. Lower yourself and repeat the full sequence.',
   4, 6, null, 90, 'hybrid', 'https://www.youtube.com/results?search_query=burpee+pull-up+exercise'),

  ('Thrusters', 'conditioning', 'full_body', 'barbell', 'intermediate',
   'Hold a barbell at shoulder height. Squat down until thighs are parallel to the floor, then drive up explosively and press the bar overhead in one fluid movement.',
   4, 10, null, 75, 'hybrid', 'https://www.youtube.com/results?search_query=barbell+thruster+exercise+tutorial'),

  ('Kettlebell Complex', 'conditioning', 'full_body', 'kettlebell', 'intermediate',
   'Perform a sequence without rest: kettlebell deadlift, row, clean, squat, and press on each rep. Move continuously through all movements for the set reps.',
   3, 8, null, 90, 'hybrid', 'https://www.youtube.com/results?search_query=kettlebell+complex+workout'),

  ('Sprint Intervals', 'cardio', 'cardio', 'bodyweight', 'intermediate',
   'Sprint at maximum effort for 20–30 seconds, then rest for 40 seconds. Repeat for the set number of rounds. Focus on maximum output during each sprint.',
   8, null, 20, 40, 'hybrid', 'https://www.youtube.com/results?search_query=sprint+interval+training+HIIT'),

  ('Sandbag Clean and Carry', 'conditioning', 'full_body', 'machine', 'advanced',
   'Clean a sandbag from the floor to your shoulder, then walk a set distance. Lower it and repeat on the other shoulder. This builds grip, core, and full-body conditioning simultaneously.',
   4, 6, null, 90, 'hybrid', 'https://www.youtube.com/results?search_query=sandbag+clean+carry+exercise'),

  ('Push-up to Row', 'conditioning', 'full_body', 'dumbbell', 'intermediate',
   'In a plank position holding dumbbells, perform a push-up. At the top, row one dumbbell to your hip while balancing on the other arm. Alternate sides each rep.',
   3, 10, null, 60, 'hybrid', 'https://www.youtube.com/results?search_query=push-up+row+exercise+tutorial')
) as v(
  name, category, muscle_group, equipment, difficulty,
  instructions, default_sets, default_reps, default_duration_seconds,
  rest_seconds, workout_type, video_url
)
where not exists (select 1 from public.exercises e where e.name = v.name);

-- 3. Update Hammer Curl and Preacher Curl to arms workout_type
-- (they exist in push/pull but should also appear in arms searches)
-- We use INSERT to add arms-specific versions rather than modifying existing rows
insert into public.exercises (
  name, category, muscle_group, equipment, difficulty,
  instructions, default_sets, default_reps, default_duration_seconds,
  rest_seconds, workout_type, video_url
)
select * from (values
  ('Hammer Curl (Arms)', 'strength', 'biceps', 'dumbbell', 'beginner',
   'Curl dumbbells with a neutral (hammer) grip, keeping your wrists straight throughout. This targets both the bicep and brachialis for thicker, wider arms.',
   3, 12, null, 45, 'arms', 'https://www.youtube.com/watch?v=zC3nLlEvin4'),

  ('Skull Crushers (Arms)', 'strength', 'triceps', 'barbell', 'intermediate',
   'Lying flat, hold a barbell with arms extended above your chest. Bend only at the elbows to lower the bar toward your forehead, then extend back up. Keep upper arms vertical throughout.',
   3, 10, null, 60, 'arms', 'https://www.youtube.com/watch?v=NIyuKTZ9E6c'),

  ('Tricep Pushdown (Arms)', 'strength', 'triceps', 'cable', 'beginner',
   'Stand at a cable machine with a straight bar at head height. Keeping elbows pinned at your sides, push the bar down to full arm extension. Contract the triceps hard at the bottom.',
   3, 15, null, 45, 'arms', 'https://www.youtube.com/watch?v=2-LAMcpzODU'),

  ('Overhead Tricep Extension (Arms)', 'strength', 'triceps', 'dumbbell', 'beginner',
   'Hold a single dumbbell overhead with both hands. Lower it behind your head by bending only at the elbows, then extend back to the start. Keep your upper arms close to your ears.',
   3, 12, null, 45, 'arms', 'https://www.youtube.com/watch?v=nRiJVZDpdL0'),

  ('Preacher Curl (Arms)', 'strength', 'biceps', 'barbell', 'intermediate',
   'Seat yourself at a preacher bench with your upper arms resting flat on the pad. Curl the bar up fully, squeeze the bicep at the top, then lower with a 3-second count.',
   3, 10, null, 60, 'arms', 'https://www.youtube.com/watch?v=fIWP-FRFNU0')
) as v(
  name, category, muscle_group, equipment, difficulty,
  instructions, default_sets, default_reps, default_duration_seconds,
  rest_seconds, workout_type, video_url
)
where not exists (select 1 from public.exercises e where e.name = v.name);

-- Done. All new exercises added with proper workout_types.
