import type { LucideIcon } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-sm border border-border bg-bg-card p-6">
      <Icon size={20} className={accent ? "text-accent-red" : "text-text-secondary"} />
      <p className={`mt-4 font-display text-3xl ${accent ? "text-accent-red" : "text-text-primary"}`}>
        {value}
      </p>
      <p className="mt-1 text-xs tracking-widest text-text-secondary">{label}</p>
    </div>
  );
}
