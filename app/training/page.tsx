import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrainingStyleSelector from "@/components/dashboard/TrainingStyleSelector";
import type { Profile } from "@/types";

const CATEGORIES = [
  { name: "STRENGTH", image: "/images/gym-dumbbells.jpg", description: "Progressive overload to build raw power across major lifts." },
  { name: "CONDITIONING", image: "/images/gym-machines.jpg", description: "High-output circuits that build sustained work capacity." },
  { name: "CARDIO", image: "/images/gym-discipline.jpg", description: "Structured endurance work for a stronger engine." },
  { name: "FLEXIBILITY", image: "/images/fit-for-purpose.jpg", description: "Mobility and recovery work that protects long-term performance." },
];

export default async function TrainingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
          <h1 className="font-display text-4xl md:text-5xl">TRAINING</h1>
          <p className="mt-3 max-w-xl text-text-secondary">
            Every plan on ARISE is built from four training pillars and delivered through a split that fits your
            schedule.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <div key={cat.name} className="relative h-72 overflow-hidden rounded-sm border border-border">
                <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-display text-xl">{cat.name}</p>
                  <p className="mt-1 text-xs text-text-secondary">{cat.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <h2 className="font-display text-3xl">CHOOSE YOUR SPLIT</h2>
            {profile && profile.onboarding_completed ? (
              <>
                <p className="mt-2 text-text-secondary">
                  Selecting a split regenerates your active plan immediately from the exercise database.
                </p>
                <div className="mt-6">
                  <TrainingStyleSelector userId={user!.id} profile={profile} />
                </div>
                <p className="mt-6 text-sm text-text-secondary">
                  Prefer full control?{" "}
                  <Link href="/dashboard/plan" className="text-text-primary underline underline-offset-4">
                    Build a manual schedule
                  </Link>{" "}
                  instead.
                </p>
              </>
            ) : (
              <div className="mt-6 rounded-sm border border-border bg-bg-card p-8">
                <p className="text-text-secondary">
                  Create an account to generate a plan tailored to your goal, experience, and schedule.
                </p>
                <Link
                  href="/signup"
                  className="mt-5 inline-flex rounded-sm bg-accent-red px-6 py-3 text-sm font-semibold tracking-widest text-white transition-colors hover:bg-accent-hover focus-ring"
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
