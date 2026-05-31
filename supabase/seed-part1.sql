-- ============================================================
-- Seed Part 1 — Реабілітація спини + Офіс і постава
-- Запускати ПІСЛЯ seed.sql (не скидає існуючі дані)
-- ============================================================

-- НОВІ КАТЕГОРІЇ
INSERT INTO categories (id, slug, title_ua, title_en, description_ua, description_en, "order") VALUES
  (
    '00000000-0000-0000-0000-000000000004',
    'rehabilitation',
    'Реабілітація',
    'Rehabilitation',
    'Відновлення після травм і зміцнення слабких зон',
    'Recovery from injuries and strengthening weak areas',
    4
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    'office',
    'Офісний синдром',
    'Office Syndrome',
    'Програми для тих хто довго сидить — спина, постава, шия',
    'Programs for desk workers — back, posture, neck',
    5
  );

-- ============================================================
-- ПРОГРАМА 4: Реабілітація спини (4 тижні × 3 дні)
-- beginner, free, 30-40 хв/тренування
-- ============================================================
INSERT INTO programs (id, slug, category_id, title_ua, title_en, description_ua, description_en, level, is_free, "order") VALUES
  (
    '00000000-0000-0000-0001-000000000004',
    'back-rehabilitation',
    '00000000-0000-0000-0000-000000000004',
    'Реабілітація спини',
    'Back Rehabilitation',
    'Програма для зміцнення глибоких м''язів спини, усунення болю і відновлення мобільності хребта за 4 тижні',
    '4-week program to strengthen deep back muscles, eliminate pain and restore spinal mobility',
    'beginner', true, 1
  );

-- Тижні
INSERT INTO weeks (id, program_id, title_ua, title_en, "order") VALUES
  ('00000000-0000-0000-0002-000000000011', '00000000-0000-0000-0001-000000000004', 'Тиждень 1 — Мобільність', 'Week 1 — Mobility', 1),
  ('00000000-0000-0000-0002-000000000012', '00000000-0000-0000-0001-000000000004', 'Тиждень 2 — Зміцнення', 'Week 2 — Strengthening', 2),
  ('00000000-0000-0000-0002-000000000013', '00000000-0000-0000-0001-000000000004', 'Тиждень 3 — Інтеграція', 'Week 3 — Integration', 3),
  ('00000000-0000-0000-0002-000000000014', '00000000-0000-0000-0001-000000000004', 'Тиждень 4 — Фінал', 'Week 4 — Final', 4);

-- Дні
INSERT INTO days (id, week_id, title_ua, title_en, "order") VALUES
  -- Тиждень 1
  ('00000000-0000-0000-0003-000000000030', '00000000-0000-0000-0002-000000000011', 'День 1 — Розминка хребта', 'Day 1 — Spine Warm-up', 1),
  ('00000000-0000-0000-0003-000000000031', '00000000-0000-0000-0002-000000000011', 'День 2 — Стабілізація', 'Day 2 — Stabilization', 2),
  ('00000000-0000-0000-0003-000000000032', '00000000-0000-0000-0002-000000000011', 'День 3 — Розтяжка', 'Day 3 — Stretching', 3),
  -- Тиждень 2
  ('00000000-0000-0000-0003-000000000033', '00000000-0000-0000-0002-000000000012', 'День 4 — Розгиначі спини', 'Day 4 — Back Extensors', 1),
  ('00000000-0000-0000-0003-000000000034', '00000000-0000-0000-0002-000000000012', 'День 5 — Глибокий кор', 'Day 5 — Deep Core', 2),
  ('00000000-0000-0000-0003-000000000035', '00000000-0000-0000-0002-000000000012', 'День 6 — Мобільність таза', 'Day 6 — Hip Mobility', 3),
  -- Тиждень 3
  ('00000000-0000-0000-0003-000000000036', '00000000-0000-0000-0002-000000000013', 'День 7 — Повна спина', 'Day 7 — Full Back', 1),
  ('00000000-0000-0000-0003-000000000037', '00000000-0000-0000-0002-000000000013', 'День 8 — Постава і лопатки', 'Day 8 — Posture & Scapula', 2),
  ('00000000-0000-0000-0003-000000000038', '00000000-0000-0000-0002-000000000013', 'День 9 — Відновлення', 'Day 9 — Recovery', 3),
  -- Тиждень 4
  ('00000000-0000-0000-0003-000000000039', '00000000-0000-0000-0002-000000000014', 'День 10 — Сила і стабільність', 'Day 10 — Strength & Stability', 1),
  ('00000000-0000-0000-0003-000000000040', '00000000-0000-0000-0002-000000000014', 'День 11 — Постава і тонус', 'Day 11 — Posture & Tone', 2),
  ('00000000-0000-0000-0003-000000000041', '00000000-0000-0000-0002-000000000014', 'День 12 — Фінальне оцінювання', 'Day 12 — Final Assessment', 3);

