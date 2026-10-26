"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, Zap, Target, Calendar, Clock, BarChart2 } from "lucide-react";

interface CategoryInfo {
    id: string;
    name: string;
    image: string;
    tagline: string;
    explanation: string;
    benefits: string[];
    suitableFor: string;
    frequency: string;
    accentColor: string;
    workouts: { name: string; duration: string; difficulty: "Beginner" | "Intermediate" | "Advanced"; split: string }[];
}

const CATEGORIES: CategoryInfo[] = [
    {
        id: "strength",
        name: "STRENGTH",
        image: "/images/gym-dumbbells.jpg",
        tagline: "Build raw power with progressive resistance training.",
        accentColor: "#E50914",
        explanation:
            "Strength training is the foundation of every ARISE program. Using compound barbell and dumbbell movements, you'll progressively overload your muscles over weeks and months to build real, lasting power across the major lifts.",
        benefits: [
            "Increases muscle mass and density",
            "Boosts metabolism long-term",
            "Strengthens bones and connective tissue",
            "Improves posture and joint stability",
            "Builds confidence through measurable progress",
        ],
        suitableFor: "Anyone looking to get stronger, build muscle, or improve body composition.",
        frequency: "3–5 days per week",
        workouts: [
            { name: "Push Day", duration: "45–60 min", difficulty: "Intermediate", split: "Push / Pull / Legs" },
            { name: "Pull Day", duration: "45–60 min", difficulty: "Intermediate", split: "Push / Pull / Legs" },
            { name: "Upper Body", duration: "45–55 min", difficulty: "Beginner", split: "Upper / Lower" },
            { name: "Full Body Strength", duration: "50–65 min", difficulty: "Advanced", split: "Full Body" },
        ],
    },
    {
        id: "conditioning",
        name: "CONDITIONING",
        image: "/images/gym-machines.jpg",
        tagline: "Sharpen work capacity with high-output circuits.",
        accentColor: "#F97316",
        explanation:
            "Conditioning develops your ability to sustain high-intensity effort over time. Through circuits, complexes, and metcons, you'll build the engine that transfers directly to every other area of your training.",
        benefits: [
            "Dramatically improves cardiovascular capacity",
            "Burns high calories during and after sessions",
            "Increases mental toughness",
            "Develops explosive athleticism",
            "Pairs perfectly with strength work",
        ],
        suitableFor: "Athletes, those wanting to lose fat fast, or anyone plateaued with standard cardio.",
        frequency: "2–4 days per week",
        workouts: [
            { name: "Strength & Conditioning Circuit", duration: "30–40 min", difficulty: "Intermediate", split: "Strength & Conditioning" },
            { name: "Metcon Blast", duration: "20–30 min", difficulty: "Advanced", split: "Conditioning" },
        ],
    },
    {
        id: "cardio",
        name: "CARDIO",
        image: "/images/gym-discipline.jpg",
        tagline: "Improve endurance and cardiovascular resilience.",
        accentColor: "#3B82F6",
        explanation:
            "ARISE cardio programming goes beyond treadmill time. Structured aerobic sessions build a strong endurance base, improve heart health, and accelerate recovery between strength sessions.",
        benefits: [
            "Strengthens the heart and lungs",
            "Improves recovery between training sessions",
            "Reduces stress and improves mood",
            "Increases daily energy levels",
            "Supports fat loss over time",
        ],
        suitableFor: "Beginners building a fitness base, endurance athletes, or anyone complementing a strength program.",
        frequency: "3–6 days per week",
        workouts: [
            { name: "Steady-State Run", duration: "20–40 min", difficulty: "Beginner", split: "Cardio" },
            { name: "Rowing Endurance", duration: "15–25 min", difficulty: "Intermediate", split: "Cardio" },
            { name: "Jump Rope Circuit", duration: "15–20 min", difficulty: "Beginner", split: "Cardio" },
        ],
    },
    {
        id: "flexibility",
        name: "FLEXIBILITY",
        image: "/images/fit-for-purpose.jpg",
        tagline: "Restore mobility and protect long-term performance.",
        accentColor: "#8B5CF6",
        explanation:
            "Mobility and flexibility work is the often-overlooked pillar that keeps everything else running. ARISE mobility sessions restore range of motion, reduce injury risk, and improve the quality of every other workout you do.",
        benefits: [
            "Reduces injury risk significantly",
            "Improves posture and movement quality",
            "Accelerates recovery between sessions",
            "Enhances performance in strength and cardio",
            "Reduces chronic tightness and pain",
        ],
        suitableFor: "Everyone — especially those who sit for long hours, or are returning from injury.",
        frequency: "2–7 days per week (can be done daily)",
        workouts: [
            { name: "Full Body Mobility Flow", duration: "20–30 min", difficulty: "Beginner", split: "Flexibility & Mobility" },
            { name: "Hip & Spine Recovery", duration: "15–25 min", difficulty: "Beginner", split: "Flexibility & Mobility" },
        ],
    },
    {
        id: "core",
        name: "CORE",
        image: "/images/gym-discipline.jpg",
        tagline: "Build a strong, stable foundation for all movement.",
        accentColor: "#F59E0B",
        explanation:
            "Core training at ARISE goes beyond sit-ups. A strong core stabilises every compound lift, protects your spine, and transfers power from your lower to upper body. These sessions are designed to be used standalone or as a finisher.",
        benefits: [
            "Protects and supports the lower back",
            "Improves balance and athletic performance",
            "Transfers directly to all compound lifts",
            "Reduces injury risk across all training",
            "Builds visible abdominal definition",
        ],
        suitableFor: "All levels — core work is essential for everyone from beginners to advanced athletes.",
        frequency: "2–4 days per week (or as a daily finisher)",
        workouts: [
            { name: "Core Fundamentals", duration: "15–20 min", difficulty: "Beginner", split: "Core" },
            { name: "Core Strength Circuit", duration: "20–25 min", difficulty: "Intermediate", split: "Core" },
            { name: "Advanced Core Blast", duration: "25–30 min", difficulty: "Advanced", split: "Core" },
        ],
    },
    {
        id: "arms",
        name: "ARMS",
        image: "/images/gym-dumbbells.jpg",
        tagline: "Sculpt powerful biceps and triceps with focused arm training.",
        accentColor: "#DC143C",
        explanation:
            "ARISE Arms programs target biceps and triceps with precision isolation work layered onto compound movements. Whether you want sleeve-filling mass or defined, athletic arms, these sessions deliver focused hypertrophy with proper mind-muscle connection.",
        benefits: [
            "Maximises bicep and tricep development",
            "Improves pulling and pushing strength",
            "Enhances arm definition and symmetry",
            "Supports better performance in compound lifts",
            "Builds confidence in aesthetics and strength",
        ],
        suitableFor: "Anyone wanting to develop stronger, more defined arms — pairs perfectly with any split.",
        frequency: "1–3 dedicated sessions per week",
        workouts: [
            { name: "Bicep Builder", duration: "25–35 min", difficulty: "Beginner", split: "Arms" },
            { name: "Tricep Blast", duration: "25–35 min", difficulty: "Intermediate", split: "Arms" },
            { name: "Full Arms Circuit", duration: "40–50 min", difficulty: "Intermediate", split: "Arms" },
        ],
    },
    {
        id: "calisthenics",
        name: "CALISTHENICS",
        image: "/images/gym-machines.jpg",
        tagline: "Master your bodyweight. Own your movement.",
        accentColor: "#22C55E",
        explanation:
            "Calisthenics is the art of using your own bodyweight as resistance. It builds functional strength, body control, and impressive skills — from mastering your first pull-up through to the muscle-up and beyond. No equipment required.",
        benefits: [
            "Builds functional, real-world strength",
            "Develops balance, coordination, and body control",
            "Requires zero equipment — train anywhere",
            "Scalable from beginner to elite",
            "Dramatically improves joint health and flexibility",
        ],
        suitableFor: "Everyone — beginners who want to start moving their body, advanced athletes chasing elite skills.",
        frequency: "3–5 days per week",
        workouts: [
            { name: "Beginner Foundations", duration: "20–30 min", difficulty: "Beginner", split: "Calisthenics" },
            { name: "Intermediate Skills", duration: "30–45 min", difficulty: "Intermediate", split: "Calisthenics" },
            { name: "Advanced Skill Circuit", duration: "40–55 min", difficulty: "Advanced", split: "Calisthenics" },
        ],
    },
    {
        id: "hybrid",
        name: "HYBRID",
        image: "/images/gym-machines.jpg",
        tagline: "Combine training styles for elite all-round fitness.",
        accentColor: "#94A3B8",
        explanation:
            "Hybrid training combines multiple modalities in a single program: strength meets cardio, calisthenics meets conditioning. The result is an athlete who is strong, fast, durable, and capable. This is the next level of ARISE.",
        benefits: [
            "Develops strength and endurance simultaneously",
            "Eliminates fitness plateaus through variety",
            "Builds all-round athletic capability",
            "Keeps training mentally engaging",
            "Transfers to real-world performance",
        ],
        suitableFor: "Intermediate to advanced athletes ready for a challenge that covers all bases.",
        frequency: "4–6 days per week",
        workouts: [
            { name: "Strength + Cardio", duration: "40–55 min", difficulty: "Intermediate", split: "Hybrid" },
            { name: "Calisthenics + Conditioning", duration: "35–50 min", difficulty: "Advanced", split: "Hybrid" },
            { name: "Cardio + Core Finisher", duration: "30–40 min", difficulty: "Intermediate", split: "Hybrid" },
        ],
    },
];

