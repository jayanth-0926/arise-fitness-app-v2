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

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.weight - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <div className="rounded-sm border border-border bg-bg-card p-6">
      <p className="mb-4 text-xs tracking-widest text-text-secondary">WEIGHT PROGRESS (KG)</p>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
        <polyline points={points.join(" ")} fill="none" stroke="#E3261A" strokeWidth="2.5" />
        {points.map((p, i) => {
          const [x, y] = p.split(",");
          return <circle key={i} cx={x} cy={y} r="3.5" fill="#F5F5F5" />;
        })}
      </svg>
      <div className="mt-2 flex justify-between text-[10px] text-text-secondary">
        <span>{data[0].date}</span>
        <span>{data[data.length - 1].date}</span>
      </div>
    </div>
  );
}
