// Run: SUPABASE_URL=... SERVICE_ROLE_KEY=... node supabase/run-seed.mjs
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SERVICE_ROLE_KEY env vars')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

async function run() {
  console.log('🗑  Clearing existing data...')
  await supabase.from('workout_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('user_programs').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('exercises').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('days').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('weeks').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('programs').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  // ── CATEGORIES ──────────────────────────────────────────────────────────────
  console.log('📁 Inserting categories...')
  const { error: catErr } = await supabase.from('categories').insert([
    { id: '00000000-0000-0000-0000-000000000001', slug: 'handstand', title_ua: 'Стійка на руках', title_en: 'Handstand', description_ua: 'Стійка на руках з нуля до впевненого балансу', description_en: 'From zero to confident freestanding handstand', order: 1 },
    { id: '00000000-0000-0000-0000-000000000002', slug: 'stretching', title_ua: 'Розтяжка', title_en: 'Stretching', description_ua: 'Гнучкість і мобільність для всього тіла', description_en: 'Flexibility and mobility for the whole body', order: 2 },
    { id: '00000000-0000-0000-0000-000000000003', slug: 'strength', title_ua: 'Сила', title_en: 'Strength', description_ua: 'Базова силова підготовка', description_en: 'Foundational strength training', order: 3 },
  ])
  if (catErr) { console.error('Categories error:', catErr.message); process.exit(1) }

  // ── PROGRAMS ─────────────────────────────────────────────────────────────────
  console.log('📋 Inserting programs...')
  const { error: progErr } = await supabase.from('programs').insert([
    { id: '00000000-0000-0000-0001-000000000001', category_id: '00000000-0000-0000-0000-000000000001', slug: 'handstand-beginners', title_ua: 'Стійка для початківців', title_en: 'Handstand for Beginners', description_ua: "Перша програма: зміцнення зап'ястків, лінія тіла, kick-up до стіни", description_en: 'First program: wrist strengthening, body line, kick-up to wall', level: 'beginner', is_free: true, order: 1 },
    { id: '00000000-0000-0000-0001-000000000002', category_id: '00000000-0000-0000-0000-000000000001', slug: 'freestanding-handstand', title_ua: 'Вільна стійка', title_en: 'Freestanding Handstand', description_ua: 'Баланс без стіни: робота з пальцями, плечима, корпусом', description_en: 'Balance without wall: fingers, shoulders, core control', level: 'intermediate', is_free: false, order: 2 },
    { id: '00000000-0000-0000-0001-000000000003', category_id: '00000000-0000-0000-0000-000000000002', slug: 'basic-flexibility', title_ua: 'Базова гнучкість', title_en: 'Basic Flexibility', description_ua: 'Розтяжка на кожен день: шпагат, прогин, мобільність плечей', description_en: 'Daily stretching: splits, backbend, shoulder mobility', level: 'beginner', is_free: true, order: 1 },
  ])
  if (progErr) { console.error('Programs error:', progErr.message); process.exit(1) }

  // ── WEEKS ────────────────────────────────────────────────────────────────────
  console.log('📅 Inserting weeks...')
  const { error: weeksErr } = await supabase.from('weeks').insert([
    { id: '00000000-0000-0000-0002-000000000001', program_id: '00000000-0000-0000-0001-000000000001', title_ua: 'Тиждень 1 — Підготовка', title_en: 'Week 1 — Foundation', order: 1 },
    { id: '00000000-0000-0000-0002-000000000002', program_id: '00000000-0000-0000-0001-000000000001', title_ua: 'Тиждень 2 — Kick-up', title_en: 'Week 2 — Kick-up', order: 2 },
    { id: '00000000-0000-0000-0002-000000000003', program_id: '00000000-0000-0000-0001-000000000001', title_ua: 'Тиждень 3 — Баланс і контроль', title_en: 'Week 3 — Balance & Control', order: 3 },
    { id: '00000000-0000-0000-0002-000000000004', program_id: '00000000-0000-0000-0001-000000000001', title_ua: 'Тиждень 4 — Перший відрив', title_en: 'Week 4 — First Freestand', order: 4 },
  ])
  if (weeksErr) { console.error('Weeks error:', weeksErr.message); process.exit(1) }

  // ── DAYS ─────────────────────────────────────────────────────────────────────
  console.log('📆 Inserting days...')
  const { error: daysErr } = await supabase.from('days').insert([
    // Week 1
    { id: '00000000-0000-0000-0003-000000000001', week_id: '00000000-0000-0000-0002-000000000001', title_ua: "День 1 — Зап'ястки і плечі", title_en: 'Day 1 — Wrists & Shoulders', order: 1 },
    { id: '00000000-0000-0000-0003-000000000002', week_id: '00000000-0000-0000-0002-000000000001', title_ua: 'День 2 — Лінія тіла', title_en: 'Day 2 — Body Line', order: 2 },
    { id: '00000000-0000-0000-0003-000000000003', week_id: '00000000-0000-0000-0002-000000000001', title_ua: 'День 3 — Опора на руки', title_en: 'Day 3 — Weight on Hands', order: 3 },
    // Week 2
    { id: '00000000-0000-0000-0003-000000000004', week_id: '00000000-0000-0000-0002-000000000002', title_ua: 'День 4 — Kick-up до стіни', title_en: 'Day 4 — Kick-up to Wall', order: 1 },
    { id: '00000000-0000-0000-0003-000000000005', week_id: '00000000-0000-0000-0002-000000000002', title_ua: 'День 5 — Тримання біля стіни', title_en: 'Day 5 — Wall Hold', order: 2 },
    // Week 3
    { id: '00000000-0000-0000-0003-000000000006', week_id: '00000000-0000-0000-0002-000000000003', title_ua: 'День 1 — Пальці і зсув ваги', title_en: 'Day 1 — Fingers & Weight Shifts', order: 1 },
    { id: '00000000-0000-0000-0003-000000000007', week_id: '00000000-0000-0000-0002-000000000003', title_ua: 'День 2 — Сила плечей', title_en: 'Day 2 — Shoulder Strength', order: 2 },
    { id: '00000000-0000-0000-0003-000000000008', week_id: '00000000-0000-0000-0002-000000000003', title_ua: 'День 3 — Рівновага', title_en: 'Day 3 — Balance Drills', order: 3 },
    { id: '00000000-0000-0000-0003-000000000009', week_id: '00000000-0000-0000-0002-000000000003', title_ua: 'День 4 — Одноручна підготовка', title_en: 'Day 4 — One-Arm Prep', order: 4 },
    { id: '00000000-0000-0000-0003-000000000010', week_id: '00000000-0000-0000-0002-000000000003', title_ua: 'День 5 — Інтеграція', title_en: 'Day 5 — Integration', order: 5 },
    // Week 4
    { id: '00000000-0000-0000-0003-000000000011', week_id: '00000000-0000-0000-0002-000000000004', title_ua: 'День 1 — Перший відрив від стіни', title_en: 'Day 1 — First Step Away', order: 1 },
    { id: '00000000-0000-0000-0003-000000000012', week_id: '00000000-0000-0000-0002-000000000004', title_ua: 'День 2 — Мікробаланс', title_en: 'Day 2 — Micro Balance', order: 2 },
    { id: '00000000-0000-0000-0003-000000000013', week_id: '00000000-0000-0000-0002-000000000004', title_ua: 'День 3 — Серії без стіни', title_en: 'Day 3 — Freestand Sets', order: 3 },
    { id: '00000000-0000-0000-0003-000000000014', week_id: '00000000-0000-0000-0002-000000000004', title_ua: 'День 4 — Контроль падіння', title_en: 'Day 4 — Fall Control', order: 4 },
    { id: '00000000-0000-0000-0003-000000000015', week_id: '00000000-0000-0000-0002-000000000004', title_ua: 'День 5 — Фінальний тест', title_en: 'Day 5 — Final Test', order: 5 },
  ])
  if (daysErr) { console.error('Days error:', daysErr.message); process.exit(1) }

  // ── EXERCISES ────────────────────────────────────────────────────────────────
  console.log('💪 Inserting exercises...')
  const exercises = [
    // Day 1 — Wrists & Shoulders
    { id: '00000000-0000-0000-0004-000000000001', day_id: '00000000-0000-0000-0003-000000000001', name_ua: "Розминка зап'ястків", name_en: 'Wrist Warm-up', description_ua: 'Кола, згинання, розгинання — по 10 повторень у кожну сторону', description_en: 'Circles, flexion, extension — 10 reps each direction', target_hold: null, target_reps: 10, target_sets: 2, youtube_url: 'https://www.youtube.com/watch?v=mSZWSQSSEjE', is_handstand: false, order: 1 },
    { id: '00000000-0000-0000-0004-000000000002', day_id: '00000000-0000-0000-0003-000000000001', name_ua: 'Planche lean', name_en: 'Planche Lean', description_ua: 'Нахил вперед на прямих руках — тримати рівновагу', description_en: 'Lean forward on straight arms — hold the balance', target_hold: 10, target_reps: null, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=B6JVHmZWjIY', is_handstand: false, order: 2 },
    { id: '00000000-0000-0000-0004-000000000003', day_id: '00000000-0000-0000-0003-000000000001', name_ua: 'Pike hold', name_en: 'Pike Hold', description_ua: 'Стійка в складці на руках біля стіни', description_en: 'Pike position hold with hands near the wall', target_hold: 15, target_reps: null, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=5fmOH2a57hI', is_handstand: true, order: 3 },
    // Day 2 — Body Line
    { id: '00000000-0000-0000-0004-000000000004', day_id: '00000000-0000-0000-0003-000000000002', name_ua: 'Hollow body hold', name_en: 'Hollow Body Hold', description_ua: 'Лежачи на спині — підняти руки і ноги, тримати тіло як банан', description_en: 'Lying on back — raise arms and legs, hold banana shape', target_hold: 20, target_reps: null, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=LlDNef_Ztsc', is_handstand: false, order: 1 },
    { id: '00000000-0000-0000-0004-000000000005', day_id: '00000000-0000-0000-0003-000000000002', name_ua: 'Superman hold', name_en: 'Superman Hold', description_ua: 'Лежачи на животі — підняти руки і ноги вгору', description_en: 'Lying on stomach — raise arms and legs up', target_hold: 15, target_reps: null, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=cc6UVRS7PW4', is_handstand: false, order: 2 },
    // Day 3 — Weight on Hands
    { id: '00000000-0000-0000-0004-000000000006', day_id: '00000000-0000-0000-0003-000000000003', name_ua: 'Поза жаби', name_en: 'Frog Stand', description_ua: 'Коліна на ліктях, руки на підлозі — утримувати рівновагу', description_en: 'Knees on elbows, hands on floor — hold the balance', target_hold: 10, target_reps: null, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=tVPVl_VIXFE', is_handstand: false, order: 1 },
    { id: '00000000-0000-0000-0004-000000000007', day_id: '00000000-0000-0000-0003-000000000003', name_ua: 'Відтискання з широкою постановкою', name_en: 'Wide Push-ups', description_ua: 'Руки ширше плечей — контроль лопаток і протракція', description_en: 'Hands wider than shoulders — scapular control and protraction', target_hold: null, target_reps: 10, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=_l3ySVKYVJ8', is_handstand: false, order: 2 },
    { id: '00000000-0000-0000-0004-000000000008', day_id: '00000000-0000-0000-0003-000000000003', name_ua: 'Pike pike handstand (з підвищення)', name_en: 'Elevated Pike Hold', description_ua: 'Ноги на лаві або стільці, руки на підлозі — утримувати позицію', description_en: 'Feet on bench or chair, hands on floor — hold the position', target_hold: 20, target_reps: null, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=5fmOH2a57hI', is_handstand: true, order: 3 },
    // Day 4 — Kick-up to Wall
    { id: '00000000-0000-0000-0004-000000000009', day_id: '00000000-0000-0000-0003-000000000004', name_ua: 'Donkey kicks', name_en: 'Donkey Kicks', description_ua: 'З положення нахилу — поштовх ногами вгору без доходу до стіни', description_en: 'From bent position — kick legs up without reaching the wall', target_hold: null, target_reps: 8, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=A_gGFhL5dB4', is_handstand: false, order: 1 },
    { id: '00000000-0000-0000-0004-000000000010', day_id: '00000000-0000-0000-0003-000000000004', name_ua: 'Вихід в стійку до стіни', name_en: 'Kick-up to Wall', description_ua: 'Повний kick-up з доходом до стіни і утриманням', description_en: 'Full kick-up reaching the wall and holding', target_hold: null, target_reps: 5, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=d9s6h7rMhZU', is_handstand: true, order: 2 },
    { id: '00000000-0000-0000-0004-000000000011', day_id: '00000000-0000-0000-0003-000000000004', name_ua: 'Стійка біля стіни (спиною)', name_en: 'Back-to-Wall Handstand', description_ua: 'Стійка спиною до стіни — контроль лінії тіла', description_en: 'Handstand with back to wall — body line control', target_hold: 15, target_reps: null, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=d9s6h7rMhZU', is_handstand: true, order: 3 },
    // Day 5 — Wall Hold
    { id: '00000000-0000-0000-0004-000000000012', day_id: '00000000-0000-0000-0003-000000000005', name_ua: 'Стійка обличчям до стіни', name_en: 'Chest-to-Wall Handstand', description_ua: 'Руки впритул до стіни — відпрацювання вирівнювання', description_en: 'Hands close to wall — alignment practice', target_hold: 20, target_reps: null, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=BGt0DxbFGbA', is_handstand: true, order: 1 },
    { id: '00000000-0000-0000-0004-000000000013', day_id: '00000000-0000-0000-0003-000000000005', name_ua: 'Підйоми плечей в стійці', name_en: 'Shoulder Shrugs in Handstand', description_ua: 'У стійці біля стіни — підйоми і опускання через лопатки', description_en: 'In handstand at wall — elevate and depress through shoulder blades', target_hold: null, target_reps: 10, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=BGt0DxbFGbA', is_handstand: true, order: 2 },
    { id: '00000000-0000-0000-0004-000000000014', day_id: '00000000-0000-0000-0003-000000000005', name_ua: 'Тривале утримання біля стіни', name_en: 'Long Wall Handstand Hold', description_ua: 'Максимально довге утримання стійки біля стіни з контролем дихання', description_en: 'Maximum hold at wall with breath control', target_hold: 30, target_reps: null, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=BGt0DxbFGbA', is_handstand: true, order: 3 },
    // Week 3, Day 1
    { id: '00000000-0000-0000-0004-000000000015', day_id: '00000000-0000-0000-0003-000000000006', name_ua: 'Натискання пальцями', name_en: 'Finger Press', description_ua: 'У стійці біля стіни — свідомо перекладати вагу на подушечки пальців і назад на долоні', description_en: 'In wall handstand — consciously shift weight to fingertips and back to palm', target_hold: null, target_reps: 10, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=BGt0DxbFGbA', is_handstand: true, order: 1 },
    { id: '00000000-0000-0000-0004-000000000016', day_id: '00000000-0000-0000-0003-000000000006', name_ua: 'Зсув ваги вбік', name_en: 'Lateral Weight Shifts', description_ua: 'У стійці біля стіни — повільно переносити вагу з однієї руки на іншу', description_en: 'In wall handstand — slowly shift weight from one hand to the other', target_hold: null, target_reps: 8, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=BGt0DxbFGbA', is_handstand: true, order: 2 },
    { id: '00000000-0000-0000-0004-000000000017', day_id: '00000000-0000-0000-0003-000000000006', name_ua: 'Тривале утримання з диханням', name_en: 'Long Hold with Breathing', description_ua: 'Стійка біля стіни — контролювати дихання, не затримувати', description_en: 'Wall handstand — control breathing, do not hold breath', target_hold: 45, target_reps: null, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=BGt0DxbFGbA', is_handstand: true, order: 3 },
    // Week 3, Day 2
    { id: '00000000-0000-0000-0004-000000000018', day_id: '00000000-0000-0000-0003-000000000007', name_ua: 'Протракція лопаток', name_en: 'Scapular Protraction', description_ua: 'В упорі лежачи — виштовхувати лопатки вгору, утримувати 2 сек', description_en: 'In push-up position — push shoulder blades up, hold 2 sec', target_hold: null, target_reps: 10, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=_l3ySVKYVJ8', is_handstand: false, order: 1 },
    { id: '00000000-0000-0000-0004-000000000019', day_id: '00000000-0000-0000-0003-000000000007', name_ua: 'Pike push-up', name_en: 'Pike Push-up', description_ua: 'В позиції перевернутої V — відтискання з акцентом на плечі', description_en: 'In inverted V position — push-ups targeting shoulders', target_hold: null, target_reps: 8, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=sposDXWEB0A', is_handstand: false, order: 2 },
    { id: '00000000-0000-0000-0004-000000000020', day_id: '00000000-0000-0000-0003-000000000007', name_ua: 'Стійка з підвищення', name_en: 'Elevated Pike Hold', description_ua: 'Ноги на лаві, руки на підлозі — поступово збільшувати час', description_en: 'Feet on bench, hands on floor — gradually increase time', target_hold: 30, target_reps: null, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=5fmOH2a57hI', is_handstand: true, order: 3 },
    // Week 3, Day 3
    { id: '00000000-0000-0000-0004-000000000021', day_id: '00000000-0000-0000-0003-000000000008', name_ua: 'Стійка жаби (тривала)', name_en: 'Frog Stand (Extended)', description_ua: 'Коліна на ліктях — утримувати рівновагу якомога довше', description_en: 'Knees on elbows — hold balance as long as possible', target_hold: 20, target_reps: null, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=tVPVl_VIXFE', is_handstand: false, order: 1 },
    { id: '00000000-0000-0000-0004-000000000022', day_id: '00000000-0000-0000-0003-000000000008', name_ua: 'Kick-up з контрольованим поверненням', name_en: 'Kick-up with Controlled Descent', description_ua: 'Підйом у стійку до стіни і повільне повернення — не падати, а опускатися', description_en: 'Kick up to wall and slowly lower down — controlled descent, not fall', target_hold: null, target_reps: 6, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=d9s6h7rMhZU', is_handstand: true, order: 2 },
    { id: '00000000-0000-0000-0004-000000000023', day_id: '00000000-0000-0000-0003-000000000008', name_ua: 'Стійка обличчям до стіни (тривала)', name_en: 'Chest-to-Wall (Extended)', description_ua: 'Руки впритул до стіни — максимальний час утримання', description_en: 'Hands close to wall — maximum hold time', target_hold: 40, target_reps: null, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=BGt0DxbFGbA', is_handstand: true, order: 3 },
    // Week 3, Day 4
    { id: '00000000-0000-0000-0004-000000000024', day_id: '00000000-0000-0000-0003-000000000009', name_ua: 'Поза жаби на одній руці', name_en: 'One-Arm Frog Stand', description_ua: 'Спроба підняти одну руку в позі жаби — хоча б на 1 секунду', description_en: 'Attempt to lift one hand in frog stand — even for 1 second', target_hold: 3, target_reps: null, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=tVPVl_VIXFE', is_handstand: false, order: 1 },
    { id: '00000000-0000-0000-0004-000000000025', day_id: '00000000-0000-0000-0003-000000000009', name_ua: 'Боковий зсув у стійці', name_en: 'Side Lean in Handstand', description_ua: 'У стійці біля стіни — нахилятися вбік, переносячи вагу на одну руку', description_en: 'In wall handstand — lean sideways, loading one arm at a time', target_hold: null, target_reps: 8, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=BGt0DxbFGbA', is_handstand: true, order: 2 },
    { id: '00000000-0000-0000-0004-000000000026', day_id: '00000000-0000-0000-0003-000000000009', name_ua: 'Hollow body на одній нозі', name_en: 'Single-Leg Hollow Body', description_ua: 'Hollow body з однією ногою піднятою вище — активує ассиметричний контроль корпусу', description_en: 'Hollow body with one leg raised higher — trains asymmetric core control', target_hold: 15, target_reps: null, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=LlDNef_Ztsc', is_handstand: false, order: 3 },
    // Week 3, Day 5
    { id: '00000000-0000-0000-0004-000000000027', day_id: '00000000-0000-0000-0003-000000000010', name_ua: "Розминка зап'ястків і плечей", name_en: 'Wrist & Shoulder Warm-up', description_ua: "Повна розминка: кола зап'ястками, протракція, обертання плечей", description_en: 'Full warm-up: wrist circles, protraction, shoulder rotations', target_hold: null, target_reps: 10, target_sets: 2, youtube_url: 'https://www.youtube.com/watch?v=mSZWSQSSEjE', is_handstand: false, order: 1 },
    { id: '00000000-0000-0000-0004-000000000028', day_id: '00000000-0000-0000-0003-000000000010', name_ua: 'Серія kick-up до стіни', name_en: 'Kick-up Series', description_ua: '5 підходів по 5 kick-up до стіни з утриманням кожного', description_en: '5 sets of 5 kick-ups to wall, holding each rep', target_hold: null, target_reps: 5, target_sets: 5, youtube_url: 'https://www.youtube.com/watch?v=d9s6h7rMhZU', is_handstand: true, order: 2 },
    { id: '00000000-0000-0000-0004-000000000029', day_id: '00000000-0000-0000-0003-000000000010', name_ua: 'Максимальне утримання', name_en: 'Max Hold', description_ua: 'Один підхід — максимально довге утримання стійки біля стіни', description_en: 'One set — maximum handstand hold at wall', target_hold: 60, target_reps: null, target_sets: 1, youtube_url: 'https://www.youtube.com/watch?v=BGt0DxbFGbA', is_handstand: true, order: 3 },
    // Week 4, Day 1
    { id: '00000000-0000-0000-0004-000000000030', day_id: '00000000-0000-0000-0003-000000000011', name_ua: "Стійка з однією п'ятою від стіни", name_en: 'One Heel Off Wall', description_ua: "У стійці спиною до стіни — відірвати одну п'яту і тримати рівновагу", description_en: 'In back-to-wall handstand — lift one heel off wall and balance', target_hold: 5, target_reps: null, target_sets: 5, youtube_url: 'https://www.youtube.com/watch?v=d9s6h7rMhZU', is_handstand: true, order: 1 },
    { id: '00000000-0000-0000-0004-000000000031', day_id: '00000000-0000-0000-0003-000000000011', name_ua: "Стійка з двома п'ятами від стіни", name_en: 'Both Heels Off Wall', description_ua: "Обидві п'яти від стіни — утримувати рівновагу пальцями", description_en: 'Both heels off wall — balance using finger pressure', target_hold: 3, target_reps: null, target_sets: 5, youtube_url: 'https://www.youtube.com/watch?v=d9s6h7rMhZU', is_handstand: true, order: 2 },
    { id: '00000000-0000-0000-0004-000000000032', day_id: '00000000-0000-0000-0003-000000000011', name_ua: 'Kick-up від стіни', name_en: 'Kick Away from Wall', description_ua: 'Підйом у стійку і спроба відійти від стіни хоча б на 2 секунди', description_en: 'Kick up and attempt to step away from wall for at least 2 seconds', target_hold: 2, target_reps: null, target_sets: 5, youtube_url: 'https://www.youtube.com/watch?v=d9s6h7rMhZU', is_handstand: true, order: 3 },
    // Week 4, Day 2
    { id: '00000000-0000-0000-0004-000000000033', day_id: '00000000-0000-0000-0003-000000000012', name_ua: 'Балансування на паралельних брусках', name_en: 'Balance on Parallettes', description_ua: 'Стійка на паралельних брусках або книгах — більша стабільність для практики', description_en: 'Handstand on parallettes or books — more stability for balance practice', target_hold: 5, target_reps: null, target_sets: 5, youtube_url: 'https://www.youtube.com/watch?v=B6JVHmZWjIY', is_handstand: true, order: 1 },
    { id: '00000000-0000-0000-0004-000000000034', day_id: '00000000-0000-0000-0003-000000000012', name_ua: 'Пошук балансової точки', name_en: 'Finding the Balance Point', description_ua: 'Без стіни — повільні kick-up і пошук точки рівноваги без утримання', description_en: 'Without wall — slow kick-ups finding the balance point without holding', target_hold: null, target_reps: 8, target_sets: 4, youtube_url: 'https://www.youtube.com/watch?v=d9s6h7rMhZU', is_handstand: true, order: 2 },
    { id: '00000000-0000-0000-0004-000000000035', day_id: '00000000-0000-0000-0003-000000000012', name_ua: 'Стійка жаби до стійки на руках', name_en: 'Frog to Handstand', description_ua: 'З пози жаби — спроба випрямитися у стійку на руках', description_en: 'From frog stand — attempt to press into handstand', target_hold: null, target_reps: 5, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=tVPVl_VIXFE', is_handstand: true, order: 3 },
    // Week 4, Day 3
    { id: '00000000-0000-0000-0004-000000000036', day_id: '00000000-0000-0000-0003-000000000013', name_ua: 'Серії вільної стійки', name_en: 'Freestand Sets', description_ua: '10 спроб вільної стійки поспіль — фокус на якість входу, не тривалість', description_en: '10 freestand attempts in a row — focus on entry quality, not duration', target_hold: null, target_reps: 10, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=d9s6h7rMhZU', is_handstand: true, order: 1 },
    { id: '00000000-0000-0000-0004-000000000037', day_id: '00000000-0000-0000-0003-000000000013', name_ua: 'Утримання 3–5 секунд', name_en: '3–5 Second Holds', description_ua: 'Ціль — хоча б 3 секунди вільної стійки без доторкання до стіни', description_en: 'Goal — at least 3 seconds of freestanding handstand without touching wall', target_hold: 5, target_reps: null, target_sets: 5, youtube_url: 'https://www.youtube.com/watch?v=d9s6h7rMhZU', is_handstand: true, order: 2 },
    { id: '00000000-0000-0000-0004-000000000038', day_id: '00000000-0000-0000-0003-000000000013', name_ua: 'Відновлення після падіння', name_en: 'Recovery after Fall', description_ua: 'Практика повернення в стійку після відхилення — відновлення балансу', description_en: 'Practice returning to balance after overbalancing — balance recovery', target_hold: null, target_reps: 8, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=d9s6h7rMhZU', is_handstand: true, order: 3 },
    // Week 4, Day 4
    { id: '00000000-0000-0000-0004-000000000039', day_id: '00000000-0000-0000-0003-000000000014', name_ua: 'Вихід через перекид', name_en: 'Forward Roll Out', description_ua: 'Навмисне падіння вперед через перекид — безпечний вихід з вільної стійки', description_en: 'Intentional forward fall into a forward roll — safe exit from freestanding handstand', target_hold: null, target_reps: 8, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=d9s6h7rMhZU', is_handstand: false, order: 1 },
    { id: '00000000-0000-0000-0004-000000000040', day_id: '00000000-0000-0000-0003-000000000014', name_ua: 'Пірует-вихід', name_en: 'Pirouette Out', description_ua: 'Поворот на 90° з виходом — просунутіший безпечний вихід', description_en: '90° turn out of handstand — more advanced safe exit', target_hold: null, target_reps: 6, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=d9s6h7rMhZU', is_handstand: true, order: 2 },
    { id: '00000000-0000-0000-0004-000000000041', day_id: '00000000-0000-0000-0003-000000000014', name_ua: 'Практика вільної стійки з безпечним падінням', name_en: 'Freestand with Safe Fall', description_ua: 'Вільна стійка з заздалегідь запланованим виходом — перекид або пірует', description_en: 'Freestanding handstand with pre-planned exit — roll or pirouette', target_hold: null, target_reps: 8, target_sets: 4, youtube_url: 'https://www.youtube.com/watch?v=d9s6h7rMhZU', is_handstand: true, order: 3 },
    // Week 4, Day 5
    { id: '00000000-0000-0000-0004-000000000042', day_id: '00000000-0000-0000-0003-000000000015', name_ua: 'Розминка 5 хвилин', name_en: '5-Minute Warm-up', description_ua: "Зап'ястки, плечі, hollow body — стандартна розминка перед стійкою", description_en: 'Wrists, shoulders, hollow body — standard handstand warm-up', target_hold: null, target_reps: 10, target_sets: 2, youtube_url: 'https://www.youtube.com/watch?v=mSZWSQSSEjE', is_handstand: false, order: 1 },
    { id: '00000000-0000-0000-0004-000000000043', day_id: '00000000-0000-0000-0003-000000000015', name_ua: 'Максимальна вільна стійка', name_en: 'Max Freestand', description_ua: 'Три спроби максимального утримання вільної стійки — записати кращий результат', description_en: 'Three attempts at maximum freestanding hold — record your best time', target_hold: 10, target_reps: null, target_sets: 3, youtube_url: 'https://www.youtube.com/watch?v=d9s6h7rMhZU', is_handstand: true, order: 2 },
    { id: '00000000-0000-0000-0004-000000000044', day_id: '00000000-0000-0000-0003-000000000015', name_ua: 'Заминка і розтяжка плечей', name_en: 'Cool Down & Shoulder Stretch', description_ua: 'Розтяжка грудних, плечей і зап\'ястків після тренування', description_en: 'Stretch chest, shoulders and wrists after training', target_hold: 30, target_reps: null, target_sets: 2, youtube_url: 'https://www.youtube.com/watch?v=mSZWSQSSEjE', is_handstand: false, order: 3 },
  ]

  const { error: exErr } = await supabase.from('exercises').insert(exercises)
  if (exErr) { console.error('Exercises error:', exErr.message); process.exit(1) }

  console.log('✅ Seed complete!')
  console.log(`   Categories: 3`)
  console.log(`   Programs: 3`)
  console.log(`   Weeks: 4`)
  console.log(`   Days: 15`)
  console.log(`   Exercises: ${exercises.length}`)
}

run().catch(e => { console.error(e); process.exit(1) })
