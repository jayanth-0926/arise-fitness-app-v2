"use server";

import { createClient } from "@/lib/supabase/server";
import { calculateStreak } from "@/lib/streak";
import type { WorkoutCompletion } from "@/types";

function todayDateKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function getCompletions(userId: string): Promise<WorkoutCompletion[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("workout_completions")
    .select("*")
    .eq("user_id", userId)
    .order("scheduled_date", { ascending: true });
  return (data || []) as unknown as WorkoutCompletion[];
}

export async function getStreak(userId: string) {
  const completions = await getCompletions(userId);
  return calculateStreak(completions);
}

export async function hasCompletedToday(userId: string): Promise<boolean> {
  const supabase = createClient();
  const { data } = await supabase
    .from("workout_completions")
    .select("id")
    .eq("user_id", userId)
    .eq("scheduled_date", todayDateKey())
    .maybeSingle();
  return !!data;
}

/**
 * Records a workout completion for today. Guarded by a unique constraint on
 * (user_id, scheduled_date, workout_day_id) at the database level, so a
 * duplicate insert for the same scheduled workout/date is rejected rather
 * than silently creating a second record.
 */
export async function markWorkoutComplete(userId: string, workoutDayId: string | null) {
  const supabase = createClient();
  const today = todayDateKey();

  const { data: existing } = await supabase
    .from("workout_completions")
    .select("id")
    .eq("user_id", userId)
    .eq("scheduled_date", today)
    .maybeSingle();

  if (existing) {
    return { success: false, message: "Today's workout is already marked complete." };
  }

  const { error } = await supabase.from("workout_completions").insert({
    user_id: userId,
    workout_day_id: workoutDayId,
    scheduled_date: today,
    completed_at: new Date().toISOString(),
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Workout marked complete." };
}
