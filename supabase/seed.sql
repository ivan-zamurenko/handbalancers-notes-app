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
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, "order") VALUES
  (
    '00000000-0000-0000-0004-000000000001',
    '00000000-0000-0000-0003-000000000001',
    'Розминка зап''ястків',
    'Wrist Warm-up',
    'Кола, згинання, розгинання — по 10 повторень у кожну сторону',
    'Circles, flexion, extension — 10 reps each direction',
    null, 10, 2, 'https://www.youtube.com/watch?v=mSZWSQSSEjE', 1
  ),
  (
    '00000000-0000-0000-0004-000000000002',
    '00000000-0000-0000-0003-000000000001',
    'Planche lean',
    'Planche Lean',
    'Нахил вперед на прямих руках — тримати рівновагу',
    'Lean forward on straight arms — hold the balance',
    10, null, 3, 'https://www.youtube.com/watch?v=B6JVHmZWjIY', 2
  ),
  (
    '00000000-0000-0000-0004-000000000003',
    '00000000-0000-0000-0003-000000000001',
    'Pike hold',
    'Pike Hold',
    'Стійка в складці на руках біля стіни',
    'Pike position hold with hands near the wall',
    15, null, 3, 'https://www.youtube.com/watch?v=5fmOH2a57hI', 3
  );

-- EXERCISES (день 2)
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, "order") VALUES
  (
    '00000000-0000-0000-0004-000000000004',
    '00000000-0000-0000-0003-000000000002',
    'Hollow body hold',
    'Hollow Body Hold',
    'Лежачи на спині — підняти руки і ноги, тримати тіло як банан',
    'Lying on back — raise arms and legs, hold banana shape',
    20, null, 3, 'https://www.youtube.com/watch?v=LlDNef_Ztsc', 1
  ),
  (
    '00000000-0000-0000-0004-000000000005',
    '00000000-0000-0000-0003-000000000002',
    'Superman hold',
    'Superman Hold',
    'Лежачи на животі — підняти руки і ноги вгору',
    'Lying on stomach — raise arms and legs up',
    15, null, 3, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', 2
  );

-- EXERCISES (день 3 — Опора на руки)
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, "order") VALUES
  (
    '00000000-0000-0000-0004-000000000006',
    '00000000-0000-0000-0003-000000000003',
    'Поза жаби',
    'Frog Stand',
    'Коліна на ліктях, руки на підлозі — утримувати рівновагу',
    'Knees on elbows, hands on floor — hold the balance',
    10, null, 3, 'https://www.youtube.com/watch?v=tVPVl_VIXFE', 1
  ),
  (
    '00000000-0000-0000-0004-000000000007',
    '00000000-0000-0000-0003-000000000003',
    'Відтискання з широкою постановкою',
    'Wide Push-ups',
    'Руки ширше плечей — контроль лопаток і протракція',
    'Hands wider than shoulders — scapular control and protraction',
    null, 10, 3, 'https://www.youtube.com/watch?v=_l3ySVKYVJ8', 2
  ),
  (
    '00000000-0000-0000-0004-000000000008',
    '00000000-0000-0000-0003-000000000003',
    'Pike pike handstand (з підвищення)',
    'Elevated Pike Hold',
    'Ноги на лаві або стільці, руки на підлозі — утримувати позицію',
    'Feet on bench or chair, hands on floor — hold the position',
    20, null, 3, 'https://www.youtube.com/watch?v=5fmOH2a57hI', 3
  );

-- EXERCISES (день 4 — Kick-up до стіни)
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, "order") VALUES
  (
    '00000000-0000-0000-0004-000000000009',
    '00000000-0000-0000-0003-000000000004',
    'Donkey kicks',
    'Donkey Kicks',
    'З положення нахилу — поштовх ногами вгору без доходу до стіни',
    'From bent position — kick legs up without reaching the wall',
    null, 8, 3, 'https://www.youtube.com/watch?v=A_gGFhL5dB4', 1
  ),
  (
    '00000000-0000-0000-0004-000000000010',
    '00000000-0000-0000-0003-000000000004',
    'Вихід в стійку до стіни',
    'Kick-up to Wall',
    'Повний kick-up з доходом до стіни і утриманням',
    'Full kick-up reaching the wall and holding',
    null, 5, 3, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', 2
  ),
  (
    '00000000-0000-0000-0004-000000000011',
    '00000000-0000-0000-0003-000000000004',
    'Стійка біля стіни (спиною)',
    'Back-to-Wall Handstand',
    'Стійка спиною до стіни — контроль лінії тіла',
    'Handstand with back to wall — body line control',
    15, null, 3, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', 3
  );

-- EXERCISES (день 5 — Тримання біля стіни)
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, "order") VALUES
  (
    '00000000-0000-0000-0004-000000000012',
    '00000000-0000-0000-0003-000000000005',
    'Стійка обличчям до стіни',
    'Chest-to-Wall Handstand',
    'Руки впритул до стіни — відпрацювання вирівнювання',
    'Hands close to wall — alignment practice',
    20, null, 3, 'https://www.youtube.com/watch?v=BGt0DxbFGbA', 1
  ),
  (
    '00000000-0000-0000-0004-000000000013',
    '00000000-0000-0000-0003-000000000005',
    'Підйоми плечей в стійці',
    'Shoulder Shrugs in Handstand',
    'У стійці біля стіни — підйоми і опускання через лопатки',
    'In handstand at wall — elevate and depress through shoulder blades',
    null, 10, 3, 'https://www.youtube.com/watch?v=BGt0DxbFGbA', 2
  ),
  (
    '00000000-0000-0000-0004-000000000014',
    '00000000-0000-0000-0003-000000000005',
    'Тривале утримання біля стіни',
    'Long Wall Handstand Hold',
    'Максимально довге утримання стійки біля стіни з контролем дихання',
    'Maximum hold at wall with breath control',
    30, null, 3, 'https://www.youtube.com/watch?v=BGt0DxbFGbA', 3
  );

