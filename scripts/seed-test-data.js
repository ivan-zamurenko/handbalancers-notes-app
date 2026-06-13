/**
 * Seed script: 3 нові програми + 3 тестові юзери + workout_logs за 30 днів
 * Запуск: node scripts/seed-test-data.js
 */
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const env = fs.readFileSync('.env.local', 'utf8')
const vars = {}
for (const line of env.split('\n')) {
  const idx = line.indexOf('=')
  if (idx > 0) vars[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
}

const supabase = createClient(vars.NEXT_PUBLIC_SUPABASE_URL, vars.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ── Helpers ──────────────────────────────────────────────────────────────────

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(10 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), 0, 0)
  return d.toISOString()
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function genHoldSets(target, count) {
  return Array.from({ length: count }, () => rand(Math.max(1, target - 8), target + 5))
}

function genRepsSets(target, count) {
  return Array.from({ length: count }, () => rand(Math.max(1, target - 3), target + 2))
}

// ── IDs ───────────────────────────────────────────────────────────────────────

const CAT = {
  handstand:    '00000000-0000-0000-0000-000000000001',
  stretching:   '00000000-0000-0000-0000-000000000002',
  conditioning: '00000000-0000-0000-0000-000000000003',
  prehab:       '00000000-0000-0000-0000-000000000004',
  coordination: '00000000-0000-0000-0000-000000000005',
}

const PROG = {
  prehab:        '00000000-0000-0000-0001-000000000004',
  conditioning:  '00000000-0000-0000-0001-000000000005',
  flexibility:   '00000000-0000-0000-0001-000000000006',
  handstandBeginners: '00000000-0000-0000-0001-000000000001',
}

// ── Program data ──────────────────────────────────────────────────────────────

const programs = [
  {
    id: PROG.prehab,
    category_id: CAT.prehab,
    slug: 'daily-prehab',
    title_ua: 'Щоденний Prehab',
    title_en: 'Daily Prehab',
    description_ua: 'Профілактика травм, рухливість суглобів і відновлення',
    description_en: 'Injury prevention, joint mobility and recovery',
    level: 'beginner',
    is_free: true,
    order: 1,
  },
  {
    id: PROG.conditioning,
    category_id: CAT.conditioning,
    slug: 'strength-foundations',
    title_ua: 'Базова Сила',
    title_en: 'Strength Foundations',
    description_ua: 'Силова база: віджимання, кор, статичні утримання',
    description_en: 'Strength base: push-ups, core, static holds',
    level: 'beginner',
    is_free: true,
    order: 1,
  },
  {
    id: PROG.flexibility,
    category_id: CAT.stretching,
    slug: 'full-flexibility',
    title_ua: 'Повна Гнучкість',
    title_en: 'Full Flexibility',
    description_ua: 'Шпагат, прогин, мобільність плечей і стегон',
    description_en: 'Splits, backbend, shoulder and hip mobility',
    level: 'beginner',
    is_free: false,
    order: 2,
  },
]

// week id prefix pattern: 00000000-0000-0000-0002-0000000000XX
function wid(n) { return `00000000-0000-0000-0002-${String(n).padStart(12, '0')}` }
function did(n) { return `00000000-0000-0000-0003-${String(n).padStart(12, '0')}` }
function eid(n) { return `00000000-0000-0000-0004-${String(n).padStart(12, '0')}` }

// weeks: 5-10 for new programs (existing go up to 4)
const weeks = [
  // prehab
  { id: wid(5),  program_id: PROG.prehab,       title_ua: 'Тиждень 1 — Зап\'ястки і плечі', title_en: 'Week 1 — Wrists & Shoulders', order: 1 },
  { id: wid(6),  program_id: PROG.prehab,       title_ua: 'Тиждень 2 — Стегна і хребет',   title_en: 'Week 2 — Hips & Spine',       order: 2 },
  // conditioning
  { id: wid(7),  program_id: PROG.conditioning, title_ua: 'Тиждень 1 — Основи',             title_en: 'Week 1 — Basics',             order: 1 },
  { id: wid(8),  program_id: PROG.conditioning, title_ua: 'Тиждень 2 — Прогрес',             title_en: 'Week 2 — Progress',           order: 2 },
  // flexibility
  { id: wid(9),  program_id: PROG.flexibility,  title_ua: 'Тиждень 1 — Відкриття',           title_en: 'Week 1 — Opening',            order: 1 },
  { id: wid(10), program_id: PROG.flexibility,  title_ua: 'Тиждень 2 — Заглиблення',         title_en: 'Week 2 — Deepening',          order: 2 },
]

// days: 16-45 (5 days × 6 weeks)
const days = [
  // prehab week 1
  { id: did(16), week_id: wid(5), title_ua: 'День 1 — Зап\'ястки',      title_en: 'Day 1 — Wrists',         order: 1 },
  { id: did(17), week_id: wid(5), title_ua: 'День 2 — Плечі',            title_en: 'Day 2 — Shoulders',      order: 2 },
  { id: did(18), week_id: wid(5), title_ua: 'День 3 — Хребет',           title_en: 'Day 3 — Spine',          order: 3 },
  { id: did(19), week_id: wid(5), title_ua: 'День 4 — Пальці і передпліччя', title_en: 'Day 4 — Fingers & Forearms', order: 4 },
  { id: did(20), week_id: wid(5), title_ua: 'День 5 — Відновлення',      title_en: 'Day 5 — Recovery',       order: 5 },
  // prehab week 2
  { id: did(21), week_id: wid(6), title_ua: 'День 1 — Стегна',           title_en: 'Day 1 — Hips',           order: 1 },
  { id: did(22), week_id: wid(6), title_ua: 'День 2 — Гомілка і стопи',  title_en: 'Day 2 — Ankles & Feet',  order: 2 },
  { id: did(23), week_id: wid(6), title_ua: 'День 3 — Поперек',          title_en: 'Day 3 — Lower Back',     order: 3 },
  { id: did(24), week_id: wid(6), title_ua: 'День 4 — Шия і грудний відділ', title_en: 'Day 4 — Neck & Thoracic', order: 4 },
  { id: did(25), week_id: wid(6), title_ua: 'День 5 — Повне відновлення', title_en: 'Day 5 — Full Recovery',  order: 5 },
  // conditioning week 1
  { id: did(26), week_id: wid(7), title_ua: 'День 1 — Поштовхова сила',  title_en: 'Day 1 — Push Strength',  order: 1 },
  { id: did(27), week_id: wid(7), title_ua: 'День 2 — Кор',              title_en: 'Day 2 — Core',           order: 2 },
  { id: did(28), week_id: wid(7), title_ua: 'День 3 — Плечі',            title_en: 'Day 3 — Shoulders',      order: 3 },
  { id: did(29), week_id: wid(7), title_ua: 'День 4 — Все тіло',         title_en: 'Day 4 — Full Body',      order: 4 },
  { id: did(30), week_id: wid(7), title_ua: 'День 5 — Тест',             title_en: 'Day 5 — Test',           order: 5 },
  // conditioning week 2
  { id: did(31), week_id: wid(8), title_ua: 'День 1 — Об\'єм',           title_en: 'Day 1 — Volume',         order: 1 },
  { id: did(32), week_id: wid(8), title_ua: 'День 2 — Вибухова сила',    title_en: 'Day 2 — Explosive',      order: 2 },
  { id: did(33), week_id: wid(8), title_ua: 'День 3 — Статика',          title_en: 'Day 3 — Statics',        order: 3 },
  { id: did(34), week_id: wid(8), title_ua: 'День 4 — Витривалість',     title_en: 'Day 4 — Endurance',      order: 4 },
  { id: did(35), week_id: wid(8), title_ua: 'День 5 — Максимум',         title_en: 'Day 5 — Max',            order: 5 },
  // flexibility week 1
  { id: did(36), week_id: wid(9),  title_ua: 'День 1 — Задня поверхня',  title_en: 'Day 1 — Posterior Chain', order: 1 },
  { id: did(37), week_id: wid(9),  title_ua: 'День 2 — Стегна',          title_en: 'Day 2 — Hips',            order: 2 },
  { id: did(38), week_id: wid(9),  title_ua: 'День 3 — Плечі',           title_en: 'Day 3 — Shoulders',       order: 3 },
  { id: did(39), week_id: wid(9),  title_ua: 'День 4 — Хребет',          title_en: 'Day 4 — Spine',           order: 4 },
  { id: did(40), week_id: wid(9),  title_ua: 'День 5 — Потік',           title_en: 'Day 5 — Flow',            order: 5 },
  // flexibility week 2
  { id: did(41), week_id: wid(10), title_ua: 'День 1 — Шпагат',          title_en: 'Day 1 — Splits',          order: 1 },
  { id: did(42), week_id: wid(10), title_ua: 'День 2 — Прогин',          title_en: 'Day 2 — Backbend',        order: 2 },
  { id: did(43), week_id: wid(10), title_ua: 'День 3 — Глибокі стегна',  title_en: 'Day 3 — Deep Hips',       order: 3 },
  { id: did(44), week_id: wid(10), title_ua: 'День 4 — Мобільність плечей', title_en: 'Day 4 — Shoulder Mobility', order: 4 },
  { id: did(45), week_id: wid(10), title_ua: 'День 5 — Фінальний тест',  title_en: 'Day 5 — Final Test',      order: 5 },
]

// exercises for new programs — all with exercise_category_id
const exercises = [
  // ── PREHAB (day 16-25) ─────────────────────────────────────────────────────
  { id: eid(45), day_id: did(16), exercise_category_id: CAT.prehab, name_ua: 'Кола зап\'ястками', name_en: 'Wrist Circles', description_ua: 'Повільні кола зап\'ястками в обидва боки — по 10 повторень', description_en: 'Slow wrist circles both directions — 10 reps each', target_reps: 10, target_sets: 2, is_handstand: false, order: 1 },
  { id: eid(46), day_id: did(16), exercise_category_id: CAT.prehab, name_ua: 'Розтяжка розгиначів зап\'ястків', name_en: 'Wrist Extensor Stretch', description_ua: 'Рука вперед, пальці вниз — утримати 30 сек', description_en: 'Arm forward, fingers down — hold 30 sec', target_hold: 30, target_sets: 2, is_handstand: false, order: 2 },
  { id: eid(47), day_id: did(16), exercise_category_id: CAT.prehab, name_ua: 'Розтяжка згиначів зап\'ястків', name_en: 'Wrist Flexor Stretch', description_ua: 'Рука вперед, пальці вгору — утримати 30 сек', description_en: 'Arm forward, fingers up — hold 30 sec', target_hold: 30, target_sets: 2, is_handstand: false, order: 3 },

  { id: eid(48), day_id: did(17), exercise_category_id: CAT.prehab, name_ua: 'Обертання плечей', name_en: 'Shoulder Rolls', description_ua: 'Повільні кола плечима вперед і назад', description_en: 'Slow shoulder circles forward and backward', target_reps: 10, target_sets: 2, is_handstand: false, order: 1 },
  { id: eid(49), day_id: did(17), exercise_category_id: CAT.prehab, name_ua: 'Відведення рук за спину', name_en: 'Shoulder Dislocates', description_ua: 'З палицею або рушником — переведення рук за спину', description_en: 'With stick or towel — pass arms behind back', target_reps: 10, target_sets: 3, is_handstand: false, order: 2 },
  { id: eid(50), day_id: did(17), exercise_category_id: CAT.prehab, name_ua: 'Розтяжка грудних м\'язів', name_en: 'Chest Opener', description_ua: 'Руки на рамі дверей — нахилитись вперед, утримати 30 сек', description_en: 'Hands on door frame — lean forward, hold 30 sec', target_hold: 30, target_sets: 2, is_handstand: false, order: 3 },

  { id: eid(51), day_id: did(18), exercise_category_id: CAT.prehab, name_ua: 'Кіт-корова', name_en: 'Cat-Cow', description_ua: 'На четвереньках — згинання і розгинання хребта', description_en: 'On all fours — flex and extend spine', target_reps: 10, target_sets: 3, is_handstand: false, order: 1 },
  { id: eid(52), day_id: did(18), exercise_category_id: CAT.prehab, name_ua: 'Грудний міст', name_en: 'Thoracic Bridge', description_ua: 'Лежачи, опора на руки і стопи — прогин у грудному відділі', description_en: 'Lying, support on hands and feet — thoracic extension', target_hold: 20, target_sets: 3, is_handstand: false, order: 2 },
  { id: eid(53), day_id: did(18), exercise_category_id: CAT.prehab, name_ua: 'Скручування хребта лежачи', name_en: 'Supine Spinal Twist', description_ua: 'Лежачи на спині — коліна в сторону, утримати 30 сек', description_en: 'Lying on back — knees to side, hold 30 sec', target_hold: 30, target_sets: 2, is_handstand: false, order: 3 },

  { id: eid(54), day_id: did(19), exercise_category_id: CAT.prehab, name_ua: 'Розтяжка пальців', name_en: 'Finger Stretches', description_ua: 'Відтягування кожного пальця назад — по 3 рази кожен', description_en: 'Pull each finger back — 3 times each', target_reps: 10, target_sets: 2, is_handstand: false, order: 1 },
  { id: eid(55), day_id: did(19), exercise_category_id: CAT.prehab, name_ua: 'Масаж передпліч', name_en: 'Forearm Massage', description_ua: 'Круговий масаж м\'язів передпліччя — по 60 сек на кожне', description_en: 'Circular massage of forearm muscles — 60 sec each', target_hold: 60, target_sets: 2, is_handstand: false, order: 2 },
  { id: eid(56), day_id: did(19), exercise_category_id: CAT.prehab, name_ua: 'Стрес-тест зап\'ястків', name_en: 'Wrist Loading Test', description_ua: 'Упор на прямих руках — поступово збільшувати навантаження', description_en: 'Support on straight arms — gradually increase load', target_hold: 15, target_sets: 3, is_handstand: false, order: 3 },

  { id: eid(57), day_id: did(20), exercise_category_id: CAT.prehab, name_ua: 'Повна розминка суглобів', name_en: 'Full Joint Warm-up', description_ua: 'Кола всіма суглобами зверху вниз — шия, плечі, лікті, зап\'ястки', description_en: 'Circles all joints top to bottom — neck, shoulders, elbows, wrists', target_reps: 10, target_sets: 1, is_handstand: false, order: 1 },
  { id: eid(58), day_id: did(20), exercise_category_id: CAT.prehab, name_ua: 'Дихальна практика', name_en: 'Breathing Practice', description_ua: 'Повільне діафрагмальне дихання — 4 рахунки вдих, 6 видих', description_en: 'Slow diaphragmatic breathing — 4 count inhale, 6 exhale', target_hold: 60, target_sets: 3, is_handstand: false, order: 2 },
  { id: eid(59), day_id: did(20), exercise_category_id: CAT.prehab, name_ua: 'М\'яке скручування хребта', name_en: 'Gentle Spinal Rotation', description_ua: 'Сидячи — повільні повороти тулуба, по 10 в кожен бік', description_en: 'Seated — slow torso rotations, 10 each side', target_reps: 10, target_sets: 2, is_handstand: false, order: 3 },

  { id: eid(60), day_id: did(21), exercise_category_id: CAT.prehab, name_ua: 'Розтяжка клубово-поперекового м\'яза', name_en: 'Psoas Stretch', description_ua: 'Випад уперед — утримати 40 сек на кожну ногу', description_en: 'Lunge forward — hold 40 sec each leg', target_hold: 40, target_sets: 2, is_handstand: false, order: 1 },
  { id: eid(61), day_id: did(21), exercise_category_id: CAT.prehab, name_ua: 'Кола стегнами', name_en: 'Hip Circles', description_ua: 'Широкі кола стегнами стоячи — 10 в кожен бік', description_en: 'Wide hip circles standing — 10 each direction', target_reps: 10, target_sets: 2, is_handstand: false, order: 2 },
  { id: eid(62), day_id: did(21), exercise_category_id: CAT.prehab, name_ua: 'Голуб (розтяжка стегна)', name_en: 'Pigeon Pose', description_ua: 'Одна нога зігнута вперед, інша витягнута назад — утримати 45 сек', description_en: 'One leg bent forward, other extended back — hold 45 sec', target_hold: 45, target_sets: 2, is_handstand: false, order: 3 },

  { id: eid(63), day_id: did(22), exercise_category_id: CAT.prehab, name_ua: 'Кола гомілкою', name_en: 'Ankle Circles', description_ua: 'Сидячи — повільні кола гомілкою в обидва боки', description_en: 'Seated — slow ankle circles both directions', target_reps: 15, target_sets: 2, is_handstand: false, order: 1 },
  { id: eid(64), day_id: did(22), exercise_category_id: CAT.prehab, name_ua: 'Підйоми на носки', name_en: 'Calf Raises', description_ua: 'Повільні підйоми і опускання — 15 повторень', description_en: 'Slow raises and lower — 15 reps', target_reps: 15, target_sets: 3, is_handstand: false, order: 2 },
  { id: eid(65), day_id: did(22), exercise_category_id: CAT.prehab, name_ua: 'Розтяжка гомілки у стіні', name_en: 'Wall Calf Stretch', description_ua: 'Нахил до стіни з прямою ногою позаду — утримати 30 сек', description_en: 'Lean to wall with straight back leg — hold 30 sec', target_hold: 30, target_sets: 2, is_handstand: false, order: 3 },

  { id: eid(66), day_id: did(23), exercise_category_id: CAT.prehab, name_ua: 'Міст лежачи', name_en: 'Glute Bridge', description_ua: 'Лежачи — підняти таз, утримати 20 сек', description_en: 'Lying — raise hips, hold 20 sec', target_hold: 20, target_sets: 3, is_handstand: false, order: 1 },
  { id: eid(67), day_id: did(23), exercise_category_id: CAT.prehab, name_ua: 'Дитяча поза', name_en: 'Child\'s Pose', description_ua: 'Колінна поза з витягнутими руками вперед — утримати 60 сек', description_en: 'Kneeling with arms extended forward — hold 60 sec', target_hold: 60, target_sets: 2, is_handstand: false, order: 2 },
  { id: eid(68), day_id: did(23), exercise_category_id: CAT.prehab, name_ua: 'Перекати на хребті', name_en: 'Spinal Rolling', description_ua: 'Лежачи — перекати з зігнутими колінами, масуж хребет', description_en: 'Lying — roll with bent knees, massage spine', target_reps: 10, target_sets: 2, is_handstand: false, order: 3 },

  { id: eid(69), day_id: did(24), exercise_category_id: CAT.prehab, name_ua: 'Нахили голови', name_en: 'Neck Tilts', description_ua: 'Повільні нахили голови в усі боки — по 5 сек утримання', description_en: 'Slow head tilts all directions — 5 sec holds', target_hold: 5, target_sets: 3, is_handstand: false, order: 1 },
  { id: eid(70), day_id: did(24), exercise_category_id: CAT.prehab, name_ua: 'Розкриття грудного відділу на валику', name_en: 'Thoracic Extension on Roller', description_ua: 'Ролик під лопатками — прогнутись назад, утримати 20 сек', description_en: 'Roller under shoulder blades — extend back, hold 20 sec', target_hold: 20, target_sets: 3, is_handstand: false, order: 2 },
  { id: eid(71), day_id: did(24), exercise_category_id: CAT.prehab, name_ua: 'Ротація грудного відділу', name_en: 'Thoracic Rotation', description_ua: 'На четвереньках — рука за голову, поворот ліктем вгору', description_en: 'On all fours — hand behind head, rotate elbow up', target_reps: 10, target_sets: 3, is_handstand: false, order: 3 },

  { id: eid(72), day_id: did(25), exercise_category_id: CAT.prehab, name_ua: 'Розминка від голови до ніг', name_en: 'Head-to-Toe Warm-up', description_ua: 'Послідовна розминка всіх суглобів — 30 хв відновлення', description_en: 'Sequential warm-up of all joints — 30 min recovery', target_reps: 10, target_sets: 1, is_handstand: false, order: 1 },
  { id: eid(73), day_id: did(25), exercise_category_id: CAT.prehab, name_ua: 'Глибоке дихання лежачи', name_en: 'Deep Lying Breathing', description_ua: 'Повне розслаблення тіла з глибоким диханням', description_en: 'Full body relaxation with deep breathing', target_hold: 90, target_sets: 2, is_handstand: false, order: 2 },

  // ── CONDITIONING (day 26-35) ──────────────────────────────────────────────
  { id: eid(74), day_id: did(26), exercise_category_id: CAT.conditioning, name_ua: 'Відтискання', name_en: 'Push-ups', description_ua: 'Класичні відтискання — контроль лопаток', description_en: 'Classic push-ups — scapular control', target_reps: 10, target_sets: 4, is_handstand: false, order: 1 },
  { id: eid(75), day_id: did(26), exercise_category_id: CAT.conditioning, name_ua: 'Паузові відтискання', name_en: 'Paused Push-ups', description_ua: 'Відтискання з паузою в нижній точці — 2 сек', description_en: 'Push-ups with pause at bottom — 2 sec', target_reps: 8, target_sets: 3, is_handstand: false, order: 2 },
  { id: eid(76), day_id: did(26), exercise_category_id: CAT.conditioning, name_ua: 'Трицепсові відтискання', name_en: 'Tricep Push-ups', description_ua: 'Вузька постановка рук — акцент на трицепси', description_en: 'Narrow hand placement — tricep focus', target_reps: 8, target_sets: 3, is_handstand: false, order: 3 },

  { id: eid(77), day_id: did(27), exercise_category_id: CAT.conditioning, name_ua: 'Планка', name_en: 'Plank Hold', description_ua: 'Упор на передпліччях або прямих руках — утримати', description_en: 'Support on forearms or straight arms — hold', target_hold: 30, target_sets: 4, is_handstand: false, order: 1 },
  { id: eid(78), day_id: did(27), exercise_category_id: CAT.conditioning, name_ua: 'Бічна планка', name_en: 'Side Plank', description_ua: 'Боком — утримати по 20 сек на кожен бік', description_en: 'On side — hold 20 sec each side', target_hold: 20, target_sets: 3, is_handstand: false, order: 2 },
  { id: eid(79), day_id: did(27), exercise_category_id: CAT.conditioning, name_ua: 'Hollow body hold', name_en: 'Hollow Body Hold', description_ua: 'Лежачи на спині — тіло у формі банана', description_en: 'Lying on back — body in banana shape', target_hold: 25, target_sets: 3, is_handstand: false, order: 3 },

  { id: eid(80), day_id: did(28), exercise_category_id: CAT.conditioning, name_ua: 'Відтискання з піку', name_en: 'Pike Push-ups', description_ua: 'В позиції перевернутої V — акцент на плечі', description_en: 'In inverted V — shoulder focus', target_reps: 8, target_sets: 4, is_handstand: false, order: 1 },
  { id: eid(81), day_id: did(28), exercise_category_id: CAT.conditioning, name_ua: 'Протракція лопаток в планці', name_en: 'Scapular Push-ups', description_ua: 'В планці — виштовхування і утримання лопаток', description_en: 'In plank — push and hold shoulder blades', target_reps: 10, target_sets: 3, is_handstand: false, order: 2 },
  { id: eid(82), day_id: did(28), exercise_category_id: CAT.conditioning, name_ua: 'Відмахи рук лежачи', name_en: 'Superman Pulls', description_ua: 'Лежачи на животі — тягнути руки вздовж тіла', description_en: 'Lying on stomach — pull arms along body', target_reps: 12, target_sets: 3, is_handstand: false, order: 3 },

  { id: eid(83), day_id: did(29), exercise_category_id: CAT.conditioning, name_ua: 'Бурпі', name_en: 'Burpees', description_ua: 'Стрибок вгору, присідання, упор, відтискання — 10 повторень', description_en: 'Jump up, squat, support, push-up — 10 reps', target_reps: 10, target_sets: 3, is_handstand: false, order: 1 },
  { id: eid(84), day_id: did(29), exercise_category_id: CAT.conditioning, name_ua: 'Альпініст', name_en: 'Mountain Climbers', description_ua: 'В упорі — почергове підтягування колін до грудей', description_en: 'In plank — alternating knee drives to chest', target_reps: 20, target_sets: 3, is_handstand: false, order: 2 },
  { id: eid(85), day_id: did(29), exercise_category_id: CAT.conditioning, name_ua: 'Ходьба на руках', name_en: 'Bear Crawl', description_ua: 'На чотирьох — повільна ходьба вперед і назад', description_en: 'On all fours — slow walk forward and back', target_reps: 10, target_sets: 3, is_handstand: false, order: 3 },

  { id: eid(86), day_id: did(30), exercise_category_id: CAT.conditioning, name_ua: 'Максимум відтискань', name_en: 'Max Push-ups', description_ua: 'Один підхід — максимальна кількість відтискань', description_en: 'One set — maximum push-ups', target_reps: 20, target_sets: 1, is_handstand: false, order: 1 },
  { id: eid(87), day_id: did(30), exercise_category_id: CAT.conditioning, name_ua: 'Максимальна планка', name_en: 'Max Plank', description_ua: 'Один підхід — максимальний час планки', description_en: 'One set — maximum plank time', target_hold: 60, target_sets: 1, is_handstand: false, order: 2 },
  { id: eid(88), day_id: did(30), exercise_category_id: CAT.conditioning, name_ua: 'Максимальний hollow body', name_en: 'Max Hollow Body', description_ua: 'Один підхід — максимальний час утримання', description_en: 'One set — maximum hold time', target_hold: 45, target_sets: 1, is_handstand: false, order: 3 },

  { id: eid(89), day_id: did(31), exercise_category_id: CAT.conditioning, name_ua: 'Відтискання 5×10', name_en: 'Push-ups 5×10', description_ua: '5 підходів по 10 відтискань — акцент на кількість', description_en: '5 sets of 10 push-ups — volume focus', target_reps: 10, target_sets: 5, is_handstand: false, order: 1 },
  { id: eid(90), day_id: did(31), exercise_category_id: CAT.conditioning, name_ua: 'Arch body hold', name_en: 'Arch Body Hold', description_ua: 'Лежачи на животі — підняти руки і ноги, утримати', description_en: 'Lying on stomach — raise arms and legs, hold', target_hold: 20, target_sets: 4, is_handstand: false, order: 2 },
  { id: eid(91), day_id: did(31), exercise_category_id: CAT.conditioning, name_ua: 'V-sit спроба', name_en: 'V-sit Attempt', description_ua: 'Сидячи — підняти прямі ноги, утримати рівновагу', description_en: 'Seated — raise straight legs, hold balance', target_hold: 5, target_sets: 5, is_handstand: false, order: 3 },

  { id: eid(92), day_id: did(32), exercise_category_id: CAT.conditioning, name_ua: 'Вибухові відтискання', name_en: 'Explosive Push-ups', description_ua: 'Відтискання з відривом долонь від підлоги', description_en: 'Push-ups with hands leaving floor', target_reps: 6, target_sets: 4, is_handstand: false, order: 1 },
  { id: eid(93), day_id: did(32), exercise_category_id: CAT.conditioning, name_ua: 'Стрибки на одній нозі', name_en: 'Single Leg Hops', description_ua: 'Стрибки на одній нозі — по 10 на кожну', description_en: 'Hops on one leg — 10 each', target_reps: 10, target_sets: 3, is_handstand: false, order: 2 },
  { id: eid(94), day_id: did(32), exercise_category_id: CAT.conditioning, name_ua: 'Стрибкові випади', name_en: 'Jump Lunges', description_ua: 'Стрибок зі зміною ніг у випаді — 10 повторень', description_en: 'Jump with leg switch in lunge — 10 reps', target_reps: 10, target_sets: 3, is_handstand: false, order: 3 },

  { id: eid(95), day_id: did(33), exercise_category_id: CAT.conditioning, name_ua: 'L-sit утримання', name_en: 'L-sit Hold', description_ua: 'Сидячи з опорою на руки — підняти ноги під прямим кутом', description_en: 'Seated with hand support — raise legs to 90°', target_hold: 10, target_sets: 5, is_handstand: false, order: 1 },
  { id: eid(96), day_id: did(33), exercise_category_id: CAT.conditioning, name_ua: 'Tuck hold', name_en: 'Tuck Hold', description_ua: 'Колінна позиція з підйомом — утримати рівновагу', description_en: 'Tucked position with lift — hold balance', target_hold: 8, target_sets: 5, is_handstand: false, order: 2 },
  { id: eid(97), day_id: did(33), exercise_category_id: CAT.conditioning, name_ua: 'Довга планка', name_en: 'Long Plank', description_ua: 'Планка понад 1 хвилину — розвиток витривалості', description_en: 'Plank over 1 minute — endurance focus', target_hold: 60, target_sets: 3, is_handstand: false, order: 3 },

  { id: eid(98), day_id: did(34), exercise_category_id: CAT.conditioning, name_ua: 'Серія відтискань 10×10', name_en: 'Push-up Circuit 10×10', description_ua: '10 підходів по 10 відтискань з 30 сек відпочинку', description_en: '10 sets of 10 push-ups with 30 sec rest', target_reps: 10, target_sets: 10, is_handstand: false, order: 1 },
  { id: eid(99), day_id: did(34), exercise_category_id: CAT.conditioning, name_ua: 'Планка AMRAP', name_en: 'Plank AMRAP', description_ua: 'Максимальна кількість підходів планки по 30 сек за 5 хв', description_en: 'Max plank sets of 30 sec in 5 minutes', target_hold: 30, target_sets: 5, is_handstand: false, order: 2 },
  { id: eid(100), day_id: did(34), exercise_category_id: CAT.conditioning, name_ua: 'Hollow body 5×20', name_en: 'Hollow Body 5×20', description_ua: 'Максимальна кількість підходів — розвиток витривалості кора', description_en: '5 sets of 20 sec hollow body — core endurance', target_hold: 20, target_sets: 5, is_handstand: false, order: 3 },

  { id: eid(101), day_id: did(35), exercise_category_id: CAT.conditioning, name_ua: 'Фінальний тест сили', name_en: 'Strength Final Test', description_ua: 'Максимум відтискань без зупинки', description_en: 'Max push-ups without stopping', target_reps: 25, target_sets: 1, is_handstand: false, order: 1 },
  { id: eid(102), day_id: did(35), exercise_category_id: CAT.conditioning, name_ua: 'Максимальний L-sit', name_en: 'Max L-sit', description_ua: 'Три спроби максимального утримання L-sit', description_en: 'Three attempts at max L-sit hold', target_hold: 15, target_sets: 3, is_handstand: false, order: 2 },
  { id: eid(103), day_id: did(35), exercise_category_id: CAT.conditioning, name_ua: 'Фінальна планка', name_en: 'Final Plank', description_ua: 'Один максимальний підхід планки', description_en: 'One maximum plank hold', target_hold: 90, target_sets: 1, is_handstand: false, order: 3 },

  // ── FLEXIBILITY (day 36-45) ───────────────────────────────────────────────
  { id: eid(104), day_id: did(36), exercise_category_id: CAT.stretching, name_ua: 'Нахил вперед стоячи', name_en: 'Standing Forward Fold', description_ua: 'Ноги прямі, нахил вперед — утримати 45 сек', description_en: 'Straight legs, fold forward — hold 45 sec', target_hold: 45, target_sets: 3, is_handstand: false, order: 1 },
  { id: eid(105), day_id: did(36), exercise_category_id: CAT.stretching, name_ua: 'Розтяжка підколінних сухожиль лежачи', name_en: 'Lying Hamstring Stretch', description_ua: 'Лежачи на спині — підняти пряму ногу, утримати 30 сек', description_en: 'Lying on back — raise straight leg, hold 30 sec', target_hold: 30, target_sets: 3, is_handstand: false, order: 2 },
  { id: eid(106), day_id: did(36), exercise_category_id: CAT.stretching, name_ua: 'Глибокий випад', name_en: 'Deep Lunge', description_ua: 'Довгий випад вперед — утримати 40 сек на кожну ногу', description_en: 'Long forward lunge — hold 40 sec each leg', target_hold: 40, target_sets: 2, is_handstand: false, order: 3 },

  { id: eid(107), day_id: did(37), exercise_category_id: CAT.stretching, name_ua: 'Метелик', name_en: 'Butterfly Stretch', description_ua: 'Сидячи — ступні разом, лікті на колінах, натиснути вниз', description_en: 'Seated — feet together, elbows on knees, press down', target_hold: 45, target_sets: 3, is_handstand: false, order: 1 },
  { id: eid(108), day_id: did(37), exercise_category_id: CAT.stretching, name_ua: 'Поза голуба', name_en: 'Pigeon Stretch', description_ua: 'Нога зігнута під 90° спереду — утримати 60 сек', description_en: 'Leg bent 90° in front — hold 60 sec', target_hold: 60, target_sets: 2, is_handstand: false, order: 2 },
  { id: eid(109), day_id: did(37), exercise_category_id: CAT.stretching, name_ua: 'Поперечний шпагат сидячи', name_en: 'Seated Straddle', description_ua: 'Ноги широко, нахил вперед — утримати 45 сек', description_en: 'Legs wide, fold forward — hold 45 sec', target_hold: 45, target_sets: 3, is_handstand: false, order: 3 },

  { id: eid(110), day_id: did(38), exercise_category_id: CAT.stretching, name_ua: 'Розтяжка передньої дельти', name_en: 'Front Delt Stretch', description_ua: 'Рука за спину, поворот — утримати 30 сек', description_en: 'Arm behind back, turn — hold 30 sec', target_hold: 30, target_sets: 3, is_handstand: false, order: 1 },
  { id: eid(111), day_id: did(38), exercise_category_id: CAT.stretching, name_ua: 'Відведення рук з ременем', name_en: 'Shoulder Dislocates with Band', description_ua: 'З ременем широко — переведення рук через голову назад', description_en: 'With band wide — pass arms overhead to back', target_reps: 10, target_sets: 3, is_handstand: false, order: 2 },
  { id: eid(112), day_id: did(38), exercise_category_id: CAT.stretching, name_ua: 'Кобра', name_en: 'Cobra Stretch', description_ua: 'Лежачи на животі — випрямити руки, прогин у хребті', description_en: 'Lying on stomach — straighten arms, spinal arch', target_hold: 30, target_sets: 3, is_handstand: false, order: 3 },

  { id: eid(113), day_id: did(39), exercise_category_id: CAT.stretching, name_ua: 'Скручування сидячи', name_en: 'Seated Twist', description_ua: 'Одна нога пряма, інша зігнута — поворот тулуба, 30 сек', description_en: 'One leg straight, one bent — torso twist, 30 sec', target_hold: 30, target_sets: 3, is_handstand: false, order: 1 },
  { id: eid(114), day_id: did(39), exercise_category_id: CAT.stretching, name_ua: 'Кіт-корова з паузою', name_en: 'Cat-Cow with Pause', description_ua: 'Повільні хвилі хребтом з паузою на кожному кінці', description_en: 'Slow spine waves with pause at each end', target_reps: 8, target_sets: 3, is_handstand: false, order: 2 },
  { id: eid(115), day_id: did(39), exercise_category_id: CAT.stretching, name_ua: 'Пасивний прогин на м\'ячі', name_en: 'Passive Backbend on Ball', description_ua: 'Спина на гімнастичному м\'ячі — розслаблений прогин, 60 сек', description_en: 'Back on exercise ball — relaxed backbend, 60 sec', target_hold: 60, target_sets: 2, is_handstand: false, order: 3 },

  { id: eid(116), day_id: did(40), exercise_category_id: CAT.stretching, name_ua: 'Потік з нахилу до кобри', name_en: 'Forward Fold to Cobra Flow', description_ua: 'Повільний потік між нахилом і коброю — 10 циклів', description_en: 'Slow flow between forward fold and cobra — 10 cycles', target_reps: 10, target_sets: 2, is_handstand: false, order: 1 },
  { id: eid(117), day_id: did(40), exercise_category_id: CAT.stretching, name_ua: 'Поза дитини з нахилом вбік', name_en: 'Child\'s Pose with Side Lean', description_ua: 'Дитяча поза — нахил руками вправо і вліво по 30 сек', description_en: 'Child\'s pose — arms lean right and left 30 sec each', target_hold: 30, target_sets: 2, is_handstand: false, order: 2 },
  { id: eid(118), day_id: did(40), exercise_category_id: CAT.stretching, name_ua: 'Поза зоряного неба (Shavasana)', name_en: 'Savasana', description_ua: 'Повне розслаблення лежачи — 90 сек', description_en: 'Complete relaxation lying — 90 sec', target_hold: 90, target_sets: 1, is_handstand: false, order: 3 },

  { id: eid(119), day_id: did(41), exercise_category_id: CAT.stretching, name_ua: 'Прогрес поздовжнього шпагату', name_en: 'Front Split Progression', description_ua: 'Ковзання однієї ноги вперед якомога далі — утримати 60 сек', description_en: 'Slide one leg forward as far as possible — hold 60 sec', target_hold: 60, target_sets: 2, is_handstand: false, order: 1 },
  { id: eid(120), day_id: did(41), exercise_category_id: CAT.stretching, name_ua: 'Прогрес поперечного шпагату', name_en: 'Side Split Progression', description_ua: 'Ковзання ніг в сторони якомога далі — утримати 60 сек', description_en: 'Slide legs sideways as far as possible — hold 60 sec', target_hold: 60, target_sets: 2, is_handstand: false, order: 2 },
  { id: eid(121), day_id: did(41), exercise_category_id: CAT.stretching, name_ua: 'Активний шпагат з підтяжкою', name_en: 'Active Split with Lift', description_ua: 'В позиції шпагату — підняти ногу, що спереді, без рук', description_en: 'In split position — lift front leg without hands', target_reps: 5, target_sets: 3, is_handstand: false, order: 3 },

  { id: eid(122), day_id: did(42), exercise_category_id: CAT.stretching, name_ua: 'Колесо (міст)', name_en: 'Wheel Pose', description_ua: 'Повний прогин на руках і ногах — утримати 20 сек', description_en: 'Full backbend on hands and feet — hold 20 sec', target_hold: 20, target_sets: 3, is_handstand: false, order: 1 },
  { id: eid(123), day_id: did(42), exercise_category_id: CAT.stretching, name_ua: 'Верблюд', name_en: 'Camel Pose', description_ua: 'Стоячи на колінах, прогин назад з руками на п\'ятах — 30 сек', description_en: 'Standing on knees, backbend with hands on heels — 30 sec', target_hold: 30, target_sets: 3, is_handstand: false, order: 2 },
  { id: eid(124), day_id: did(42), exercise_category_id: CAT.stretching, name_ua: 'Прогин у стіни', name_en: 'Wall Backbend', description_ua: 'Стоячи до стіни — поступово опускати руки по стіні вниз', description_en: 'Standing at wall — gradually walk hands down wall', target_hold: 30, target_sets: 2, is_handstand: false, order: 3 },

  { id: eid(125), day_id: did(43), exercise_category_id: CAT.stretching, name_ua: 'Поза гірлянди', name_en: 'Garland Pose (Deep Squat)', description_ua: 'Глибоке присідання — п\'яти на підлозі, утримати 60 сек', description_en: 'Deep squat — heels on floor, hold 60 sec', target_hold: 60, target_sets: 3, is_handstand: false, order: 1 },
  { id: eid(126), day_id: did(43), exercise_category_id: CAT.stretching, name_ua: 'Лягуша (frog stretch)', name_en: 'Frog Stretch', description_ua: 'На четвереньках — коліна широко, утримати 60 сек', description_en: 'On all fours — knees wide, hold 60 sec', target_hold: 60, target_sets: 2, is_handstand: false, order: 2 },
  { id: eid(127), day_id: did(43), exercise_category_id: CAT.stretching, name_ua: '90/90 stretch', name_en: '90/90 Hip Stretch', description_ua: 'Обидві ноги зігнуті під 90° — поворот між позиціями', description_en: 'Both legs bent 90° — rotate between positions', target_reps: 10, target_sets: 3, is_handstand: false, order: 3 },

  { id: eid(128), day_id: did(44), exercise_category_id: CAT.stretching, name_ua: 'Розтяжка плечей за спиною', name_en: 'Behind-Back Shoulder Stretch', description_ua: 'Одна рука зверху, інша знизу — зчепити пальці, 30 сек', description_en: 'One arm over, one under — clasp fingers, 30 sec', target_hold: 30, target_sets: 3, is_handstand: false, order: 1 },
  { id: eid(129), day_id: did(44), exercise_category_id: CAT.stretching, name_ua: 'Розтяжка широкого м\'яза спини', name_en: 'Lat Stretch', description_ua: 'Руки на турніку або полиці — повисіти з нахилом тулуба', description_en: 'Hands on bar or shelf — hang with torso angled', target_hold: 30, target_sets: 3, is_handstand: false, order: 2 },
  { id: eid(130), day_id: did(44), exercise_category_id: CAT.stretching, name_ua: 'Розтяжка шиї і трапеції', name_en: 'Neck & Trap Stretch', description_ua: 'Рука тягне голову в сторону — 30 сек на кожен бік', description_en: 'Hand pulls head to side — 30 sec each side', target_hold: 30, target_sets: 2, is_handstand: false, order: 3 },

  { id: eid(131), day_id: did(45), exercise_category_id: CAT.stretching, name_ua: 'Тест гнучкості: нахил вперед', name_en: 'Flexibility Test: Forward Fold', description_ua: 'Виміряти відстань від долонь до підлоги', description_en: 'Measure distance from palms to floor', target_hold: 30, target_sets: 1, is_handstand: false, order: 1 },
  { id: eid(132), day_id: did(45), exercise_category_id: CAT.stretching, name_ua: 'Тест гнучкості: шпагат', name_en: 'Flexibility Test: Splits', description_ua: 'Записати поточний прогрес у шпагаті', description_en: 'Record current splits progress', target_hold: 60, target_sets: 1, is_handstand: false, order: 2 },
  { id: eid(133), day_id: did(45), exercise_category_id: CAT.stretching, name_ua: 'Повне відновлення', name_en: 'Full Cool Down', description_ua: 'М\'яка розтяжка всього тіла — 15 хв', description_en: 'Gentle full-body stretch — 15 min', target_hold: 30, target_sets: 3, is_handstand: false, order: 3 },
]

// ── Test users config ─────────────────────────────────────────────────────────

const testUsers = [
  {
    email: 'alpha@handbalancer.test',
    password: 'Test1234!',
    name: 'Олексій (Баланс + Prehab)',
    // Enrolled in handstand-beginners + daily-prehab
    // Focuses on: handstand + prehab category
    enrollments: [PROG.handstandBeginners, PROG.prehab],
    // Logs: 28 days, 5-6 days/week
    logDays: [1,2,3,5,6,8,9,10,12,13,15,16,17,19,20,22,23,24,26,27,29,30],
    exercisePool: [
      // handstand exercises
      { id: eid(2),  hold: true,  target: 10, sets: 3 },
      { id: eid(3),  hold: true,  target: 15, sets: 3 },
      { id: eid(6),  hold: true,  target: 10, sets: 3 },
      { id: eid(8),  hold: true,  target: 20, sets: 3 },
      { id: eid(12), hold: true,  target: 20, sets: 3 },
      { id: eid(14), hold: true,  target: 30, sets: 3 },
      { id: eid(17), hold: true,  target: 45, sets: 3 },
      // prehab exercises
      { id: eid(45), hold: false, target: 10, sets: 2 },
      { id: eid(46), hold: true,  target: 30, sets: 2 },
      { id: eid(48), hold: false, target: 10, sets: 2 },
      { id: eid(51), hold: false, target: 10, sets: 3 },
      { id: eid(57), hold: false, target: 10, sets: 1 },
      { id: eid(60), hold: true,  target: 40, sets: 2 },
    ],
  },
  {
    email: 'beta@handbalancer.test',
    password: 'Test1234!',
    name: 'Марія (Сила + Розтяжка)',
    // Enrolled in strength-foundations + full-flexibility
    // Focuses on: conditioning + stretching category
    enrollments: [PROG.conditioning, PROG.flexibility],
    logDays: [1,2,4,5,7,8,10,11,13,14,16,17,19,20,22,23,25,26,28,29],
    exercisePool: [
      // conditioning
      { id: eid(74), hold: false, target: 10, sets: 4 },
      { id: eid(75), hold: false, target: 8,  sets: 3 },
      { id: eid(77), hold: true,  target: 30, sets: 4 },
      { id: eid(79), hold: true,  target: 25, sets: 3 },
      { id: eid(80), hold: false, target: 8,  sets: 4 },
      { id: eid(86), hold: false, target: 20, sets: 1 },
      { id: eid(89), hold: false, target: 10, sets: 5 },
      // flexibility
      { id: eid(104), hold: true,  target: 45, sets: 3 },
      { id: eid(107), hold: true,  target: 45, sets: 3 },
      { id: eid(108), hold: true,  target: 60, sets: 2 },
      { id: eid(112), hold: true,  target: 30, sets: 3 },
      { id: eid(116), hold: false, target: 10, sets: 2 },
      { id: eid(119), hold: true,  target: 60, sets: 2 },
    ],
  },
  {
    email: 'gamma@handbalancer.test',
    password: 'Test1234!',
    name: 'Дмитро (Все потроху)',
    // Enrolled in all programs
    // Well-rounded across all categories
    enrollments: [PROG.handstandBeginners, PROG.conditioning, PROG.prehab],
    logDays: [1,2,3,4,5,7,8,9,10,11,13,14,15,16,17,19,20,21,22,23,25,26,27,28,29],
    exercisePool: [
      // handstand
      { id: eid(6),  hold: true,  target: 10, sets: 3 },
      { id: eid(12), hold: true,  target: 20, sets: 3 },
      { id: eid(15), hold: false, target: 10, sets: 3 },
      // conditioning
      { id: eid(74), hold: false, target: 10, sets: 4 },
      { id: eid(77), hold: true,  target: 30, sets: 4 },
      { id: eid(79), hold: true,  target: 25, sets: 3 },
      { id: eid(80), hold: false, target: 8,  sets: 4 },
      { id: eid(95), hold: true,  target: 10, sets: 5 },
      // prehab
      { id: eid(45), hold: false, target: 10, sets: 2 },
      { id: eid(51), hold: false, target: 10, sets: 3 },
      { id: eid(62), hold: true,  target: 45, sets: 2 },
      // stretching (від flexibility program)
      { id: eid(104), hold: true,  target: 45, sets: 3 },
      { id: eid(109), hold: true,  target: 45, sets: 3 },
    ],
  },
]

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log('1. Upsert programs...')
  const { error: pe } = await supabase.from('programs').upsert(programs, { onConflict: 'id' })
  if (pe) { console.error('Programs:', pe.message); process.exit(1) }

  console.log('2. Upsert weeks...')
  const { error: we } = await supabase.from('weeks').upsert(weeks, { onConflict: 'id' })
  if (we) { console.error('Weeks:', we.message); process.exit(1) }

  console.log('3. Upsert days...')
  const { error: de } = await supabase.from('days').upsert(days, { onConflict: 'id' })
  if (de) { console.error('Days:', de.message); process.exit(1) }

  console.log('4. Upsert exercises...')
  // Insert in batches of 20
  for (let i = 0; i < exercises.length; i += 20) {
    const batch = exercises.slice(i, i + 20)
    const { error: ee } = await supabase.from('exercises').upsert(batch, { onConflict: 'id' })
    if (ee) { console.error('Exercises batch:', ee.message); process.exit(1) }
  }

  console.log('5. Creating test users...')
  for (const user of testUsers) {
    console.log(`   Creating ${user.email}...`)

    // Create user
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { full_name: user.name },
    })

    if (authErr && !authErr.message.includes('already been registered')) {
      console.error('  Auth error:', authErr.message)
      continue
    }

    let userId
    if (authData?.user) {
      userId = authData.user.id
    } else {
      // User exists, get their ID
      const { data: existingUsers } = await supabase.auth.admin.listUsers()
      const found = existingUsers?.users?.find(u => u.email === user.email)
      if (!found) { console.error('  Could not find user:', user.email); continue }
      userId = found.id
    }

    console.log(`   User ID: ${userId}`)

    // Enroll in programs
    for (const programId of user.enrollments) {
      await supabase.from('user_programs').upsert(
        { user_id: userId, program_id: programId },
        { onConflict: 'user_id,program_id' }
      )
    }

    // Generate workout logs
    console.log(`   Generating ${user.logDays.length} days of logs...`)
    const logs = []
    for (const daysBack of user.logDays) {
      // Pick 2-4 random exercises for this day
      const shuffled = [...user.exercisePool].sort(() => Math.random() - 0.5)
      const todayExercises = shuffled.slice(0, rand(2, 4))

      for (const ex of todayExercises) {
        const entry = {
          user_id: userId,
          exercise_id: ex.id,
          logged_at: daysAgo(daysBack),
        }
        if (ex.hold) {
          entry.hold_sets = genHoldSets(ex.target, ex.sets)
        } else {
          entry.reps_sets = genRepsSets(ex.target, ex.sets)
        }
        logs.push(entry)
      }
    }

    // Insert logs in batches
    for (let i = 0; i < logs.length; i += 50) {
      const { error: le } = await supabase.from('workout_logs').insert(logs.slice(i, i + 50))
      if (le) console.error('  Logs batch error:', le.message)
    }

    console.log(`   Done: ${logs.length} logs created`)
  }

  console.log('\nDone! Test users created:')
  for (const u of testUsers) {
    console.log(`  ${u.email} / ${u.password}`)
  }
}

run().catch(console.error)