-- ВПРАВИ — День 1: Розминка хребта
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000069', '00000000-0000-0000-0003-000000000030',
   'Котик-корівка', 'Cat-Cow',
   'На четвереньках — почергово прогинати і округляти хребет, синхронізувати з диханням',
   'On all fours — alternate arching and rounding the spine, sync with breathing',
   null, 12, 3, 'https://www.youtube.com/watch?v=kqnua4rHVVA', false, 1),
  ('00000000-0000-0000-0004-000000000070', '00000000-0000-0000-0003-000000000030',
   'Дитяча поза', 'Child''s Pose',
   'З колін потягнутись руками вперед, розслабити поперек і плечі',
   'From knees stretch arms forward, relax lower back and shoulders',
   45, null, 3, 'https://www.youtube.com/watch?v=HCLmqfO1Fg8', false, 2),
  ('00000000-0000-0000-0004-000000000071', '00000000-0000-0000-0003-000000000030',
   'Місток лежачи', 'Glute Bridge',
   'Лежачи на спині, підняти таз до прямої лінії стегна-тіло, стиснути сідниці',
   'Lying on back, raise hips to straight line, squeeze glutes',
   null, 15, 3, 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E', false, 3),
  ('00000000-0000-0000-0004-000000000072', '00000000-0000-0000-0003-000000000030',
   'Скручування лежачи', 'Supine Spinal Twist',
   'Лежачи на спині, завести коліно через тіло в протилежну сторону, тримати',
   'Lying on back, bring knee across body to opposite side, hold',
   30, null, 2, 'https://www.youtube.com/watch?v=kqnua4rHVVA', false, 4);

-- ВПРАВИ — День 2: Стабілізація
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000073', '00000000-0000-0000-0003-000000000031',
   'Bird Dog', 'Bird Dog',
   'На четвереньках — одночасно витягнути протилежні руку і ногу, утримувати рівновагу 2 сек',
   'On all fours — simultaneously extend opposite arm and leg, hold balance for 2s',
   null, 8, 3, 'https://www.youtube.com/watch?v=wiFNA3sqjCA', false, 1),
  ('00000000-0000-0000-0004-000000000074', '00000000-0000-0000-0003-000000000031',
   'Dead Bug', 'Dead Bug',
   'Лежачи на спині, руки вгору — почергово опускати протилежні руку і ногу не торкаючись підлоги',
   'Lying on back, arms up — alternately lower opposite arm and leg without touching floor',
   null, 8, 3, 'https://www.youtube.com/watch?v=4XLEnwUr1d8', false, 2),
  ('00000000-0000-0000-0004-000000000075', '00000000-0000-0000-0003-000000000031',
   'Планка на ліктях', 'Forearm Plank',
   'Упор на ліктях і носках, тіло пряме, напружити кор і сідниці, не прогинатись',
   'Forearm support, body straight, engage core and glutes, no sagging',
   20, null, 3, 'https://www.youtube.com/watch?v=pSHjTRCQxIw', false, 3),
  ('00000000-0000-0000-0004-000000000076', '00000000-0000-0000-0003-000000000031',
   'Бічна планка', 'Side Plank',
   'Упор на лікті збоку, стегна підняти — утримувати пряму лінію тіла',
   'Side forearm support, raise hips — maintain straight body line',
   15, null, 2, 'https://www.youtube.com/watch?v=pSHjTRCQxIw', false, 4);

-- ВПРАВИ — День 3: Розтяжка
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000077', '00000000-0000-0000-0003-000000000032',
   'Розтяжка грушоподібного м''яза', 'Piriformis Stretch',
   'Лежачи, закинути щиколотку на протилежне коліно, потягнути до грудей — зняти напругу з сідниці',
   'Lying, place ankle on opposite knee, pull toward chest — release piriformis tension',
   30, null, 3, 'https://www.youtube.com/watch?v=kqnua4rHVVA', false, 1),
  ('00000000-0000-0000-0004-000000000078', '00000000-0000-0000-0003-000000000032',
   'Нахил вперед стоячи', 'Standing Forward Fold',
   'Стоячи, ноги на ширині плечей — повільно опустити тулуб вниз, руки вільно звисають',
   'Standing, feet shoulder-width — slowly lower torso down, arms hang freely',
   45, null, 3, 'https://www.youtube.com/watch?v=HCLmqfO1Fg8', false, 2),
  ('00000000-0000-0000-0004-000000000079', '00000000-0000-0000-0003-000000000032',
   'Поза кобри (низька)', 'Low Cobra',
   'Лежачи на животі, впертись на руки — підняти лише груди, лобок на підлозі',
   'Lying on stomach, press on hands — lift only chest, pubic bone on floor',
   20, null, 3, 'https://www.youtube.com/watch?v=GXbJnZoJZRU', false, 3),
  ('00000000-0000-0000-0004-000000000080', '00000000-0000-0000-0003-000000000032',
   'Перекат колін', 'Knee Rolling',
   'Лежачи на спині, коліна підняті — повільно опускати обидва коліна в бік до підлоги',
   'Lying on back, knees bent — slowly lower both knees to one side toward floor',
   null, 10, 2, 'https://www.youtube.com/watch?v=kqnua4rHVVA', false, 4);

-- ВПРАВИ — День 4: Розгиначі спини
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000081', '00000000-0000-0000-0003-000000000033',
   'Superman утримання', 'Superman Hold',
   'Лежачи на животі — підняти одночасно руки і ноги вгору, утримувати',
   'Lying on stomach — simultaneously raise arms and legs, hold',
   15, null, 3, 'https://www.youtube.com/watch?v=GXbJnZoJZRU', false, 1),
  ('00000000-0000-0000-0004-000000000082', '00000000-0000-0000-0003-000000000033',
   'Розгинання спини', 'Back Extension',
   'Лежачи на животі, руки за головою — підняти тулуб відриваючи груди від підлоги',
   'Lying on stomach, hands behind head — raise torso lifting chest from floor',
   null, 12, 3, 'https://www.youtube.com/watch?v=GXbJnZoJZRU', false, 2),
  ('00000000-0000-0000-0004-000000000083', '00000000-0000-0000-0003-000000000033',
   'Hip Hinge', 'Hip Hinge',
   'Стоячи, руки на стегнах — нахил вперед з прямою спиною, відчути розтяжку задньої поверхні стегон',
   'Standing, hands on hips — hinge forward with straight back, feel hamstring stretch',
   null, 12, 3, 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E', false, 3),
  ('00000000-0000-0000-0004-000000000084', '00000000-0000-0000-0003-000000000033',
   'Котик-корівка з затримкою', 'Cat-Cow with Pause',
   'Котик-корівка але з 5-секундною фіксацією в кожному положенні для глибшого залучення м''язів',
   'Cat-cow but with 5-second pause in each position for deeper muscle engagement',
   5, null, 3, 'https://www.youtube.com/watch?v=kqnua4rHVVA', false, 4);

-- ВПРАВИ — День 5: Глибокий кор
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000085', '00000000-0000-0000-0003-000000000034',
   'Hollow Body Hold', 'Hollow Body Hold',
   'Лежачи, підняти лопатки і ноги — тіло у формі банана, поперек притиснутий до підлоги',
   'Lying, raise shoulder blades and legs — banana shape, lower back pressed to floor',
   20, null, 3, 'https://www.youtube.com/watch?v=LlDNef_Ztsc', false, 1),
  ('00000000-0000-0000-0004-000000000086', '00000000-0000-0000-0003-000000000034',
   'Dead Bug (прогрес)', 'Dead Bug Advanced',
   'Dead Bug зі скошеною ногою — більше навантаження на глибокий кор і поперек',
   'Dead bug with extended leg — more load on deep core and lower back',
   null, 10, 3, 'https://www.youtube.com/watch?v=4XLEnwUr1d8', false, 2),
  ('00000000-0000-0000-0004-000000000087', '00000000-0000-0000-0003-000000000034',
   'Планка (прогрес)', 'Plank Advanced',
   'Планка на ліктях 25 секунд — стежити за диханням, не затримувати',
   'Forearm plank for 25 seconds — maintain breathing, don''t hold breath',
   25, null, 3, 'https://www.youtube.com/watch?v=pSHjTRCQxIw', false, 3),
  ('00000000-0000-0000-0004-000000000088', '00000000-0000-0000-0003-000000000034',
   'McGill Curl-up', 'McGill Curl-up',
   'Лежачи, одна нога зігнута — підняти лише голову і лопатки, поперек не відривати. Протокол Мак-Гілла',
   'Lying, one leg bent — raise only head and shoulder blades, keep lower back down. McGill protocol',
   null, 10, 3, 'https://www.youtube.com/watch?v=4XLEnwUr1d8', false, 4);

