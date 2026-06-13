-- ============================================================
-- Міграція: radar chart support
-- Запускати в Supabase SQL Editor (НЕ весь schema.sql)
-- ============================================================

-- 1. Нова колонка на exercises
ALTER TABLE exercises
  ADD COLUMN IF NOT EXISTS exercise_category_id uuid REFERENCES categories(id) ON DELETE SET NULL;

-- 2. Нові категорії (якщо ще не існують)
INSERT INTO categories (id, slug, title_ua, title_en, description_ua, description_en, "order")
VALUES
  ('00000000-0000-0000-0000-000000000003', 'conditioning', 'Підкачка',   'Conditioning', 'Силова підготовка і витривалість',          'Strength and endurance training',        3),
  ('00000000-0000-0000-0000-000000000004', 'prehab',       'Здоров''я',  'Prehab',       'Профілактика травм, розминка, відновлення', 'Injury prevention, warm-up, recovery',   4),
  ('00000000-0000-0000-0000-000000000005', 'coordination', 'Координація','Coordination', 'Контроль тіла, виходи, переходи',           'Body control, exits, transitions',        5)
ON CONFLICT (id) DO NOTHING;

-- 3. Теги вправ
-- prehab: розминки і заминки
UPDATE exercises SET exercise_category_id = '00000000-0000-0000-0000-000000000004'
WHERE id IN (
  '00000000-0000-0000-0004-000000000001',
  '00000000-0000-0000-0004-000000000027',
  '00000000-0000-0000-0004-000000000042',
  '00000000-0000-0000-0004-000000000044'
);

-- conditioning: силові вправи
UPDATE exercises SET exercise_category_id = '00000000-0000-0000-0000-000000000003'
WHERE id IN (
  '00000000-0000-0000-0004-000000000004',
  '00000000-0000-0000-0004-000000000005',
  '00000000-0000-0000-0004-000000000007',
  '00000000-0000-0000-0004-000000000009',
  '00000000-0000-0000-0004-000000000013',
  '00000000-0000-0000-0004-000000000018',
  '00000000-0000-0000-0004-000000000019',
  '00000000-0000-0000-0004-000000000026'
);

-- coordination: виходи і переходи
UPDATE exercises SET exercise_category_id = '00000000-0000-0000-0000-000000000005'
WHERE id IN (
  '00000000-0000-0000-0004-000000000038',
  '00000000-0000-0000-0004-000000000039',
  '00000000-0000-0000-0004-000000000040'
);

-- handstand: все інше (без тегу → баланс)
UPDATE exercises SET exercise_category_id = '00000000-0000-0000-0000-000000000001'
WHERE exercise_category_id IS NULL;
