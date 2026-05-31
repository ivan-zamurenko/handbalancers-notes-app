// Запуск: SUPABASE_SERVICE_KEY=... node supabase/create-test-users.mjs
// Створює 5 тестових користувачів з різними станами trial/subscription
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://meldhargnvjnmpefrkpn.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// Всі тестові паролі однакові
const TEST_PASSWORD = 'TestUser123!'

const users = [
  {
    email: 'test-active@handbalancers.test',
    name: 'Active Trial User',
    trialDays: 7,
    // Активний trial — 7 днів
  },
  {
    email: 'test-warning@handbalancers.test',
    name: 'Warning Trial User',
    trialDays: 1,
    // Trial закінчується завтра — покаже банер
  },
  {
    email: 'test-expired@handbalancers.test',
    name: 'Expired Trial User',
    trialDays: -1,
    // Trial прострочений — покаже paywall
  },
  {
    email: 'test-subscribed@handbalancers.test',
    name: 'Subscribed User',
    trialDays: -30,
    hasSubscription: true,
    // Trial прострочений але є активна підписка
  },
  {
    email: 'test-new@handbalancers.test',
    name: 'New User',
    trialDays: 14,
    // Новий юзер, тільки зареєстрований
  },
]

async function run() {
  for (const user of users) {
    console.log(`\nCreating ${user.email}...`)

    // 1. Створити auth user через admin API
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: user.email,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: user.name },
    })

    if (authErr) {
      if (authErr.message.includes('already been registered')) {
        console.log(`  ⚠️  Already exists, fetching...`)
        // Get existing user
        const { data: list } = await supabase.auth.admin.listUsers()
        const existing = list.users.find(u => u.email === user.email)
        if (existing) {
          await updateProfile(existing.id, user)
          continue
        }
      }
      console.error(`  ❌ Auth error: ${authErr.message}`)
      continue
    }

    const userId = authData.user.id
    console.log(`  ✓ Auth user created: ${userId}`)

    await updateProfile(userId, user)
  }

  // Summary
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, trial_ends_at')
    .like('email', '%handbalancers.test%')

  console.log('\n=== Test Users Summary ===')
  console.log(`Password for all: ${TEST_PASSWORD}`)
  console.log('')
  profiles?.forEach(p => {
    const daysLeft = p.trial_ends_at
      ? Math.ceil((new Date(p.trial_ends_at) - new Date()) / (1000 * 60 * 60 * 24))
      : null
    console.log(`${p.email}`)
    console.log(`  trial_ends_at: ${p.trial_ends_at} (${daysLeft} days)`)
  })
}

async function updateProfile(userId, user) {
  const trialEndsAt = new Date()
  trialEndsAt.setDate(trialEndsAt.getDate() + user.trialDays)

  // Update profile trial_ends_at
  const { error: profileErr } = await supabase
    .from('profiles')
    .update({ trial_ends_at: trialEndsAt.toISOString() })
    .eq('id', userId)

  if (profileErr) {
    // Profile might not exist yet (trigger creates it)
    const { error: insertErr } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: user.email,
        full_name: user.name,
        trial_ends_at: trialEndsAt.toISOString(),
      })
    if (insertErr) console.error(`  ❌ Profile error: ${insertErr.message}`)
    else console.log(`  ✓ Profile created`)
  } else {
    console.log(`  ✓ Profile updated (trial: ${user.trialDays > 0 ? '+' : ''}${user.trialDays} days)`)
  }

  // Create subscription if needed
  if (user.hasSubscription) {
    const { error: subErr } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        status: 'active',
        plan: 'monthly',
        current_period_start: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        current_period_end: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      })
    if (subErr) console.error(`  ❌ Subscription error: ${subErr.message}`)
    else console.log(`  ✓ Active subscription created`)
  }
}

run().catch(console.error)