-- ВПРАВИ — День 6: Мобільність таза
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000089', '00000000-0000-0000-0003-000000000035',
   'Кола тазом', 'Hip Circles',
   'Стоячи, руки на стегнах — великі кола тазом в обох напрямках для розминки кульшового суглоба',
   'Standing, hands on hips — large hip circles in both directions to warm up hip joint',
   null, 10, 3, 'https://www.youtube.com/watch?v=kqnua4rHVVA', false, 1),
  ('00000000-0000-0000-0004-000000000090', '00000000-0000-0000-0003-000000000035',
   '90/90 Розтяжка стегон', '90/90 Hip Stretch',
   'Сидячи на підлозі, обидва коліна під кутом 90° — нахилитись до переднього коліна, потягнути задній сідниць',
   'Sitting on floor, both knees at 90° — lean toward front knee, stretch rear glute',
   45, null, 2, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 2),
  ('00000000-0000-0000-0004-000000000091', '00000000-0000-0000-0003-000000000035',
   'Поза голуба', 'Pigeon Pose',
   'Одна нога попереду зігнута, інша витягнута назад — нахилитись до переднього стегна',
   'One leg bent in front, other extended back — lean toward front thigh',
   45, null, 2, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 3),
  ('00000000-0000-0000-0004-000000000092', '00000000-0000-0000-0003-000000000035',
   'Ноги вгору по стіні', 'Legs Up Wall',
   'Лежачи близько до стіни — підняти прямі ноги вгору, повністю розслабитись. Знімає навантаження з хребта',
   'Lying close to wall — raise straight legs up, fully relax. Decompresses the spine',
   120, null, 2, 'https://www.youtube.com/watch?v=HCLmqfO1Fg8', false, 4);

-- ВПРАВИ — День 7: Повна спина
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000093', '00000000-0000-0000-0003-000000000036',
   'Good Morning (без ваги)', 'Good Morning Bodyweight',
   'Стоячи, руки за головою — нахил вперед з прямою спиною до паралелі, відчути задню поверхню',
   'Standing, hands behind head — hinge forward with straight back to parallel, feel posterior chain',
   null, 12, 3, 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E', false, 1),
  ('00000000-0000-0000-0004-000000000094', '00000000-0000-0000-0003-000000000036',
   'Wall Angels', 'Wall Angels',
   'Стоячи спиною до стіни — підняти руки вгору як ангел, притискаючи поперек, лопатки і руки до стіни',
   'Standing with back to wall — raise arms up like angel, keeping lower back, scapula and arms on wall',
   null, 10, 3, 'https://www.youtube.com/watch?v=Hg3y7Bq5Fp8', false, 2),
  ('00000000-0000-0000-0004-000000000095', '00000000-0000-0000-0003-000000000036',
   'Superman (довше)', 'Superman Extended',
   'Superman hold але 20 секунд — фокус на утриманні без прогину в шиї',
   'Superman hold but 20 seconds — focus on holding without neck hyperextension',
   20, null, 4, 'https://www.youtube.com/watch?v=GXbJnZoJZRU', false, 3),
  ('00000000-0000-0000-0004-000000000096', '00000000-0000-0000-0003-000000000036',
   'Котик-корівка (потік)', 'Cat-Cow Flow',
   'Плавний безперервний потік котик-корівка, 15 повторень без зупинок — мобілізація всього хребта',
   'Smooth continuous cat-cow flow, 15 reps without stops — full spine mobilization',
   null, 15, 2, 'https://www.youtube.com/watch?v=kqnua4rHVVA', false, 4);

-- ВПРАВИ — День 8: Постава і лопатки
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000097', '00000000-0000-0000-0003-000000000037',
   'Підтягування підборіддя', 'Chin Tucks',
   'Стоячи або сидячи — втягнути підборіддя назад (подвійне підборіддя), утримати 2 сек. Виправляє форвард-хед',
   'Standing or sitting — tuck chin back (double chin), hold 2s. Corrects forward head posture',
   null, 15, 3, 'https://www.youtube.com/watch?v=C1b6s4bWOUM', false, 1),
  ('00000000-0000-0000-0004-000000000098', '00000000-0000-0000-0003-000000000037',
   'Зведення лопаток', 'Shoulder Retraction',
   'Сидячи або стоячи — звести лопатки разом і притиснути вниз, утримати 3 сек. Ключ до правильної постави',
   'Sitting or standing — bring shoulder blades together and press down, hold 3s. Key to correct posture',
   null, 15, 3, 'https://www.youtube.com/watch?v=Hg3y7Bq5Fp8', false, 2),
  ('00000000-0000-0000-0004-000000000099', '00000000-0000-0000-0003-000000000037',
   'Розтяжка грудей у дверях', 'Doorway Chest Stretch',
   'Руки в дверній рамі під кутом 90° — зробити крок вперед, відчути розтяжку грудних м''язів',
   'Arms on door frame at 90° — step forward, feel pectoral stretch',
   30, null, 3, 'https://www.youtube.com/watch?v=UBMk30rjy0o', false, 3),
  ('00000000-0000-0000-0004-000000000100', '00000000-0000-0000-0003-000000000037',
   'Розгинання грудного відділу на стільці', 'Thoracic Extension on Chair',
   'Сидячи, скласти руки за головою — відхилитись назад через спинку стільця, розкрити грудний відділ',
   'Sitting, clasp hands behind head — extend back over chair back, open thoracic spine',
   15, null, 3, 'https://www.youtube.com/watch?v=Hg3y7Bq5Fp8', false, 4);

