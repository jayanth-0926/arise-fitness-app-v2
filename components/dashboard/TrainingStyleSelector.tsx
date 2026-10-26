"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, RefreshCw, Check } from "lucide-react";
import { regenerateAutoPlan } from "@/lib/planService";
import type { Profile, TrainingStyle } from "@/types";

const STYLES: { value: TrainingStyle; label: string; description: string; accent: string }[] = [
  { value: "push_pull_legs", label: "PUSH / PULL / LEGS", description: "Classic 3-way split for hypertrophy and strength.", accent: "#E50914" },
  { value: "upper_lower", label: "UPPER / LOWER", description: "Balanced split, ideal for 4 training days.", accent: "#3B82F6" },
  { value: "full_body", label: "FULL BODY", description: "Efficient, high-frequency full-body sessions.", accent: "#06B6D4" },
  { value: "strength_conditioning", label: "STRENGTH + CONDITIONING", description: "Alternates heavy lifting with work-capacity days.", accent: "#F97316" },
  { value: "cardio", label: "CARDIO", description: "Endurance-focused programming.", accent: "#3B82F6" },
  { value: "flexibility_mobility", label: "FLEXIBILITY / MOBILITY", description: "Recovery and range-of-motion focused.", accent: "#8B5CF6" },
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
      {STYLES.map((s, i) => {
        const isActive = profile.preferred_training_style === s.value;
        const isLoading = pending && selected === s.value;

        return (
          <motion.button
            key={s.value}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => apply(s.value)}
            disabled={pending}
            className="text-left rounded-sm border p-5 transition-all duration-300 focus-ring"
            style={
              isActive
                ? { borderColor: `${s.accent}60`, background: `${s.accent}10` }
                : { borderColor: "#1E334D", background: "#101D31" }
            }
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-lg tracking-wide">{s.label}</p>
              <div className="flex items-center gap-2">
                {isLoading && <Loader2 size={15} className="animate-spin" style={{ color: s.accent }} />}
                {isActive && !isLoading && <Check size={15} style={{ color: s.accent }} />}
              </div>
            </div>
            <p className="mt-1 text-sm text-text-secondary">{s.description}</p>
            {isActive && (
              <div className="mt-3 h-0.5 rounded-full w-full" style={{ background: s.accent, opacity: 0.5 }} />
            )}
          </motion.button>
        );
      })}

      {error && <p className="sm:col-span-2 text-sm text-error">{error}</p>}
      {done && (
        <p className="sm:col-span-2 flex items-center gap-2 text-sm text-accent-cyan">
          <RefreshCw size={14} /> New plan generated — check your dashboard.
        </p>
      )}
    </div>
  );
}
