# 🤸 Handbalancer's Studio

> Your daily studio for handstand and flexibility.

A premium training platform for handbalancers, gymnasts, and anyone working on
handstands, mobility, prehab, and strength. Members follow structured multi-week
programs, log every set, and watch their progress grow over time.

Built with **Next.js 16**, **Supabase**, and **Stripe**. Fully bilingual:
🇺🇦 Ukrainian (default) and 🇬🇧 English.

---

## ✨ Features

- **Structured programs** — content organized as category → program → week → day → exercise
- **Daily workout flow** — one clear next action, timers, and per-set logging
- **Progress tracking** — growth charts per exercise, streaks, and an activity overview
- **Personal dashboard** — Apple-style progress ring, today's focus, and momentum at a glance
- **Subscriptions & trials** — 7-day free trial, then a single all-access membership via Stripe
- **Bilingual UI & content** — every label and every program available in UA and EN

---

## 🛠 Tech Stack

| Technology | Role |
|---|---|
| Next.js 16 (App Router, Turbopack) | Framework |
| TypeScript | Type safety |
| Supabase (`@supabase/ssr`) | Auth + PostgreSQL + Row Level Security |
| next-intl 4 | Internationalization (`ua` / `en`) |
| Stripe | Subscriptions, Checkout & webhooks |
| Recharts | Progress charts |
| Inline styles | Design system (no Tailwind — intentional) |

**Design language:** Apple-clean + Strava-confident. Accent `#39E600`, background
`#0d0d0d`, neutral grays. The accent is reserved for actions and records, never
for static metadata.

---

## 🏗 Architecture

The codebase follows a layered, swap-friendly architecture so any block can be
added, removed, or replaced without rewriting a page.

- **Pages** (`app/[locale]/…`) orchestrate and fetch data
- **Services** (`lib/services/…`) hold business rules
- **Repositories** (`lib/db/…`) own all database access
- **Facade** (`lib/services/data.ts`) gives pages a single import surface
- **Adapters** (`lib/stripe.ts`, `lib/supabase*.ts`) isolate external providers

UI components render and trigger actions only — they never know provider-specific
details (Stripe, Supabase, etc.).

```
app/
├── [locale]/                 # ua (default) / en
│   ├── page.tsx              # Landing
│   ├── (auth)/               # login / register
│   ├── dashboard/            # Progress ring, today, streak
│   ├── programs/             # Catalog + program details
│   ├── workout/[id]/         # Workout session
│   ├── tracking/             # History, charts, activity
│   └── billing/              # Membership & pricing
└── api/stripe/               # checkout + webhook

components/                   # auth, billing, dashboard, layout,
                              # programs, tracking, workout
lib/
├── db/                       # Repositories (one file per domain)
├── services/                 # Business logic + data facade
├── stripe.ts                 # Stripe adapter
└── supabase*.ts              # Browser / server / admin clients
i18n/                         # routing, request config, navigation
messages/                     # ua.json + en.json (UI strings)
supabase/                     # schema.sql, seeds, helper scripts
types/                        # Shared TypeScript types
proxy.ts                      # Supabase session refresh + next-intl routing
```

---

## 🗄 Data Model

Content hierarchy: **category → program → week → day → exercise**

| Table | Purpose |
|---|---|
| `profiles` | User profiles (incl. `trial_ends_at`) |
| `categories` | Training categories (handstand, flexibility, strength, prehab) |
| `programs` / `weeks` / `days` | Program structure |
| `exercises` | Exercise details (video, target sets, reps/holds) |
| `workout_logs` | Logged results per set |
| `user_programs` | User ↔ program enrollment |
| `subscriptions` | Stripe subscription state |
| `bookings` | Coaching consultation bookings |

All tables are protected with **Row Level Security (RLS)**.

---

## 💳 Access & Billing

- New members get a **7-day free trial** (set on profile creation)
- After the trial, access requires an active **all-access membership** via Stripe
- `lib/db/subscriptions.ts → hasActiveAccess()` checks both states

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRICE_ID_UAH=your_stripe_price_id
```

### 3. Apply the database schema

In the Supabase SQL Editor: run `supabase/reset.sql` first (only when resetting an
existing database), then `supabase/schema.sql`.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |

---

## 📄 License

MIT
