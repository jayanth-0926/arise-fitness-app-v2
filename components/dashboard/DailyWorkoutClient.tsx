"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, PartyPopper } from "lucide-react";
import { markWorkoutComplete } from "@/lib/completionService";
import type { Exercise, WorkoutExercise } from "@/types";

interface Props {
  userId: string;
  dayLabel: string;
  workoutDayId: string | null;
  exercises: (WorkoutExercise & { exercise: Exercise })[];
  alreadyCompleted: boolean;
}

export default function DailyWorkoutClient({ userId, dayLabel, workoutDayId, exercises, alreadyCompleted }: Props) {
  const router = useRouter();
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState(alreadyCompleted);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleComplete() {
    startTransition(async () => {
      const result = await markWorkoutComplete(userId, workoutDayId);
      setMessage(result.message);
      if (result.success) {
        setCompleted(true);
        router.refresh();
      }
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-widest text-text-secondary">TODAY</p>
          <h1 className="font-display text-4xl">{dayLabel.toUpperCase()}</h1>
        </div>
      </div>

      {exercises.length === 0 ? (
        <p className="mt-10 text-text-secondary">No exercises scheduled — this looks like a rest day.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {exercises.map((we) => {
            const isChecked = checked.has(we.id);
            return (
              <div
                key={we.id}
                className={`rounded-sm border p-5 transition-colors ${
                  isChecked ? "border-accent-red bg-accent-red/5" : "border-border bg-bg-card"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-xl">{we.exercise.name}</p>
                    <p className="mt-1 text-sm text-text-secondary">
                      {we.reps
                        ? `${we.sets} sets × ${we.reps} reps`
                        : `${we.sets} sets × ${Math.round((we.duration_seconds ?? 0) / 60)} min`}
                      {"  ·  "}Rest {we.rest_seconds}s
                    </p>
                    <p className="mt-2 max-w-xl text-sm text-text-secondary">{we.exercise.instructions}</p>
                  </div>
                  <button
                    onClick={() => toggle(we.id)}
                    aria-label={isChecked ? "Mark exercise incomplete" : "Mark exercise complete"}
                    className="mt-1 shrink-0 text-accent-red focus-ring"
                  >
                    {isChecked ? <CheckCircle2 size={26} /> : <Circle size={26} className="text-text-secondary" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence mode="wait">
        {completed ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 flex flex-col items-center gap-3 rounded-sm border border-accent-red bg-accent-red/10 py-10 text-center"
          >
            <PartyPopper className="text-accent-red" size={36} />
            <p className="font-display text-2xl">WORKOUT COMPLETE</p>
            <p className="text-sm text-text-secondary">Logged for today. Streak updated.</p>
          </motion.div>
        ) : (
          exercises.length > 0 && (
            <motion.button
              key="cta"
              onClick={handleComplete}
              disabled={pending}
              className="mt-10 w-full rounded-sm bg-accent-red py-4 text-sm font-semibold tracking-widest text-white transition-colors hover:bg-accent-hover disabled:opacity-60 focus-ring sm:w-auto sm:px-10"
            >
              {pending ? "SAVING..." : "MARK WORKOUT COMPLETE"}
            </motion.button>
          )
        )}
      </AnimatePresence>

      {message && !completed && <p className="mt-3 text-sm text-text-secondary">{message}</p>}
    </div>
  );
}
