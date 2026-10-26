import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg-primary">
        {/* SECTION 1 — ARISE */}
        <section className="relative flex min-h-[70vh] items-center overflow-hidden px-6 pt-32 md:px-10">
          <Image
            src="/images/hero-warrior.jpg"
            alt="Athlete training alone with focus"
            fill
            className="object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/70 to-bg-primary/50" />
          <div className="relative z-10 mx-auto max-w-3xl">
            <h1 className="font-display text-5xl md:text-7xl">ARISE</h1>
            <p className="mt-6 max-w-xl text-lg text-text-secondary">
              ARISE exists for one reason: to give people a structured, honest path toward getting stronger — in
              the gym and in the discipline that carries over into everything else.
            </p>
          </div>
        </section>

        {/* SECTION 2 — DISCIPLINE BUILDS RESULTS */}
        <section className="mx-auto max-w-5xl px-6 py-24 md:px-10">
          <h2 className="font-display text-4xl md:text-5xl">
            DISCIPLINE BUILDS <span className="text-accent-cyan">RESULTS.</span>
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <p className="font-display text-xl">CONSISTENCY</p>
              <p className="mt-2 text-sm text-text-secondary">
                Results come from showing up on the days you don't feel like it, not just the days you do.
              </p>
            </div>
            <div>
              <p className="font-display text-xl">STRENGTH</p>
              <p className="mt-2 text-sm text-text-secondary">
                Strength is built gradually through progressive, structured overload — not shortcuts.
              </p>
            </div>
            <div>
              <p className="font-display text-xl">PROGRESS</p>
              <p className="mt-2 text-sm text-text-secondary">
                Small, trackable improvements compound into meaningful change over months, not days.
              </p>
            </div>
            <div>
              <p className="font-display text-xl">RECOVERY</p>
              <p className="mt-2 text-sm text-text-secondary">
                Rest days and sleep are part of the program, not a break from it — growth happens between sessions.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3 — TRAIN WITH PURPOSE */}
        <section className="relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-80 md:h-auto">
              <Image src="/images/gym-machines.jpg" alt="Gym training floor" fill className="object-cover" />
            </div>
            <div className="flex flex-col justify-center bg-bg-secondary px-6 py-16 md:px-14">
              <h2 className="font-display text-4xl">TRAIN WITH PURPOSE.</h2>
              <p className="mt-4 text-text-secondary">
                Every ARISE plan is built from a clear training approach — Push/Pull/Legs, Upper/Lower, Full Body,
                Strength + Conditioning, Cardio, or Flexibility/Mobility — matched to your goal, schedule, and
                experience level. No guesswork, no generic templates.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4 — KNOW YOUR BODY */}
        <section className="mx-auto max-w-5xl px-6 py-24 md:px-10">
          <h2 className="font-display text-4xl md:text-5xl">KNOW YOUR BODY.</h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <InfoBlock
              title="BMI"
              body="A general screening ratio of weight to height. Useful as one data point, but it doesn't account for muscle mass or body composition."
            />
            <InfoBlock
              title="Fitness Goals"
              body="Muscle gain, fat loss, strength, endurance, mobility, or general fitness — your goal shapes every part of your plan."
            />
            <InfoBlock
              title="Strength Training"
              body="Progressive resistance work that builds muscle and functional power over time."
            />
            <InfoBlock
              title="Cardio & Conditioning"
              body="Builds your cardiovascular engine and work capacity, supporting recovery between strength sessions."
            />
            <InfoBlock
              title="Flexibility"
              body="Mobility work protects your joints and range of motion, reducing injury risk as training intensity increases."
            />
            <InfoBlock
              title="Recovery"
              body="Sleep, nutrition, and rest days allow the adaptations from training to actually take place."
            />
          </div>
          <p className="mt-10 max-w-2xl text-xs text-text-secondary">
            This information is general and educational, not medical advice. Speak with a healthcare professional
            for guidance specific to your situation.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

function InfoBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-sm border border-border bg-bg-card p-6">
      <p className="font-display text-lg text-accent-cyan">{title}</p>
      <p className="mt-2 text-sm text-text-secondary">{body}</p>
    </div>
  );
}
