// ============================================================
// Handbalancers — TypeScript Types
// Відповідають таблицям Supabase schema v2
// ============================================================

export type Level = 'beginner' | 'intermediate' | 'advanced'
export type SubscriptionStatus = 'active' | 'canceled' | 'trialing' | 'past_due'
export type BookingStatus = 'pending' | 'paid' | 'canceled'

export type Profile = {
  id: string
  name: string | null
  avatar_url: string | null
  trial_ends_at: string | null
  created_at: string
}

export type Category = {
  id: string
  slug: string
  title_ua: string
  title_en: string
  description_ua: string | null
  description_en: string | null
  order: number
}

export type Program = {
  id: string
  category_id: string
  title_ua: string
  title_en: string
  description_ua: string | null
  description_en: string | null
  level: Level
  is_free: boolean
  thumbnail_url: string | null
  order: number
  created_at: string
}

export type Week = {
  id: string
  program_id: string
  title_ua: string
  title_en: string
  order: number
}

export type Day = {
  id: string
  week_id: string
  title_ua: string
  title_en: string
  order: number
}

export type Exercise = {
  id: string
  day_id: string
  name_ua: string
  name_en: string
  description_ua: string | null
  description_en: string | null
  target_hold: number | null    // секунди
  target_reps: number | null
  target_sets: number | null
  youtube_url: string | null
  screenshot_urls: string[] | null
  order: number
}

export type WorkoutLog = {
  id: string
  user_id: string
  exercise_id: string
  hold_sets: number[] | null   // секунди кожного hold-підходу [10, 5, 20]
  reps_sets: number[] | null   // повторення кожного reps-підходу [10, 8, 10]
  video_url: string | null
  note: string | null
  logged_at: string
}

export type UserProgram = {
  id: string
  user_id: string
  program_id: string
  purchased_at: string
}

export type Subscription = {
  id: string
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  status: SubscriptionStatus
  current_period_end: string
  created_at: string
}

export type Booking = {
  id: string
  user_id: string
  stripe_payment_intent: string | null
  status: BookingStatus
  scheduled_at: string | null
  meet_url: string | null
  note: string | null
  created_at: string
}

export type ExerciseFavorite = {
  id: string
  user_id: string
  exercise_id: string
  created_at: string
}

export type DayProgress = {
  id: string
  user_id: string
  day_id: string
  completed_at: string
}
