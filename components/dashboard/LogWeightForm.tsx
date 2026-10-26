"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LogWeightForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [weight, setWeight] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const value = Number(weight);
    if (!value || value < 30 || value > 300) {
      setError("Enter a valid weight in kilograms (30–300).");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const { error: insertError } = await supabase.from("measurements").insert({
        user_id: userId,
        weight_kg: value,
        recorded_at: new Date().toISOString(),
      });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      // Keep the profile's current weight in sync so BMI reflects the latest entry.
      await supabase.from("profiles").update({ weight_kg: value }).eq("id", userId);

      setWeight("");
      setSaved(true);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-sm border border-border bg-bg-card p-6">
      <p className="text-xs tracking-widest text-text-secondary">LOG TODAY&apos;S WEIGHT</p>
      <div className="mt-4 flex gap-3">
        <input
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => {
            setWeight(e.target.value);
            setSaved(false);
          }}
          placeholder="kg"
          className="w-28 rounded-sm border border-border bg-bg-secondary px-4 py-3 text-sm focus-ring transition-colors duration-200 focus:border-accent-cyan/50"
        />
        <button
          type="submit"
          disabled={pending}
          className="btn-press inline-flex items-center gap-2 rounded-sm px-5 py-3 text-sm font-semibold tracking-widest text-bg-primary transition-all hover:shadow-glow-sm disabled:opacity-60 focus-ring"
          style={{ background: "linear-gradient(135deg, #06B6D4, #22D3EE)" }}
        >
          {pending ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          LOG
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-error">{error}</p>}
      {saved && <p className="mt-3 text-sm text-accent-cyan">Weight logged successfully.</p>}
    </form>
  );
}
