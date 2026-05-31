-- ============================================================
-- Trial Testing Commands
-- Запускати в Supabase SQL Editor під час розробки
-- Підставляти свій email замість 'your@email.com'
-- ============================================================

-- 1. ПЕРЕГЛЯНУТИ ПОТОЧНИЙ СТАН TRIAL
-- ============================================================
SELECT
  p.id,
  u.email,
  p.trial_ends_at,
  p.trial_ends_at - now() AS time_left,
  CASE
    WHEN p.trial_ends_at > now() THEN 'ACTIVE ✅'
    ELSE 'EXPIRED ❌'
  END AS trial_status,
  s.status AS subscription_status
FROM profiles p
JOIN auth.users u ON u.id = p.id
LEFT JOIN subscriptions s ON s.user_id = p.id
ORDER BY u.created_at DESC;


-- 2. СТАН: Trial активний (нормальний — щойно зареєструвався)
-- ============================================================
UPDATE profiles
SET trial_ends_at = now() + interval '7 days'
WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');


-- 3. СТАН: Trial закінчується завтра (показати банер ⚠️)
-- ============================================================
UPDATE profiles
SET trial_ends_at = now() + interval '1 day'
WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');


-- 4. СТАН: Trial закінчується через 2 дні (теж показати банер ⚠️)
-- ============================================================
UPDATE profiles
SET trial_ends_at = now() + interval '2 days'
WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');


-- 5. СТАН: Trial вичерпано (показати paywall 🔒)
-- ============================================================
UPDATE profiles
SET trial_ends_at = now() - interval '1 minute'
WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');


-- 6. ВІДНОВИТИ ДОСТУП (прибрати paywall — для продовження розробки)
-- ============================================================
UPDATE profiles
SET trial_ends_at = now() + interval '30 days'
WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');


-- 7. СИМУЛЮВАТИ АКТИВНУ ПІДПИСКУ (bypass trial check)
-- ============================================================
-- Спочатку вичерпати trial:
UPDATE profiles
SET trial_ends_at = now() - interval '1 day'
WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');

-- Потім додати підписку:
INSERT INTO subscriptions (user_id, stripe_customer_id, stripe_subscription_id, status, current_period_end)
SELECT
  id,
  'cus_test_' || substr(id::text, 1, 8),
  'sub_test_' || substr(id::text, 1, 8),
  'active',
  now() + interval '30 days'
FROM auth.users
WHERE email = 'your@email.com'
ON CONFLICT (stripe_subscription_id) DO UPDATE SET status = 'active', current_period_end = now() + interval '30 days';


-- 8. СКАСУВАТИ ПІДПИСКУ (перевірити що paywall з''являється якщо trial теж вичерпано)
-- ============================================================
UPDATE subscriptions
SET status = 'canceled'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your@email.com');


-- 9. ПЕРЕВІРИТИ ПОВНИЙ СТАН ЮЗЕРА
-- ============================================================
SELECT
  u.email,
  p.trial_ends_at,
  ROUND(EXTRACT(EPOCH FROM (p.trial_ends_at - now())) / 86400, 1) AS days_left,
  s.status AS sub_status,
  s.current_period_end AS sub_ends_at
FROM auth.users u
JOIN profiles p ON p.id = u.id
LEFT JOIN subscriptions s ON s.user_id = u.id
WHERE u.email = 'your@email.com';