-- ВПРАВИ — День 9: Відновлення
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000101', '00000000-0000-0000-0003-000000000038',
   'Дитяча поза (розширена)', 'Extended Child''s Pose',
   'Дитяча поза з руками витягнутими вперед — повне розслаблення і декомпресія хребта',
   'Child''s pose with arms extended forward — full relaxation and spinal decompression',
   60, null, 3, 'https://www.youtube.com/watch?v=HCLmqfO1Fg8', false, 1),
  ('00000000-0000-0000-0004-000000000102', '00000000-0000-0000-0003-000000000038',
   'Скручування хребта лежачи', 'Supine Spinal Twist (Long)',
   'Глибше скручування — рука на протилежному плечі, максимальна ротація хребта',
   'Deeper twist — hand on opposite shoulder, maximum spinal rotation',
   30, null, 2, 'https://www.youtube.com/watch?v=kqnua4rHVVA', false, 2),
  ('00000000-0000-0000-0004-000000000103', '00000000-0000-0000-0003-000000000038',
   'Шавасана (відпочинок)', 'Savasana',
   'Повне розслаблення лежачи на спині — сканування тіла з голови до ніг, усвідомлене дихання',
   'Full relaxation lying on back — body scan from head to toes, conscious breathing',
   120, null, 1, 'https://www.youtube.com/watch?v=HCLmqfO1Fg8', false, 3),
  ('00000000-0000-0000-0004-000000000104', '00000000-0000-0000-0003-000000000038',
   'Самомасаж спини (м''яч)', 'Back Self-Massage',
   'Лежачи на тенісному м''ячі або кулаку — перекочуватись по паравертебральних м''язах',
   'Lying on tennis ball or fist — roll along paraspinal muscles',
   60, null, 2, 'https://www.youtube.com/watch?v=kqnua4rHVVA', false, 4);

-- ВПРАВИ — День 10: Сила і стабільність
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000105', '00000000-0000-0000-0003-000000000039',
   'Bird Dog Hold (прогрес)', 'Bird Dog Hold Advanced',
   'Bird Dog з 20-секундним утриманням — тест стабільності хребта',
   'Bird dog with 20-second hold — spinal stability test',
   20, null, 4, 'https://www.youtube.com/watch?v=wiFNA3sqjCA', false, 1),
  ('00000000-0000-0000-0004-000000000106', '00000000-0000-0000-0003-000000000039',
   'Планка 40 сек', 'Plank 40s',
   'Планка на ліктях 40 секунд — фінальна перевірка стабільності кору',
   'Forearm plank 40 seconds — final core stability check',
   40, null, 3, 'https://www.youtube.com/watch?v=pSHjTRCQxIw', false, 2),
  ('00000000-0000-0000-0004-000000000107', '00000000-0000-0000-0003-000000000039',
   'Hip Thrust', 'Hip Thrust',
   'Плечима на лаві, стопи на підлозі — підняти таз до прямої лінії і стиснути сідниці вгорі',
   'Shoulders on bench, feet on floor — raise hips to straight line and squeeze glutes at top',
   null, 15, 3, 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E', false, 3),
  ('00000000-0000-0000-0004-000000000108', '00000000-0000-0000-0003-000000000039',
   'Superman 25 сек', 'Superman 25s',
   'Superman hold максимально довго — фінальний тест розгиначів спини',
   'Superman hold as long as possible — final back extensor test',
   25, null, 3, 'https://www.youtube.com/watch?v=GXbJnZoJZRU', false, 4);

-- ВПРАВИ — День 11: Постава і тонус
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000109', '00000000-0000-0000-0003-000000000040',
   'Romanian Deadlift (без ваги)', 'Romanian Deadlift Bodyweight',
   'Нахил на одній нозі — протилежна нога відходить назад, спина пряма. Баланс і задня поверхня',
   'Single leg hinge — opposite leg goes back, straight back. Balance and posterior chain',
   null, 15, 3, 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E', false, 1),
  ('00000000-0000-0000-0004-000000000110', '00000000-0000-0000-0003-000000000040',
   'Reverse Fly (нахил)', 'Reverse Fly',
   'Стоячи в нахилі, руки вниз — розвести руки в сторони наче крила. Середня частина трапеції',
   'Standing in hinge position, arms down — spread arms like wings. Mid trapezius',
   null, 12, 3, 'https://www.youtube.com/watch?v=Hg3y7Bq5Fp8', false, 2),
  ('00000000-0000-0000-0004-000000000111', '00000000-0000-0000-0003-000000000040',
   'Wall Sit', 'Wall Sit',
   'Спиною до стіни, коліна 90° — утримувати положення, квадрицепси і кор активні',
   'Back to wall, knees 90° — hold position, quads and core active',
   30, null, 3, 'https://www.youtube.com/watch?v=pSHjTRCQxIw', false, 3),
  ('00000000-0000-0000-0004-000000000112', '00000000-0000-0000-0003-000000000040',
   'Face Pull (без гумки)', 'Face Pull Simulation',
   'Руки витягнуті вперед — потягнути до обличчя розводячи лікті в сторони і вгору. Задня частина дельти',
   'Arms extended forward — pull to face spreading elbows out and up. Posterior deltoid',
   null, 15, 3, 'https://www.youtube.com/watch?v=Hg3y7Bq5Fp8', false, 4);

-- ВПРАВИ — День 12: Фінальне оцінювання
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000113', '00000000-0000-0000-0003-000000000041',
   'Оцінка рухливості хребта', 'Spine Mobility Assessment',
   'Послідовність: нахил вперед → назад → в сторони → обертання. Оцінити прогрес за 4 тижні',
   'Sequence: forward bend → backward → side → rotation. Assess progress over 4 weeks',
   null, 8, 2, 'https://www.youtube.com/watch?v=kqnua4rHVVA', false, 1),
  ('00000000-0000-0000-0004-000000000114', '00000000-0000-0000-0003-000000000041',
   'Фінальний тест: Bird Dog', 'Final Test: Bird Dog',
   'Bird dog hold 25 секунд — зафіксувати особистий рекорд стабільності',
   'Bird dog hold 25 seconds — record personal stability record',
   25, null, 3, 'https://www.youtube.com/watch?v=wiFNA3sqjCA', false, 2),
  ('00000000-0000-0000-0004-000000000115', '00000000-0000-0000-0003-000000000041',
   'Фінальний тест: Планка', 'Final Test: Plank',
   'Планка максимально довго — особистий рекорд витривалості кору',
   'Plank as long as possible — personal core endurance record',
   45, null, 2, 'https://www.youtube.com/watch?v=pSHjTRCQxIw', false, 3),
  ('00000000-0000-0000-0004-000000000116', '00000000-0000-0000-0003-000000000041',
   'Заминка і дихання', 'Cool-down & Breathing',
   'Дитяча поза + скручування + шавасана — повне відновлення і усвідомлення прогресу',
   'Child''s pose + twist + savasana — full recovery and progress awareness',
   120, null, 2, 'https://www.youtube.com/watch?v=HCLmqfO1Fg8', false, 4);


