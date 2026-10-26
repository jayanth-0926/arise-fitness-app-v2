"use client";

import { motion } from "framer-motion";

export default function WeightChart({ data }: { data: { date: string; weight: number }[] }) {
  if (data.length < 2) {
    return (
      <div className="rounded-sm border border-border bg-bg-card p-6">
        <p className="text-xs tracking-widest text-text-secondary">WEIGHT PROGRESS</p>
        <p className="mt-3 text-sm text-text-secondary">
          Log your weight at least twice to see a trend line here.
        </p>
      </div>
    );
  }

  const width = 600;
  const height = 160;
  const padding = 20;
  const weights = data.map((d) => d.weight);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = max - min || 1;

  const pts = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.weight - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const pointsStr = pts.map((p) => `${p.x},${p.y}`).join(" ");

  // Build path for area fill
  const areaPath = [
    `M ${pts[0].x},${height - padding}`,
    ...pts.map((p) => `L ${p.x},${p.y}`),
    `L ${pts[pts.length - 1].x},${height - padding}`,
    "Z",
  ].join(" ");

  return (
    <div className="rounded-sm border border-border bg-bg-card p-6">
      <p className="mb-4 text-xs tracking-widest text-text-secondary">WEIGHT PROGRESS (KG)</p>
      <motion.svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <defs>
          <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
          <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path d={areaPath} fill="url(#area-grad)" />

        {/* Line */}
        <polyline
          points={pointsStr}
          fill="none"
          stroke="url(#line-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#06B6D4" stroke="#050B14" strokeWidth="2" />
        ))}
      </motion.svg>
      <div className="mt-2 flex justify-between text-[10px] text-text-secondary">
        <span>{data[0].date}</span>
        <span>{data[data.length - 1].date}</span>
      </div>
    </div>
  );
}
