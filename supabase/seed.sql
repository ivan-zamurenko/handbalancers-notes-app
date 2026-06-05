-- ============================================================
-- Seed — тестові дані для розробки
-- Запускати після schema.sql у Supabase SQL Editor
-- ============================================================

-- RESET (безпечне очищення в порядку залежностей, щоб можна було перезапускати)
DELETE FROM workout_logs;
DELETE FROM exercises;
DELETE FROM days;
DELETE FROM weeks;
DELETE FROM user_programs;
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
INSERT INTO programs (id, category_id, slug, title_ua, title_en, description_ua, description_en, level, is_free, "order") VALUES
  (
    '00000000-0000-0000-0001-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'handstand-beginners',
    'Стійка для початківців',
    'Handstand for Beginners',
    'Перша програма: зміцнення зап''ястків, лінія тіла, kick-up до стіни',
    'First program: wrist strengthening, body line, kick-up to wall',
    'beginner', true, 1
  ),
  (
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'freestanding-handstand',
    'Вільна стійка',
    'Freestanding Handstand',
    'Баланс без стіни: робота з пальцями, плечима, корпусом',
    'Balance without wall: fingers, shoulders, core control',
    'intermediate', false, 2
  ),
  (
    '00000000-0000-0000-0001-000000000003',
    '00000000-0000-0000-0000-000000000002',
    'basic-flexibility',
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
-- WEEK 3 — Баланс і контроль
-- ============================================================

INSERT INTO weeks (id, program_id, title_ua, title_en, "order") VALUES
  ('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0001-000000000001', 'Тиждень 3 — Баланс і контроль', 'Week 3 — Balance & Control', 3),
  ('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0001-000000000001', 'Тиждень 4 — Перший відрив', 'Week 4 — First Freestand', 4);

INSERT INTO days (id, week_id, title_ua, title_en, "order") VALUES
  ('00000000-0000-0000-0003-000000000006', '00000000-0000-0000-0002-000000000003', 'День 1 — Пальці і зсув ваги', 'Day 1 — Fingers & Weight Shifts', 1),
  ('00000000-0000-0000-0003-000000000007', '00000000-0000-0000-0002-000000000003', 'День 2 — Сила плечей', 'Day 2 — Shoulder Strength', 2),
  ('00000000-0000-0000-0003-000000000008', '00000000-0000-0000-0002-000000000003', 'День 3 — Рівновага', 'Day 3 — Balance Drills', 3),
  ('00000000-0000-0000-0003-000000000009', '00000000-0000-0000-0002-000000000003', 'День 4 — Одноручна підготовка', 'Day 4 — One-Arm Prep', 4),
  ('00000000-0000-0000-0003-000000000010', '00000000-0000-0000-0002-000000000003', 'День 5 — Інтеграція', 'Day 5 — Integration', 5),
  ('00000000-0000-0000-0003-000000000011', '00000000-0000-0000-0002-000000000004', 'День 1 — Перший відрив від стіни', 'Day 1 — First Step Away', 1),
  ('00000000-0000-0000-0003-000000000012', '00000000-0000-0000-0002-000000000004', 'День 2 — Мікробаланс', 'Day 2 — Micro Balance', 2),
  ('00000000-0000-0000-0003-000000000013', '00000000-0000-0000-0002-000000000004', 'День 3 — Серії без стіни', 'Day 3 — Freestand Sets', 3),
  ('00000000-0000-0000-0003-000000000014', '00000000-0000-0000-0002-000000000004', 'День 4 — Контроль падіння', 'Day 4 — Fall Control', 4),
  ('00000000-0000-0000-0003-000000000015', '00000000-0000-0000-0002-000000000004', 'День 5 — Фінальний тест', 'Day 5 — Final Test', 5);

-- EXERCISES Week 3, Day 1 — Пальці і зсув ваги
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000015', '00000000-0000-0000-0003-000000000006',
    'Натискання пальцями', 'Finger Press',
    'У стійці біля стіни — свідомо перекладати вагу на подушечки пальців і назад на долоні',
    'In wall handstand — consciously shift weight to fingertips and back to palm',
    null, 10, 3, 'https://www.youtube.com/watch?v=BGt0DxbFGbA', true, 1),
  ('00000000-0000-0000-0004-000000000016', '00000000-0000-0000-0003-000000000006',
    'Зсув ваги вбік', 'Lateral Weight Shifts',
    'У стійці біля стіни — повільно переносити вагу з однієї руки на іншу',
    'In wall handstand — slowly shift weight from one hand to the other',
    null, 8, 3, 'https://www.youtube.com/watch?v=BGt0DxbFGbA', true, 2),
  ('00000000-0000-0000-0004-000000000017', '00000000-0000-0000-0003-000000000006',
    'Тривале утримання з диханням', 'Long Hold with Breathing',
    'Стійка біля стіни — контролювати дихання, не затримувати',
    'Wall handstand — control breathing, do not hold breath',
    45, null, 3, 'https://www.youtube.com/watch?v=BGt0DxbFGbA', true, 3);