-- ============================================================
-- ПРОГРАМА 5: Офіс і постава (4 тижні × 3 дні)
-- beginner, free, 30-45 хв/тренування
-- ============================================================
INSERT INTO programs (id, slug, category_id, title_ua, title_en, description_ua, description_en, level, is_free, "order") VALUES
  (
    '00000000-0000-0000-0001-000000000005',
    'office-posture',
    '00000000-0000-0000-0000-000000000005',
    'Офіс і постава',
    'Office & Posture',
    'Програма для офісних працівників: усунення болю в шиї, спині, ногах і відновлення правильної постави за 4 тижні',
    '4-week program for desk workers: eliminate neck, back, leg pain and restore correct posture',
    'beginner', true, 1
  );

-- Тижні
INSERT INTO weeks (id, program_id, title_ua, title_en, "order") VALUES
  ('00000000-0000-0000-0002-000000000015', '00000000-0000-0000-0001-000000000005', 'Тиждень 1 — Пробудження тіла', 'Week 1 — Body Awakening', 1),
  ('00000000-0000-0000-0002-000000000016', '00000000-0000-0000-0001-000000000005', 'Тиждень 2 — Постава', 'Week 2 — Posture', 2),
  ('00000000-0000-0000-0002-000000000017', '00000000-0000-0000-0001-000000000005', 'Тиждень 3 — Зміцнення', 'Week 3 — Strengthening', 3),
  ('00000000-0000-0000-0002-000000000018', '00000000-0000-0000-0001-000000000005', 'Тиждень 4 — Інтеграція', 'Week 4 — Integration', 4);

-- Дні
INSERT INTO days (id, week_id, title_ua, title_en, "order") VALUES
  -- Тиждень 1
  ('00000000-0000-0000-0003-000000000042', '00000000-0000-0000-0002-000000000015', 'День 1 — Шия і плечі', 'Day 1 — Neck & Shoulders', 1),
  ('00000000-0000-0000-0003-000000000043', '00000000-0000-0000-0002-000000000015', 'День 2 — Нижня спина і стегна', 'Day 2 — Lower Back & Hips', 2),
  ('00000000-0000-0000-0003-000000000044', '00000000-0000-0000-0002-000000000015', 'День 3 — Ноги і стопи', 'Day 3 — Legs & Feet', 3),
  -- Тиждень 2
  ('00000000-0000-0000-0003-000000000045', '00000000-0000-0000-0002-000000000016', 'День 4 — Верхня частина тіла', 'Day 4 — Upper Body', 1),
  ('00000000-0000-0000-0003-000000000046', '00000000-0000-0000-0002-000000000016', 'День 5 — Кор і живіт', 'Day 5 — Core & Abs', 2),
  ('00000000-0000-0000-0003-000000000047', '00000000-0000-0000-0002-000000000016', 'День 6 — Активне відновлення', 'Day 6 — Active Recovery', 3),
  -- Тиждень 3
  ('00000000-0000-0000-0003-000000000048', '00000000-0000-0000-0002-000000000017', 'День 7 — Спина і лопатки', 'Day 7 — Back & Scapula', 1),
  ('00000000-0000-0000-0003-000000000049', '00000000-0000-0000-0002-000000000017', 'День 8 — Ноги і стабільність', 'Day 8 — Legs & Stability', 2),
  ('00000000-0000-0000-0003-000000000050', '00000000-0000-0000-0002-000000000017', 'День 9 — Шия і голова', 'Day 9 — Neck & Head', 3),
  -- Тиждень 4
  ('00000000-0000-0000-0003-000000000051', '00000000-0000-0000-0002-000000000018', 'День 10 — Повна постава', 'Day 10 — Full Posture', 1),
  ('00000000-0000-0000-0003-000000000052', '00000000-0000-0000-0002-000000000018', 'День 11 — Сила і витривалість', 'Day 11 — Strength & Endurance', 2),
  ('00000000-0000-0000-0003-000000000053', '00000000-0000-0000-0002-000000000018', 'День 12 — Офісна рутина', 'Day 12 — Office Routine', 3);

-- ВПРАВИ — День 1: Шия і плечі
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000117', '00000000-0000-0000-0003-000000000042',
   'Підтягування підборіддя', 'Chin Tucks',
   'Сидячи — втягнути підборіддя назад і вгору без нахилу голови. Виправляє "голову черепахи" від сидіння',
   'Sitting — tuck chin back and up without tilting head. Fixes "turtle head" from desk work',
   null, 15, 3, 'https://www.youtube.com/watch?v=C1b6s4bWOUM', false, 1),
  ('00000000-0000-0000-0004-000000000118', '00000000-0000-0000-0003-000000000042',
   'Бічна розтяжка шиї', 'Neck Side Stretch',
   'Нахилити голову до плеча і злегка потягнути рукою — розтяжка м''язів шиї, зняти напругу від сидіння',
   'Tilt head to shoulder and gently pull with hand — neck stretch, relieve desk tension',
   30, null, 3, 'https://www.youtube.com/watch?v=C1b6s4bWOUM', false, 2),
  ('00000000-0000-0000-0004-000000000119', '00000000-0000-0000-0003-000000000042',
   'Обертання плечей', 'Shoulder Rolls',
   'Великі кола плечима вперед і назад — розігрів трапеції і шиї, може робити прямо за столом',
   'Large shoulder circles forward and back — warm up trapezius and neck, can do at desk',
   null, 10, 3, 'https://www.youtube.com/watch?v=Hg3y7Bq5Fp8', false, 3),
  ('00000000-0000-0000-0004-000000000120', '00000000-0000-0000-0003-000000000042',
   'Розтяжка грудей у дверях', 'Doorway Chest Stretch',
   'Руки в дверній рамі — крок вперед, розкрити грудну клітину. Протидіє сутулості від комп''ютера',
   'Arms on door frame — step forward, open chest. Counteracts computer hunch',
   30, null, 3, 'https://www.youtube.com/watch?v=UBMk30rjy0o', false, 4);