const DIFFICULTY_COLOR: Record<string, string> = {
    Beginner: "text-success",
    Intermediate: "text-warning",
    Advanced: "text-error",
};

const DIFFICULTY_BG: Record<string, string> = {
    Beginner: "bg-success/10",
    Intermediate: "bg-warning/10",
    Advanced: "bg-error/10",
};

export default function TrainingCategoryDetail() {
    const [selected, setSelected] = useState<CategoryInfo | null>(null);

    return (
        <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                {CATEGORIES.map((cat, i) => (
                    <motion.button
                        key={cat.id}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.5, delay: i * 0.07 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        onClick={() => setSelected(cat)}
                        className="group relative block h-56 overflow-hidden rounded-sm border border-border bg-bg-card focus-ring text-left w-full transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                        style={{ "--cat-accent": cat.accentColor } as React.CSSProperties}
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
                            style={{ background: cat.accentColor }}
                        />

                        <div className="absolute inset-x-0 bottom-0 p-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-display text-lg tracking-wide">{cat.name}</h3>
                                <ArrowUpRight
                                    size={18}
                                    className="transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                                    style={{ color: cat.accentColor }}
                                />
                            </div>
                            <p className="mt-1 text-xs text-text-secondary line-clamp-1">{cat.tagline}</p>
                        </div>
                    </motion.button>
                ))}
            </div>

            <AnimatePresence>
                {selected && (
                    <>
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="fixed inset-0 z-40 bg-bg-primary/85 backdrop-blur-sm"
                            onClick={() => setSelected(null)}
                        />

                        <motion.div
                            key="panel"
                            initial={{ opacity: 0, y: 40, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 40, scale: 0.98 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed inset-x-4 bottom-0 top-20 z-50 overflow-y-auto rounded-t-sm border border-border bg-bg-secondary shadow-2xl md:inset-x-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:h-auto md:max-h-[88vh] md:w-full md:max-w-3xl md:rounded-sm"
                        >
                            {/* Accent top bar */}
                            <div className="h-1 w-full" style={{ background: selected.accentColor }} />

                            <div className="relative h-48 w-full overflow-hidden">
                                <Image src={selected.image} alt={selected.name} fill className="object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-bg-secondary/60 to-transparent" />
                                <button
                                    onClick={() => setSelected(null)}
                                    className="absolute right-4 top-4 rounded-sm bg-bg-primary/70 p-2 text-text-primary backdrop-blur-sm hover:bg-bg-primary focus-ring transition-colors duration-200"
                                    aria-label="Close"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-6 md:p-8">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h2 className="font-display text-3xl md:text-4xl">{selected.name}</h2>
                                    <span
                                        className="rounded-sm px-3 py-1 text-xs font-semibold tracking-widest"
                                        style={{ color: selected.accentColor, background: `${selected.accentColor}18` }}
                                    >
                                        {selected.frequency}
                                    </span>
                                </div>
                                <p className="mt-2 font-medium" style={{ color: selected.accentColor }}>
                                    {selected.tagline}
                                </p>
                                <p className="mt-4 text-text-secondary leading-relaxed">{selected.explanation}</p>

                                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    {[
                                        { icon: Target, label: "SUITABLE FOR", content: selected.suitableFor },
                                        { icon: Calendar, label: "FREQUENCY", content: selected.frequency },
                                    ].map(({ icon: Icon, label, content }) => (
                                        <div key={label} className="flex items-start gap-3 rounded-sm border border-border bg-bg-card p-4">
                                            <Icon size={18} className="mt-0.5 shrink-0" style={{ color: selected.accentColor }} />
                                            <div>
                                                <p className="text-xs text-text-secondary tracking-widest">{label}</p>
                                                <p className="mt-1 text-sm">{content}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex items-start gap-3 rounded-sm border border-border bg-bg-card p-4">
                                        <Zap size={18} className="mt-0.5 shrink-0" style={{ color: selected.accentColor }} />
                                        <div>
                                            <p className="text-xs text-text-secondary tracking-widest">MAIN BENEFITS</p>
                                            <ul className="mt-1 space-y-0.5">
                                                {selected.benefits.slice(0, 3).map((b) => (
                                                    <li key={b} className="text-xs text-text-secondary">• {b}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="mt-8 font-display text-xl tracking-wide">AVAILABLE WORKOUTS</h3>
                                <div className="mt-4 space-y-3">
                                    {selected.workouts.map((w, i) => (
                                        <motion.div
                                            key={w.name}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: i * 0.06 }}
                                            className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-border bg-bg-card p-4 transition-colors duration-200 hover:border-accent-cyan/30"
                                        >
                                            <div>
                                                <p className="font-medium">{w.name}</p>
                                                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                                                    <span className="flex items-center gap-1"><Clock size={12} /> {w.duration}</span>
                                                    <span className="flex items-center gap-1"><BarChart2 size={12} /> {w.split}</span>
                                                    <span className={`font-semibold ${DIFFICULTY_COLOR[w.difficulty]} ${DIFFICULTY_BG[w.difficulty]} px-2 py-0.5 rounded-sm`}>
                                                        {w.difficulty}
                                                    </span>
                                                </div>
                                            </div>
                                            <Link
                                                href="/dashboard/workout"
                                                className="btn-press inline-flex items-center gap-1 rounded-sm px-4 py-2 text-xs font-semibold tracking-widest text-bg-primary transition-all focus-ring"
                                                style={{ background: selected.accentColor }}
                                            >
                                                START <ArrowUpRight size={12} />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-8 flex flex-wrap gap-3">
                                    <Link
                                        href="/dashboard/workout"
                                        className="btn-press inline-flex items-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold tracking-widest text-bg-primary transition-all focus-ring"
                                        style={{ background: "linear-gradient(135deg, #06B6D4, #22D3EE)" }}
                                    >
                                        START TODAY&apos;S WORKOUT
                                    </Link>
                                    <button
                                        onClick={() => setSelected(null)}
                                        className="btn-press inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3 text-sm font-semibold tracking-widest text-text-secondary transition-all duration-200 hover:border-text-secondary focus-ring"
                                    >
                                        BACK TO TRAINING
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
