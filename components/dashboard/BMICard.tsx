import { calculateBMI, BMI_DISCLAIMER } from "@/lib/bmi";

const BMI_COLORS: Record<string, string> = {
  "Underweight": "text-blue-400",
  "Normal weight": "text-success",
  "Overweight": "text-warning",
  "Obese": "text-error",
};

export default function BMICard({
  heightCm,
  weightKg,
}: {
  heightCm: number | null;
  weightKg: number | null;
}) {
  const result = calculateBMI(heightCm, weightKg);
  const colorClass = result ? (BMI_COLORS[result.category] ?? "text-accent-cyan") : "text-accent-cyan";

  return (
    <div className="rounded-sm border border-border bg-bg-card p-6">
      <p className="text-xs tracking-widest text-text-secondary">BMI</p>
      {result ? (
        <>
          <div className="mt-3 flex items-baseline gap-3">
            <span className={`font-display text-4xl ${colorClass} stat-glow`}>{result.bmi}</span>
            <span className="text-sm text-text-secondary">{result.category}</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full transition-all duration-700 progress-fill"
              style={{
                width: `${Math.min(100, ((Number(result.bmi) - 10) / 30) * 100)}%`,
              }}
            />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-text-secondary">{BMI_DISCLAIMER}</p>
        </>
      ) : (
        <p className="mt-3 text-sm text-text-secondary">
          Add your height and weight in your profile to see your BMI.
        </p>
      )}
    </div>
  );
}
