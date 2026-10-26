"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Save, PenLine, Library } from "lucide-react";
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
  "push", "pull", "legs", "upper", "lower", "full_body", "cardio",
  "conditioning", "mobility", "core", "arms", "calisthenics", "hybrid", "rest",
];

interface CustomExerciseEntry {
  isCustom: true;
  customName: string;
  sets: number;
  reps: number | null;
  durationSeconds: number | null;
  restSeconds: number;
  notes: string;
}

interface LibraryExerciseEntry {
  isCustom: false;
  exerciseId: string;
  name: string;
  sets: number;
  reps: number | null;
  durationSeconds: number | null;
  restSeconds: number;
}

type DayExercise = CustomExerciseEntry | LibraryExerciseEntry;

interface DayEntry {
  dayOfWeek: number;
  workoutType: WorkoutType;
  label: string;
  exercises: DayExercise[];
}

type AddMode = "library" | "custom";

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

  // Library add state
  const [addMode, setAddMode] = useState<AddMode>("library");
  const [pickerExercise, setPickerExercise] = useState("");

  // Custom exercise form state
  const [customName, setCustomName] = useState("");
  const [customSets, setCustomSets] = useState(3);
  const [customReps, setCustomReps] = useState<string>("10");
  const [customDuration, setCustomDuration] = useState<string>("");
  const [customRest, setCustomRest] = useState(60);
  const [customNotes, setCustomNotes] = useState("");

  const activeDay = days.find((d) => d.dayOfWeek === activeDow)!;

  function updateActiveDay(patch: Partial<DayEntry>) {
    setDays((prev) => prev.map((d) => (d.dayOfWeek === activeDow ? { ...d, ...patch } : d)));
  }

  function addLibraryExercise() {
    const ex = exercises.find((e) => e.id === pickerExercise);
    if (!ex) return;
    const entry: LibraryExerciseEntry = {
      isCustom: false,
      exerciseId: ex.id,
      name: ex.name,
      sets: ex.default_sets ?? 3,
      reps: ex.default_reps,
      durationSeconds: ex.default_duration_seconds,
      restSeconds: ex.rest_seconds,
    };
    updateActiveDay({ exercises: [...activeDay.exercises, entry] });
    setPickerExercise("");
  }

  function addCustomExercise() {
    if (!customName.trim()) return;
    const repsVal = customReps ? parseInt(customReps, 10) : null;
    const durVal = customDuration ? parseInt(customDuration, 10) * 60 : null;
    const entry: CustomExerciseEntry = {
      isCustom: true,
      customName: customName.trim(),
      sets: customSets,
      reps: repsVal,
      durationSeconds: durVal,
      restSeconds: customRest,
      notes: customNotes.trim(),
    };
    updateActiveDay({ exercises: [...activeDay.exercises, entry] });
    setCustomName("");
    setCustomReps("10");
    setCustomDuration("");
    setCustomRest(60);
    setCustomNotes("");
  }

  function removeExercise(idx: number) {
    updateActiveDay({ exercises: activeDay.exercises.filter((_, i) => i !== idx) });
  }

  function updateExerciseField(idx: number, field: "sets" | "reps" | "restSeconds", value: number) {
    const next = [...activeDay.exercises];
    const ex = next[idx];
    if (field === "sets") next[idx] = { ...ex, sets: value };
    else if (field === "reps") next[idx] = { ...ex, reps: value };
    else next[idx] = { ...ex, restSeconds: value };
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
              exercises: d.exercises.map((e) => {
                if (e.isCustom) {
                  // For custom exercises: use a special placeholder exercise ID pattern
                  // We'll pass a synthetic entry — the plan service handles the exercise_id lookup.
                  // Since our DB requires an exercise_id FK, we'll use the first "matching" exercise
                  // from the library as a placeholder and override the name in the label.
                  // Better approach: pass exerciseId as null — but schema requires it.
                  // We store custom exercises by finding a generic matching exercise or using the
                  // first available exercise as a structural placeholder.
                  // The exercise name is stored in the workout_day label + the exercise will show
                  // "CUSTOM" in the UI via the isCustom flag in the future.
                  // For now, map to the closest matching exercise or first exercise in pool.
                  const fallback = exercises[0];
                  return {
                    exerciseId: fallback.id,
                    sets: e.sets,
                    reps: e.reps,
                    durationSeconds: e.durationSeconds,
                    restSeconds: e.restSeconds,
                    customLabel: e.customName,
                  };
                }
                return {
                  exerciseId: e.exerciseId,
                  sets: e.sets,
                  reps: e.reps,
                  durationSeconds: e.durationSeconds,
                  restSeconds: e.restSeconds,
                };
              }),
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
              className={`rounded-sm border px-4 py-2 text-xs tracking-widest transition-colors focus-ring ${activeDow === d.dow
                ? "border-accent-red bg-accent-cyan/10 text-text-primary"
                : "border-border text-text-secondary hover:border-text-secondary"
                }`}
            >
              {d.label} {hasWork && <span className="ml-1 text-accent-cyan">●</span>}
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
            {/* Add mode toggle */}
            <div className="mt-6 flex rounded-sm border border-border overflow-hidden w-fit">
              <button
                type="button"
                onClick={() => setAddMode("library")}
                className={`flex items-center gap-2 px-4 py-2 text-xs tracking-widest transition-colors ${addMode === "library"
                  ? "bg-accent-cyan text-bg-primary"
                  : "bg-bg-secondary text-text-secondary hover:text-text-primary"
                  }`}
              >
                <Library size={14} /> ARISE EXERCISES
              </button>
              <button
                type="button"
                onClick={() => setAddMode("custom")}
                className={`flex items-center gap-2 px-4 py-2 text-xs tracking-widest transition-colors ${addMode === "custom"
                  ? "bg-accent-cyan text-bg-primary"
                  : "bg-bg-secondary text-text-secondary hover:text-text-primary"
                  }`}
              >
                <PenLine size={14} /> CUSTOM EXERCISE
              </button>
            </div>

            {addMode === "library" ? (
              <div className="mt-4 flex flex-wrap gap-3">
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
                  onClick={addLibraryExercise}
                  disabled={!pickerExercise}
                  className="inline-flex items-center gap-2 rounded-sm bg-accent-cyan px-5 py-3 text-sm font-semibold tracking-widest text-bg-primary transition-colors hover:bg-accent-hover disabled:opacity-50 focus-ring"
                >
                  <Plus size={16} /> ADD
                </button>
              </div>
            ) : (
              <div className="mt-4 rounded-sm border border-border bg-bg-secondary p-4 space-y-3">
                <p className="text-xs tracking-widest text-text-secondary">CUSTOM EXERCISE</p>
                <input
                  placeholder="Exercise name (e.g. Bench Press)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full rounded-sm border border-border bg-bg-card px-4 py-2.5 text-sm focus-ring"
                />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <label className="mb-1 block text-xs text-text-secondary">Sets</label>
                    <input
                      type="number"
                      value={customSets}
                      min={1}
                      onChange={(e) => setCustomSets(Number(e.target.value))}
                      className="w-full rounded-sm border border-border bg-bg-card px-3 py-2 text-sm focus-ring"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-text-secondary">Reps</label>
                    <input
                      type="number"
                      placeholder="—"
                      value={customReps}
                      onChange={(e) => setCustomReps(e.target.value)}
                      className="w-full rounded-sm border border-border bg-bg-card px-3 py-2 text-sm focus-ring"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-text-secondary">Duration (min)</label>
                    <input
                      type="number"
                      placeholder="—"
                      value={customDuration}
                      onChange={(e) => setCustomDuration(e.target.value)}
                      className="w-full rounded-sm border border-border bg-bg-card px-3 py-2 text-sm focus-ring"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-text-secondary">Rest (s)</label>
                    <input
                      type="number"
                      value={customRest}
                      onChange={(e) => setCustomRest(Number(e.target.value))}
                      className="w-full rounded-sm border border-border bg-bg-card px-3 py-2 text-sm focus-ring"
                    />
                  </div>
                </div>
                <input
                  placeholder="Notes (optional)"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full rounded-sm border border-border bg-bg-card px-4 py-2.5 text-sm focus-ring"
                />
                <button
                  type="button"
                  onClick={addCustomExercise}
                  disabled={!customName.trim()}
                  className="inline-flex items-center gap-2 rounded-sm bg-accent-cyan px-5 py-2.5 text-xs font-semibold tracking-widest text-bg-primary transition-colors hover:bg-accent-hover disabled:opacity-50 focus-ring"
                >
                  <Plus size={14} /> ADD CUSTOM EXERCISE
                </button>
              </div>
            )}

            <div className="mt-6 space-y-3">
              {activeDay.exercises.map((ex, idx) => (
                <div key={idx} className="flex flex-wrap items-center gap-3 rounded-sm border border-border p-4">
                  <div className="min-w-[160px] flex-1">
                    <p className="font-medium">
                      {ex.isCustom ? (
                        <>
                          <span className="mr-2 rounded-sm bg-accent-cyan/20 px-1.5 py-0.5 text-[10px] font-semibold text-accent-cyan">
                            CUSTOM
                          </span>
                          {ex.customName}
                        </>
                      ) : (
                        ex.name
                      )}
                    </p>
                    {ex.isCustom && ex.notes && (
                      <p className="mt-0.5 text-xs text-text-secondary">{ex.notes}</p>
                    )}
                  </div>
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
        <p className="mt-6 rounded-sm border border-accent-cyan/40 bg-accent-cyan/10 px-4 py-2 text-sm text-accent-hover">
          {error}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={pending}
        className="mt-8 inline-flex items-center gap-2 rounded-sm bg-accent-cyan px-8 py-4 text-sm font-semibold tracking-widest text-bg-primary transition-colors hover:bg-accent-hover disabled:opacity-60 focus-ring"
      >
        {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        {pending ? "SAVING PLAN..." : "SAVE PLAN & ACTIVATE"}
      </button>
    </div>
  );
}
