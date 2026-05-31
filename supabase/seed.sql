-- ============================================================
-- Seed — тестові дані для розробки
-- Запускати після schema.sql у Supabase SQL Editor
-- ============================================================

-- RESET (безпечне очищення в порядку залежностей, щоб можна було перезапускати)
DELETE FROM workout_logs;
DELETE FROM user_day_progress;
DELETE FROM user_exercise_favorites;
DELETE FROM user_programs;
DELETE FROM exercises;
DELETE FROM days;
DELETE FROM weeks;
DELETE FROM programs;
DELETE FROM categories;

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
INSERT INTO programs (id, slug, category_id, title_ua, title_en, description_ua, description_en, level, is_free, "order") VALUES
  (
    '00000000-0000-0000-0001-000000000001',
    'handstand-beginners',
    '00000000-0000-0000-0000-000000000001',
    'Стійка для початківців',
    'Handstand for Beginners',
    'Перша програма: зміцнення зап''ястків, лінія тіла, kick-up до стіни',
    'First program: wrist strengthening, body line, kick-up to wall',
    'beginner', true, 1
  ),
  (
    '00000000-0000-0000-0001-000000000002',
    'freestanding-handstand',
    '00000000-0000-0000-0000-000000000001',
    'Вільна стійка',
    'Freestanding Handstand',
    'Баланс без стіни: робота з пальцями, плечима, корпусом',
    'Balance without wall: fingers, shoulders, core control',
    'intermediate', false, 2
  ),
  (
    '00000000-0000-0000-0001-000000000003',
    'basic-flexibility',
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
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  (
    '00000000-0000-0000-0004-000000000001',
    '00000000-0000-0000-0003-000000000001',
    'Розминка зап''ястків',
    'Wrist Warm-up',
    'Кола, згинання, розгинання — по 10 повторень у кожну сторону',
    'Circles, flexion, extension — 10 reps each direction',
    null, 10, 2, 'https://www.youtube.com/watch?v=mSZWSQSSEjE', false, 1
  ),
  (
    '00000000-0000-0000-0004-000000000002',
    '00000000-0000-0000-0003-000000000001',
    'Planche lean',
    'Planche Lean',
    'Нахил вперед на прямих руках — тримати рівновагу',
    'Lean forward on straight arms — hold the balance',
    10, null, 3, 'https://www.youtube.com/watch?v=B6JVHmZWjIY', false, 2
  ),
  (
    '00000000-0000-0000-0004-000000000003',
    '00000000-0000-0000-0003-000000000001',
    'Pike hold',
    'Pike Hold',
    'Стійка в складці на руках біля стіни',
    'Pike position hold with hands near the wall',
    15, null, 3, 'https://www.youtube.com/watch?v=5fmOH2a57hI', true, 3
  );

-- EXERCISES (день 2)
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  (
    '00000000-0000-0000-0004-000000000004',
    '00000000-0000-0000-0003-000000000002',
    'Hollow body hold',
    'Hollow Body Hold',
    'Лежачи на спині — підняти руки і ноги, тримати тіло як банан',
    'Lying on back — raise arms and legs, hold banana shape',
    20, null, 3, 'https://www.youtube.com/watch?v=LlDNef_Ztsc', false, 1
  ),
  (
    '00000000-0000-0000-0004-000000000005',
    '00000000-0000-0000-0003-000000000002',
    'Superman hold',
    'Superman Hold',
    'Лежачи на животі — підняти руки і ноги вгору',
    'Lying on stomach — raise arms and legs up',
    15, null, 3, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 2
  );

-- EXERCISES (день 3 — Опора на руки)
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  (
    '00000000-0000-0000-0004-000000000006',
    '00000000-0000-0000-0003-000000000003',
    'Поза жаби',
    'Frog Stand',
    'Коліна на ліктях, руки на підлозі — утримувати рівновагу',
    'Knees on elbows, hands on floor — hold the balance',
    10, null, 3, 'https://www.youtube.com/watch?v=tVPVl_VIXFE', false, 1
  ),
  (
    '00000000-0000-0000-0004-000000000007',
    '00000000-0000-0000-0003-000000000003',
    'Відтискання з широкою постановкою',
    'Wide Push-ups',
    'Руки ширше плечей — контроль лопаток і протракція',
    'Hands wider than shoulders — scapular control and protraction',
    null, 10, 3, 'https://www.youtube.com/watch?v=_l3ySVKYVJ8', false, 2
  ),
  (
    '00000000-0000-0000-0004-000000000008',
    '00000000-0000-0000-0003-000000000003',
    'Pike pike handstand (з підвищення)',
    'Elevated Pike Hold',
    'Ноги на лаві або стільці, руки на підлозі — утримувати позицію',
    'Feet on bench or chair, hands on floor — hold the position',
    20, null, 3, 'https://www.youtube.com/watch?v=5fmOH2a57hI', true, 3
  );

-- EXERCISES (день 4 — Kick-up до стіни)
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  (
    '00000000-0000-0000-0004-000000000009',
    '00000000-0000-0000-0003-000000000004',
    'Donkey kicks',
    'Donkey Kicks',
    'З положення нахилу — поштовх ногами вгору без доходу до стіни',
    'From bent position — kick legs up without reaching the wall',
    null, 8, 3, 'https://www.youtube.com/watch?v=A_gGFhL5dB4', false, 1
  ),
  (
    '00000000-0000-0000-0004-000000000010',
    '00000000-0000-0000-0003-000000000004',
    'Вихід в стійку до стіни',
    'Kick-up to Wall',
    'Повний kick-up з доходом до стіни і утриманням',
    'Full kick-up reaching the wall and holding',
    null, 5, 3, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 2
  ),
  (
    '00000000-0000-0000-0004-000000000011',
    '00000000-0000-0000-0003-000000000004',
    'Стійка біля стіни (спиною)',
    'Back-to-Wall Handstand',
    'Стійка спиною до стіни — контроль лінії тіла',
    'Handstand with back to wall — body line control',
    15, null, 3, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 3
  );

-- EXERCISES (день 5 — Тримання біля стіни)
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  (
    '00000000-0000-0000-0004-000000000012',
    '00000000-0000-0000-0003-000000000005',
    'Стійка обличчям до стіни',
    'Chest-to-Wall Handstand',
    'Руки впритул до стіни — відпрацювання вирівнювання',
    'Hands close to wall — alignment practice',
    20, null, 3, 'https://www.youtube.com/watch?v=BGt0DxbFGbA', true, 1
  ),
  (
    '00000000-0000-0000-0004-000000000013',
    '00000000-0000-0000-0003-000000000005',
    'Підйоми плечей в стійці',
    'Shoulder Shrugs in Handstand',
    'У стійці біля стіни — підйоми і опускання через лопатки',
    'In handstand at wall — elevate and depress through shoulder blades',
    null, 10, 3, 'https://www.youtube.com/watch?v=BGt0DxbFGbA', true, 2
  ),
  (
    '00000000-0000-0000-0004-000000000014',
    '00000000-0000-0000-0003-000000000005',
    'Тривале утримання біля стіни',
    'Long Wall Handstand Hold',
    'Максимально довге утримання стійки біля стіни з контролем дихання',
    'Maximum hold at wall with breath control',
    30, null, 3, 'https://www.youtube.com/watch?v=BGt0DxbFGbA', true, 3
  );

-- ============================================================
-- WEEKS 3–4 для програми "Стійка для початківців"
-- ============================================================
INSERT INTO weeks (id, program_id, title_ua, title_en, "order") VALUES
  ('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0001-000000000001', 'Тиждень 3 — Баланс', 'Week 3 — Balance', 3),
  ('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0001-000000000001', 'Тиждень 4 — Консолідація', 'Week 4 — Consolidation', 4);

INSERT INTO days (id, week_id, title_ua, title_en, "order") VALUES
  ('00000000-0000-0000-0003-000000000006', '00000000-0000-0000-0002-000000000003', 'День 6 — Баланс на пальцях', 'Day 6 — Finger Balance', 1),
  ('00000000-0000-0000-0003-000000000007', '00000000-0000-0000-0002-000000000003', 'День 7 — Відхід від стіни', 'Day 7 — Coming off the Wall', 2),
  ('00000000-0000-0000-0003-000000000008', '00000000-0000-0000-0002-000000000003', 'День 8 — Тест дня', 'Day 8 — Day Test', 3),
  ('00000000-0000-0000-0003-000000000009', '00000000-0000-0000-0002-000000000004', 'День 9 — Повторення техніки', 'Day 9 — Technique Review', 1),
  ('00000000-0000-0000-0003-000000000010', '00000000-0000-0000-0002-000000000004', 'День 10 — Максимальний час', 'Day 10 — Max Hold', 2),
  ('00000000-0000-0000-0003-000000000011', '00000000-0000-0000-0002-000000000004', 'День 11 — Завершення програми', 'Day 11 — Program Finish', 3);

INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  -- день 6
  ('00000000-0000-0000-0004-000000000015', '00000000-0000-0000-0003-000000000006',
   'Баланс на кінчиках пальців', 'Fingertip Balance',
   'У стійці біля стіни — перенести вагу на пальці і відпустити стіну', 'At wall — shift weight to fingers and release',
   5, null, 5, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 1),
  ('00000000-0000-0000-0004-000000000016', '00000000-0000-0000-0003-000000000006',
   'Стрибки в стійку', 'Pop-up Practice',
   'Серії швидких підйомів для напрацювання автоматизму', 'Quick pop-up series for muscle memory',
   null, 6, 4, 'https://www.youtube.com/watch?v=A_gGFhL5dB4', false, 2),
  ('00000000-0000-0000-0004-000000000017', '00000000-0000-0000-0003-000000000006',
   'Shoulder tap у стійці', 'Shoulder Tap in Handstand',
   'У стійці біля стіни — по черзі відривати руки', 'At wall — alternately lift hands',
   null, 8, 3, 'https://www.youtube.com/watch?v=BGt0DxbFGbA', true, 3),
  -- день 7
  ('00000000-0000-0000-0004-000000000018', '00000000-0000-0000-0003-000000000007',
   'Вільний баланс 3 сек', 'Freestanding 3s',
   'Відпустити стіну і тримати 3 секунди', 'Release wall and hold for 3 seconds',
   3, null, 8, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 1),
  ('00000000-0000-0000-0004-000000000019', '00000000-0000-0000-0003-000000000007',
   'Cartwheel вихід', 'Cartwheel Exit',
   'Безпечний вихід із стійки через колесо', 'Safe handstand exit through cartwheel',
   null, 5, 3, 'https://www.youtube.com/watch?v=mSZWSQSSEjE', false, 2),
  -- день 8
  ('00000000-0000-0000-0004-000000000020', '00000000-0000-0000-0003-000000000008',
   'Тест: стійка у стіни', 'Test: Wall Handstand',
   'Максимальний час у стійці біля стіни', 'Max hold at wall',
   60, null, 1, 'https://www.youtube.com/watch?v=BGt0DxbFGbA', true, 1),
  ('00000000-0000-0000-0004-000000000021', '00000000-0000-0000-0003-000000000008',
   'Тест: вільний баланс', 'Test: Freestanding Balance',
   'Найдовший вільний баланс без стіни', 'Longest freestanding balance without wall',
   10, null, 3, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 2),
  -- день 9
  ('00000000-0000-0000-0004-000000000022', '00000000-0000-0000-0003-000000000009',
   'Розминка зап''ястків', 'Wrist Warm-up',
   'Кола, згинання, розгинання', 'Circles, flexion, extension',
   null, 10, 2, 'https://www.youtube.com/watch?v=mSZWSQSSEjE', false, 1),
  ('00000000-0000-0000-0004-000000000023', '00000000-0000-0000-0003-000000000009',
   'Повний kick-up + утримання', 'Full Kick-up + Hold',
   'Серія kick-up з утриманням максимально довго', 'Kick-up series holding as long as possible',
   null, 5, 4, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 2),
  ('00000000-0000-0000-0004-000000000024', '00000000-0000-0000-0003-000000000009',
   'Planche lean', 'Planche Lean',
   'Нахил вперед на прямих руках', 'Lean forward on straight arms',
   15, null, 3, 'https://www.youtube.com/watch?v=B6JVHmZWjIY', false, 3),
  -- день 10
  ('00000000-0000-0000-0004-000000000025', '00000000-0000-0000-0003-000000000010',
   'Стійка: максимальний час', 'Handstand Max Hold',
   'Одна спроба на максимальний час у стійці', 'One attempt for maximum handstand hold',
   120, null, 1, 'https://www.youtube.com/watch?v=BGt0DxbFGbA', true, 1),
  ('00000000-0000-0000-0004-000000000026', '00000000-0000-0000-0003-000000000010',
   'Hollow body 30 сек', 'Hollow Body 30s',
   'Утримання hollow body 30 секунд', 'Hold hollow body for 30 seconds',
   30, null, 3, 'https://www.youtube.com/watch?v=LlDNef_Ztsc', false, 2),
  -- день 11
  ('00000000-0000-0000-0004-000000000027', '00000000-0000-0000-0003-000000000011',
   'Вільний баланс — найкращий час', 'Freestanding — Best Time',
   'Фінальний тест: найдовший вільний баланс', 'Final test: longest freestanding balance',
   15, null, 5, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 1),
  ('00000000-0000-0000-0004-000000000028', '00000000-0000-0000-0003-000000000011',
   'Стречінг плечей', 'Shoulder Stretch',
   'Розтяжка плечей після курсу', 'Shoulder stretch after the course',
   30, null, 2, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 2);


-- ============================================================
-- ПРОГРАМА 2: "Вільна стійка" — 4 тижні (intermediate, premium)
-- ============================================================
INSERT INTO weeks (id, program_id, title_ua, title_en, "order") VALUES
  ('00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0001-000000000002', 'Тиждень 1 — Баланс без стіни', 'Week 1 — Balance Without Wall', 1),
  ('00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0001-000000000002', 'Тиждень 2 — Пальці і корпус', 'Week 2 — Fingers & Core', 2),
  ('00000000-0000-0000-0002-000000000007', '00000000-0000-0000-0001-000000000002', 'Тиждень 3 — Стабілізація', 'Week 3 — Stabilization', 3),
  ('00000000-0000-0000-0002-000000000008', '00000000-0000-0000-0001-000000000002', 'Тиждень 4 — Піки та рекорди', 'Week 4 — Peaks & Records', 4);

INSERT INTO days (id, week_id, title_ua, title_en, "order") VALUES
  -- Тиждень 1
  ('00000000-0000-0000-0003-000000000012', '00000000-0000-0000-0002-000000000005', 'День 1 — Kick-up контроль', 'Day 1 — Kick-up Control', 1),
  ('00000000-0000-0000-0003-000000000013', '00000000-0000-0000-0002-000000000005', 'День 2 — Відпускання стіни', 'Day 2 — Releasing the Wall', 2),
  ('00000000-0000-0000-0003-000000000014', '00000000-0000-0000-0002-000000000005', 'День 3 — Мікробаланс', 'Day 3 — Micro-balance', 3),
  -- Тиждень 2
  ('00000000-0000-0000-0003-000000000015', '00000000-0000-0000-0002-000000000006', 'День 4 — Робота пальців', 'Day 4 — Finger Work', 1),
  ('00000000-0000-0000-0003-000000000016', '00000000-0000-0000-0002-000000000006', 'День 5 — Компресія корпусу', 'Day 5 — Core Compression', 2),
  ('00000000-0000-0000-0003-000000000017', '00000000-0000-0000-0002-000000000006', 'День 6 — Серії балансу', 'Day 6 — Balance Series', 3),
  -- Тиждень 3
  ('00000000-0000-0000-0003-000000000018', '00000000-0000-0000-0002-000000000007', 'День 7 — Плечова стабільність', 'Day 7 — Shoulder Stability', 1),
  ('00000000-0000-0000-0003-000000000019', '00000000-0000-0000-0002-000000000007', 'День 8 — Тримання під навантаженням', 'Day 8 — Loaded Hold', 2),
  ('00000000-0000-0000-0003-000000000020', '00000000-0000-0000-0002-000000000007', 'День 9 — Рухливість у стійці', 'Day 9 — Movement in Handstand', 3),
  -- Тиждень 4
  ('00000000-0000-0000-0003-000000000021', '00000000-0000-0000-0002-000000000008', 'День 10 — Фінальні серії', 'Day 10 — Final Series', 1),
  ('00000000-0000-0000-0003-000000000022', '00000000-0000-0000-0002-000000000008', 'День 11 — PR день', 'Day 11 — PR Day', 2),
  ('00000000-0000-0000-0003-000000000023', '00000000-0000-0000-0002-000000000008', 'День 12 — Завершення курсу', 'Day 12 — Course Finish', 3);

INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  -- д12
  ('00000000-0000-0000-0004-000000000029', '00000000-0000-0000-0003-000000000012',
   'Kick-up з зупинкою', 'Kick-up with Pause',
   'Зупинитись у вертикалі і зафіксувати положення', 'Stop at vertical and fix position',
   3, null, 8, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 1),
  ('00000000-0000-0000-0004-000000000030', '00000000-0000-0000-0003-000000000012',
   'Shoulder shrug в стійці', 'Shoulder Shrug in HS',
   'Підняти і опустити плечі в стійці', 'Elevate and depress shoulders in HS',
   null, 10, 3, 'https://www.youtube.com/watch?v=BGt0DxbFGbA', true, 2),
  -- д13
  ('00000000-0000-0000-0004-000000000031', '00000000-0000-0000-0003-000000000013',
   'Відпускання стіни на 1 сек', 'Release Wall 1s',
   'Відпустити стіну на 1 секунду, повернутись', 'Release wall for 1 second, return',
   1, null, 10, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 1),
  ('00000000-0000-0000-0004-000000000032', '00000000-0000-0000-0003-000000000013',
   'Баланс 5 сек', 'Balance 5s',
   'Тримати вільний баланс 5 секунд', 'Hold freestanding balance for 5 seconds',
   5, null, 6, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 2),
  -- д14
  ('00000000-0000-0000-0004-000000000033', '00000000-0000-0000-0003-000000000014',
   'Мікрокорекції пальцями', 'Micro-corrections with Fingers',
   'Навмисні малі корекції балансу через пальці', 'Deliberate small corrections through fingers',
   10, null, 5, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 1),
  ('00000000-0000-0000-0004-000000000034', '00000000-0000-0000-0003-000000000014',
   'Hollow body hold', 'Hollow Body Hold',
   'Лежачи на спині — тіло як банан', 'Lying on back — banana shape',
   30, null, 3, 'https://www.youtube.com/watch?v=LlDNef_Ztsc', false, 2),
  -- д15
  ('00000000-0000-0000-0004-000000000035', '00000000-0000-0000-0003-000000000015',
   'Finger press в стійці', 'Finger Press in HS',
   'Тиснути пальцями і відпускати по черзі', 'Press and release fingers alternately',
   null, 12, 3, 'https://www.youtube.com/watch?v=BGt0DxbFGbA', true, 1),
  ('00000000-0000-0000-0004-000000000036', '00000000-0000-0000-0003-000000000015',
   'Баланс 8 сек', 'Balance 8s',
   'Тримати вільний баланс 8 секунд', 'Hold freestanding balance for 8 seconds',
   8, null, 6, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 2),
  -- д16
  ('00000000-0000-0000-0004-000000000037', '00000000-0000-0000-0003-000000000016',
   'L-sit пресування', 'L-sit Press',
   'Підйом в L-sit і утримання', 'Lift to L-sit and hold',
   5, null, 5, 'https://www.youtube.com/watch?v=B6JVHmZWjIY', false, 1),
  ('00000000-0000-0000-0004-000000000038', '00000000-0000-0000-0003-000000000016',
   'Compression hold', 'Compression Hold',
   'Ноги підняти до кута 90° і тримати', 'Lift legs to 90° and hold',
   10, null, 4, 'https://www.youtube.com/watch?v=B6JVHmZWjIY', false, 2),
  -- д17
  ('00000000-0000-0000-0004-000000000039', '00000000-0000-0000-0003-000000000017',
   'Серія балансу 10 спроб', 'Balance Series 10 Attempts',
   'Підряд 10 спроб вільного балансу', '10 consecutive freestanding attempts',
   null, 10, 1, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 1),
  ('00000000-0000-0000-0004-000000000040', '00000000-0000-0000-0003-000000000017',
   'Фіксація на 10 сек', 'Fix 10s',
   'Стабілізувати баланс і тримати 10 секунд', 'Stabilize and hold for 10 seconds',
   10, null, 4, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 2),
  -- д18
  ('00000000-0000-0000-0004-000000000041', '00000000-0000-0000-0003-000000000018',
   'Ring support hold', 'Ring Support Hold',
   'Утримання упору на кільцях', 'Support hold on rings',
   20, null, 3, 'https://www.youtube.com/watch?v=B6JVHmZWjIY', false, 1),
  ('00000000-0000-0000-0004-000000000042', '00000000-0000-0000-0003-000000000018',
   'Баланс у закритих очах', 'Eyes-Closed Balance',
   'Спробувати баланс із заплющеними очима', 'Attempt balance with eyes closed',
   3, null, 5, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 2),
  -- д19
  ('00000000-0000-0000-0004-000000000043', '00000000-0000-0000-0003-000000000019',
   'Weighted hold (з жилетом)', 'Weighted Hold',
   'Стійка з обтяженням або у гамаку', 'HS with weight vest or in hammock',
   15, null, 3, 'https://www.youtube.com/watch?v=BGt0DxbFGbA', true, 1),
  ('00000000-0000-0000-0004-000000000044', '00000000-0000-0000-0003-000000000019',
   'Straddle вихід', 'Straddle Exit',
   'Вийти з стійки через шпагат', 'Exit handstand through straddle',
   null, 5, 3, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', false, 2),
  -- д20
  ('00000000-0000-0000-0004-000000000045', '00000000-0000-0000-0003-000000000020',
   'Walking on hands', 'Walking on Hands',
   '5 кроків на руках в кожну сторону', '5 steps on hands each direction',
   null, 5, 4, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 1),
  ('00000000-0000-0000-0004-000000000046', '00000000-0000-0000-0003-000000000020',
   'Баланс 15 сек', 'Balance 15s',
   'Тримати вільний баланс 15 секунд', 'Hold freestanding for 15 seconds',
   15, null, 3, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 2),
  -- д21
  ('00000000-0000-0000-0004-000000000047', '00000000-0000-0000-0003-000000000021',
   'Max hold серія', 'Max Hold Series',
   '5 спроб — кожна максимально довга', '5 attempts — each as long as possible',
   30, null, 5, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 1),
  ('00000000-0000-0000-0004-000000000048', '00000000-0000-0000-0003-000000000021',
   'Hollow body + pull-over', 'Hollow Body + Pull-over',
   'Комбінація hollow і підйому в стійку через горизонт', 'Hollow into press-to-hs',
   null, 5, 3, 'https://www.youtube.com/watch?v=LlDNef_Ztsc', false, 2),
  -- д22 (PR день)
  ('00000000-0000-0000-0004-000000000049', '00000000-0000-0000-0003-000000000022',
   'PR: Вільний баланс', 'PR: Freestanding HS',
   'Встановити особистий рекорд тривалості вільного балансу', 'Set personal best freestanding hold',
   60, null, 3, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 1),
  ('00000000-0000-0000-0004-000000000050', '00000000-0000-0000-0003-000000000022',
   'PR: Kick-up точність', 'PR: Kick-up Accuracy',
   '10 kick-up — підрахувати скільки потрапили в баланс', '10 kick-ups — count how many hit balance',
   null, 10, 1, 'https://www.youtube.com/watch?v=A_gGFhL5dB4', true, 2),
  -- д23
  ('00000000-0000-0000-0004-000000000051', '00000000-0000-0000-0003-000000000023',
   'Фінальний вільний баланс', 'Final Freestanding HS',
   'Остання спроба курсу — фінальний результат', 'Last attempt of the course — final result',
   60, null, 1, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 1),
  ('00000000-0000-0000-0004-000000000052', '00000000-0000-0000-0003-000000000023',
   'Відновлення і розтяжка', 'Recovery & Stretch',
   'Плечі, зап''ястки, спина — повне відновлення', 'Shoulders, wrists, back — full recovery',
   30, null, 2, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 2);


-- ============================================================
-- ПРОГРАМА 3: "Базова гнучкість" — 2 тижні (beginner, free)
-- ============================================================
INSERT INTO weeks (id, program_id, title_ua, title_en, "order") VALUES
  ('00000000-0000-0000-0002-000000000009', '00000000-0000-0000-0001-000000000003', 'Тиждень 1 — Розкриття тіла', 'Week 1 — Body Opening', 1),
  ('00000000-0000-0000-0002-000000000010', '00000000-0000-0000-0001-000000000003', 'Тиждень 2 — Поглиблення', 'Week 2 — Deepening', 2);

INSERT INTO days (id, week_id, title_ua, title_en, "order") VALUES
  ('00000000-0000-0000-0003-000000000024', '00000000-0000-0000-0002-000000000009', 'День 1 — Стегна і паховина', 'Day 1 — Hips & Groin', 1),
  ('00000000-0000-0000-0003-000000000025', '00000000-0000-0000-0002-000000000009', 'День 2 — Плечі і грудний відділ', 'Day 2 — Shoulders & Thoracic', 2),
  ('00000000-0000-0000-0003-000000000026', '00000000-0000-0000-0002-000000000009', 'День 3 — Хребет і шия', 'Day 3 — Spine & Neck', 3),
  ('00000000-0000-0000-0003-000000000027', '00000000-0000-0000-0002-000000000010', 'День 4 — Шпагат (підготовка)', 'Day 4 — Splits Prep', 1),
  ('00000000-0000-0000-0003-000000000028', '00000000-0000-0000-0002-000000000010', 'День 5 — Прогин і задня поверхня', 'Day 5 — Backbend & Posterior', 2),
  ('00000000-0000-0000-0003-000000000029', '00000000-0000-0000-0002-000000000010', 'День 6 — Повне тіло', 'Day 6 — Full Body', 3);

INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  -- д24
  ('00000000-0000-0000-0004-000000000053', '00000000-0000-0000-0003-000000000024',
   'Метелик', 'Butterfly Stretch',
   'Сидячи — стопи разом, коліна до підлоги', 'Sitting — soles together, knees toward floor',
   30, null, 3, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 1),
  ('00000000-0000-0000-0004-000000000054', '00000000-0000-0000-0003-000000000024',
   'Голуб (ліва/права)', 'Pigeon Pose',
   'По 30 сек на кожну сторону', '30 sec each side',
   30, null, 2, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 2),
  ('00000000-0000-0000-0004-000000000055', '00000000-0000-0000-0003-000000000024',
   'Нахил вперед сидячи', 'Seated Forward Fold',
   'Ноги разом, тягнутись до стоп', 'Legs together, reach toward feet',
   40, null, 3, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 3),
  -- д25
  ('00000000-0000-0000-0004-000000000056', '00000000-0000-0000-0003-000000000025',
   'Плечовий стретч у дверях', 'Doorway Shoulder Stretch',
   'Руки в двері, нахилитись вперед', 'Arms in doorway, lean forward',
   30, null, 2, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 1),
  ('00000000-0000-0000-0004-000000000057', '00000000-0000-0000-0003-000000000025',
   'Котик-корівка', 'Cat-Cow',
   'На чотирьох — чергувати прогин і округлення', 'On all fours — alternate arch and round',
   null, 10, 3, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 2),
  ('00000000-0000-0000-0004-000000000058', '00000000-0000-0000-0003-000000000025',
   'Thread the needle', 'Thread the Needle',
   'Прокручування грудного відділу', 'Thoracic rotation',
   20, null, 3, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 3),
  -- д26
  ('00000000-0000-0000-0004-000000000059', '00000000-0000-0000-0003-000000000026',
   'Хребет скручування', 'Spine Twist',
   'Лежачи на спині, коліно через тіло', 'Lying on back, knee across body',
   30, null, 2, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 1),
  ('00000000-0000-0000-0004-000000000060', '00000000-0000-0000-0003-000000000026',
   'Дитяча поза', 'Child''s Pose',
   'Повне розслаблення спини', 'Full back release',
   60, null, 2, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 2),
  -- д27
  ('00000000-0000-0000-0004-000000000061', '00000000-0000-0000-0003-000000000027',
   'Шпагат (підготовка ліво)', 'Splits Prep Left',
   'Випад назад на ліву, тягнути', 'Lunge left back, pull down',
   30, null, 3, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 1),
  ('00000000-0000-0000-0004-000000000062', '00000000-0000-0000-0003-000000000027',
   'Шпагат (підготовка право)', 'Splits Prep Right',
   'Випад назад на праву, тягнути', 'Lunge right back, pull down',
   30, null, 3, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 2),
  ('00000000-0000-0000-0004-000000000063', '00000000-0000-0000-0003-000000000027',
   'Поперечний шпагат', 'Middle Splits',
   'Ноги в сторони — утримувати низьку позицію', 'Legs apart — hold low position',
   30, null, 3, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 3),
  -- д28
  ('00000000-0000-0000-0004-000000000064', '00000000-0000-0000-0003-000000000028',
   'Прогин на підлозі (Cobra)', 'Cobra Pose',
   'Руки поруч із грудьми, підняти голову і груди', 'Hands beside chest, lift head and chest',
   20, null, 3, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 1),
  ('00000000-0000-0000-0004-000000000065', '00000000-0000-0000-0003-000000000028',
   'Місток (bridge)', 'Bridge',
   'Лежачи на спині, підняти таз і прогнутись', 'Lying on back, lift hips into bridge',
   20, null, 3, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 2),
  ('00000000-0000-0000-0004-000000000066', '00000000-0000-0000-0003-000000000028',
   'Ноги над головою', 'Legs Over Head',
   'Лежачи, закинути ноги за голову', 'Lying, bring legs over head',
   20, null, 3, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 3),
  -- д29
  ('00000000-0000-0000-0004-000000000067', '00000000-0000-0000-0003-000000000029',
   'Sun Salutation (сонячне вітання)', 'Sun Salutation',
   '5 циклів — поєднання всіх рухів', '5 cycles — combining all movements',
   null, 5, 1, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 1),
  ('00000000-0000-0000-0004-000000000068', '00000000-0000-0000-0003-000000000029',
   'Шавасана (відновлення)', 'Savasana',
   'Повне розслаблення тіла 2 хвилини', 'Full body relaxation 2 minutes',
   120, null, 1, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 2);

