"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  {
    name: "STRENGTH",
    description: "Build raw power with progressive resistance training.",
    image: "/images/gym-dumbbells.jpg",
  },
  {
    name: "CONDITIONING",
    description: "Sharpen work capacity with high-output circuits.",
    image: "/images/gym-machines.jpg",
  },
  {
    name: "CARDIO",
    description: "Improve endurance and cardiovascular resilience.",
    image: "/images/gym-discipline.jpg",
  },
  {
    name: "FLEXIBILITY",
    description: "Restore mobility and protect long-term performance.",
    image: "/images/fit-for-purpose.jpg",
  },
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
        <h2 className="font-display text-4xl md:text-5xl">FOUR PILLARS. ONE STANDARD.</h2>
        <p className="mt-4 text-text-secondary">
          Every ARISE program is built from these four training foundations.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <Link
              href="/training"
              className="group relative block h-96 overflow-hidden rounded-sm border border-border bg-bg-card focus-ring"
            >
              <Image
                src={cat.image}
                alt={`${cat.name} training`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl tracking-wide">{cat.name}</h3>
                  <ArrowUpRight
                    size={22}
                    className="text-accent-red transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </div>
                <p className="mt-2 text-sm text-text-secondary">{cat.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
