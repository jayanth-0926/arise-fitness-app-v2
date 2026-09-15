"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <Image
        src="/images/hero-warrior.jpg"
        alt="Solo athlete training with focus in a quiet gym"
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-bg-primary/20" />
      <div className="absolute inset-0 bg-bg-primary/20" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24 md:px-10 md:pb-32">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-6xl leading-[0.95] tracking-tight sm:text-7xl md:text-8xl"
        >
          BUILT
          <br />
          <span className="text-accent-red">DIFFERENT.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-md text-lg text-text-secondary"
        >
          No shortcuts. No noise. Just a structured path from where you are to your strongest version.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-sm bg-accent-red px-8 py-4 text-sm font-semibold tracking-widest text-white transition-colors hover:bg-accent-hover focus-ring"
          >
            JOIN NOW
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/training"
            className="inline-flex items-center gap-2 rounded-sm border border-border px-8 py-4 text-sm font-semibold tracking-widest text-text-primary transition-colors hover:border-text-primary focus-ring"
          >
            EXPLORE TRAINING
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
