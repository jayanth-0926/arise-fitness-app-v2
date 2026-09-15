import type { Measurement, WorkoutCompletion } from "@/types";

function dateOnly(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function workoutsInRange(completions: WorkoutCompletion[], start: Date, end: Date): number {
  const startKey = dateOnly(start);
  const endKey = dateOnly(end);
  const days = new Set(completions.map((c) => dateOnly(new Date(c.scheduled_date))));
  let count = 0;
  for (const key of days) {
    if (key >= startKey && key <= endKey) count++;
  }
  return count;
}

export function workoutsThisWeek(completions: WorkoutCompletion[]): number {
  const now = new Date();
  const dow = now.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);
  return workoutsInRange(completions, monday, now);
}

export function workoutsThisMonth(completions: WorkoutCompletion[]): number {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return workoutsInRange(completions, firstOfMonth, now);
}

export function completionRate(completions: WorkoutCompletion[], daysPerWeek: number | null): number {
  if (!daysPerWeek || completions.length === 0) return 0;
  const days = Array.from(new Set(completions.map((c) => dateOnly(new Date(c.scheduled_date))))).sort();
  const first = new Date(days[0]);
  const now = new Date();
  const weeksElapsed = Math.max(1, Math.ceil((now.getTime() - first.getTime()) / (7 * 24 * 60 * 60 * 1000)));
  const expected = weeksElapsed * daysPerWeek;
  return Math.min(100, Math.round((days.length / expected) * 100));
}

export interface WeeklyBucket {
  label: string;
  count: number;
}

export function lastNWeeksActivity(completions: WorkoutCompletion[], weeks = 8): WeeklyBucket[] {
  const now = new Date();
  const dow = now.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const thisMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);

  const buckets: WeeklyBucket[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const start = new Date(thisMonday);
    start.setDate(thisMonday.getDate() - i * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const count = workoutsInRange(completions, start, end);
    buckets.push({ label: `${start.getMonth() + 1}/${start.getDate()}`, count });
  }
  return buckets;
}

export function weightHistory(measurements: Measurement[]): { date: string; weight: number }[] {
  return measurements
    .filter((m) => m.weight_kg != null)
    .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime())
    .map((m) => ({ date: dateOnly(new Date(m.recorded_at)), weight: m.weight_kg as number }));
}
