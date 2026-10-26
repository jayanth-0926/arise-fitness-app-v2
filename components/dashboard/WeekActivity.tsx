"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { StreakData } from "@/types";

export default function WeekActivity({ weekActivity }: { weekActivity: StreakData["weekActivity"] }) {
  return (
    <div className="rounded-sm border border-border bg-bg-card p-6">
      <p className="mb-5 text-xs tracking-widest text-text-secondary">THIS WEEK</p>
      <div className="flex justify-between gap-2">
        {weekActivity.map((d, i) => (
          <motion.div
            key={d.date}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <span className="text-xs text-text-secondary">{d.day}</span>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 ${d.completed
                  ? "border-accent-cyan/50 bg-accent-cyan/20 text-accent-cyan"
                  : "border-border text-text-secondary"
                }`}
            >
              {d.completed ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Check size={15} />
                </motion.span>
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