-- EXERCISES Week 3, Day 2 — Сила плечей
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000018', '00000000-0000-0000-0003-000000000007',
    'Протракція лопаток', 'Scapular Protraction',
    'В упорі лежачи — виштовхувати лопатки вгору, утримувати 2 сек',
    'In push-up position — push shoulder blades up, hold 2 sec',
    null, 10, 3, 'https://www.youtube.com/watch?v=_l3ySVKYVJ8', false, 1),
  ('00000000-0000-0000-0004-000000000019', '00000000-0000-0000-0003-000000000007',
    'Pike push-up', 'Pike Push-up',
    'В позиції перевернутої V — відтискання з акцентом на плечі',
    'In inverted V position — push-ups targeting shoulders',
    null, 8, 3, 'https://www.youtube.com/watch?v=sposDXWEB0A', false, 2),
  ('00000000-0000-0000-0004-000000000020', '00000000-0000-0000-0003-000000000007',
    'Стійка з підвищення', 'Elevated Pike Hold',
    'Ноги на лаві, руки на підлозі — поступово збільшувати час',
    'Feet on bench, hands on floor — gradually increase time',
    30, null, 3, 'https://www.youtube.com/watch?v=5fmOH2a57hI', true, 3);

-- EXERCISES Week 3, Day 3 — Рівновага
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000021', '00000000-0000-0000-0003-000000000008',
    'Стійка жаби (тривала)', 'Frog Stand (Extended)',
    'Коліна на ліктях — утримувати рівновагу якомога довше',
    'Knees on elbows — hold balance as long as possible',
    20, null, 3, 'https://www.youtube.com/watch?v=tVPVl_VIXFE', false, 1),
  ('00000000-0000-0000-0004-000000000022', '00000000-0000-0000-0003-000000000008',
    'Kick-up з контрольованим поверненням', 'Kick-up with Controlled Descent',
    'Підйом у стійку до стіни і повільне повернення — не падати, а опускатися',
    'Kick up to wall and slowly lower down — controlled descent, not fall',
    null, 6, 3, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 2),
  ('00000000-0000-0000-0004-000000000023', '00000000-0000-0000-0003-000000000008',
    'Стійка обличчям до стіни (тривала)', 'Chest-to-Wall (Extended)',
    'Руки впритул до стіни — максимальний час утримання',
    'Hands close to wall — maximum hold time',
    40, null, 3, 'https://www.youtube.com/watch?v=BGt0DxbFGbA', true, 3);

