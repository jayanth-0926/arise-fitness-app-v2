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
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full rounded-t-sm ${d.count > 0 ? "bg-accent-red" : "bg-border"}`}
              style={{ minHeight: d.count > 0 ? 6 : 3 }}
            />
            <span className="text-[10px] text-text-secondary">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
