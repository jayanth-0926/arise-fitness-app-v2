import { Check } from "lucide-react";
import type { StreakData } from "@/types";

export default function WeekActivity({ weekActivity }: { weekActivity: StreakData["weekActivity"] }) {
  return (
    <div className="rounded-sm border border-border bg-bg-card p-6">
      <p className="mb-4 text-xs tracking-widest text-text-secondary">THIS WEEK</p>
      <div className="flex justify-between gap-2">
        {weekActivity.map((d) => (
          <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-xs text-text-secondary">{d.day}</span>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                d.completed
                  ? "border-accent-red bg-accent-red/20 text-accent-red"
                  : "border-border text-text-secondary"
              }`}
            >
              {d.completed ? <Check size={16} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
