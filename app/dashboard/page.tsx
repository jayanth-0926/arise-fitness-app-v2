import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Dumbbell, ArrowRight, Settings,
  BarChart2, CalendarDays
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateActivePlan } from "@/lib/planService";
import { getStreak } from "@/lib/completionService";
import { weightHistory, workoutsThisWeek } from "@/lib/progressStats";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatCard from "@/components/dashboard/StatCard";
import WeekActivity from "@/components/dashboard/WeekActivity";
import BMICard from "@/components/dashboard/BMICard";
import WeightChart from "@/components/dashboard/WeightChart";
import type { Measurement, Profile } from "@/types";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const profile = profileData as Profile | null;
  if (!profile || !profile.onboarding_completed) redirect("/onboarding");

  const plan = await getOrCreateActivePlan(user.id, profile);
  const streak = await getStreak(user.id);

  const { data: measurementsData } = await supabase
    .from("measurements").select("*").eq("user_id", user.id).order("recorded_at", { ascending: true });
  const measurements = (measurementsData || []) as unknown as Measurement[];
  const wHistory = weightHistory(measurements);

  const todayDow = new Date().getDay();
  const todaysDay = plan?.days.find((d) => d.day_of_week === todayDow);

  const { data: completionsData } = await supabase
    .from("workout_completions").select("*").eq("user_id", user.id).order("scheduled_date", { ascending: true });
  const completions = completionsData ?? [];
  const thisWeekCount = workoutsThisWeek(completions as never);
  const level = Math.floor(streak.totalWorkouts / 10) + 1;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg-primary px-6 pb-24 pt-32 md:px-10">
        <div className="mx-auto max-w-6xl">

          {/* Header */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-text-secondary tracking-widest">WELCOME BACK</p>
              <h1 className="font-display text-4xl md:text-5xl gradient-text">
                {profile.full_name?.toUpperCase() || "ATHLETE"}
              </h1>
            </div>
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-2 rounded-sm border border-border px-5 py-2.5 text-sm text-text-secondary transition-all duration-200 hover:border-accent-cyan/50 hover:text-accent-hover focus-ring"
            >
              <Settings size={16} /> Edit Profile
            </Link>
          </div>

          {/* Primary stats */}
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard icon="flame" label="CURRENT STREAK" value={`${streak.currentStreak} days`} accent />
            <StatCard icon="flame" label="LONGEST STREAK" value={`${streak.longestStreak} days`} />
            <StatCard icon="calendar-check" label="THIS WEEK" value={`${thisWeekCount} workouts`} />
            <StatCard icon="trophy" label="LEVEL" value={`LVL ${level}`} />
          </div>

          {/* Level progress bar */}
          <div className="mt-4 rounded-sm border border-border bg-bg-card p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs tracking-widest text-text-secondary">CONSISTENCY — LEVEL {level}</p>
              <p className="text-xs text-text-secondary">{streak.totalWorkouts % 10}/10 toward Level {level + 1}</p>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full progress-fill transition-all duration-700"
                style={{ width: `${((streak.totalWorkouts % 10) / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* Today's workout + week activity */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-sm border border-border bg-bg-card p-8 transition-all duration-300 hover:border-accent-cyan/20">
              <p className="text-xs tracking-widest text-text-secondary">TODAY&apos;S WORKOUT</p>
              {todaysDay && todaysDay.workout_type !== "rest" ? (
                <>
                  <h2 className="mt-2 font-display text-3xl md:text-4xl">{todaysDay.label.toUpperCase()}</h2>
                  <p className="mt-2 text-sm text-text-secondary">
                    {todaysDay.exercises.length} exercise{todaysDay.exercises.length !== 1 ? "s" : ""} scheduled.
                  </p>
                  <div className="mt-3 space-y-1">
                    {todaysDay.exercises.slice(0, 3).map((we) => (
                      <p key={we.id} className="text-xs text-text-secondary flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-accent-cyan inline-block" />
                        {we.exercise?.name ?? "Exercise"}
                        {we.reps ? ` — ${we.sets}×${we.reps}` : ""}
                      </p>
                    ))}
                    {todaysDay.exercises.length > 3 && (
                      <p className="text-xs text-text-secondary flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-border inline-block" />
                        +{todaysDay.exercises.length - 3} more exercises
                      </p>
                    )}
                  </div>
                  <Link
                    href="/dashboard/workout"
                    className="mt-6 inline-flex items-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold tracking-widest text-bg-primary transition-all duration-300 hover:shadow-glow-cyan focus-ring btn-press"
                    style={{ background: "linear-gradient(135deg, #06B6D4, #22D3EE)" }}
                  >
                    START TODAY&apos;S WORKOUT <ArrowRight size={16} />
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="mt-2 font-display text-3xl">REST DAY</h2>
                  <p className="mt-2 text-sm text-text-secondary">
                    Recovery is part of the plan. Stretch, hydrate, and come back strong tomorrow.
                  </p>
                </>
              )}
            </div>
            <WeekActivity weekActivity={streak.weekActivity} />
          </div>

          {/* Weight chart + fitness goal */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <WeightChart data={wHistory} />
            <div className="rounded-sm border border-border bg-bg-card p-6">
              <p className="text-xs tracking-widest text-text-secondary">FITNESS GOAL</p>
              <p className="mt-3 font-display text-2xl">
                {profile.fitness_goal?.replace(/_/g, " ").toUpperCase() || "—"}
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                {profile.experience_level
                  ? `${profile.experience_level.charAt(0).toUpperCase()}${profile.experience_level.slice(1)}`
                  : ""}{" "}
                · {profile.training_days_per_week} days/week · {profile.preferred_duration_minutes} min sessions
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-sm border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-1 text-xs font-medium text-accent-hover">
                  {plan ? plan.training_style.replace(/_/g, " ").toUpperCase() : "No plan"}
                </span>
                <span className="rounded-sm border border-border px-3 py-1 text-xs text-text-secondary">
                  {streak.totalWorkouts} total workouts
                </span>
              </div>
            </div>
          </div>

          {/* BMI + Quick Actions */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <BMICard heightCm={profile.height_cm} weightKg={profile.weight_kg} />

            {[
              { href: "/dashboard/workout", icon: Dumbbell, label: "Today's Workout", sub: "Start your session now" },
              { href: "/dashboard/plan", icon: CalendarDays, label: "My Schedule", sub: "Build your weekly plan" },
              { href: "/progress", icon: BarChart2, label: "Progress", sub: "Track your growth" },
            ].map(({ href, icon: Icon, label, sub }) => (
              <Link
                key={href}
                href={href}
                className="group card-hover flex flex-col justify-between rounded-sm border border-border bg-bg-card p-5 focus-ring"
              >
                <Icon size={20} className="text-accent-cyan" />
                <div className="mt-4">
                  <p className="font-display text-lg">{label}</p>
                  <p className="mt-1 text-xs text-text-secondary">{sub}</p>
                </div>
                <ArrowRight
                  size={16}
                  className="mt-3 text-accent-cyan transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
