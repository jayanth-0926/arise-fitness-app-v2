import type {
  Exercise,
  ExperienceLevel,
  FitnessGoal,
  Profile,
  TrainingStyle,
  WorkoutType,
} from "@/types";

export interface GeneratedExercise {
  exercise: Exercise;
  sets: number;
  reps: number | null;
  duration_seconds: number | null;
  rest_seconds: number;
}

export interface GeneratedDay {
  dayOfWeek: number; // 0 = Sunday
  dayLabel: string;
  workoutType: WorkoutType;
  label: string;
  exercises: GeneratedExercise[];
}

export interface GeneratedPlan {
  trainingStyle: TrainingStyle;
  days: GeneratedDay[];
}

const DAY_LABELS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

const WORKOUT_TYPE_LABEL: Record<WorkoutType, string> = {
  push: "Push",
  pull: "Pull",
  legs: "Legs",
  upper: "Upper Body",
  lower: "Lower Body",
  full_body: "Full Body",
  cardio: "Cardio",
  conditioning: "Conditioning",
  mobility: "Mobility & Recovery",
  core: "Core",
  arms: "Arms",
  calisthenics: "Calisthenics",
  hybrid: "Hybrid",
  rest: "Rest",
};

/**
 * Builds the sequence of workout types across a 7-day week (Mon-first order
 * internally, mapped to day-of-week afterward) based on the chosen training
 * style and how many training days the user wants.
 */
function buildWeeklyPattern(style: TrainingStyle, daysPerWeek: number): WorkoutType[] {
  const cycles: Record<TrainingStyle, WorkoutType[]> = {
    push_pull_legs: ["push", "pull", "legs"],
    upper_lower: ["upper", "lower"],
    full_body: ["full_body"],
    strength_conditioning: ["full_body", "conditioning"],
    cardio: ["cardio"],
    flexibility_mobility: ["mobility"],
  };

  const cycle = cycles[style];
  const pattern: WorkoutType[] = [];
  let cycleIndex = 0;
  let trainingDaysPlaced = 0;
  let daysSinceRest = 0;

  // Spread training days across 7 slots (Mon..Sun), inserting rest days so
  // no more than 3 consecutive training days occur when a rest is due.
  const restEvery = daysPerWeek >= 6 ? 7 : daysPerWeek === 5 ? 3 : 2;

  for (let i = 0; i < 7; i++) {
    const remainingSlots = 7 - i;
    const remainingTrainingDays = daysPerWeek - trainingDaysPlaced;

    const mustTrain = remainingTrainingDays >= remainingSlots;
    const shouldRest =
      !mustTrain &&
      remainingTrainingDays > 0 &&
      daysSinceRest >= restEvery &&
      trainingDaysPlaced < daysPerWeek;

    if (remainingTrainingDays <= 0) {
      pattern.push("rest");
      continue;
    }

    if (shouldRest) {
      pattern.push("rest");
      daysSinceRest = 0;
      continue;
    }

    pattern.push(cycle[cycleIndex % cycle.length]);
    cycleIndex++;
    trainingDaysPlaced++;
    daysSinceRest++;
  }

  return pattern;
}

function exerciseCountForDuration(durationMinutes: number, experience: ExperienceLevel): number {
  // Roughly one exercise per 6-8 working minutes, adjusted by experience.
  const base = Math.round(durationMinutes / 7);
  if (experience === "beginner") return Math.max(3, base - 1);
  if (experience === "advanced") return Math.max(5, base + 1);
  return Math.max(4, base);
}

function setsRepsForGoal(
  goal: FitnessGoal,
  experience: ExperienceLevel
): { sets: number; reps: number; rest: number } {
  const experienceBonus = experience === "advanced" ? 1 : 0;
  switch (goal) {
    case "strength":
      return { sets: 4 + experienceBonus, reps: 5, rest: 120 };
    case "muscle_gain":
      return { sets: 3 + experienceBonus, reps: 10, rest: 75 };
    case "fat_loss":
      return { sets: 3, reps: 15, rest: 45 };
    case "endurance":
      return { sets: 3, reps: 18, rest: 40 };
    case "mobility":
      return { sets: 2, reps: 12, rest: 30 };
    default:
      return { sets: 3, reps: 12, rest: 60 };
  }
}

function equipmentAllowed(exercise: Exercise, available: string[]): boolean {
  if (!available || available.length === 0) return true; // no restriction set
  const eq = exercise.equipment.toLowerCase();
  if (eq === "bodyweight" || eq === "none") return true;
  return available.some((a) => eq.includes(a.toLowerCase()));
}