-- ВПРАВИ — День 2: Нижня спина і стегна
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000121', '00000000-0000-0000-0003-000000000043',
   'Розтяжка згинача стегна', 'Hip Flexor Stretch',
   'Коліно на підлозі, друга нога вперед — зсунутись вперед тазом. Згиначі скорочуються від тривалого сидіння',
   'Knee on floor, other leg forward — push hips forward. Hip flexors shorten from prolonged sitting',
   45, null, 3, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 1),
  ('00000000-0000-0000-0004-000000000122', '00000000-0000-0000-0003-000000000043',
   'Котик-корівка', 'Cat-Cow',
   'Базовий котик-корівка — ранкова мобілізація хребта після ночі або сидіння',
   'Basic cat-cow — morning spine mobilization after sleep or sitting',
   null, 12, 3, 'https://www.youtube.com/watch?v=kqnua4rHVVA', false, 2),
  ('00000000-0000-0000-0004-000000000123', '00000000-0000-0000-0003-000000000043',
   'Розтяжка грушоподібного', 'Piriformis Stretch',
   'Лежачи — закинути ногу на коліно, потягнути обидві ноги до грудей. Частий біль у сідниці від сидіння',
   'Lying — cross leg over knee, pull both legs to chest. Common glute pain from sitting',
   45, null, 2, 'https://www.youtube.com/watch?v=kqnua4rHVVA', false, 3),
  ('00000000-0000-0000-0004-000000000124', '00000000-0000-0000-0003-000000000043',
   'Місток', 'Glute Bridge',
   'Активація сідниць, що "вимикаються" від тривалого сидіння — підняти таз і утримати 2 сек вгорі',
   'Activate glutes that "turn off" from prolonged sitting — raise hips and hold 2s at top',
   null, 15, 3, 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E', false, 4);

-- ВПРАВИ — День 3: Ноги і стопи
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000125', '00000000-0000-0000-0003-000000000044',
   'Підйоми на носки', 'Calf Raises',
   'Стоячи на носках — підняти і опустити. Покращує кровообіг у ногах після тривалого сидіння',
   'Standing on toes — raise and lower. Improves blood circulation in legs after prolonged sitting',
   null, 20, 3, 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E', false, 1),
  ('00000000-0000-0000-0004-000000000126', '00000000-0000-0000-0003-000000000044',
   'Кола гомілкою', 'Ankle Circles',
   'Сидячи або стоячи — великі кола гомілкою в обох напрямках. Профілактика набряку і варикозу',
   'Sitting or standing — large ankle circles in both directions. Prevents swelling and varicose veins',
   null, 10, 2, 'https://www.youtube.com/watch?v=kqnua4rHVVA', false, 2),
  ('00000000-0000-0000-0004-000000000127', '00000000-0000-0000-0003-000000000044',
   'Розтяжка задньої поверхні стегна', 'Hamstring Stretch Standing',
   'Нога на підвищенні або вперед — нахилитись до прямої ноги. Задня поверхня скорочується від сидіння',
   'Leg elevated or forward — lean toward straight leg. Hamstrings shorten from sitting',
   45, null, 3, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 3),
  ('00000000-0000-0000-0004-000000000128', '00000000-0000-0000-0003-000000000044',
   'Розтяжка квадрицепса', 'Quad Stretch',
   'Стоячи — зігнути ногу назад, тримати за щиколотку. Баланс і розтяжка передньої поверхні стегна',
   'Standing — bend leg backward, hold ankle. Balance and front thigh stretch',
   30, null, 3, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 4);

-- ВПРАВИ — День 4: Верхня частина тіла
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000129', '00000000-0000-0000-0003-000000000045',
   'Wall Angels', 'Wall Angels',
   'Стоячи біля стіни — підняти руки від стегон до голови притискаючи кожну частину до стіни. Антидот сутулості',
   'At wall — raise arms from hips to overhead keeping everything touching wall. Antidote to hunching',
   null, 12, 3, 'https://www.youtube.com/watch?v=Hg3y7Bq5Fp8', false, 1),
  ('00000000-0000-0000-0004-000000000130', '00000000-0000-0000-0003-000000000045',
   'Розтяжка рук за спиною', 'Band Pull-Apart Simulation',
   'Руки витягнуті вперед — розвести в сторони тримаючи напругу. Середня трапеція і задня дельта',
   'Arms extended forward — spread to sides while maintaining tension. Mid trapezius and rear delt',
   null, 15, 3, 'https://www.youtube.com/watch?v=Hg3y7Bq5Fp8', false, 2),
  ('00000000-0000-0000-0004-000000000131', '00000000-0000-0000-0003-000000000045',
   'Y-T-W (плечі)', 'Y-T-W Shoulders',
   'Лежачи на животі — по черзі підняти руки в позиції Y (над головою), T (в сторони), W (лікті 90°)',
   'Lying on stomach — alternately raise arms in Y (overhead), T (sides), W (elbows 90°)',
   null, 8, 3, 'https://www.youtube.com/watch?v=GXbJnZoJZRU', false, 3),
  ('00000000-0000-0000-0004-000000000132', '00000000-0000-0000-0003-000000000045',
   'Розтяжка грудей (прогрес)', 'Chest Opener Advanced',
   'Руки зчеплені за спиною — підняти вгору і відкрити груди. Максимальний розтяг після дня за комп''ютером',
   'Hands clasped behind back — lift up and open chest. Maximum stretch after day at computer',
   30, null, 3, 'https://www.youtube.com/watch?v=UBMk30rjy0o', false, 4);

-- ВПРАВИ — День 5: Кор і живіт
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000133', '00000000-0000-0000-0003-000000000046',
   'Планка', 'Plank',
   'Базова планка — активація кору як єдиної системи підтримки хребта',
   'Basic plank — activating core as unified spinal support system',
   25, null, 3, 'https://www.youtube.com/watch?v=pSHjTRCQxIw', false, 1),
  ('00000000-0000-0000-0004-000000000134', '00000000-0000-0000-0003-000000000046',
   'Dead Bug', 'Dead Bug',
   'Координація протилежних кінцівок з поперек притиснутим до підлоги — глибокий кор',
   'Opposite limb coordination with lower back pressed to floor — deep core',
   null, 10, 3, 'https://www.youtube.com/watch?v=4XLEnwUr1d8', false, 2),
  ('00000000-0000-0000-0004-000000000135', '00000000-0000-0000-0003-000000000046',
   'Зворотні скручування', 'Reverse Crunch',
   'Лежачи на спині — підтягнути коліна до грудей піднімаючи таз. Нижня частина преса',
   'Lying on back — pull knees to chest raising hips. Lower abdominals',
   null, 15, 3, 'https://www.youtube.com/watch?v=4XLEnwUr1d8', false, 3),
  ('00000000-0000-0000-0004-000000000136', '00000000-0000-0000-0003-000000000046',
   'Бічна планка', 'Side Plank',
   'Упор збоку — стабілізація боків хребта (квадратний м''яз попереку)',
   'Side support — stabilize sides of spine (quadratus lumborum)',
   20, null, 2, 'https://www.youtube.com/watch?v=pSHjTRCQxIw', false, 4);

