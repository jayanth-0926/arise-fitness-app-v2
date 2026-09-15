"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const nextPath = params.get("next") || "/dashboard";
  const justRegistered = params.get("confirm") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  async function handleForgotPassword() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter your email above first, then click 'Forgot password'.");
      return;
    }
    setResetLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== "undefined" ? `${window.location.origin}/login` : undefined,
    });
    setResetLoading(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setResetSent(true);
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
          <h1 className="font-display text-3xl">LOG IN</h1>
          <p className="mt-2 text-sm text-text-secondary">Welcome back. Let's get to work.</p>

          {justRegistered && (
            <p className="mt-4 rounded-sm border border-border bg-bg-secondary px-4 py-2 text-sm text-text-secondary">
              Check your email to confirm your account before logging in.
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs tracking-widest text-text-secondary">
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-sm border border-border bg-bg-secondary px-4 py-3 text-sm focus-ring"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs tracking-widest text-text-secondary">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                className="mt-2 text-xs text-text-secondary underline underline-offset-4 hover:text-text-primary focus-ring"
              >
                {resetLoading ? "Sending reset link..." : "Forgot password?"}
              </button>
              {resetSent && (
                <p className="mt-1 text-xs text-text-secondary">Password reset email sent.</p>
              )}
            </div>

            {error && (
              <p className="rounded-sm border border-accent-red/40 bg-accent-red/10 px-4 py-2 text-sm text-accent-hover">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-accent-red py-3.5 text-sm font-semibold tracking-widest text-white transition-colors hover:bg-accent-hover disabled:opacity-60 focus-ring"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "LOGGING IN..." : "LOG IN"}
            </button>

            <p className="text-center text-sm text-text-secondary">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-text-primary underline underline-offset-4">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