function experienceAllowed(exercise: Exercise, level: ExperienceLevel): boolean {
  const order: ExperienceLevel[] = ["beginner", "intermediate", "advanced"];
  return order.indexOf(exercise.difficulty) <= order.indexOf(level);
}

const MUSCLE_GROUPS_BY_TYPE: Record<WorkoutType, string[]> = {
  push: ["chest", "shoulders", "triceps", "core"],
  pull: ["back", "biceps", "core"],
  legs: ["legs", "glutes", "core"],
  upper: ["chest", "back", "shoulders", "biceps", "triceps"],
  lower: ["legs", "glutes", "core"],
  full_body: ["chest", "back", "legs", "shoulders", "core", "glutes"],
  cardio: ["cardio"],
  conditioning: ["cardio", "full_body", "core"],
  mobility: ["mobility", "core"],
  core: ["core"],
  arms: ["biceps", "triceps"],
  calisthenics: ["chest", "back", "shoulders", "core", "legs", "triceps", "biceps"],
  hybrid: ["full_body", "cardio", "core"],
  rest: [],
};

function pickExercisesForDay(
  pool: Exercise[],
  workoutType: WorkoutType,
  count: number,
  experience: ExperienceLevel,
  equipment: string[]
): Exercise[] {
  const muscleGroups = MUSCLE_GROUPS_BY_TYPE[workoutType];
  const candidates = pool.filter(
    (e) =>
      e.workout_type === workoutType &&
      muscleGroups.includes(e.muscle_group) &&
      experienceAllowed(e, experience) &&
      equipmentAllowed(e, equipment)
  );

  // Distribute across muscle groups round-robin so no single group dominates.
  const byGroup: Record<string, Exercise[]> = {};
  for (const ex of candidates) {
    byGroup[ex.muscle_group] = byGroup[ex.muscle_group] || [];
    byGroup[ex.muscle_group].push(ex);
  }
  const groups = Object.keys(byGroup);
  const selected: Exercise[] = [];
  let groupIndex = 0;
  const usedIds = new Set<string>();

  while (selected.length < count && groups.length > 0) {
    const group = groups[groupIndex % groups.length];
    const options = byGroup[group].filter((e) => !usedIds.has(e.id));
    if (options.length > 0) {
      const chosen = options[0];
      selected.push(chosen);
      usedIds.add(chosen.id);
    }
    groupIndex++;
    if (groupIndex > groups.length * count + count) break; // safety valve
  }

  return selected.slice(0, count);
}

export function generateWorkoutPlan(profile: Profile, exercisePool: Exercise[]): GeneratedPlan {
  const style = profile.preferred_training_style ?? "full_body";
  const goal = profile.fitness_goal ?? "general_fitness";
  const experience = profile.experience_level ?? "beginner";
  const daysPerWeek = profile.training_days_per_week ?? 3;
  const duration = profile.preferred_duration_minutes ?? 45;
  const equipment = profile.available_equipment ?? [];

  const pattern = buildWeeklyPattern(style, daysPerWeek);
  const { sets, reps, rest } = setsRepsForGoal(goal, experience);
  const exerciseCount = exerciseCountForDuration(duration, experience);

  const days: GeneratedDay[] = pattern.map((workoutType, i) => {
    const dayOfWeek = (i + 1) % 7; // pattern[0] = Monday -> dayOfWeek 1

    if (workoutType === "rest") {
      return {
        dayOfWeek,
        dayLabel: DAY_LABELS[dayOfWeek],
        workoutType,
        label: "Rest",
        exercises: [],
      };
    }

    const picked = pickExercisesForDay(exercisePool, workoutType, exerciseCount, experience, equipment);

    const exercises: GeneratedExercise[] = picked.map((exercise) => {
      const isCardioLike = exercise.category === "cardio" || exercise.muscle_group === "cardio";
      const isMobility = exercise.category === "flexibility";
      return {
        exercise,
        sets: isMobility ? 2 : sets,
        reps: isCardioLike || isMobility ? null : reps,
        duration_seconds: isCardioLike || isMobility ? exercise.default_duration_seconds ?? 600 : null,
        rest_seconds: isMobility ? 20 : rest,
      };
    });

    return {
      dayOfWeek,
      dayLabel: DAY_LABELS[dayOfWeek],
      workoutType,
      label: WORKOUT_TYPE_LABEL[workoutType],
      exercises,
    };
  });

  return { trainingStyle: style, days };
}

export function getTodaysWorkoutType(plan: GeneratedPlan): GeneratedDay | null {
  const todayDow = new Date().getDay();
  return plan.days.find((d) => d.dayOfWeek === todayDow) ?? null;
}
