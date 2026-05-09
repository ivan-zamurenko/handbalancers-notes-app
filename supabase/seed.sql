-- ============================================================
-- Seed — тестові дані для розробки
-- Запускати після schema.sql у Supabase SQL Editor
-- ============================================================

-- CATEGORIES
INSERT INTO categories (id, slug, title_ua, title_en, description_ua, description_en, "order") VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'handstand',
    'Стійка на руках',
    'Handstand',
    'Стійка на руках з нуля до впевненого балансу',
    'From zero to confident freestanding handstand',
    1
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'stretching',
    'Розтяжка',
    'Stretching',
    'Гнучкість і мобільність для всього тіла',
    'Flexibility and mobility for the whole body',
    2
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'strength',
    'Сила',
    'Strength',
    'Базова силова підготовка',
    'Foundational strength training',
    3
  );


-- PROGRAMS
INSERT INTO programs (id, category_id, title_ua, title_en, description_ua, description_en, level, is_free, "order") VALUES
  (
    '00000000-0000-0000-0001-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Стійка для початківців',
    'Handstand for Beginners',
    'Перша програма: зміцнення зап''ястків, лінія тіла, kick-up до стіни',
    'First program: wrist strengthening, body line, kick-up to wall',
    'beginner', true, 1
  ),
  (
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Вільна стійка',
    'Freestanding Handstand',
    'Баланс без стіни: робота з пальцями, плечима, корпусом',
    'Balance without wall: fingers, shoulders, core control',
    'intermediate', false, 2
  ),
  (
    '00000000-0000-0000-0001-000000000003',
    '00000000-0000-0000-0000-000000000002',
    'Базова гнучкість',
    'Basic Flexibility',
    'Розтяжка на кожен день: шпагат, прогин, мобільність плечей',
    'Daily stretching: splits, backbend, shoulder mobility',
    'beginner', true, 1
  );


-- WEEKS
INSERT INTO weeks (id, program_id, title_ua, title_en, "order") VALUES
  ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0001-000000000001', 'Тиждень 1 — Підготовка', 'Week 1 — Foundation', 1),
  ('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0001-000000000001', 'Тиждень 2 — Kick-up', 'Week 2 — Kick-up', 2);


-- DAYS
INSERT INTO days (id, week_id, title_ua, title_en, "order") VALUES
  ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0002-000000000001', 'День 1 — Зап''ястки і плечі', 'Day 1 — Wrists & Shoulders', 1),
  ('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0002-000000000001', 'День 2 — Лінія тіла', 'Day 2 — Body Line', 2),
  ('00000000-0000-0000-0003-000000000003', '00000000-0000-0000-0002-000000000001', 'День 3 — Опора на руки', 'Day 3 — Weight on Hands', 3),
  ('00000000-0000-0000-0003-000000000004', '00000000-0000-0000-0002-000000000002', 'День 4 — Kick-up до стіни', 'Day 4 — Kick-up to Wall', 1),
  ('00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0002-000000000002', 'День 5 — Тримання біля стіни', 'Day 5 — Wall Hold', 2);


-- EXERCISES (день 1)
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, "order") VALUES
  (
    '00000000-0000-0000-0004-000000000001',
    '00000000-0000-0000-0003-000000000001',
    'Розминка зап''ястків',
    'Wrist Warm-up',
    'Кола, згинання, розгинання — по 10 повторень у кожну сторону',
    'Circles, flexion, extension — 10 reps each direction',
    null, 10, 2, 1
  ),
  (
    '00000000-0000-0000-0004-000000000002',
    '00000000-0000-0000-0003-000000000001',
    'Planche lean',
    'Planche Lean',
    'Нахил вперед на прямих руках — тримати рівновагу',
    'Lean forward on straight arms — hold the balance',
    10, null, 3, 2
  ),
  (
    '00000000-0000-0000-0004-000000000003',
    '00000000-0000-0000-0003-000000000001',
    'Pike hold',
    'Pike Hold',
    'Стійка в складці на руках біля стіни',
    'Pike position hold with hands near the wall',
    15, null, 3, 3
  );

-- EXERCISES (день 2)
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, "order") VALUES
  (
    '00000000-0000-0000-0004-000000000004',
    '00000000-0000-0000-0003-000000000002',
    'Hollow body hold',
    'Hollow Body Hold',
    'Лежачи на спині — підняти руки і ноги, тримати тіло як банан',
    'Lying on back — raise arms and legs, hold banana shape',
    20, null, 3, 1
  ),
  (
    '00000000-0000-0000-0004-000000000005',
    '00000000-0000-0000-0003-000000000002',
    'Superman hold',
    'Superman Hold',
    'Лежачи на животі — підняти руки і ноги вгору',
    'Lying on stomach — raise arms and legs up',
    15, null, 3, 2
  );
