"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ProfileForm from "@/components/ProfileForm";

export default function OnboardingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login?next=/onboarding");
        return;
      }
      setUserId(data.user.id);
      setFullName((data.user.user_metadata?.full_name as string) || "");
      setChecking(false);
    });
  }, [router]);

  if (checking || !userId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg-primary">
        <Loader2 className="animate-spin text-accent-red" size={28} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-primary px-6 py-16 md:px-10">
      <div className="mx-auto max-w-2xl">
        <p className="font-display text-3xl">ARISE</p>
        <h1 className="mt-6 font-display text-4xl">TELL US ABOUT YOU</h1>
        <p className="mt-2 text-text-secondary">
          This builds your personalized plan. You can update it anytime from your profile.
        </p>

        <ProfileForm
          userId={userId}
          initial={{ full_name: fullName }}
          submitLabel="COMPLETE SETUP"
          redirectTo="/dashboard"
        />
      </div>
    </main>
  );
}
