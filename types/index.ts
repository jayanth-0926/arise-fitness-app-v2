export type FitnessGoal =
  | "muscle_gain"
  | "fat_loss"
  | "strength"
  | "general_fitness"
  | "endurance"
  | "mobility";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export type TrainingStyle =
  | "push_pull_legs"
  | "upper_lower"
  | "full_body"
  | "strength_conditioning"
  | "cardio"
  | "flexibility_mobility";

export type ExerciseCategory =
  | "strength"
  | "conditioning"
  | "cardio"
  | "flexibility";

export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "legs"
  | "glutes"
  | "core"
  | "full_body"
  | "cardio"
  | "mobility";

export type WorkoutType =
  | "push"
  | "pull"
  | "legs"
  | "upper"
  | "lower"
  | "full_body"
  | "cardio"
  | "conditioning"
  | "mobility"
  | "rest";

export interface Profile {
  id: string;
  full_name: string | null;
  age: number | null;
  gender: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  fitness_goal: FitnessGoal | null;
  experience_level: ExperienceLevel | null;
  training_days_per_week: number | null;
  preferred_duration_minutes: number | null;
  available_equipment: string[] | null;
  preferred_training_style: TrainingStyle | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscle_group: MuscleGroup;
  equipment: string;
  difficulty: ExperienceLevel;
  instructions: string;
  default_sets: number | null;
  default_reps: number | null;
  default_duration_seconds: number | null;
  rest_seconds: number;
  workout_type: WorkoutType;
}

export interface WorkoutPlan {
  id: string;
  user_id: string;
  name: string;
  training_style: TrainingStyle;
  is_manual: boolean;
  is_active: boolean;
  created_at: string;
}

export interface WorkoutDay {
  id: string;
  plan_id: string;
  day_of_week: number; // 0 = Sunday ... 6 = Saturday
  workout_type: WorkoutType;
  label: string;
}

export interface WorkoutExercise {
  id: string;
  workout_day_id: string;
  exercise_id: string;
  sets: number;
  reps: number | null;
  duration_seconds: number | null;
  rest_seconds: number;
  order_index: number;
  exercise?: Exercise;
}

export interface WorkoutCompletion {
  id: string;
  user_id: string;
  workout_day_id: string | null;
  completed_at: string;
  scheduled_date: string;
}

export interface Measurement {
  id: string;
  user_id: string;
  weight_kg: number | null;
  recorded_at: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  weekActivity: { day: string; completed: boolean; date: string }[];
}

export interface BMIResult {
  bmi: number;
  category: "Underweight" | "Normal range" | "Overweight" | "Obesity range";
}
