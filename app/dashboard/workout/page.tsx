import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateActivePlan } from "@/lib/planService";
import { hasCompletedToday } from "@/lib/completionService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DailyWorkoutClient from "@/components/dashboard/DailyWorkoutClient";
import type { Profile } from "@/types";

export default async function WorkoutPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/dashboard/workout");

  const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const profile = profileData as Profile | null;
  if (!profile || !profile.onboarding_completed) redirect("/onboarding");

  const plan = await getOrCreateActivePlan(user.id, profile);
  const todayDow = new Date().getDay();
  const todaysDay = plan?.days.find((d) => d.day_of_week === todayDow) ?? null;
  const alreadyCompleted = await hasCompletedToday(user.id);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg-primary px-6 pb-24 pt-32 md:px-10">
        <div className="mx-auto max-w-3xl">
          <DailyWorkoutClient
            userId={user.id}
            dayLabel={todaysDay?.label ?? "Rest"}
            workoutDayId={todaysDay?.id ?? null}
            exercises={todaysDay?.exercises ?? []}
            alreadyCompleted={alreadyCompleted}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
