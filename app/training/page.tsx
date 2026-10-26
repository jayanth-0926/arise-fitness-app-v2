import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrainingStyleSelector from "@/components/dashboard/TrainingStyleSelector";
import TrainingCategoryDetail from "@/components/TrainingCategoryDetail";
import type { Profile } from "@/types";

export default async function TrainingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: Profile | null = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    profile = data as Profile | null;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg-primary px-6 pb-24 pt-32 md:px-10">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <h1 className="font-display text-4xl md:text-5xl gradient-text">TRAINING</h1>
          <p className="mt-3 max-w-xl text-text-secondary">
            Eight training disciplines — one platform. Click any category to explore workouts,
            understand the benefits, and start a session built for your goal.
          </p>

          {/* Interactive category grid */}
          <div className="mt-12">
            <TrainingCategoryDetail />
          </div>

          {/* Choose your split */}
          <div className="mt-20">
            <div className="mb-6">
              <h2 className="font-display text-3xl">CHOOSE YOUR SPLIT</h2>
              <p className="mt-2 text-text-secondary">
                Selecting a split here regenerates your active plan from the exercise database immediately.
              </p>
            </div>
            {profile && profile.onboarding_completed ? (
              <>
                <TrainingStyleSelector userId={user!.id} profile={profile} />
                <p className="mt-6 text-sm text-text-secondary">
                  Prefer full control?{" "}
                  <Link href="/dashboard/plan" className="text-accent-hover underline underline-offset-4 hover:text-accent-highlight transition-colors">
                    Build a manual schedule
                  </Link>{" "}
                  instead.
                </p>
              </>
            ) : (
              <div className="rounded-sm border border-border bg-bg-card p-8">
                <p className="text-text-secondary">
                  Create an account to generate a plan tailored to your goal, experience, and schedule.
                </p>
                <Link
                  href="/signup"
                  className="btn-press mt-5 inline-flex rounded-sm px-6 py-3 text-sm font-semibold tracking-widest text-bg-primary transition-all focus-ring"
                  style={{ background: "linear-gradient(135deg, #06B6D4, #22D3EE)" }}
                >
                  JOIN NOW
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
