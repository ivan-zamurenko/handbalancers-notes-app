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
  title: string
  description: string | null
  order: number
}

export type Program = {
  id: string
  category_id: string
  title: string
  description: string | null
  level: Level
  is_free: boolean
  thumbnail_url: string | null
  order: number
  created_at: string
}

export type Week = {
  id: string
  program_id: string
  title: string
  order: number
}

export type Day = {
  id: string
  week_id: string
  title: string
  order: number
}

export type Exercise = {
  id: string
  day_id: string
  name: string
  description: string | null
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
  sets: number | null
  reps: number | null
  achieved_hold: number | null  // секунди
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
