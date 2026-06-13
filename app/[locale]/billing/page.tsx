import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import FaqBlock from '@/components/billing/blocks/FaqBlock'
import ValueIntroBlock from '@/components/billing/blocks/ValueIntroBlock'
import PricingCard from '@/components/billing/PricingCard'
import LogoutButton from '@/components/auth/LogoutButton'
import { getCurrentUser } from '@/lib/services/auth-service'
import { getUserSubscription } from '@/lib/services/subscriptions'
import { getSubscriptionPriceId } from '@/lib/services/billing-config'
import { getStreak } from '@/lib/services/training'
import { getDashboardStats } from '@/lib/db/workoutLogs'

type InactiveBlock = 'valueIntro' | 'pricingCard' | 'faq'

export default async function BillingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ success?: string; canceled?: string }>
}) {
  const { locale } = await params
  const { success, canceled } = await searchParams

  const user = await getCurrentUser()
  if (!user) redirect(`/${locale}/login`)

  const t = await getTranslations('billing')
  const navT = await getTranslations('nav')

  const [subscription, streak, stats] = await Promise.all([
    getUserSubscription(user.id),
    getStreak(user.id),
    getDashboardStats(user.id),
  ])
  const priceId = getSubscriptionPriceId()

  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing'

  const validUntil = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString(
        locale === 'ua' ? 'uk-UA' : 'en-US',
        { day: 'numeric', month: 'long', year: 'numeric' }
      )
    : null

  const statusLabel = subscription?.status === 'trialing' ? t('statusTrialing')
    : subscription?.status === 'active' ? t('statusActive')
    : subscription?.status === 'canceled' ? t('statusCanceled')
    : null

  const faqItems = [
    { q: t('faq1q'), a: t('faq1a') },
    { q: t('faq2q'), a: t('faq2a') },
    { q: t('faq3q'), a: t('faq3a') },
  ]
  const inactiveBlocksOrder: InactiveBlock[] = ['valueIntro', 'pricingCard', 'faq']
  const inactiveBlocks: Record<InactiveBlock, JSX.Element> = {
    valueIntro: <ValueIntroBlock headline={t('valueHeadline')} description={t('noSubscription')} />,
    pricingCard: <PricingCard priceId={priceId} locale={locale} />,
    faq: <FaqBlock title={t('faqTitle')} items={faqItems} />,
  }

  return (
    <main style={{ maxWidth: '680px', margin: '0 auto', padding: isActive ? '1.5rem 1.25rem' : '2rem 1.25rem 4rem' }}>

      {isActive ? (
        // ── Акаунт (активна підписка) ──
        <>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>
            {t('titleActive')}
          </h1>

          {success && (
            <div style={{ background: 'rgba(57,230,0,0.07)', border: '1px solid rgba(57,230,0,0.2)', borderRadius: '10px', padding: '0.875rem 1rem', marginBottom: '1.5rem', color: '#39e600', fontWeight: 500 }}>
              {t('successMessage')}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#555', marginBottom: '0.25rem' }}>Email</p>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc' }}>{user.email}</p>
          </div>

          {/* Підписка */}
          <div style={{ border: '1px solid #1e1e1e', borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>Studio Membership</span>
              {statusLabel && (
                <span style={{ fontSize: '0.75rem', color: '#39e600', fontWeight: 600 }}>{statusLabel}</span>
              )}
            </div>
            {validUntil && (
              <p style={{ margin: '0.375rem 0 0', fontSize: '0.8rem', color: '#555' }}>
                {t('validUntil')} {validUntil}
              </p>
            )}
          </div>

          {/* Статистика */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ border: '1px solid #1e1e1e', borderRadius: '14px', padding: '1rem 1.25rem' }}>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{streak}</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#555' }}>{t('streakLabel')}</p>
            </div>
            <div style={{ border: '1px solid #1e1e1e', borderRadius: '14px', padding: '1rem 1.25rem' }}>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{stats.totalSessions}</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#555' }}>{t('totalSessions')}</p>
            </div>
          </div>

          {/* Вийти */}
          <div style={{ paddingTop: '0.5rem' }}>
            <LogoutButton label={navT('logout')} />
          </div>
        </>
      ) : (
        // ── Paywall (без підписки) ──
        <>
          <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 0.75rem' }}>
              {t('title')}
            </h1>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
              {t('subtitle')}
            </p>
          </div>

          {canceled && (
            <div style={{ background: 'rgba(255,200,0,0.06)', border: '1px solid rgba(255,200,0,0.15)', borderRadius: '10px', padding: '0.875rem 1rem', marginBottom: '1.5rem', color: '#f5a623' }}>
              {t('canceledMessage')}
            </div>
          )}

          {inactiveBlocksOrder.map(block => (
            <div key={block}>{inactiveBlocks[block]}</div>
          ))}

          <div style={{ paddingTop: '2rem', borderTop: '1px solid #1a1a1a', marginTop: '0.5rem' }}>
            <LogoutButton label={navT('logout')} />
          </div>
        </>
      )}
    </main>
  )
}
