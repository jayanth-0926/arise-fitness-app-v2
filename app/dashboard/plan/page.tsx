import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ManualPlanBuilder from "@/components/dashboard/ManualPlanBuilder";
import type { Exercise, Profile } from "@/types";

export default async function ManualPlanPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/dashboard/plan");

  const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const profile = profileData as Profile | null;
  if (!profile || !profile.onboarding_completed) redirect("/onboarding");

  const { data: exercisesData } = await supabase.from("exercises").select("*").order("name", { ascending: true });
  const exercises = (exercisesData || []) as unknown as Exercise[];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg-primary px-6 pb-24 pt-32 md:px-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-4xl">BUILD YOUR SCHEDULE</h1>
          <p className="mt-2 max-w-xl text-text-secondary">
            Create a manual weekly schedule. Saving this replaces your current active plan — the auto-generator
            won&apos;t override a manual schedule once it exists.
          </p>
          {exercises.length === 0 ? (
            <p className="mt-10 text-text-secondary">
              No exercises found in the database yet. Run the seed SQL in Supabase first.
            </p>
          ) : (
            <div className="mt-10">
              <ManualPlanBuilder userId={user.id} exercises={exercises} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
