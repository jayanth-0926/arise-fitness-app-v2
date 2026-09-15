"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { deactivateCurrentPlanAndCreateManual } from "@/lib/planService";
import type { Exercise, TrainingStyle, WorkoutType } from "@/types";

const DAYS = [
  { dow: 1, label: "MONDAY" },
  { dow: 2, label: "TUESDAY" },
  { dow: 3, label: "WEDNESDAY" },
  { dow: 4, label: "THURSDAY" },
  { dow: 5, label: "FRIDAY" },
  { dow: 6, label: "SATURDAY" },
  { dow: 0, label: "SUNDAY" },
];

const WORKOUT_TYPES: WorkoutType[] = [
  "push", "pull", "legs", "upper", "lower", "full_body", "cardio", "conditioning", "mobility", "rest",
];

interface DayEntry {
  dayOfWeek: number;
  workoutType: WorkoutType;
  label: string;
  exercises: {
    exerciseId: string;
    name: string;
    sets: number;
    reps: number | null;
    durationSeconds: number | null;
    restSeconds: number;
  }[];
}

export default function ManualPlanBuilder({ userId, exercises }: { userId: string; exercises: Exercise[] }) {
  const router = useRouter();
  const [planName, setPlanName] = useState("My Manual Plan");
  const [activeDow, setActiveDow] = useState(1);
  const [days, setDays] = useState<DayEntry[]>(
    DAYS.map((d) => ({ dayOfWeek: d.dow, workoutType: "rest", label: "Rest", exercises: [] }))
  );
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pickerExercise, setPickerExercise] = useState("");

  const activeDay = days.find((d) => d.dayOfWeek === activeDow)!;

  function updateActiveDay(patch: Partial<DayEntry>) {
    setDays((prev) => prev.map((d) => (d.dayOfWeek === activeDow ? { ...d, ...patch } : d)));
  }

  function addExercise() {
    const ex = exercises.find((e) => e.id === pickerExercise);
    if (!ex) return;
    updateActiveDay({
      exercises: [
        ...activeDay.exercises,
        {
          exerciseId: ex.id,
          name: ex.name,
          sets: ex.default_sets ?? 3,
          reps: ex.default_reps,
          durationSeconds: ex.default_duration_seconds,
          restSeconds: ex.rest_seconds,
        },
      ],
    });
    setPickerExercise("");
  }

  function removeExercise(idx: number) {
    updateActiveDay({ exercises: activeDay.exercises.filter((_, i) => i !== idx) });
  }

  function updateExerciseField(idx: number, field: "sets" | "reps" | "restSeconds", value: number) {
    const next = [...activeDay.exercises];
    next[idx] = { ...next[idx], [field]: value };
    updateActiveDay({ exercises: next });
  }

  function inferTrainingStyle(): TrainingStyle {
    const types = new Set(days.filter((d) => d.workoutType !== "rest").map((d) => d.workoutType));
    if (types.has("push") && types.has("pull") && types.has("legs")) return "push_pull_legs";
    if (types.has("upper") && types.has("lower")) return "upper_lower";
    if (types.size === 1 && types.has("cardio")) return "cardio";
    if (types.size === 1 && types.has("mobility")) return "flexibility_mobility";
    if (types.has("conditioning")) return "strength_conditioning";
    return "full_body";
  }

  function handleSave() {
    setError(null);
    const activeDays = days.filter((d) => d.workoutType !== "rest" && d.exercises.length > 0);
    if (activeDays.length === 0) {
      setError("Add at least one training day with exercises before saving.");
      return;
    }

    startTransition(async () => {
      try {
        await deactivateCurrentPlanAndCreateManual(
          userId,
          planName || "My Manual Plan",
          inferTrainingStyle(),
          days
            .filter((d) => d.workoutType !== "rest")
            .map((d) => ({
              dayOfWeek: d.dayOfWeek,
              workoutType: d.workoutType,
              label: d.label,
              exercises: d.exercises.map((e) => ({
                exerciseId: e.exerciseId,
                sets: e.sets,
                reps: e.reps,
                durationSeconds: e.durationSeconds,
                restSeconds: e.restSeconds,
              })),
            }))
        );
        setSaved(true);
        router.push("/dashboard");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save plan.");
      }
    });
  }

  return (
    <div>
      <div className="mb-8">
        <label className="mb-2 block text-xs tracking-widest text-text-secondary">PLAN NAME</label>
        <input
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          className="w-full max-w-sm rounded-sm border border-border bg-bg-secondary px-4 py-3 text-sm focus-ring"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {DAYS.map((d) => {
          const entry = days.find((x) => x.dayOfWeek === d.dow)!;
          const hasWork = entry.workoutType !== "rest" && entry.exercises.length > 0;
          return (
            <button
              key={d.dow}
              onClick={() => setActiveDow(d.dow)}
              className={`rounded-sm border px-4 py-2 text-xs tracking-widest transition-colors focus-ring ${
                activeDow === d.dow
                  ? "border-accent-red bg-accent-red/10 text-text-primary"
                  : "border-border text-text-secondary hover:border-text-secondary"
              }`}
            >
              {d.label} {hasWork && <span className="ml-1 text-accent-red">●</span>}
            </button>
          );
        })}
      </div>

      <div className="mt-8 rounded-sm border border-border bg-bg-card p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs tracking-widest text-text-secondary">WORKOUT TYPE</label>
            <select
              value={activeDay.workoutType}
              onChange={(e) => updateActiveDay({ workoutType: e.target.value as WorkoutType })}
              className="w-full rounded-sm border border-border bg-bg-secondary px-4 py-3 text-sm focus-ring"
            >
              {WORKOUT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, " ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs tracking-widest text-text-secondary">DAY LABEL</label>
            <input
              value={activeDay.label}
              onChange={(e) => updateActiveDay({ label: e.target.value })}
              className="w-full rounded-sm border border-border bg-bg-secondary px-4 py-3 text-sm focus-ring"
            />
          </div>
        </div>

        {activeDay.workoutType !== "rest" && (
          <>
            <div className="mt-6 flex flex-wrap gap-3">
              <select
                value={pickerExercise}
                onChange={(e) => setPickerExercise(e.target.value)}
                className="min-w-[240px] flex-1 rounded-sm border border-border bg-bg-secondary px-4 py-3 text-sm focus-ring"
              >
                <option value="">Select an exercise to add...</option>
                {exercises
                  .filter((e) => e.workout_type === activeDay.workoutType)
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} — {e.muscle_group}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={addExercise}
                disabled={!pickerExercise}
                className="inline-flex items-center gap-2 rounded-sm bg-accent-red px-5 py-3 text-sm font-semibold tracking-widest text-white transition-colors hover:bg-accent-hover disabled:opacity-50 focus-ring"
              >
                <Plus size={16} /> ADD
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {activeDay.exercises.map((ex, idx) => (
                <div key={idx} className="flex flex-wrap items-center gap-3 rounded-sm border border-border p-4">
                  <p className="min-w-[160px] flex-1 font-medium">{ex.name}</p>
                  <label className="text-xs text-text-secondary">
                    Sets{" "}
                    <input
                      type="number"
                      value={ex.sets}
                      onChange={(e) => updateExerciseField(idx, "sets", Number(e.target.value))}
                      className="ml-1 w-16 rounded-sm border border-border bg-bg-secondary px-2 py-1 text-sm focus-ring"
                    />
                  </label>
                  {ex.reps !== null && (
                    <label className="text-xs text-text-secondary">
                      Reps{" "}
                      <input
                        type="number"
                        value={ex.reps ?? 0}
                        onChange={(e) => updateExerciseField(idx, "reps", Number(e.target.value))}
                        className="ml-1 w-16 rounded-sm border border-border bg-bg-secondary px-2 py-1 text-sm focus-ring"
                      />
                    </label>
                  )}
                  <label className="text-xs text-text-secondary">
                    Rest (s){" "}
                    <input
                      type="number"
                      value={ex.restSeconds}
                      onChange={(e) => updateExerciseField(idx, "restSeconds", Number(e.target.value))}
                      className="ml-1 w-16 rounded-sm border border-border bg-bg-secondary px-2 py-1 text-sm focus-ring"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeExercise(idx)}
                    className="ml-auto text-text-secondary hover:text-accent-hover focus-ring"
                    aria-label="Remove exercise"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {activeDay.exercises.length === 0 && (
                <p className="text-sm text-text-secondary">No exercises added for this day yet.</p>
              )}
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="mt-6 rounded-sm border border-accent-red/40 bg-accent-red/10 px-4 py-2 text-sm text-accent-hover">
          {error}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={pending}
        className="mt-8 inline-flex items-center gap-2 rounded-sm bg-accent-red px-8 py-4 text-sm font-semibold tracking-widest text-white transition-colors hover:bg-accent-hover disabled:opacity-60 focus-ring"
      >
        {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        {pending ? "SAVING PLAN..." : "SAVE PLAN & ACTIVATE"}
      </button>
    </div>
  );
}
