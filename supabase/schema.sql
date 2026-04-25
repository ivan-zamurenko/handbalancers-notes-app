-- ============================================================
-- Handbalancers — Database Schema
-- Supabase / PostgreSQL
-- ============================================================

-- 1. PROFILES
-- Розширює вбудовану auth.users таблицю Supabase
-- Створюється автоматично через trigger при будь-якій реєстрації (email, OAuth, тощо)
CREATE TABLE profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text,
  avatar_url  text,
  created_at  timestamptz DEFAULT now()
);

-- 2. PROGRAMS
-- Тренувальні програми (handstand, flexibility, etc.)
CREATE TABLE programs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  description   text,
  level         text NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  is_free       boolean NOT NULL DEFAULT false,
  thumbnail_url text,
  created_at    timestamptz DEFAULT now()
);

-- 3. WORKOUTS
-- Окремі тренування всередині програми (одне заняття)
CREATE TABLE workouts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id  uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text,
  "order"     int NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- 4. EXERCISES
-- Вправи всередині одного тренування
CREATE TABLE exercises (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id    uuid NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  name          text NOT NULL,
  description   text,
  target_hold   int,   -- ціль: секунди (для hold-вправ, наприклад handstand)
  target_reps   int,   -- ціль: кількість повторень
  video_url     text,
  "order"       int NOT NULL DEFAULT 0
);

-- 5. WORKOUT LOGS
-- Записи результатів — що зробив користувач під час тренування
CREATE TABLE workout_logs (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id    uuid NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  achieved_hold  int,    -- досягнутий час у секундах
  reps           int,    -- кількість повторень
  note           text,
  logged_at      timestamptz NOT NULL DEFAULT now()
);

-- 6. USER PROGRAMS
-- Доступ користувача до програм (безкоштовні або куплені)
CREATE TABLE user_programs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id   uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  purchased_at timestamptz DEFAULT now(),
  UNIQUE (user_id, program_id)
);

-- 7. SUBSCRIPTIONS
-- Статус підписки через Stripe
CREATE TABLE subscriptions (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id      text NOT NULL,
  stripe_subscription_id  text NOT NULL UNIQUE,
  status                  text NOT NULL CHECK (status IN ('active', 'canceled', 'trialing', 'past_due')),
  current_period_end      timestamptz NOT NULL,
  created_at              timestamptz DEFAULT now()
);

-- ============================================================
-- INDEXES — для швидкого пошуку
-- ============================================================

CREATE INDEX ON workout_logs (user_id, logged_at DESC);
CREATE INDEX ON workout_logs (exercise_id);
CREATE INDEX ON workouts (program_id, "order");
CREATE INDEX ON exercises (workout_id, "order");
CREATE INDEX ON user_programs (user_id);
CREATE INDEX ON subscriptions (user_id);

-- ============================================================
-- TRIGGER — автоматичне створення профілю після будь-якої реєстрації
-- Спрацьовує для email/password, Google, GitHub та інших OAuth провайдерів
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',  -- Google OAuth
      NEW.raw_user_meta_data->>'user_name',  -- GitHub OAuth
      NEW.raw_user_meta_data->>'name',       -- email реєстрація
      split_part(NEW.email, '@', 1)          -- fallback: частина email до @
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW; -- не блокуємо створення користувача якщо profiles insert впав
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
-- ROW LEVEL SECURITY (RLS)
-- Кожен користувач бачить ТІЛЬКИ свої дані
-- ============================================================

ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_programs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions   ENABLE ROW LEVEL SECURITY;
-- programs, workouts, exercises — публічні для читання
ALTER TABLE programs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises       ENABLE ROW LEVEL SECURITY;

-- profiles: читання і оновлення лише власного профілю
-- INSERT виконує trigger (SECURITY DEFINER) — RLS не блокує його
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert" ON profiles
  FOR INSERT WITH CHECK (true); -- trigger має SECURITY DEFINER, тому дозволяємо

CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- workout_logs: лише власні записи
CREATE POLICY "Own logs" ON workout_logs
  FOR ALL USING (auth.uid() = user_id);

-- user_programs: лише свій доступ
CREATE POLICY "Own programs access" ON user_programs
  FOR ALL USING (auth.uid() = user_id);

-- subscriptions: лише своя підписка
CREATE POLICY "Own subscription" ON subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- programs / workouts / exercises: всі авторизовані можуть читати
CREATE POLICY "Public programs read" ON programs
  FOR SELECT USING (true);

CREATE POLICY "Public workouts read" ON workouts
  FOR SELECT USING (true);

CREATE POLICY "Public exercises read" ON exercises
  FOR SELECT USING (true);
