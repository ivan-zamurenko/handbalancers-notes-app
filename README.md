# 🤸 Handbalancers — Training Platform

Платформа для відстеження тренувань з handstand, розтяжки та фітнесу. Користувач проходить програми, записує результати тренувань і спостерігає за своїм прогресом через дашборд.

---

## ✨ Функціонал

| Розділ | Опис |
|---|---|
| **Авторизація** | Реєстрація та вхід через Supabase Auth |
| **Програми** | Список тренувальних програм з рівнями складності |
| **Тренування** | Таймер для hold-вправ, запис результатів |
| **Трекінг** | Історія, середні показники, графіки прогресу |
| **Дашборд** | Streak, статистика за 1M / 3M / 6M, досягнення |
| **Оплата** | Підписки та покупка курсів через Stripe |

---

## 🛠 Технології

- **Frontend** — [Next.js 14](https://nextjs.org/) (App Router)
- **Backend / DB** — [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Графіки** — [Recharts](https://recharts.org/)
- **Оплата** — [Stripe](https://stripe.com/)
- **Мова** — TypeScript (ES2017)
- **Стилі** — Tailwind CSS

---

## 📁 Структура проекту

```
handbalancers-notes-app/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Вхід в акаунт
│   │   └── register/page.tsx       # Реєстрація
│   ├── api/
│   │   └── stripe/
│   │       ├── checkout/route.ts   # Створення Stripe Checkout Session
│   │       └── webhook/route.ts    # Обробка Stripe webhook
│   ├── billing/page.tsx            # Підписки та оплата
│   ├── dashboard/page.tsx          # Дашборд користувача
│   ├── programs/
│   │   ├── page.tsx                # Список програм
│   │   └── [id]/page.tsx           # Деталі програми
│   ├── tracking/page.tsx           # Трекінг прогресу
│   ├── workout/[id]/page.tsx       # Активне тренування
│   ├── layout.tsx                  # Кореневий layout
│   └── page.tsx                    # Лендінг-сторінка
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── billing/
│   │   ├── PricingCard.tsx
│   │   └── SubscriptionStatus.tsx
│   ├── dashboard/
│   │   ├── ProgressChart.tsx       # Графік (Recharts)
│   │   ├── StatsCard.tsx           # Середні показники
│   │   └── StreakBadge.tsx         # Streak лічильник
│   ├── programs/
│   │   ├── ProgramCard.tsx
│   │   └── ProgramList.tsx
│   ├── tracking/
│   │   ├── ExerciseStats.tsx
│   │   └── TrackingHistory.tsx
│   └── workout/
│       ├── ExerciseCard.tsx
│       ├── LogForm.tsx             # Форма запису результату
│       └── Timer.tsx               # Таймер для hold-вправ
├── lib/
│   ├── supabase.ts                 # Supabase клієнт
│   ├── stripe.ts                   # Stripe клієнт
│   └── hooks/
│       └── useAuth.ts              # Хук авторизації
├── types/
│   └── index.ts                    # TypeScript типи
├── .env.example                    # Шаблон змінних середовища
├── next.config.js
├── package.json
└── tsconfig.json
```

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

```bash
cp .env.example .env.local
```

Заповни `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 4. Запустити dev-сервер

```bash
npm run dev
```

Відкрий [http://localhost:3000](http://localhost:3000)

---

## 🗄 Supabase таблиці

| Таблиця | Опис |
|---|---|
| `profiles` | Профілі користувачів |
| `programs` | Тренувальні програми |
| `workouts` | Тренування у програмах |
| `exercises` | Вправи у тренуваннях |
| `workout_logs` | Записи результатів |
| `subscriptions` | Підписки (Stripe) |

---

## 📄 Ліцензія

MIT
