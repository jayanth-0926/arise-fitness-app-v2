# ARISE — Premium Fitness Platform

A full-stack fitness training platform: personalized workout generation, real progress tracking,
and a black/white/red premium gym aesthetic. Built with Next.js App Router, TypeScript, Tailwind
CSS, and Supabase (Auth + Postgres).

---

## 1. Tech Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — custom ARISE color system (see `tailwind.config.ts`)
- **Supabase** — Authentication, Postgres database, Row Level Security
- **Framer Motion** — entrance/scroll animations
- **Lucide React** — icons

No external AI API is required. Workout generation is fully deterministic (`lib/workoutGenerator.ts`),
based on the user's profile and a real exercise database.

---

## 2. Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase project URL + anon/publishable key
# (Yours are already filled into .env.local for convenience)

# 3. Run the dev server
npm run dev
```

Visit `http://localhost:3000`.

---

## 3. Supabase Setup

1. Open your Supabase project → **SQL Editor**.
2. Run the entire contents of `supabase/schema.sql` first. This creates all tables, indexes,
   triggers, and Row Level Security policies.
3. Run the entire contents of `supabase/seed.sql` next. This populates the `exercises` table with
   ~50 real exercises across strength, conditioning, cardio, and flexibility.
4. In **Authentication → URL Configuration**, set your Site URL (e.g. `http://localhost:3000` for
   local dev, or your Vercel domain in production) so password-reset emails link back correctly.
5. Email confirmation: by default Supabase requires email confirmation before a session is created.
   If you want instant sign-in during development, you can disable "Confirm email" under
   **Authentication → Providers → Email** — just know that's a project-level security setting.

### Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=https://btfkeuibaxpcckalxghe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Z4VzvzuI8_tCH1MtKGdfeA_LcrF9Nh5
```

These are safe to expose in the browser — they're the public anon/publishable key, not the
service-role key. **Never** put a service-role key in `NEXT_PUBLIC_*` variables or client code.

---

## 4. Deploying to Vercel

1. Push this project to a GitHub repository.
2. In Vercel, **Add New Project** → import the repo.
3. Add the two environment variables above under **Settings → Environment Variables**.
4. Deploy. Vercel auto-detects Next.js — no extra build configuration needed.
5. Update your Supabase **Site URL** and **Redirect URLs** (Authentication → URL Configuration) to
   include your Vercel domain, or password-reset/email links will point to localhost.

---

## 5. Architecture Notes

- **`lib/supabase/client.ts`** — browser Supabase client (client components).
- **`lib/supabase/server.ts`** — server Supabase client (server components, reads cookies).
- **`lib/supabase/middleware.ts`** + **`middleware.ts`** — refreshes the auth session on every
  request and redirects unauthenticated users away from `/dashboard/*` and `/onboarding`.
- **`lib/workoutGenerator.ts`** — deterministic weekly plan generator. Takes a profile (goal,
  experience, days/week, duration, equipment, style) and a pool of exercises, and produces a full
  weekly schedule. No external AI call — this always works, offline-safe.
- **`lib/streak.ts`** — computes current/longest streak and the current week's activity from real
  `workout_completions` rows using actual calendar-day math (not a naive counter).
- **`lib/planService.ts`** — server actions that fetch-or-generate the user's active plan, persist
  it to Supabase, and handle manual-plan creation/regeneration.
- **`lib/completionService.ts`** — marks a workout complete for today, guarded against duplicates
  both in application logic and via a unique database index
  (`uniq_completion_per_user_per_day`).
- **`components/ProfileForm.tsx`** — shared between onboarding and profile editing, so there's one
  source of truth for profile validation and fields.

### Manual vs. auto-generated plans

Every user has at most one **active** plan (`workout_plans.is_active`), enforced by a partial
unique index in Postgres. If no active plan exists when the dashboard loads, one is generated
automatically from the exercise database and saved — so it's stable across page reloads rather
than being regenerated every visit. Visiting **Training → Build a manual schedule**
(`/dashboard/plan`) lets a user replace it with a hand-built weekly schedule; saving deactivates
the old plan and activates the new one.

---

## 6. Testing Checklist

- [ ] Home page loads, hero animates in, nav links work
- [ ] Mobile hamburger menu opens/closes with animation
- [ ] Join Now → Sign Up page (no site navbar, Hanuman background image)
- [ ] Sign up with a new account → profile row created → onboarding
- [ ] Log in with existing account
- [ ] Log out (via Supabase session expiry / clearing cookies) and confirm protected routes redirect to `/login`
- [ ] Complete onboarding → redirected to dashboard
- [ ] Edit profile → BMI recalculates when height/weight change
- [ ] Training page → select a split → active plan regenerates
- [ ] Build a manual schedule → save → becomes the active plan
- [ ] Daily workout page shows today's exercises with instructions
- [ ] Mark workout complete → success animation → cannot duplicate same-day completion
- [ ] Streak and weekly activity update after completion
- [ ] Progress page shows real stats; empty state shown with zero workouts
- [ ] Contact page displays placeholder fields
- [ ] Test on mobile width (375px), tablet (768px), and desktop (1440px)
- [ ] `npm run build` completes with no TypeScript or build errors

---

## 7. What's Intentionally Left as a Placeholder

- **Contact details** (email, phone, address, social) are `xxxxx` placeholders per the project
  brief — replace them in `app/contact/page.tsx` and `components/Footer.tsx`.

Everything else — auth, onboarding, BMI, workout generation, manual scheduling, daily workout
tracking, streaks, and weight/progress logging (see the "Log Today's Weight" form on the Progress
page) — is fully wired to Supabase with no mock data.
