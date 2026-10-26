"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Hero() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsAuthed(!!data.user);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session?.user);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <Image
        src="/images/hero-warrior.jpg"
        alt="Solo athlete training with focus in a quiet gym"
        fill
        priority
        className="object-cover object-center"
      />
      {/* Blue-dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/70 to-bg-primary/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/60 to-transparent" />

      {/* Subtle cyan glow orb */}
      <div className="absolute bottom-0 left-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent-cyan/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24 md:px-10 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-4 py-1.5 backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-accent-cyan" />
          <span className="text-xs tracking-widest text-accent-hover">PREMIUM FITNESS PLATFORM</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-6xl leading-[0.95] tracking-tight sm:text-7xl md:text-8xl"
        >
          BUILT
          <br />
          <span className="gradient-text">DIFFERENT.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-md text-lg text-text-secondary"
        >
          No shortcuts. No noise. Just a structured path from where you are to your strongest version.
        </motion.p>

        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap gap-4"
          >
            {isAuthed ? (
              <>
                <Link
                  href="/dashboard/workout"
                  className="btn-press group inline-flex items-center gap-2 rounded-sm px-8 py-4 text-sm font-semibold tracking-widest text-bg-primary transition-all duration-300 focus-ring hover:shadow-glow-cyan"
                  style={{ background: "linear-gradient(135deg, #06B6D4, #22D3EE)" }}
                >
                  START TODAY&apos;S WORKOUT
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/progress"
                  className="btn-press inline-flex items-center gap-2 rounded-sm border border-accent-cyan/40 bg-accent-cyan/10 px-8 py-4 text-sm font-semibold tracking-widest text-accent-hover backdrop-blur-sm transition-all duration-300 hover:border-accent-cyan hover:bg-accent-cyan/20 focus-ring"
                >
                  VIEW MY PROGRESS
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="btn-press group inline-flex items-center gap-2 rounded-sm px-8 py-4 text-sm font-semibold tracking-widest text-bg-primary transition-all duration-300 focus-ring hover:shadow-glow-cyan"
                  style={{ background: "linear-gradient(135deg, #06B6D4, #22D3EE)" }}
                >
                  JOIN NOW
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/training"
                  className="btn-press inline-flex items-center gap-2 rounded-sm border border-border px-8 py-4 text-sm font-semibold tracking-widest text-text-primary transition-all duration-300 hover:border-accent-cyan/50 hover:text-accent-hover focus-ring"
                >
                  EXPLORE TRAINING
                </Link>
              </>
            )}
          </motion.div>
        )}

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 flex flex-wrap gap-8 border-t border-border/50 pt-8"
        >
          {[
            { label: "Training Programs", value: "8+" },
            { label: "Exercises", value: "80+" },
            { label: "Categories", value: "8" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-display text-2xl text-accent-cyan">{s.value}</p>
              <p className="mt-0.5 text-xs text-text-secondary">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