-- ВПРАВИ — День 6: Активне відновлення
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000137', '00000000-0000-0000-0003-000000000047',
   'Ноги вгору по стіні', 'Legs Up Wall',
   'Таз близько до стіни, ноги вгору — повністю розслабитись. Знімає набряк з ніг і розвантажує хребет',
   'Hips close to wall, legs up — fully relax. Drains swelling from legs and decompresses spine',
   180, null, 2, 'https://www.youtube.com/watch?v=HCLmqfO1Fg8', false, 1),
  ('00000000-0000-0000-0004-000000000138', '00000000-0000-0000-0003-000000000047',
   'Скручування хребта лежачи', 'Supine Twist',
   'М''яке скручування — на відміну від силових вправ, це відновлення і зняття напруги',
   'Gentle twist — unlike strength exercises, this is recovery and tension release',
   30, null, 2, 'https://www.youtube.com/watch?v=kqnua4rHVVA', false, 2),
  ('00000000-0000-0000-0004-000000000139', '00000000-0000-0000-0003-000000000047',
   'Дитяча поза', 'Child''s Pose',
   'Повне розслаблення — контрпоза до сидіння, декомпресія поперекового відділу',
   'Full relaxation — counter-pose to sitting, lumbar decompression',
   60, null, 3, 'https://www.youtube.com/watch?v=HCLmqfO1Fg8', false, 3),
  ('00000000-0000-0000-0004-000000000140', '00000000-0000-0000-0003-000000000047',
   'Самомасаж шиї', 'Neck Self-Massage',
   'Пальцями масажувати основу черепа і трапецію — зняти накопичену напругу від роботи',
   'Use fingers to massage base of skull and trapezius — release accumulated work tension',
   60, null, 2, 'https://www.youtube.com/watch?v=C1b6s4bWOUM', false, 4);

-- ВПРАВИ — День 7: Спина і лопатки
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000141', '00000000-0000-0000-0003-000000000048',
   'Тяга гумки до пояса', 'Resistance Band Row',
   'Гумка закріплена перед — тягнути ліктями назад і вниз, стискаючи лопатки. Антидот від сутулості',
   'Band anchored in front — pull elbows back and down, squeezing shoulder blades. Antidote to hunching',
   null, 15, 3, 'https://www.youtube.com/watch?v=Hg3y7Bq5Fp8', false, 1),
  ('00000000-0000-0000-0004-000000000142', '00000000-0000-0000-0003-000000000048',
   'Reverse Fly (лежачи)', 'Reverse Fly Prone',
   'Лежачи на животі — підняти руки в сторони. Акцент на ромбоїдах і трапеції',
   'Lying on stomach — raise arms to sides. Focus on rhomboids and trapezius',
   null, 12, 3, 'https://www.youtube.com/watch?v=GXbJnZoJZRU', false, 2),
  ('00000000-0000-0000-0004-000000000143', '00000000-0000-0000-0003-000000000048',
   'Superman', 'Superman',
   'Класичний superman — зміцнення м''язів-розгиначів спини',
   'Classic superman — strengthening spinal extensor muscles',
   15, null, 4, 'https://www.youtube.com/watch?v=GXbJnZoJZRU', false, 3),
  ('00000000-0000-0000-0004-000000000144', '00000000-0000-0000-0003-000000000048',
   'Розтяжка грудей (прогрес)', 'Chest Stretch Advanced',
   'Руки широко в сторони, обертання тулуба — повний розтяг грудних м''язів',
   'Arms wide to sides, torso rotation — full pectoral stretch',
   30, null, 3, 'https://www.youtube.com/watch?v=UBMk30rjy0o', false, 4);

