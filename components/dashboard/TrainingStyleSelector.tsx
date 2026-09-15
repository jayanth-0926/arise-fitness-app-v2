"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";
import { regenerateAutoPlan } from "@/lib/planService";
import type { Profile, TrainingStyle } from "@/types";

const STYLES: { value: TrainingStyle; label: string; description: string }[] = [
  { value: "push_pull_legs", label: "PUSH / PULL / LEGS", description: "Classic 3-way split for hypertrophy and strength." },
  { value: "upper_lower", label: "UPPER / LOWER", description: "Balanced split, ideal for 4 training days." },
  { value: "full_body", label: "FULL BODY", description: "Efficient, high-frequency full-body sessions." },
  { value: "strength_conditioning", label: "STRENGTH + CONDITIONING", description: "Alternates heavy lifting with work-capacity days." },
  { value: "cardio", label: "CARDIO", description: "Endurance-focused programming." },
  { value: "flexibility_mobility", label: "FLEXIBILITY / MOBILITY", description: "Recovery and range-of-motion focused." },
];

export default function TrainingStyleSelector({ userId, profile }: { userId: string; profile: Profile }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<TrainingStyle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function apply(style: TrainingStyle) {
    setSelected(style);
    setError(null);
    setDone(false);
    startTransition(async () => {
      try {
        await regenerateAutoPlan(userId, profile, style);
        setDone(true);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to generate plan.");
      }
    });
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {STYLES.map((s) => (
        <button
          key={s.value}
          onClick={() => apply(s.value)}
          disabled={pending}
          className={`text-left rounded-sm border p-5 transition-colors focus-ring ${
            profile.preferred_training_style === s.value
              ? "border-accent-red bg-accent-red/10"
              : "border-border bg-bg-card hover:border-text-secondary"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="font-display text-lg tracking-wide">{s.label}</p>
            {pending && selected === s.value && <Loader2 size={16} className="animate-spin text-accent-red" />}
          </div>
          <p className="mt-1 text-sm text-text-secondary">{s.description}</p>
        </button>
      ))}
      {error && <p className="sm:col-span-2 text-sm text-accent-hover">{error}</p>}
      {done && (
        <p className="sm:col-span-2 flex items-center gap-2 text-sm text-accent-red">
          <RefreshCw size={14} /> New plan generated — check your dashboard.
        </p>
      )}
    </div>
  );
}
