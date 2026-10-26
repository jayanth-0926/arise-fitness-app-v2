import { redirect } from "next/navigation";
import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCompletions, getStreak } from "@/lib/completionService";
import {
  completionRate, lastNWeeksActivity, weightHistory,
  workoutsThisMonth, workoutsThisWeek,
} from "@/lib/progressStats";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatCard from "@/components/dashboard/StatCard";
import BMICard from "@/components/dashboard/BMICard";
import ActivityBarChart from "@/components/dashboard/ActivityBarChart";
import WeightChart from "@/components/dashboard/WeightChart";
import LogWeightForm from "@/components/dashboard/LogWeightForm";
import WorkoutHistoryList from "@/components/dashboard/WorkoutHistoryList";
import MonthlyCalendar from "@/components/dashboard/MonthlyCalendar";
import type { Measurement, Profile, WorkoutCompletion } from "@/types";

export default async function ProgressPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/progress");

  const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const profile = profileData as Profile | null;
  if (!profile || !profile.onboarding_completed) redirect("/onboarding");

  const completions = await getCompletions(user.id);
  const streak = await getStreak(user.id);

  const { data: measurementsData } = await supabase
    .from("measurements").select("*").eq("user_id", user.id).order("recorded_at", { ascending: true });
  const measurements = (measurementsData || []) as unknown as Measurement[];

  const { data: historyData } = await supabase
    .from("workout_completions")
    .select("*, workout_days(label, workout_type)")
    .eq("user_id", user.id)
    .order("scheduled_date", { ascending: false })
    .limit(10);
  const workoutHistory = (historyData || []) as unknown as (WorkoutCompletion & {
    workout_days: { label: string; workout_type: string } | null;
  })[];

  const hasData = completions.length > 0;
  const weightData = weightHistory(measurements);
  const startWeight = weightData.length > 0 ? weightData[0].weight : profile.weight_kg;
  const currentWeight = weightData.length > 0 ? weightData[weightData.length - 1].weight : profile.weight_kg;
  const level = Math.floor(streak.totalWorkouts / 10) + 1;
  const levelProgress = (streak.totalWorkouts % 10) / 10;
  const workoutsToNextLevel = 10 - (streak.totalWorkouts % 10);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg-primary px-6 pb-24 pt-32 md:px-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-4xl md:text-5xl gradient-text">YOUR PROGRESS</h1>
          <p className="mt-2 text-text-secondary">Real numbers from your logged workouts. Nothing simulated.</p>

          {!hasData ? (
            <div className="mt-14 rounded-sm border border-border bg-bg-card p-12 text-center">
              <Dumbbell className="mx-auto text-accent-cyan" size={36} />
              <p className="mt-4 font-display text-2xl">NO WORKOUTS LOGGED YET</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
                Complete your first training session and your streak, charts, and progress data will appear here.
              </p>
              <Link
                href="/dashboard/workout"
                className="btn-press mt-6 inline-flex rounded-sm px-6 py-3 text-sm font-semibold tracking-widest text-bg-primary transition-all focus-ring"
                style={{ background: "linear-gradient(135deg, #06B6D4, #22D3EE)" }}
              >
                GO TO TODAY&apos;S WORKOUT
              </Link>
            </div>
          ) : (
            <>
              {/* Primary stats */}
              <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard icon="flame" label="CURRENT STREAK" value={`${streak.currentStreak} days`} accent />
                <StatCard icon="flame" label="LONGEST STREAK" value={`${streak.longestStreak} days`} />
                <StatCard icon="trending-up" label="THIS WEEK" value={`${workoutsThisWeek(completions)}`} />
                <StatCard icon="percent" label="COMPLETION RATE" value={`${completionRate(completions, profile.training_days_per_week)}%`} />
              </div>

              {/* Secondary stats */}
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard icon="dumbbell" label="TOTAL WORKOUTS" value={`${streak.totalWorkouts}`} />
                <StatCard icon="calendar-days" label="THIS MONTH" value={`${workoutsThisMonth(completions)}`} />
                <StatCard icon="trophy" label="LEVEL" value={`LVL ${level}`} />
                <StatCard icon="target" label="NEXT LEVEL IN" value={`${workoutsToNextLevel} workouts`} />
              </div>

              {/* Level progress */}
              <div className="mt-4 rounded-sm border border-border bg-bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs tracking-widest text-text-secondary">CONSISTENCY — LEVEL {level}</p>
                  <p className="text-xs text-text-secondary">{streak.totalWorkouts % 10}/10 toward Level {level + 1}</p>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full progress-fill transition-all duration-700"
                    style={{ width: `${levelProgress * 100}%` }}
                  />
                </div>
              </div>

              {/* Charts */}
              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ActivityBarChart data={lastNWeeksActivity(completions)} />
                <WeightChart data={weightData} />
              </div>

              {/* Monthly calendar + weight stats */}
              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <MonthlyCalendar completions={completions} />
                </div>
                <div className="space-y-4">
                  <div className="rounded-sm border border-border bg-bg-card p-5">
                    <p className="text-xs tracking-widest text-text-secondary">WEIGHT STATS</p>
                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Starting Weight</span>
                        <span className="font-medium">{startWeight ? `${startWeight} kg` : "—"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Current Weight</span>
                        <span className="font-medium text-accent-cyan">{currentWeight ? `${currentWeight} kg` : "—"}</span>
                      </div>
                      {currentWeight && startWeight && currentWeight !== startWeight && (
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Change</span>
                          <span className={`font-medium ${currentWeight < startWeight ? "text-success" : "text-warning"}`}>
                            {currentWeight < startWeight ? "−" : "+"}
                            {Math.abs(currentWeight - startWeight).toFixed(1)} kg
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <BMICard heightCm={profile.height_cm} weightKg={currentWeight ?? profile.weight_kg} />
                </div>
              </div>

              {workoutHistory.length > 0 && (
                <div className="mt-6">
                  <WorkoutHistoryList history={workoutHistory} />
                </div>
              )}
            </>
          )}

          {/* Log weight — always visible */}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <LogWeightForm userId={user.id} />
            {!hasData && <BMICard heightCm={profile.height_cm} weightKg={profile.weight_kg} />}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
