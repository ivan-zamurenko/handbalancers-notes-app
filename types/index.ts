// Всі TypeScript типи проекту

export type Level = 'beginner' | 'intermediate' | 'advanced'

// Програма тренувань (таблиця `programs` у Supabase)
export type Program = {
  id: string
  title: string
  description: string
  level: Level
  is_free: boolean
  created_at: string
}

// Тренування у програмі (таблиця `workouts`)
export type Workout = {
  id: string
  program_id: string
  title: string
  order: number
}

// Вправа у тренуванні (таблиця `exercises`)
export type Exercise = {
  id: string
  workout_id: string
  name: string
  description: string
  target_hold?: number   // секунди
  target_reps?: number
  video_url?: string
}

// Запис результату тренування (таблиця `workout_logs`)
export type WorkoutLog = {
  id: string
  user_id: string
  exercise_id: string
  achieved_hold?: number  // секунди
  reps?: number
  note?: string
  logged_at: string
}

// Підписка (таблиця `subscriptions`)
export type Subscription = {
  id: string
  user_id: string
  stripe_subscription_id: string
  status: 'active' | 'canceled' | 'trialing' | 'past_due'
  current_period_end: string
}

// Тарифний план (для відображення на сторінці billing)
export type Plan = {
  id: string
  name: string
  price: number
  stripe_price_id: string
  features: string[]
}
