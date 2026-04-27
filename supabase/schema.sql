-- ============================================================
-- Handbalancers — Database Schema v2
-- Supabase / PostgreSQL
-- ============================================================
-- RESET (run this first if rebuilding from scratch)
-- DROP TABLE IF EXISTS bookings, workout_logs, exercises, days, weeks, programs, categories, subscriptions, user_programs, profiles CASCADE;
-- DROP FUNCTION IF EXISTS handle_new_user CASCADE;
-- ============================================================


-- 1. PROFILES
CREATE TABLE profiles (
  id             uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name           text,
  avatar_url     text,
  trial_ends_at  timestamptz,          -- коли закінчується 7-денний trial
  created_at     timestamptz DEFAULT now()
);


-- 2. CATEGORIES
-- Верхній рівень: handstand / stretching / strength / aerial (легко додати нові)
CREATE TABLE categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text NOT NULL UNIQUE,    -- 'handstand', 'stretching', тощо
  title       text NOT NULL,
  description text,
  "order"     int  NOT NULL DEFAULT 0
);


-- 3. PROGRAMS
-- Програма всередині категорії
CREATE TABLE programs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title         text NOT NULL,
  description   text,
  level         text NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  is_free       boolean NOT NULL DEFAULT false,
  thumbnail_url text,
  "order"       int NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);


-- 4. WEEKS
-- Тиждень всередині програми
CREATE TABLE weeks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id  uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  title       text NOT NULL,
  "order"     int  NOT NULL DEFAULT 0
);


-- 5. DAYS
-- День всередині тижня
CREATE TABLE days (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id  uuid NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  title    text NOT NULL,
  "order"  int  NOT NULL DEFAULT 0
);


-- 6. EXERCISES
-- Вправи всередині одного дня
CREATE TABLE exercises (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id          uuid NOT NULL REFERENCES days(id) ON DELETE CASCADE,
  name            text NOT NULL,
  description     text,
  target_hold     int,                 -- ціль: секунди (handstand hold)
  target_reps     int,                 -- ціль: кількість повторень
  target_sets     int,                 -- ціль: кількість підходів
  youtube_url     text,                -- посилання на YouTube (легко замінити на Vimeo)
  screenshot_urls text[],              -- масив URL зображень з Supabase Storage
  "order"         int NOT NULL DEFAULT 0
);


-- 7. WORKOUT LOGS
-- Результат виконання однієї вправи користувачем
CREATE TABLE workout_logs (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id    uuid NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sets           int,                  -- скільки підходів зробив
  reps           int,                  -- повторень за підхід
  achieved_hold  int,                  -- секунди (для hold-вправ)
  video_url      text,                 -- власне відео виконання
  note           text,
  logged_at      timestamptz NOT NULL DEFAULT now()
);


-- 8. USER PROGRAMS
-- Доступ користувача до програми (куплена або відкрита)
CREATE TABLE user_programs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id   uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  purchased_at timestamptz DEFAULT now(),
  UNIQUE (user_id, program_id)
);


-- 9. SUBSCRIPTIONS
-- Підписка через Stripe
CREATE TABLE subscriptions (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id      text NOT NULL,
  stripe_subscription_id  text NOT NULL UNIQUE,
  status                  text NOT NULL CHECK (status IN ('active', 'canceled', 'trialing', 'past_due')),
  current_period_end      timestamptz NOT NULL,
  created_at              timestamptz DEFAULT now()
);


-- 10. BOOKINGS
-- Бронювання онлайн-уроку (окрема оплата через Stripe Payment Link)
CREATE TABLE bookings (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent text,          -- id платежу для підтвердження
  status                text NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'paid', 'canceled')),
  scheduled_at          timestamptz,   -- обрана дата/час уроку
  meet_url              text,          -- посилання на Google Meet
  note                  text,          -- побажання від користувача
  created_at            timestamptz DEFAULT now()
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX ON workout_logs (user_id, logged_at DESC);
CREATE INDEX ON workout_logs (exercise_id);
CREATE INDEX ON exercises (day_id, "order");
CREATE INDEX ON days (week_id, "order");
CREATE INDEX ON weeks (program_id, "order");
CREATE INDEX ON programs (category_id, "order");
CREATE INDEX ON user_programs (user_id);
CREATE INDEX ON subscriptions (user_id);
CREATE INDEX ON bookings (user_id);


-- ============================================================
-- TRIGGER — автоматичне створення профілю + trial при реєстрації
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, trial_ends_at)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'user_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    now() + interval '7 days'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_programs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE weeks           ENABLE ROW LEVEL SECURITY;
ALTER TABLE days            ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises       ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- user data
CREATE POLICY "Own logs"             ON workout_logs  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own program access"   ON user_programs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own subscription"     ON subscriptions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own bookings"         ON bookings      FOR ALL USING (auth.uid() = user_id);

-- content (read-only для всіх авторизованих)
CREATE POLICY "Read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Read programs"   ON programs   FOR SELECT USING (true);
CREATE POLICY "Read weeks"      ON weeks      FOR SELECT USING (true);
CREATE POLICY "Read days"       ON days       FOR SELECT USING (true);
CREATE POLICY "Read exercises"  ON exercises  FOR SELECT USING (true);

