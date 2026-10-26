"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import type { WorkoutCompletion } from "@/types";

interface Props {
    completions: WorkoutCompletion[];
}

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MonthlyCalendar({ completions }: Props) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const completedDates = new Set(
        completions
            .map((c) => c.scheduled_date?.slice(0, 10))
            .filter(Boolean)
    );

    // First day of the month (0=Sun..6=Sat), shifted to Mon-first
    const firstDay = new Date(year, month, 1).getDay();
    const firstDayMon = (firstDay === 0 ? 6 : firstDay - 1); // Mon=0..Sun=6
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (number | null)[] = [
        ...Array(firstDayMon).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    // Pad to full weeks
    while (cells.length % 7 !== 0) cells.push(null);

    function pad(n: number) {
        return String(n).padStart(2, "0");
    }

    return (
        <div className="rounded-sm border border-border bg-bg-card p-5">
            <p className="mb-4 text-xs tracking-widest text-text-secondary">
                {MONTH_NAMES[month].toUpperCase()} {year} — WORKOUT CALENDAR
            </p>

            <div className="grid grid-cols-7 gap-1">
                {DOW.map((d) => (
                    <div key={d} className="py-1 text-center text-[10px] text-text-secondary">{d}</div>
                ))}
                {cells.map((day, idx) => {
                    if (!day) return <div key={`empty-${idx}`} />;
                    const dateKey = `${year}-${pad(month + 1)}-${pad(day)}`;
                    const completed = completedDates.has(dateKey);
                    const isToday = day === now.getDate();

                    return (
                        <motion.div
                            key={dateKey}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.2, delay: idx * 0.005 }}
                            className={`relative flex h-9 w-full items-center justify-center rounded-sm text-xs transition-colors ${completed
                                ? "bg-accent-cyan/20 text-accent-cyan font-semibold"
                                : isToday
                                    ? "border border-border bg-bg-secondary text-text-primary"
                                    : "text-text-secondary"
                                }`}
                        >
                            {day}
                            {completed && (
                                <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-accent-cyan" />
                            )}
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-text-secondary">
                <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm bg-accent-cyan/20 border border-accent-cyan/40" />
                    Workout logged
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-sm border border-border" />
                    Rest / no session
                </span>
            </div>
        </div>
    );
}