-- ВПРАВИ — День 8: Ноги і стабільність
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000145', '00000000-0000-0000-0003-000000000049',
   'Присідання', 'Bodyweight Squat',
   'Класичне присідання — активація всієї нижньої частини тіла, протидія атрофії від сидіння',
   'Classic squat — activating entire lower body, countering atrophy from sitting',
   null, 15, 3, 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E', false, 1),
  ('00000000-0000-0000-0004-000000000146', '00000000-0000-0000-0003-000000000049',
   'Підйоми на стілець', 'Step-ups',
   'Поставити ногу на стілець і піднятись — унілатеральний рух для балансу і сили ніг',
   'Place foot on chair and step up — unilateral movement for leg balance and strength',
   null, 12, 3, 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E', false, 2),
  ('00000000-0000-0000-0004-000000000147', '00000000-0000-0000-0003-000000000049',
   'Відведення стегна лежачи', 'Hip Abduction Lying',
   'Лежачи на боці — підняти пряму ногу вгору. Зовнішні ротатори стегна і сідниці',
   'Lying on side — raise straight leg up. Hip external rotators and glutes',
   null, 15, 3, 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E', false, 3),
  ('00000000-0000-0000-0004-000000000148', '00000000-0000-0000-0003-000000000049',
   'Підйоми на носки (одна нога)', 'Single Leg Calf Raise',
   'На одній нозі — підніматись на носок повільно. Баланс, сила литок і профілактика варикозу',
   'On one leg — rise to toes slowly. Balance, calf strength and varicose prevention',
   null, 15, 3, 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E', false, 4);

-- ВПРАВИ — День 9: Шия і голова
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000149', '00000000-0000-0000-0003-000000000050',
   'Обертання шиї', 'Neck Rotation',
   'Повільно обертати голову з боку в бік — мобілізація шийного відділу',
   'Slowly rotate head side to side — cervical spine mobilization',
   null, 10, 2, 'https://www.youtube.com/watch?v=C1b6s4bWOUM', false, 1),
  ('00000000-0000-0000-0004-000000000150', '00000000-0000-0000-0003-000000000050',
   'Розтяжка м''яза-підіймача лопатки', 'Levator Scapulae Stretch',
   'Повернути голову на 45° і нахилити вниз — тягне м''яз від шиї до лопатки, часто болить у офісників',
   'Rotate head 45° and tilt down — stretches muscle from neck to scapula, often sore in office workers',
   30, null, 3, 'https://www.youtube.com/watch?v=C1b6s4bWOUM', false, 2),
  ('00000000-0000-0000-0004-000000000151', '00000000-0000-0000-0003-000000000050',
   'Субокципітальний реліз', 'Suboccipital Release',
   'Пальці на основі черепа — легкий тиск і розслаблення. Знімає головний біль від напруги',
   'Fingers at base of skull — gentle pressure and release. Relieves tension headaches',
   60, null, 2, 'https://www.youtube.com/watch?v=C1b6s4bWOUM', false, 3),
  ('00000000-0000-0000-0004-000000000152', '00000000-0000-0000-0003-000000000050',
   'Вправи для очей', 'Eye Exercises',
   'Дивитись вдаль 20 сек, потім фокус на пальці — профілактика втоми очей від монітора (правило 20-20-20)',
   'Look into distance 20s, then focus on finger — prevents eye fatigue from monitor (20-20-20 rule)',
   120, null, 1, 'https://www.youtube.com/watch?v=C1b6s4bWOUM', false, 4);

-- ВПРАВИ — День 10: Повна постава
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000153', '00000000-0000-0000-0003-000000000051',
   'Розгинання грудного відділу на стільці', 'Thoracic Extension on Chair',
   'Спиною на спинку стільця — розгинання грудного відділу. Щоденна профілактика кіфозу',
   'Back on chair back — thoracic extension. Daily kyphosis prevention',
   15, null, 3, 'https://www.youtube.com/watch?v=Hg3y7Bq5Fp8', false, 1),
  ('00000000-0000-0000-0004-000000000154', '00000000-0000-0000-0003-000000000051',
   'Перевірка постави біля стіни', 'Wall Posture Check',
   'Стати спиною до стіни — п''ятки, литки, сідниці, лопатки, голова торкаються стіни. Запам''ятати відчуття',
   'Stand with back to wall — heels, calves, glutes, scapula, head touching wall. Remember the feeling',
   60, null, 3, 'https://www.youtube.com/watch?v=Hg3y7Bq5Fp8', false, 2),
  ('00000000-0000-0000-0004-000000000155', '00000000-0000-0000-0003-000000000051',
   'Підтягування підборіддя з нахилом', 'Chin Tuck with Extension',
   'Chin tuck + легкий нахил голови назад — активація глибоких флексорів шиї',
   'Chin tuck + slight backward head tilt — activating deep cervical flexors',
   null, 15, 3, 'https://www.youtube.com/watch?v=C1b6s4bWOUM', false, 3),
  ('00000000-0000-0000-0004-000000000156', '00000000-0000-0000-0003-000000000051',
   'Розтяжка згинача стегна (прогрес)', 'Hip Flexor Stretch Advanced',
   'Глибший випад — передня нога далі вперед, руки вгору і нахил назад. Максимальний розтяг',
   'Deeper lunge — front leg further forward, arms up and lean back. Maximum stretch',
   45, null, 3, 'https://www.youtube.com/watch?v=cc6UVRS7PW4', false, 4);

-- ВПРАВИ — День 11: Сила і витривалість
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000157', '00000000-0000-0000-0003-000000000052',
   'Відтискання (модифіковані)', 'Modified Push-ups',
   'Коліна на підлозі або з піднятими руками — зміцнення верхньої частини тіла без навантаження на зап''ястки',
   'Knees on floor or hands elevated — upper body strengthening without wrist strain',
   null, 10, 3, 'https://www.youtube.com/watch?v=pSHjTRCQxIw', false, 1),
  ('00000000-0000-0000-0004-000000000158', '00000000-0000-0000-0003-000000000052',
   'Assisted Row (гумка або стіл)', 'Assisted Row',
   'Тримаючись за стіл або гумку — відхилитись назад і підтягнутись. Зміцнення спини без обладнання',
   'Holding table edge or band — lean back and pull up. Back strengthening without equipment',
   null, 12, 3, 'https://www.youtube.com/watch?v=Hg3y7Bq5Fp8', false, 2),
  ('00000000-0000-0000-0004-000000000159', '00000000-0000-0000-0003-000000000052',
   'Squat Pulse', 'Squat Pulse',
   'Залишитись у нижній точці присідання і пульсувати — витривалість квадрицепсів',
   'Stay at bottom of squat and pulse — quadriceps endurance',
   null, 20, 3, 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E', false, 3),
  ('00000000-0000-0000-0004-000000000160', '00000000-0000-0000-0003-000000000052',
   'Планка з варіаціями', 'Plank Variations',
   'Чергувати планку на ліктях → підйом однієї ноги → підйом однієї руки. Динамічна стабільність',
   'Alternate forearm plank → lift one leg → lift one arm. Dynamic stability',
   30, null, 3, 'https://www.youtube.com/watch?v=pSHjTRCQxIw', false, 4);

-- ВПРАВИ — День 12: Офісна рутина
INSERT INTO exercises (id, day_id, name_ua, name_en, description_ua, description_en, target_hold, target_reps, target_sets, youtube_url, is_handstand, "order") VALUES
  ('00000000-0000-0000-0004-000000000161', '00000000-0000-0000-0003-000000000053',
   'Ранковий комплекс (повний)', 'Morning Routine Full',
   'Послідовність: котик-корівка → місток → chin tuck → shoulder rolls → forward fold. 8 хв на старт дня',
   'Sequence: cat-cow → bridge → chin tuck → shoulder rolls → forward fold. 8 min to start the day',
   null, 5, 2, 'https://www.youtube.com/watch?v=kqnua4rHVVA', false, 1),
  ('00000000-0000-0000-0004-000000000162', '00000000-0000-0000-0003-000000000053',
   'Офісна розтяжка (за столом)', 'Desk Stretch Sequence',
   'Розтяжки які можна робити не встаючи зі стільця: шия → плечі → спина → стегна. Кожну 1-2 години',
   'Stretches doable without leaving chair: neck → shoulders → back → hips. Every 1-2 hours',
   60, null, 3, 'https://www.youtube.com/watch?v=C1b6s4bWOUM', false, 2),
  ('00000000-0000-0000-0004-000000000163', '00000000-0000-0000-0003-000000000053',
   'Вправи для очей і шиї (комбо)', 'Eye + Neck Combo',
   'Вправи для очей (20-20-20) + повороти шиї + chin tuck. Комплекс кожні 2 години роботи',
   'Eye exercises (20-20-20) + neck rotations + chin tuck. Complex every 2 hours of work',
   60, null, 2, 'https://www.youtube.com/watch?v=C1b6s4bWOUM', false, 3),
  ('00000000-0000-0000-0004-000000000164', '00000000-0000-0000-0003-000000000053',
   'Вечірній relax', 'Evening Wind-Down',
   'Ноги вгору по стіні → скручування → шавасана. Повне відновлення після робочого дня',
   'Legs up wall → spinal twist → savasana. Complete recovery after work day',
   120, null, 1, 'https://www.youtube.com/watch?v=HCLmqfO1Fg8', false, 4);