-- EXERCISES Week 3, Day 4 — Одноручна підготовка
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000024', '00000000-0000-0000-0003-000000000009',
    'Поза жаби на одній руці', 'One-Arm Frog Stand',
    'Спроба підняти одну руку в позі жаби — хоча б на 1 секунду',
    'Attempt to lift one hand in frog stand — even for 1 second',
    3, null, 3, 'https://www.youtube.com/watch?v=tVPVl_VIXFE', false, 1),
  ('00000000-0000-0000-0004-000000000025', '00000000-0000-0000-0003-000000000009',
    'Боковий зсув у стійці', 'Side Lean in Handstand',
    'У стійці біля стіни — нахилятися вбік, переносячи вагу на одну руку',
    'In wall handstand — lean sideways, loading one arm at a time',
    null, 8, 3, 'https://www.youtube.com/watch?v=BGt0DxbFGbA', true, 2),
  ('00000000-0000-0000-0004-000000000026', '00000000-0000-0000-0003-000000000009',
    'Hollow body на одній нозі', 'Single-Leg Hollow Body',
    'Hollow body з однією ногою піднятою вище — активує ассиметричний контроль корпусу',
    'Hollow body with one leg raised higher — trains asymmetric core control',
    15, null, 3, 'https://www.youtube.com/watch?v=LlDNef_Ztsc', false, 3);

-- EXERCISES Week 3, Day 5 — Інтеграція
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000027', '00000000-0000-0000-0003-000000000010',
    'Розминка зап''ястків і плечей', 'Wrist & Shoulder Warm-up',
    'Повна розминка: кола зап''ястками, протракція, обертання плечей',
    'Full warm-up: wrist circles, protraction, shoulder rotations',
    null, 10, 2, 'https://www.youtube.com/watch?v=mSZWSQSSEjE', false, 1),
  ('00000000-0000-0000-0004-000000000028', '00000000-0000-0000-0003-000000000010',
    'Серія kick-up до стіни', 'Kick-up Series',
    '5 підходів по 5 kick-up до стіни з утриманням кожного',
    '5 sets of 5 kick-ups to wall, holding each rep',
    null, 5, 5, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 2),
  ('00000000-0000-0000-0004-000000000029', '00000000-0000-0000-0003-000000000010',
    'Максимальне утримання', 'Max Hold',
    'Один підхід — максимально довге утримання стійки біля стіни',
    'One set — maximum handstand hold at wall',
    60, null, 1, 'https://www.youtube.com/watch?v=BGt0DxbFGbA', true, 3);

-- ============================================================
-- WEEK 4 — Перший відрив
-- ============================================================

-- EXERCISES Week 4, Day 1 — Перший відрив від стіни
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000030', '00000000-0000-0000-0003-000000000011',
    'Стійка з одною п''ятою від стіни', 'One Heel Off Wall',
    'У стійці спиною до стіни — відірвати одну п''яту і тримати рівновагу',
    'In back-to-wall handstand — lift one heel off wall and balance',
    5, null, 5, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 1),
  ('00000000-0000-0000-0004-000000000031', '00000000-0000-0000-0003-000000000011',
    'Стійка з двома п''ятами від стіни', 'Both Heels Off Wall',
    'Обидві п''яти від стіни — утримувати рівновагу пальцями',
    'Both heels off wall — balance using finger pressure',
    3, null, 5, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 2),
  ('00000000-0000-0000-0004-000000000032', '00000000-0000-0000-0003-000000000011',
    'Kick-up від стіни', 'Kick Away from Wall',
    'Підйом у стійку і спроба відійти від стіни хоча б на 2 секунди',
    'Kick up and attempt to step away from wall for at least 2 seconds',
    2, null, 5, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 3);

-- EXERCISES Week 4, Day 2 — Мікробаланс
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000033', '00000000-0000-0000-0003-000000000012',
    'Балансування на паралельних брусках', 'Balance on Parallettes',
    'Стійка на паралельних брусках або книгах — більша стабільність для практики',
    'Handstand on parallettes or books — more stability for balance practice',
    5, null, 5, 'https://www.youtube.com/watch?v=B6JVHmZWjIY', true, 1),
  ('00000000-0000-0000-0004-000000000034', '00000000-0000-0000-0003-000000000012',
    'Пошук балансової точки', 'Finding the Balance Point',
    'Без стіни — повільні kick-up і пошук точки рівноваги без утримання',
    'Without wall — slow kick-ups finding the balance point without holding',
    null, 8, 4, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 2),
  ('00000000-0000-0000-0004-000000000035', '00000000-0000-0000-0003-000000000012',
    'Стійка жаби до стійки на руках', 'Frog to Handstand',
    'З пози жаби — спроба випрямитися у стійку на руках',
    'From frog stand — attempt to press into handstand',
    null, 5, 3, 'https://www.youtube.com/watch?v=tVPVl_VIXFE', true, 3);

