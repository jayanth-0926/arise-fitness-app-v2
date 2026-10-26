"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MotivationSection() {
  return (
    <section className="relative h-[70vh] min-h-[520px] w-full overflow-hidden">
      <Image
        src="/images/gym-discipline.jpg"
        alt="Discipline today, strength tomorrow signage inside a gym"
        fill
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-bg-primary/80" />
      {/* Cyan glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-display text-4xl leading-tight sm:text-5xl md:text-6xl"
        >
          YOUR STRONGEST VERSION
          <br />
          <span className="gradient-text">STARTS HERE.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-6 max-w-lg text-text-secondary"
        >
          Consistency compounds. Every session moves the line — the work you put in today is the
          strength you carry tomorrow.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Link
            href="/signup"
            className="btn-press mt-8 inline-flex items-center rounded-sm px-8 py-4 text-sm font-semibold tracking-widest text-bg-primary transition-all focus-ring hover:shadow-glow-cyan"
            style={{ background: "linear-gradient(135deg, #06B6D4, #22D3EE)" }}
          >
            JOIN NOW
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
