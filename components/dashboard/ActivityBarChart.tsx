"use client";

import { motion } from "framer-motion";
import type { WeeklyBucket } from "@/lib/progressStats";

export default function ActivityBarChart({ data }: { data: WeeklyBucket[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="rounded-sm border border-border bg-bg-card p-6">
      <p className="mb-6 text-xs tracking-widest text-text-secondary">WORKOUTS PER WEEK (LAST 8 WEEKS)</p>
      <div className="flex items-end justify-between gap-2 h-40">
        {data.map((d, i) => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.count / max) * 100}%` }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="w-full rounded-t-sm relative overflow-hidden"
              style={{
                minHeight: d.count > 0 ? 6 : 3,
                background: d.count > 0
                  ? "linear-gradient(to top, #06B6D4, #22D3EE)"
                  : "#1E334D",
              }}
            >
              {d.count > 0 && (
                <div className="absolute inset-0 opacity-30 bg-gradient-to-b from-white/20 to-transparent" />
              )}
            </motion.div>
            <span className="text-[10px] text-text-secondary">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