-- EXERCISES Week 4, Day 3 — Серії без стіни
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000036', '00000000-0000-0000-0003-000000000013',
    'Серії вільної стійки', 'Freestand Sets',
    '10 спроб вільної стійки поспіль — фокус на якість входу, не тривалість',
    '10 freestand attempts in a row — focus on entry quality, not duration',
    null, 10, 3, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 1),
  ('00000000-0000-0000-0004-000000000037', '00000000-0000-0000-0003-000000000013',
    'Утримання 3–5 секунд', '3–5 Second Holds',
    'Ціль — хоча б 3 секунди вільної стійки без доторкання до стіни',
    'Goal — at least 3 seconds of freestanding handstand without touching wall',
    5, null, 5, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 2),
  ('00000000-0000-0000-0004-000000000038', '00000000-0000-0000-0003-000000000013',
    'Відновлення після падіння', 'Recovery after Fall',
    'Практика повернення в стійку після відхилення — відновлення балансу',
    'Practice returning to balance after overbalancing — balance recovery',
    null, 8, 3, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 3);

-- EXERCISES Week 4, Day 4 — Контроль падіння
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000039', '00000000-0000-0000-0003-000000000014',
    'Вихід через перекид', 'Forward Roll Out',
    'Навмисне падіння вперед через перекид — безпечний вихід з вільної стійки',
    'Intentional forward fall into a forward roll — safe exit from freestanding handstand',
    null, 8, 3, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', false, 1),
  ('00000000-0000-0000-0004-000000000040', '00000000-0000-0000-0003-000000000014',
    'Пірует-вихід', 'Pirouette Out',
    'Поворот на 90° з виходом — просунутіший безпечний вихід',
    '90° turn out of handstand — more advanced safe exit',
    null, 6, 3, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 2),
  ('00000000-0000-0000-0004-000000000041', '00000000-0000-0000-0003-000000000014',
    'Практика вільної стійки з безпечним падінням', 'Freestand with Safe Fall',
    'Вільна стійка з заздалегідь запланованим виходом — перекид або пірует',
    'Freestanding handstand with pre-planned exit — roll or pirouette',
    null, 8, 4, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 3);

-- EXERCISES Week 4, Day 5 — Фінальний тест
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000042', '00000000-0000-0000-0003-000000000015',
    'Розминка 5 хвилин', '5-Minute Warm-up',
    'Зап''ястки, плечі, hollow body — стандартна розминка перед стійкою',
    'Wrists, shoulders, hollow body — standard handstand warm-up',
    null, 10, 2, 'https://www.youtube.com/watch?v=mSZWSQSSEjE', false, 1),
  ('00000000-0000-0000-0004-000000000043', '00000000-0000-0000-0003-000000000015',
    'Максимальна вільна стійка', 'Max Freestand',
    'Три спроби максимального утримання вільної стійки — записати кращий результат',
    'Three attempts at maximum freestanding hold — record your best time',
    10, null, 3, 'https://www.youtube.com/watch?v=d9s6h7rMhZU', true, 2),
  ('00000000-0000-0000-0004-000000000044', '00000000-0000-0000-0003-000000000015',
    'Заминка і розтяжка плечей', 'Cool Down & Shoulder Stretch',
    'Розтяжка грудних, плечей і зап''ястків після тренування',
    'Stretch chest, shoulders and wrists after training',
    30, null, 2, 'https://www.youtube.com/watch?v=mSZWSQSSEjE', false, 3);

