import { redirect } from "next/navigation";
import Link from "next/link";
import { Flame, Dumbbell, CalendarCheck, ArrowRight, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateActivePlan } from "@/lib/planService";
import { getStreak } from "@/lib/completionService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatCard from "@/components/dashboard/StatCard";
import WeekActivity from "@/components/dashboard/WeekActivity";
import BMICard from "@/components/dashboard/BMICard";
import type { Profile } from "@/types";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/dashboard");

  const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const profile = profileData as Profile | null;

  if (!profile || !profile.onboarding_completed) redirect("/onboarding");

  const plan = await getOrCreateActivePlan(user.id, profile);
  const streak = await getStreak(user.id);

  const todayDow = new Date().getDay();
  const todaysDay = plan?.days.find((d) => d.day_of_week === todayDow);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg-primary px-6 pb-24 pt-32 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-text-secondary">Welcome back,</p>
              <h1 className="font-display text-4xl md:text-5xl">{profile.full_name?.toUpperCase() || "ATHLETE"}</h1>
            </div>
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-2 rounded-sm border border-border px-5 py-2.5 text-sm text-text-secondary transition-colors hover:border-text-secondary hover:text-text-primary focus-ring"
            >
              <Settings size={16} /> Edit Profile
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard icon={Flame} label="CURRENT STREAK" value={`${streak.currentStreak}`} accent />
            <StatCard icon={Flame} label="LONGEST STREAK" value={`${streak.longestStreak}`} />
            <StatCard icon={Dumbbell} label="TOTAL WORKOUTS" value={`${streak.totalWorkouts}`} />
            <StatCard
              icon={CalendarCheck}
              label="TRAINING STYLE"
              value={plan ? plan.training_style.replace(/_/g, " ").toUpperCase() : "—"}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-sm border border-border bg-bg-card p-8">
              <p className="text-xs tracking-widest text-text-secondary">TODAY</p>
              {todaysDay && todaysDay.workout_type !== "rest" ? (
                <>
                  <h2 className="mt-2 font-display text-3xl">{todaysDay.label.toUpperCase()}</h2>
                  <p className="mt-2 text-sm text-text-secondary">
                    {todaysDay.exercises.length} exercises scheduled for today.
                  </p>
                  <Link
                    href="/dashboard/workout"
                    className="mt-6 inline-flex items-center gap-2 rounded-sm bg-accent-red px-6 py-3 text-sm font-semibold tracking-widest text-white transition-colors hover:bg-accent-hover focus-ring"
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

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <BMICard heightCm={profile.height_cm} weightKg={profile.weight_kg} />

            <div className="rounded-sm border border-border bg-bg-card p-6">
              <p className="text-xs tracking-widest text-text-secondary">FITNESS GOAL</p>
              <p className="mt-3 font-display text-2xl">
                {profile.fitness_goal?.replace(/_/g, " ").toUpperCase() || "—"}
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                {profile.experience_level
                  ? `${profile.experience_level.charAt(0).toUpperCase()}${profile.experience_level.slice(1)} level`
                  : ""}{" "}
                &middot; {profile.training_days_per_week} days/week &middot; {profile.preferred_duration_minutes}{" "}
                min sessions
              </p>
            </div>

            <Link
              href="/training"
              className="group flex flex-col justify-between rounded-sm border border-border bg-bg-card p-6 transition-colors hover:border-accent-red focus-ring"
            >
              <p className="text-xs tracking-widest text-text-secondary">NEED A CHANGE?</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="font-display text-xl">Build a manual plan</p>
                <ArrowRight size={18} className="text-accent-red transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
