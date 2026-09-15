import type { StreakData, WorkoutCompletion } from "@/types";

const DAY_MS = 24 * 60 * 60 * 1000;

function toDateOnly(dateStr: string): string {
  // Normalizes any ISO timestamp/date string to a YYYY-MM-DD key in local time.
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function dateKeyToUTCms(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/**
 * Computes current streak, longest streak, and a 7-day activity view from
 * real workout_completions rows. A "day" counts once even if multiple
 * workouts were logged that day. Streak breaks whenever a calendar day is
 * skipped between two completions (rest days are only excused via the
 * weekly-activity display, not silently absorbed into the streak — the
 * streak reflects actual consecutive completed days).
 */
export function calculateStreak(completions: WorkoutCompletion[]): StreakData {
  const uniqueDayKeys = Array.from(
    new Set(completions.map((c) => toDateOnly(c.scheduled_date || c.completed_at)))
  ).sort();

  const totalWorkouts = completions.length;

  let longestStreak = 0;
  let runningStreak = 0;
  let previousMs: number | null = null;

  for (const key of uniqueDayKeys) {
    const ms = dateKeyToUTCms(key);
    if (previousMs !== null && ms - previousMs === DAY_MS) {
      runningStreak += 1;
    } else {
      runningStreak = 1;
    }
    longestStreak = Math.max(longestStreak, runningStreak);
    previousMs = ms;
  }

  // Current streak: walk backward from today (or yesterday, to allow for
  // "haven't logged today yet") as long as consecutive days are present.
  const todayKey = toDateOnly(new Date().toISOString());
  const todayMs = dateKeyToUTCms(todayKey);
  const daySet = new Set(uniqueDayKeys.map(dateKeyToUTCms));

  let currentStreak = 0;
  let cursor = daySet.has(todayMs) ? todayMs : todayMs - DAY_MS;

  while (daySet.has(cursor)) {
    currentStreak += 1;
    cursor -= DAY_MS;
  }

  // Build the current week's Mon-Sun activity view.
  const now = new Date();
  const dow = now.getDay(); // 0 = Sunday
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);

  const weekActivity = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
    const labels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    return {
      day: labels[i],
      date: key,
      completed: daySet.has(dateKeyToUTCms(key)),
    };
  });

  return { currentStreak, longestStreak, totalWorkouts, weekActivity };
}
