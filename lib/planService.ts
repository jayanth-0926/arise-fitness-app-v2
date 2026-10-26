"use server";

import { createClient } from "@/lib/supabase/server";
import { generateWorkoutPlan } from "@/lib/workoutGenerator";
import type { Exercise, Profile, WorkoutDay, WorkoutExercise } from "@/types";

export interface FullWorkoutDay extends WorkoutDay {
  exercises: (WorkoutExercise & { exercise: Exercise })[];
}

export interface FullPlan {
  id: string;
  name: string;
  training_style: string;
  is_manual: boolean;
  days: FullWorkoutDay[];
}

/**
 * Returns the user's active plan (manual or generated) fully hydrated with
 * days and exercises. If no active plan exists and the profile has
 * completed onboarding, a plan is generated deterministically from the
 * exercise database and persisted so it's stable across visits.
 */
export async function getOrCreateActivePlan(userId: string, profile: Profile): Promise<FullPlan | null> {
  const supabase = createClient();

  const { data: existingPlan } = await supabase
    .from("workout_plans")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .maybeSingle();

  if (existingPlan) {
    return hydratePlan(existingPlan.id, existingPlan.name, existingPlan.training_style, existingPlan.is_manual);
  }

  if (!profile.onboarding_completed) return null;

  // Generate a fresh plan from the exercise database.
  const { data: exercisePool } = await supabase.from("exercises").select("*");
  if (!exercisePool || exercisePool.length === 0) return null;

  const generated = generateWorkoutPlan(profile, exercisePool as unknown as Exercise[]);

  const { data: newPlan, error: planError } = await supabase
    .from("workout_plans")
    .insert({
      user_id: userId,
      name: "Auto-Generated Plan",
      training_style: generated.trainingStyle,
      is_manual: false,
      is_active: true,
    })
    .select()
    .single();

  if (planError || !newPlan) return null;

  for (const day of generated.days) {
    const { data: dayRow, error: dayError } = await supabase
      .from("workout_days")
      .insert({
        plan_id: newPlan.id,
        day_of_week: day.dayOfWeek,
        workout_type: day.workoutType,
        label: day.label,
      })
      .select()
      .single();

    if (dayError || !dayRow) continue;

    if (day.exercises.length > 0) {
      const rows = day.exercises.map((ex, idx) => ({
        workout_day_id: dayRow.id,
        exercise_id: ex.exercise.id,
        sets: ex.sets,
        reps: ex.reps,
        duration_seconds: ex.duration_seconds,
        rest_seconds: ex.rest_seconds,
        order_index: idx,
      }));
      await supabase.from("workout_exercises").insert(rows);
    }
  }

  return hydratePlan(newPlan.id, newPlan.name, newPlan.training_style, newPlan.is_manual);
}

async function hydratePlan(
  planId: string,
  name: string,
  trainingStyle: string,
  isManual: boolean
): Promise<FullPlan> {
  const supabase = createClient();

  const { data: days } = await supabase
    .from("workout_days")
    .select("*")
    .eq("plan_id", planId)
    .order("day_of_week", { ascending: true });

  const fullDays: FullWorkoutDay[] = [];

  for (const day of days || []) {
    const { data: exercises } = await supabase
      .from("workout_exercises")
      .select("*, exercise:exercises(*)")
      .eq("workout_day_id", day.id)
      .order("order_index", { ascending: true });

    fullDays.push({
      ...(day as WorkoutDay),
      exercises: (exercises || []) as unknown as (WorkoutExercise & { exercise: Exercise })[],
    });
  }

  return { id: planId, name, training_style: trainingStyle, is_manual: isManual, days: fullDays };
}

/**
 * Deactivates the current active plan and generates a fresh auto plan using
 * the given training style (overriding the profile's stored preference for
 * this generation only).
 */
export async function regenerateAutoPlan(userId: string, profile: Profile, style: Profile["preferred_training_style"]) {
  const supabase = createClient();

  await supabase.from("workout_plans").update({ is_active: false }).eq("user_id", userId).eq("is_active", true);

  const { data: exercisePool } = await supabase.from("exercises").select("*");
  if (!exercisePool || exercisePool.length === 0) throw new Error("Exercise database is empty.");

  const generated = generateWorkoutPlan({ ...profile, preferred_training_style: style }, exercisePool as unknown as Exercise[]);

  const { data: newPlan, error: planError } = await supabase
    .from("workout_plans")
    .insert({ user_id: userId, name: "Auto-Generated Plan", training_style: generated.trainingStyle, is_manual: false, is_active: true })
    .select()
    .single();

  if (planError || !newPlan) throw new Error(planError?.message || "Failed to create plan");

  for (const day of generated.days) {
    const { data: dayRow, error: dayError } = await supabase
      .from("workout_days")
      .insert({ plan_id: newPlan.id, day_of_week: day.dayOfWeek, workout_type: day.workoutType, label: day.label })
      .select()
      .single();

    if (dayError || !dayRow) continue;

    if (day.exercises.length > 0) {
      const rows = day.exercises.map((ex, idx) => ({
        workout_day_id: dayRow.id,
        exercise_id: ex.exercise.id,
        sets: ex.sets,
        reps: ex.reps,
        duration_seconds: ex.duration_seconds,
        rest_seconds: ex.rest_seconds,
        order_index: idx,
      }));
      await supabase.from("workout_exercises").insert(rows);
    }
  }

  await supabase.from("profiles").update({ preferred_training_style: style }).eq("id", userId);

  return newPlan.id;
}

export async function deactivateCurrentPlanAndCreateManual(
  userId: string,
  planName: string,
  trainingStyle: string,
  days: {
    dayOfWeek: number;
    workoutType: string;
    label: string;
    exercises: {
      exerciseId: string;
      sets: number;
      reps: number | null;
      durationSeconds: number | null;
      restSeconds: number;
      customLabel?: string;
    }[];
  }[]
) {
  const supabase = createClient();

  await supabase.from("workout_plans").update({ is_active: false }).eq("user_id", userId).eq("is_active", true);

  const { data: newPlan, error } = await supabase
    .from("workout_plans")
    .insert({ user_id: userId, name: planName, training_style: trainingStyle, is_manual: true, is_active: true })
    .select()
    .single();

  if (error || !newPlan) throw new Error(error?.message || "Failed to create plan");

  for (const day of days) {
    const { data: dayRow, error: dayError } = await supabase
      .from("workout_days")
      .insert({ plan_id: newPlan.id, day_of_week: day.dayOfWeek, workout_type: day.workoutType, label: day.label })
      .select()
      .single();

    if (dayError || !dayRow) continue;

    if (day.exercises.length > 0) {
      const rows = day.exercises.map((ex, idx) => ({
        workout_day_id: dayRow.id,
        exercise_id: ex.exerciseId,
        sets: ex.sets,
        reps: ex.reps,
        duration_seconds: ex.durationSeconds,
        rest_seconds: ex.restSeconds,
        order_index: idx,
      }));
      await supabase.from("workout_exercises").insert(rows);
    }
  }

  return newPlan.id;
}

