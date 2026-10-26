"use client";

import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import type { WorkoutCompletion } from "@/types";

interface Props {
    history: (WorkoutCompletion & {
        workout_days: { label: string; workout_type: string } | null;
    })[];
}

function formatDate(dateStr: string) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

const TYPE_COLORS: Record<string, string> = {
    push: "bg-red-500/20 text-red-400",
    pull: "bg-purple-500/20 text-purple-400",
    legs: "bg-green-500/20 text-green-400",
    upper: "bg-cyan-500/20 text-cyan-400",
    lower: "bg-teal-500/20 text-teal-400",
    full_body: "bg-yellow-500/20 text-yellow-400",
    cardio: "bg-blue-500/20 text-blue-400",
    conditioning: "bg-orange-500/20 text-orange-400",
    mobility: "bg-pink-500/20 text-pink-400",
    core: "bg-amber-500/20 text-amber-400",
    arms: "bg-rose-500/20 text-rose-400",
    calisthenics: "bg-emerald-500/20 text-emerald-400",
    hybrid: "bg-slate-500/20 text-slate-300",
};

export default function WorkoutHistoryList({ history }: Props) {
    return (
        <div className="rounded-sm border border-border bg-bg-card p-5">
            <p className="mb-5 text-xs tracking-widest text-text-secondary">RECENT WORKOUT HISTORY</p>
            <div className="space-y-2">
                {history.map((item, idx) => {
                    const label = item.workout_days?.label ?? "Workout";
                    const type = item.workout_days?.workout_type ?? "";
                    const colorClass = TYPE_COLORS[type] ?? "bg-border text-text-secondary";

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.04 }}
                            className="flex items-center justify-between rounded-sm border border-border px-4 py-3"
                        >
                            <div className="flex items-center gap-3">
                                <CalendarCheck size={16} className="shrink-0 text-accent-cyan" />
                                <div>
                                    <p className="text-sm font-medium">{label}</p>
                                    <p className="text-xs text-text-secondary">{formatDate(item.scheduled_date)}</p>
                                </div>
                            </div>
                            {type && (
                                <span className={`rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${colorClass}`}>
                                    {type.replace(/_/g, " ")}
                                </span>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
