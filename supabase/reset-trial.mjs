// Resets trial_ends_at to 7 days from now for all users — dev use only
// Run: SUPABASE_URL=... SERVICE_ROLE_KEY=... node supabase/reset-trial.mjs
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SERVICE_ROLE_KEY env vars')
  process.exit(1)
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

const trialEndsAt = new Date(Date.now() + 7 * 86_400_000).toISOString()

const { data, error } = await supabase
  .from('profiles')
  .update({ trial_ends_at: trialEndsAt })
  .neq('id', '00000000-0000-0000-0000-000000000000')
  .select('id')

if (error) { console.error(error.message); process.exit(1) }
console.log(`✅ Trial extended (+7 days) for ${data.length} user(s)`)
