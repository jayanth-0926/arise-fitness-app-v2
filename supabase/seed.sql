-- =========================================================
-- ARISE — Exercise seed data
-- Run after schema.sql. Safe to re-run (checks for existing names).
-- =========================================================

insert into public.exercises (name, category, muscle_group, equipment, difficulty, instructions, default_sets, default_reps, default_duration_seconds, rest_seconds, workout_type)
select * from (values
  -- PUSH (chest, shoulders, triceps)
  ('Bench Press', 'strength', 'chest', 'barbell', 'intermediate', 'Lie on a flat bench, lower the bar to mid-chest with control, press back up to full extension.', 4, 8, null, 90, 'push'),
  ('Incline Dumbbell Press', 'strength', 'chest', 'dumbbell', 'intermediate', 'On an incline bench, press dumbbells from shoulder height to full extension above the upper chest.', 3, 10, null, 75, 'push'),
  ('Push Ups', 'strength', 'chest', 'bodyweight', 'beginner', 'Hands under shoulders, lower chest to the floor keeping a straight line from head to heels, press back up.', 3, 15, null, 60, 'push'),
  ('Shoulder Press', 'strength', 'shoulders', 'dumbbell', 'beginner', 'Press dumbbells overhead from shoulder height until arms are fully extended, lower with control.', 3, 10, null, 75, 'push'),
  ('Lateral Raise', 'strength', 'shoulders', 'dumbbell', 'beginner', 'Raise dumbbells out to the sides to shoulder height with a slight elbow bend, lower slowly.', 3, 15, null, 45, 'push'),
  ('Tricep Pushdown', 'strength', 'triceps', 'cable', 'beginner', 'Using a cable machine, push the bar down until arms are fully extended, keeping elbows tucked.', 3, 12, null, 45, 'push'),
  ('Dips', 'strength', 'triceps', 'bodyweight', 'intermediate', 'Lower your body between parallel bars until elbows reach 90 degrees, press back up.', 3, 10, null, 75, 'push'),
  ('Overhead Tricep Extension', 'strength', 'triceps', 'dumbbell', 'beginner', 'Hold a dumbbell overhead with both hands, lower behind the head, extend back up.', 3, 12, null, 45, 'push'),

  -- PULL (back, biceps)
  ('Pull Ups', 'strength', 'back', 'bodyweight', 'intermediate', 'Hang from a bar with an overhand grip, pull your chin above the bar, lower with control.', 4, 8, null, 90, 'pull'),
  ('Lat Pulldown', 'strength', 'back', 'cable', 'beginner', 'Pull the bar down to upper chest while keeping your torso upright, control it back up.', 3, 10, null, 75, 'pull'),
  ('Barbell Row', 'strength', 'back', 'barbell', 'intermediate', 'Hinge at the hips, row the bar to your lower ribcage, squeeze shoulder blades together.', 4, 8, null, 90, 'pull'),
  ('Seated Cable Row', 'strength', 'back', 'cable', 'beginner', 'Pull the handle to your torso keeping your back straight, extend arms fully on the return.', 3, 12, null, 60, 'pull'),
  ('Bicep Curl', 'strength', 'biceps', 'dumbbell', 'beginner', 'Curl dumbbells from full extension to shoulder height, keeping elbows fixed at your sides.', 3, 12, null, 45, 'pull'),
  ('Hammer Curl', 'strength', 'biceps', 'dumbbell', 'beginner', 'Curl dumbbells with a neutral grip, keeping wrists straight throughout the movement.', 3, 12, null, 45, 'pull'),
  ('Face Pull', 'strength', 'back', 'cable', 'beginner', 'Pull the rope toward your face at eye level, flaring elbows out for rear-shoulder engagement.', 3, 15, null, 45, 'pull'),
  ('Single-Arm Dumbbell Row', 'strength', 'back', 'dumbbell', 'beginner', 'Supporting yourself on a bench, row a dumbbell to your hip, keeping your torso stable.', 3, 10, null, 60, 'pull'),

  -- LEGS (legs, glutes)
  ('Squat', 'strength', 'legs', 'barbell', 'intermediate', 'Bar on your upper back, squat down until thighs are parallel to the floor, drive back up.', 4, 8, null, 120, 'legs'),
  ('Leg Press', 'strength', 'legs', 'machine', 'beginner', 'Press the platform away by extending your knees and hips, control the return.', 3, 12, null, 75, 'legs'),
  ('Lunges', 'strength', 'legs', 'dumbbell', 'beginner', 'Step forward and lower until both knees form 90-degree angles, push back to standing.', 3, 12, null, 60, 'legs'),
  ('Romanian Deadlift', 'strength', 'legs', 'barbell', 'intermediate', 'Hinge at the hips with a slight knee bend, lower the bar along your legs, drive hips forward to stand.', 4, 8, null, 90, 'legs'),
  ('Leg Curl', 'strength', 'legs', 'machine', 'beginner', 'Curl the pad toward your glutes by bending your knees, control the return.', 3, 12, null, 60, 'legs'),
  ('Leg Extension', 'strength', 'legs', 'machine', 'beginner', 'Extend your knees to lift the pad, squeeze at the top, lower with control.', 3, 12, null, 60, 'legs'),
  ('Hip Thrust', 'strength', 'glutes', 'barbell', 'intermediate', 'Upper back on a bench, drive hips up by squeezing glutes, lower with control.', 4, 10, null, 75, 'legs'),
  ('Bulgarian Split Squat', 'strength', 'glutes', 'dumbbell', 'intermediate', 'Rear foot elevated, lower into a lunge until the front thigh is parallel to the floor, drive up.', 3, 10, null, 75, 'legs'),
  ('Calf Raise', 'strength', 'legs', 'machine', 'beginner', 'Rise onto the balls of your feet, pause at the top, lower slowly below neutral.', 3, 15, null, 45, 'legs'),

  -- UPPER (combined push/pull for upper/lower split)
  ('Incline Barbell Press', 'strength', 'chest', 'barbell', 'intermediate', 'On an incline bench, lower the bar to your upper chest and press to full extension.', 4, 8, null, 90, 'upper'),
  ('Chin Ups', 'strength', 'back', 'bodyweight', 'intermediate', 'Underhand grip, pull your chin above the bar, lower under control.', 3, 8, null, 90, 'upper'),
  ('Arnold Press', 'strength', 'shoulders', 'dumbbell', 'intermediate', 'Rotate palms from facing you to forward as you press overhead, reverse on the way down.', 3, 10, null, 75, 'upper'),
  ('Cable Fly', 'strength', 'chest', 'cable', 'beginner', 'With a slight elbow bend, bring handles together in front of your chest, control the return.', 3, 12, null, 60, 'upper'),
  ('Preacher Curl', 'strength', 'biceps', 'barbell', 'intermediate', 'Resting arms on a preacher bench, curl the bar up fully then lower with control.', 3, 10, null, 60, 'upper'),
  ('Skull Crushers', 'strength', 'triceps', 'barbell', 'intermediate', 'Lying down, lower the bar toward your forehead by bending elbows, extend back up.', 3, 10, null, 60, 'upper'),

  -- LOWER
  ('Front Squat', 'strength', 'legs', 'barbell', 'advanced', 'Bar racked on front shoulders, squat down keeping your torso upright, drive back up.', 4, 6, null, 120, 'lower'),
  ('Goblet Squat', 'strength', 'legs', 'dumbbell', 'beginner', 'Hold a dumbbell at chest height, squat down between your knees, stand back up.', 3, 12, null, 60, 'lower'),
  ('Glute Bridge', 'strength', 'glutes', 'bodyweight', 'beginner', 'Lying on your back, drive hips up by squeezing glutes, lower with control.', 3, 15, null, 45, 'lower'),
  ('Step Ups', 'strength', 'legs', 'dumbbell', 'beginner', 'Step onto a box or bench, drive through the lead leg to stand, step back down.', 3, 10, null, 60, 'lower'),

  -- FULL BODY
  ('Deadlift', 'strength', 'full_body', 'barbell', 'advanced', 'Hinge at the hips, grip the bar, drive through your heels to stand fully upright.', 4, 5, null, 150, 'full_body'),
  ('Kettlebell Swing', 'conditioning', 'full_body', 'kettlebell', 'beginner', 'Hinge at the hips and swing the kettlebell to chest height using hip drive, not your arms.', 4, 15, null, 60, 'full_body'),
  ('Clean and Press', 'strength', 'full_body', 'barbell', 'advanced', 'Pull the bar from the floor to shoulder height, then press overhead in one controlled sequence.', 3, 6, null, 120, 'full_body'),
  ('Bodyweight Squat', 'strength', 'legs', 'bodyweight', 'beginner', 'Feet shoulder-width apart, squat down until thighs are parallel, stand back up.', 3, 15, null, 45, 'full_body'),
  ('Renegade Row', 'strength', 'back', 'dumbbell', 'advanced', 'In a plank position, row one dumbbell at a time while stabilizing your core.', 3, 10, null, 60, 'full_body'),

  -- CARDIO
  ('Running', 'cardio', 'cardio', 'bodyweight', 'beginner', 'Maintain a steady pace at a conversational effort for the full duration.', 1, null, 1200, 60, 'cardio'),
  ('Cycling', 'cardio', 'cardio', 'machine', 'beginner', 'Maintain a moderate resistance and steady cadence for the full duration.', 1, null, 1200, 60, 'cardio'),
  ('Jump Rope', 'cardio', 'cardio', 'bodyweight', 'beginner', 'Skip continuously with light, quick bounces, resting briefly if needed.', 3, null, 300, 45, 'cardio'),
  ('Rowing Machine', 'cardio', 'cardio', 'machine', 'intermediate', 'Drive with your legs, lean back slightly, pull the handle to your chest, reverse smoothly.', 1, null, 900, 60, 'cardio'),
  ('Stair Climber', 'cardio', 'cardio', 'machine', 'beginner', 'Maintain a steady climbing pace, keeping your posture upright.', 1, null, 900, 60, 'cardio'),

  -- CONDITIONING
  ('Burpees', 'conditioning', 'full_body', 'bodyweight', 'intermediate', 'Drop into a squat, kick back to a plank, do a push up, jump feet forward, jump up.', 4, 12, null, 45, 'conditioning'),
  ('Mountain Climbers', 'conditioning', 'core', 'bodyweight', 'beginner', 'In a plank position, drive knees toward your chest rapidly, alternating legs.', 4, 20, null, 30, 'conditioning'),
  ('Battle Ropes', 'conditioning', 'full_body', 'machine', 'intermediate', 'Alternate slamming the ropes up and down with maximum effort for the set duration.', 4, null, 30, 45, 'conditioning'),
  ('Box Jumps', 'conditioning', 'legs', 'machine', 'intermediate', 'Jump onto a box landing softly with both feet, step back down and reset.', 4, 10, null, 60, 'conditioning'),
  ('Sled Push', 'conditioning', 'full_body', 'machine', 'advanced', 'Drive through your legs to push the sled forward for the set distance.', 4, null, 40, 60, 'conditioning'),
  ('Wall Balls', 'conditioning', 'full_body', 'machine', 'intermediate', 'Squat down holding a medicine ball, drive up and throw it to a target, catch and repeat.', 4, 15, null, 45, 'conditioning'),

  -- MOBILITY / FLEXIBILITY
  ('Plank', 'flexibility', 'core', 'bodyweight', 'beginner', 'Hold a straight line from head to heels, bracing your core, breathing steadily.', 3, null, 45, 30, 'mobility'),
  ('Crunches', 'flexibility', 'core', 'bodyweight', 'beginner', 'Curl your shoulders toward your pelvis, squeezing your abs, lower with control.', 3, 20, null, 30, 'mobility'),
  ('Cat-Cow Stretch', 'flexibility', 'mobility', 'bodyweight', 'beginner', 'On hands and knees, alternate arching and rounding your spine slowly.', 2, 10, null, 15, 'mobility'),
  ('Hip Flexor Stretch', 'flexibility', 'mobility', 'bodyweight', 'beginner', 'In a lunge position, shift your hips forward gently until you feel a stretch, hold.', 2, null, 30, 15, 'mobility'),
  ('World''s Greatest Stretch', 'flexibility', 'mobility', 'bodyweight', 'intermediate', 'From a lunge, rotate your torso toward the front leg, reaching upward, then reset.', 2, 8, null, 20, 'mobility'),
  ('Downward Dog to Cobra Flow', 'flexibility', 'mobility', 'bodyweight', 'beginner', 'Flow slowly between downward dog and cobra pose, breathing with each transition.', 2, 8, null, 15, 'mobility'),
  ('Shoulder Dislocates', 'flexibility', 'mobility', 'bands', 'beginner', 'Holding a band or stick wide, rotate it from front to back keeping arms straight.', 2, 12, null, 15, 'mobility'),
  ('Standing Quad Stretch', 'flexibility', 'mobility', 'bodyweight', 'beginner', 'Pull one heel toward your glutes while standing, keeping knees together, hold and switch.', 2, null, 30, 15, 'mobility')
) as v(name, category, muscle_group, equipment, difficulty, instructions, default_sets, default_reps, default_duration_seconds, rest_seconds, workout_type)
where not exists (
  select 1 from public.exercises e where e.name = v.name
);
