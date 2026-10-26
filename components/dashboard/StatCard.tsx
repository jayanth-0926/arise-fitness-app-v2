"use client";

import { motion } from "framer-motion";
import {
  Flame, Dumbbell, TrendingUp, Percent, Trophy,
  CalendarCheck, CalendarDays, Target, BarChart2,
  Zap, Scale, Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Icon map: Server passes a plain string, Client resolves the component ──
const ICON_MAP: Record<string, LucideIcon> = {
  flame: Flame,
  dumbbell: Dumbbell,
  "trending-up": TrendingUp,
  percent: Percent,
  trophy: Trophy,
  "calendar-check": CalendarCheck,
  "calendar-days": CalendarDays,
  target: Target,
  "bar-chart": BarChart2,
  zap: Zap,
  scale: Scale,
  activity: Activity,
};

export default function StatCard({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: string;
  label: string;
  value: string;
  accent?: boolean;
}) {
  const Icon = ICON_MAP[icon] ?? Dumbbell; // safe fallback

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, scale: 1.015 }}
      className={`rounded-sm border bg-bg-card p-6 transition-shadow duration-300 hover:shadow-glow-sm cursor-default ${accent ? "border-accent-cyan/40" : "border-border"
        }`}
    >
      <Icon
        size={20}
        className={accent ? "text-accent-cyan" : "text-text-secondary"}
      />
      <p
        className={`mt-4 font-display text-3xl ${accent ? "text-accent-cyan stat-glow" : "text-text-primary"
          }`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs tracking-widest text-text-secondary">{label}</p>
    </motion.div>
  );
}
