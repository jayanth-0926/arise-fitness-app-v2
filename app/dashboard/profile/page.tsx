import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileForm from "@/components/ProfileForm";
import type { Profile } from "@/types";

export default async function ProfileEditPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/dashboard/profile");

  const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const profile = (profileData as Profile | null) ?? { id: user.id };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg-primary px-6 pb-24 pt-32 md:px-10">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-4xl">YOUR PROFILE</h1>
          <p className="mt-2 text-text-secondary">
            Update your details. Changing height or weight recalculates your BMI automatically.
          </p>
          <ProfileForm userId={user.id} initial={profile} submitLabel="SAVE CHANGES" redirectTo="/dashboard" />
        </div>
      </main>
      <Footer />
    </>
  );
}
