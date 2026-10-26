"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  { name: "STRENGTH", description: "Build raw power with progressive resistance training.", image: "/images/gym-dumbbells.jpg", accent: "#E50914" },
  { name: "CONDITIONING", description: "Sharpen work capacity with high-output circuits.", image: "/images/gym-machines.jpg", accent: "#F97316" },
  { name: "ARMS", description: "Sculpt powerful biceps and triceps with precision work.", image: "/images/gym-dumbbells.jpg", accent: "#DC143C" },
  { name: "CALISTHENICS", description: "Master your bodyweight. Own your movement.", image: "/images/gym-machines.jpg", accent: "#22C55E" },
  { name: "CARDIO", description: "Improve endurance and cardiovascular resilience.", image: "/images/gym-discipline.jpg", accent: "#3B82F6" },
  { name: "FLEXIBILITY", description: "Restore mobility and protect long-term performance.", image: "/images/fit-for-purpose.jpg", accent: "#8B5CF6" },
  { name: "CORE", description: "Build a strong, stable foundation for all movement.", image: "/images/gym-discipline.jpg", accent: "#F59E0B" },
  { name: "HYBRID", description: "Combine training styles for elite all-round fitness.", image: "/images/gym-machines.jpg", accent: "#94A3B8" },
];

export default function TrainingCategories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="mb-14 max-w-xl"
      >
        <h2 className="font-display text-4xl md:text-5xl">
          EIGHT PILLARS.{" "}
          <span className="gradient-text">ONE STANDARD.</span>
        </h2>
        <p className="mt-4 text-text-secondary">
          Every ARISE program is built from these eight training disciplines. Find your focus.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <Link
              href="/training"
              className="group relative block h-64 overflow-hidden rounded-sm border border-border bg-bg-card focus-ring transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
              <Image
                src={cat.image}
                alt={`${cat.name} training`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/95 via-bg-primary/50 to-transparent" />

              {/* Category accent left border */}
              <div
                className="absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-300 group-hover:w-1"
                style={{ background: cat.accent }}
              />

              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg tracking-wide">{cat.name}</h3>
                  <ArrowUpRight
                    size={18}
                    className="transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    style={{ color: cat.accent }}
                  />
                </div>
                <p className="mt-1 text-xs text-text-secondary line-clamp-2">{cat.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-10 text-center"
      >
        <Link
          href="/training"
          className="btn-press inline-flex items-center gap-2 rounded-sm border border-accent-cyan/30 bg-accent-cyan/10 px-8 py-3 text-sm font-semibold tracking-widest text-accent-hover transition-all hover:border-accent-cyan hover:bg-accent-cyan/20 focus-ring"
        >
          EXPLORE ALL TRAINING <ArrowUpRight size={16} />
        </Link>
      </motion.div>
    </section>
  );
}
