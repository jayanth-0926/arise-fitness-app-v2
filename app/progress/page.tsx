import { redirect } from "next/navigation";
import Link from "next/link";
import { Flame, Dumbbell, TrendingUp, Percent } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCompletions, getStreak } from "@/lib/completionService";
import {
  completionRate,
  lastNWeeksActivity,
  weightHistory,
  workoutsThisMonth,
  workoutsThisWeek,
} from "@/lib/progressStats";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatCard from "@/components/dashboard/StatCard";
import BMICard from "@/components/dashboard/BMICard";
import ActivityBarChart from "@/components/dashboard/ActivityBarChart";
import WeightChart from "@/components/dashboard/WeightChart";
import LogWeightForm from "@/components/dashboard/LogWeightForm";
import type { Measurement, Profile } from "@/types";

export default async function ProgressPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/progress");

  const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const profile = profileData as Profile | null;

  if (!profile || !profile.onboarding_completed) redirect("/onboarding");

  const completions = await getCompletions(user.id);
  const streak = await getStreak(user.id);
  const { data: measurementsData } = await supabase
    .from("measurements")
    .select("*")
    .eq("user_id", user.id)
    .order("recorded_at", { ascending: true });
  const measurements = (measurementsData || []) as unknown as Measurement[];

  const hasData = completions.length > 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg-primary px-6 pb-24 pt-32 md:px-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-4xl md:text-5xl">YOUR PROGRESS</h1>
          <p className="mt-2 text-text-secondary">Real numbers from your logged workouts. Nothing simulated.</p>

          {!hasData ? (
            <div className="mt-14 rounded-sm border border-border bg-bg-card p-12 text-center">
              <Dumbbell className="mx-auto text-accent-red" size={36} />
              <p className="mt-4 font-display text-2xl">NO WORKOUTS LOGGED YET</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
                Complete your first training session and your streak, weekly activity, and progress charts will
                appear here.
              </p>
              <Link
                href="/dashboard/workout"
                className="mt-6 inline-flex rounded-sm bg-accent-red px-6 py-3 text-sm font-semibold tracking-widest text-white transition-colors hover:bg-accent-hover focus-ring"
              >
                GO TO TODAY&apos;S WORKOUT
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard icon={Flame} label="CURRENT STREAK" value={`${streak.currentStreak}`} accent />
                <StatCard icon={Flame} label="LONGEST STREAK" value={`${streak.longestStreak}`} />
                <StatCard icon={TrendingUp} label="THIS WEEK" value={`${workoutsThisWeek(completions)}`} />
                <StatCard icon={Percent} label="COMPLETION RATE" value={`${completionRate(completions, profile.training_days_per_week)}%`} />
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ActivityBarChart data={lastNWeeksActivity(completions)} />
                <WeightChart data={weightHistory(measurements)} />
              </div>
            </>
          )}

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <BMICard heightCm={profile.height_cm} weightKg={profile.weight_kg} />
            <StatCard icon={Dumbbell} label="TOTAL WORKOUTS" value={`${streak.totalWorkouts}`} />
            <StatCard icon={TrendingUp} label="THIS MONTH" value={`${workoutsThisMonth(completions)}`} />
          </div>

          <div className="mt-6 max-w-sm">
            <LogWeightForm userId={user.id} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
