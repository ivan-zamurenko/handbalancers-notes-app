# 🤸 Handbalancers Notes App

Тренувальна платформа для акробатів, гімнастів та всіх, хто займається стійками на руках, розтяжкою, силовими та повітряними елементами.

Побудована на **Next.js 16**, **Supabase** та **Stripe**. Підтримує дві мови: 🇺🇦 українська (за замовчуванням) та 🇬🇧 англійська.

---

## 🛠 Стек технологій

| Технологія | Роль |
|---|---|
| Next.js 16 (App Router, Turbopack) | Фреймворк |
| TypeScript | Типізація |
| Tailwind CSS | Стилі (mobile-first) |
| Supabase (+ @supabase/ssr) | Auth + PostgreSQL + RLS |
| next-intl 4 | Інтернаціоналізація (uk / en) |
| Stripe | Підписки + Payment Links |
| Recharts | Графіки прогресу |
| Resend | Email-сповіщення (заплановано) |

---

## 📁 Структура проєкту

```
app/
├── [locale]/                       # uk (default) / en
│   ├── layout.tsx                  # NextIntlClientProvider + Navbar
│   ├── page.tsx                    # Лендінг
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   ├── programs/
│   │   ├── page.tsx                # Список категорій / програм
│   │   └── [id]/                   # Деталі програми
│   ├── workout/
│   │   └── [id]/                   # Сторінка тренування
│   ├── tracking/
│   └── billing/
├── api/
│   └── stripe/
│       ├── checkout/
│       └── webhook/
├── globals.css
└── layout.tsx

components/
├── auth/           LoginForm, RegisterForm
├── billing/        PricingCard, SubscriptionStatus
├── dashboard/      ProgressChart, StatsCard, StreakBadge
├── layout/         Navbar (з перемикачем мови)
├── programs/       ProgramCard, ProgramList
├── tracking/       ExerciseStats, TrackingHistory
└── workout/        ExerciseCard, LogForm, Timer

lib/
├── supabase.ts             # Браузерний клієнт
├── supabase-server.ts      # Серверний клієнт (RSC / Server Actions)
├── stripe.ts
├── db/                     # Весь доступ до БД тут
│   ├── categories.ts
│   ├── programs.ts         # programs + weeks + days
│   ├── exercises.ts
│   ├── workoutLogs.ts
│   ├── subscriptions.ts    # hasActiveAccess() (підписка або trial)
│   └── bookings.ts
└── hooks/
    └── useAuth.ts

i18n/
├── routing.ts              # Локалі: uk (default), en
├── request.ts              # getRequestConfig
└── navigation.ts           # createNavigation

messages/
├── uk.json
└── en.json

types/
└── index.ts                # Profile, Category, Program, Week, Day,
                            # Exercise, WorkoutLog, Booking, Subscription

supabase/
├── schema.sql              # Схема v2
└── reset.sql               # Скидання БД перед застосуванням схеми

proxy.ts                    # Supabase session refresh + next-intl routing
```

---

## 🗄 Схема бази даних

Ієрархія контенту: **категорія → програма → тиждень → день → вправа**

| Таблиця | Опис |
|---|---|
| `profiles` | Профілі користувачів (`trial_ends_at`) |
| `categories` | Категорії (стійки, розтяжка, сила, повітряне) |
| `programs` | Тренувальні програми |
| `weeks` | Тижні у програмі |
| `days` | Дні у тижні |
| `exercises` | Вправи (`youtube_url`, `screenshot_urls[]`, `target_sets`) |
| `workout_logs` | Записи результатів (`sets`, `video_url`) |
| `user_programs` | Зв'язок користувач–програма |
| `subscriptions` | Підписки Stripe |
| `bookings` | Записи на Google Meet з тренером |

Усі таблиці захищені **Row Level Security (RLS)**.

---

## 💰 Доступ та білінг

- Нові користувачі отримують **7-денний безкоштовний trial** (тригер `handle_new_user`)
- Після trial — платна підписка через Stripe
- `lib/db/subscriptions.ts → hasActiveAccess()` перевіряє обидва стани

---

## 🚀 Швидкий старт

### 1. Клонувати репозиторій

```bash
git clone https://github.com/YOUR_USERNAME/handbalancers-notes-app.git
cd handbalancers-notes-app
```

### 2. Встановити залежності

```bash
npm install
```

### 3. Налаштувати змінні середовища

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=your_stripe_payment_link_url
```

### 4. Застосувати схему Supabase

Якщо оновлюєш існуючу БД, спочатку запусти `supabase/reset.sql` у Supabase SQL Editor, потім `supabase/schema.sql`.

Для нового проєкту — одразу `supabase/schema.sql`.

### 5. Запустити dev-сервер

```bash
npm run dev
```

Відкрий [http://localhost:3000](http://localhost:3000)

---

## 📄 Ліцензія

MIT
