"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface FormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialState: FormState = { fullName: "", email: "", password: "", confirmPassword: "" };

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.password.length < 8) next.password = "Password must be at least 8 characters.";
    if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.fullName } },
    });

    if (error) {
      setFormError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: form.fullName,
        onboarding_completed: false,
      });

      if (profileError) {
        setFormError(profileError.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      if (data.session) {
        router.push("/onboarding");
      } else {
        // Email confirmation required by Supabase project settings.
        router.push("/login?confirm=1");
      }
    }, 1200);
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-16">
      <Image
        src="/images/hanuman-signup.jpg"
        alt=""
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-bg-primary/85" />

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="mb-8 block text-center font-display text-3xl tracking-wide">
          ARISE
        </Link>

        <div className="rounded-sm border border-border bg-bg-card/90 p-8 backdrop-blur-sm">
          <h1 className="font-display text-3xl">SIGN UP</h1>
          <p className="mt-2 text-sm text-text-secondary">Create your account to begin training.</p>

          {success ? (
            <div className="mt-8 flex flex-col items-center gap-3 py-8 text-center">
              <CheckCircle2 className="text-accent-red" size={40} />
              <p className="text-lg font-semibold">Account created</p>
              <p className="text-sm text-text-secondary">Taking you to your onboarding...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
              <div>
                <label htmlFor="fullName" className="mb-1.5 block text-xs tracking-widest text-text-secondary">
                  FULL NAME
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full rounded-sm border border-border bg-bg-secondary px-4 py-3 text-sm focus-ring"
                />
                {errors.fullName && <p className="mt-1 text-xs text-accent-hover">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs tracking-widest text-text-secondary">
                  EMAIL
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-sm border border-border bg-bg-secondary px-4 py-3 text-sm focus-ring"
                />
                {errors.email && <p className="mt-1 text-xs text-accent-hover">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs tracking-widest text-text-secondary">
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full rounded-sm border border-border bg-bg-secondary px-4 py-3 pr-11 text-sm focus-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary focus-ring"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-accent-hover">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-xs tracking-widest text-text-secondary">
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full rounded-sm border border-border bg-bg-secondary px-4 py-3 pr-11 text-sm focus-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary focus-ring"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-accent-hover">{errors.confirmPassword}</p>
                )}
              </div>

              {formError && (
                <p className="rounded-sm border border-accent-red/40 bg-accent-red/10 px-4 py-2 text-sm text-accent-hover">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-sm bg-accent-red py-3.5 text-sm font-semibold tracking-widest text-white transition-colors hover:bg-accent-hover disabled:opacity-60 focus-ring"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
              </button>

              <p className="text-center text-sm text-text-secondary">
                Already have an account?{" "}
                <Link href="/login" className="text-text-primary underline underline-offset-4">
                  Log in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
