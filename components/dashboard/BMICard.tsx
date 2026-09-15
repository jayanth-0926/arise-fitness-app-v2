import { calculateBMI, BMI_DISCLAIMER } from "@/lib/bmi";

export default function BMICard({
  heightCm,
  weightKg,
}: {
  heightCm: number | null;
  weightKg: number | null;
}) {
  const result = calculateBMI(heightCm, weightKg);

  return (
    <div className="rounded-sm border border-border bg-bg-card p-6">
      <p className="text-xs tracking-widest text-text-secondary">BMI</p>
      {result ? (
        <>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-display text-4xl text-accent-red">{result.bmi}</span>
            <span className="text-sm text-text-secondary">{result.category}</span>
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
