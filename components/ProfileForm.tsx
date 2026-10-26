"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ExperienceLevel, FitnessGoal, Profile, TrainingStyle } from "@/types";

const GOALS: { value: FitnessGoal; label: string }[] = [
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "fat_loss", label: "Fat Loss" },
  { value: "strength", label: "Strength" },
  { value: "general_fitness", label: "General Fitness" },
  { value: "endurance", label: "Endurance" },
  { value: "mobility", label: "Mobility / Flexibility" },
];

const EXPERIENCE: { value: ExperienceLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const STYLES: { value: TrainingStyle; label: string }[] = [
  { value: "push_pull_legs", label: "Push / Pull / Legs" },
  { value: "upper_lower", label: "Upper / Lower" },
  { value: "full_body", label: "Full Body" },
  { value: "strength_conditioning", label: "Strength + Conditioning" },
  { value: "cardio", label: "Cardio" },
  { value: "flexibility_mobility", label: "Flexibility / Mobility" },
];

const EQUIPMENT_OPTIONS = ["Barbell", "Dumbbell", "Machine", "Cable", "Bodyweight", "Kettlebell", "Bands"];
const DAYS_OPTIONS = [2, 3, 4, 5, 6, 7];
const DURATION_OPTIONS = [20, 30, 45, 60, 90];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-2 block text-xs tracking-widest text-text-secondary">{children}</label>;
}

function PillButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-sm border px-4 py-2.5 text-sm transition-colors focus-ring ${
        active
          ? "border-accent-red bg-accent-cyan/10 text-text-primary"
          : "border-border text-text-secondary hover:border-text-secondary"
      }`}
    >
      {children}
    </button>
  );
}

export default function ProfileForm({
  userId,
  initial,
  submitLabel,
  redirectTo,
}: {
  userId: string;
  initial: Partial<Profile>;
  submitLabel: string;
  redirectTo: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [fullName, setFullName] = useState(initial.full_name ?? "");
  const [age, setAge] = useState(initial.age?.toString() ?? "");
  const [gender, setGender] = useState(initial.gender ?? "");
  const [heightCm, setHeightCm] = useState(initial.height_cm?.toString() ?? "");
  const [weightKg, setWeightKg] = useState(initial.weight_kg?.toString() ?? "");
  const [goal, setGoal] = useState<FitnessGoal | "">((initial.fitness_goal as FitnessGoal) ?? "");
  const [experience, setExperience] = useState<ExperienceLevel | "">(
    (initial.experience_level as ExperienceLevel) ?? ""
  );
  const [days, setDays] = useState<number | "">(initial.training_days_per_week ?? "");
  const [duration, setDuration] = useState<number | "">(initial.preferred_duration_minutes ?? "");
  const [equipment, setEquipment] = useState<string[]>(initial.available_equipment ?? []);
  const [style, setStyle] = useState<TrainingStyle | "">((initial.preferred_training_style as TrainingStyle) ?? "");

  function toggleEquipment(item: string) {
    setEquipment((prev) => (prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]));
  }

  function validate(): boolean {
    if (!fullName.trim()) return setErr("Full name is required.");
    if (age && (Number(age) < 13 || Number(age) > 100)) return setErr("Enter a valid age.");
    if (heightCm && (Number(heightCm) < 100 || Number(heightCm) > 250))
      return setErr("Enter a valid height in centimeters.");
    if (weightKg && (Number(weightKg) < 30 || Number(weightKg) > 300))
      return setErr("Enter a valid weight in kilograms.");
    if (!goal) return setErr("Select a fitness goal.");
    if (!experience) return setErr("Select your experience level.");
    if (!days) return setErr("Select training days per week.");
    if (!duration) return setErr("Select a preferred workout duration.");
    if (!style) return setErr("Select a preferred training style.");
    setError(null);
    return true;
  }

  function setErr(msg: string) {
    setError(msg);
    return false;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const supabase = createClient();

    const { error: upsertError } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: fullName,
      age: age ? Number(age) : null,
      gender: gender || null,
      height_cm: heightCm ? Number(heightCm) : null,
      weight_kg: weightKg ? Number(weightKg) : null,
      fitness_goal: goal,
      experience_level: experience,
      training_days_per_week: days,
      preferred_duration_minutes: duration,
      available_equipment: equipment,
      preferred_training_style: style,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    });

    setLoading(false);

    if (upsertError) {
      setError(upsertError.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push(redirectTo);
      router.refresh();
    }, 700);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-8" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel>FULL NAME</FieldLabel>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-sm border border-border bg-bg-secondary px-4 py-3 text-sm focus-ring"
          />
        </div>
        <div>
          <FieldLabel>AGE</FieldLabel>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full rounded-sm border border-border bg-bg-secondary px-4 py-3 text-sm focus-ring"
          />
        </div>
        <div>
          <FieldLabel>GENDER (OPTIONAL)</FieldLabel>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full rounded-sm border border-border bg-bg-secondary px-4 py-3 text-sm focus-ring"
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div />
        <div>
          <FieldLabel>HEIGHT (CM)</FieldLabel>
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            className="w-full rounded-sm border border-border bg-bg-secondary px-4 py-3 text-sm focus-ring"
          />
        </div>
        <div>
          <FieldLabel>WEIGHT (KG)</FieldLabel>
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="w-full rounded-sm border border-border bg-bg-secondary px-4 py-3 text-sm focus-ring"
          />
        </div>
      </div>

      <div>
        <FieldLabel>FITNESS GOAL</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {GOALS.map((g) => (
            <PillButton key={g.value} active={goal === g.value} onClick={() => setGoal(g.value)}>
              {g.label}
            </PillButton>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>TRAINING EXPERIENCE</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {EXPERIENCE.map((x) => (
            <PillButton key={x.value} active={experience === x.value} onClick={() => setExperience(x.value)}>
              {x.label}
            </PillButton>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>TRAINING DAYS PER WEEK</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {DAYS_OPTIONS.map((d) => (
            <PillButton key={d} active={days === d} onClick={() => setDays(d)}>
              {d}
            </PillButton>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>PREFERRED WORKOUT DURATION</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {DURATION_OPTIONS.map((d) => (
            <PillButton key={d} active={duration === d} onClick={() => setDuration(d)}>
              {d} min
            </PillButton>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>AVAILABLE EQUIPMENT</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map((eq) => (
            <PillButton key={eq} active={equipment.includes(eq)} onClick={() => toggleEquipment(eq)}>
              {eq}
            </PillButton>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>PREFERRED TRAINING STYLE</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <PillButton key={s.value} active={style === s.value} onClick={() => setStyle(s.value)}>
              {s.label}
            </PillButton>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-sm border border-accent-cyan/40 bg-accent-cyan/10 px-4 py-2 text-sm text-accent-hover">
          {error}
        </p>
      )}
      {success && <p className="text-sm text-accent-cyan">Saved.</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-sm bg-accent-cyan text-bg-primary py-4 text-sm font-semibold tracking-widest text-bg-primary transition-colors hover:bg-accent-hover disabled:opacity-60 focus-ring sm:w-auto sm:px-10"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "SAVING..." : submitLabel}
      </button>
    </form>
  );
}
