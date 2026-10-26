"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, PartyPopper, ChevronDown, ChevronUp, Play, ExternalLink } from "lucide-react";
import { markWorkoutComplete } from "@/lib/completionService";
import type { Exercise, WorkoutExercise } from "@/types";

interface Props {
  userId: string;
  dayLabel: string;
  workoutDayId: string | null;
  exercises: (WorkoutExercise & { exercise: Exercise })[];
  alreadyCompleted: boolean;
}

/** Returns the best video URL for an exercise.
 *  Uses the stored video_url field first (e.g. https://www.youtube.com/watch?v=xxx),
 *  then falls back to a YouTube search query URL.
 */
function getVideoUrl(exercise: Exercise): string {
  if (exercise.video_url && exercise.video_url.trim().length > 0) {
    return exercise.video_url;
  }
  const query = encodeURIComponent(`${exercise.name} exercise proper form tutorial`);
  return `https://www.youtube.com/results?search_query=${query}`;
}

const DIFFICULTY_STYLE: Record<string, { text: string; bg: string }> = {
  beginner: { text: "text-success", bg: "bg-success/10" },
  intermediate: { text: "text-warning", bg: "bg-warning/10" },
  advanced: { text: "text-error", bg: "bg-error/10" },
};

export default function DailyWorkoutClient({ userId, dayLabel, workoutDayId, exercises, alreadyCompleted }: Props) {
  const router = useRouter();
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState(alreadyCompleted);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [workoutStarted, setWorkoutStarted] = useState(alreadyCompleted);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => {
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

  const progress = exercises.length > 0 ? Math.round((checked.size / exercises.length) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <p className="text-xs tracking-widest text-text-secondary">TODAY&apos;S SESSION</p>
          <h1 className="font-display text-4xl gradient-text">{dayLabel.toUpperCase()}</h1>
        </div>
        {!completed && exercises.length > 0 && workoutStarted && (
          <div className="text-right">
            <p className="text-xs text-text-secondary">{checked.size}/{exercises.length} done</p>
            <div className="mt-1.5 h-1.5 w-36 overflow-hidden rounded-full bg-border">
              <motion.div
                className="h-full rounded-full progress-fill"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {exercises.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 rounded-sm border border-border bg-bg-card p-8 text-center"
        >
          <p className="text-text-secondary">No exercises scheduled — this is a rest day. Recover well.</p>
        </motion.div>
      ) : (
        <>
          {!workoutStarted && !completed && (
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setWorkoutStarted(true)}
              className="btn-press mt-6 inline-flex items-center gap-2 rounded-sm px-8 py-3.5 text-sm font-semibold tracking-widest text-bg-primary focus-ring"
              style={{ background: "linear-gradient(135deg, #06B6D4, #22D3EE)" }}
            >
              <Play size={16} /> START WORKOUT
            </motion.button>
          )}

          <div className="mt-8 space-y-3">
            {exercises.map((we, idx) => {
              const isChecked = checked.has(we.id);
              const isOpen = expanded.has(we.id);
              const diff = DIFFICULTY_STYLE[we.exercise.difficulty] ?? { text: "text-text-secondary", bg: "bg-border" };
              const videoUrl = getVideoUrl(we.exercise);

              return (
                <motion.div
                  key={we.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  layout
                  className={`rounded-sm border transition-all duration-300 ${isChecked
                      ? "border-accent-cyan/50 bg-accent-cyan/5"
                      : "border-border bg-bg-card hover:border-border/60"
                    }`}
                >
                  <div className="flex items-start justify-between gap-4 p-5">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display text-lg">{we.exercise.name}</p>
                        <span className={`rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${diff.text} ${diff.bg}`}>
                          {we.exercise.difficulty}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                        <span>
                          {we.reps
                            ? `${we.sets} sets × ${we.reps} reps`
                            : `${we.sets} sets × ${Math.round((we.duration_seconds ?? 0) / 60)} min`}
                        </span>
                        <span className="text-border">·</span>
                        <span>Rest {we.rest_seconds}s</span>
                        <span className="text-border">·</span>
                        <span className="capitalize">{we.exercise.muscle_group.replace(/_/g, " ")}</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleExpand(we.id)}
                        className="text-text-secondary hover:text-text-primary focus-ring rounded-sm p-1 transition-colors duration-200"
                        aria-label={isOpen ? "Collapse" : "Expand"}
                      >
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </motion.button>
                      {workoutStarted && (
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => toggle(we.id)}
                          aria-label={isChecked ? "Uncheck" : "Complete exercise"}
                          className="mt-1 shrink-0 focus-ring"
                          style={{ color: isChecked ? "#06B6D4" : "#94A3B8" }}
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {isChecked ? (
                              <motion.span
                                key="checked"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.25, type: "spring", stiffness: 400 }}
                              >
                                <CheckCircle2 size={26} />
                              </motion.span>
                            ) : (
                              <motion.span
                                key="unchecked"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Circle size={26} />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border px-5 pb-5 pt-4">
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-4">
                            {[
                              { label: "SETS", value: String(we.sets) },
                              { label: "REPS", value: we.reps ? String(we.reps) : "—" },
                              { label: "REST", value: `${we.rest_seconds}s` },
                              { label: "TARGET", value: we.exercise.muscle_group.replace(/_/g, " ") },
                            ].map((s) => (
                              <div key={s.label} className="rounded-sm bg-bg-primary p-3 text-center">
                                <p className="text-[10px] text-text-secondary tracking-widest">{s.label}</p>
                                <p className="mt-1 font-display text-lg capitalize">{s.value}</p>
                              </div>
                            ))}
                          </div>

                          <p className="text-[10px] tracking-widest text-text-secondary mb-2">INSTRUCTIONS</p>
                          <p className="text-sm text-text-secondary leading-relaxed">{we.exercise.instructions}</p>

                          <a
                            href={videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-press mt-4 inline-flex items-center gap-2 rounded-sm border border-accent-cyan/30 bg-accent-cyan/10 px-4 py-2 text-xs font-semibold tracking-widest text-accent-hover transition-all duration-200 hover:border-accent-cyan hover:bg-accent-cyan/20 focus-ring"
                          >
                            <Play size={12} className="text-accent-cyan" />
                            WATCH GUIDE
                            <ExternalLink size={10} className="text-text-secondary" />
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      <AnimatePresence mode="wait">
        {completed ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
            className="mt-10 flex flex-col items-center gap-3 rounded-sm border border-accent-cyan/40 bg-accent-cyan/10 py-10 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 300 }}
            >
              <PartyPopper className="text-accent-cyan" size={40} />
            </motion.div>
            <p className="font-display text-2xl gradient-text">WORKOUT COMPLETE</p>
            <p className="text-sm text-text-secondary">Logged for today. Streak updated. Well done.</p>
          </motion.div>
        ) : (
          workoutStarted && exercises.length > 0 && (
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10"
            >
              {checked.size < exercises.length && (
                <p className="mb-3 text-xs text-text-secondary">
                  Check off exercises as you complete them, then log the session.
                </p>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleComplete}
                disabled={pending}
                className="w-full rounded-sm py-4 text-sm font-semibold tracking-widest text-bg-primary transition-all focus-ring sm:w-auto sm:px-10 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #06B6D4, #22D3EE)" }}
              >
                {pending ? "SAVING..." : "MARK WORKOUT COMPLETE"}
              </motion.button>
            </motion.div>
          )
        )}
      </AnimatePresence>

      {message && !completed && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-sm text-text-secondary"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
