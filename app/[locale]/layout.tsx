import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { getMessages, getTranslations } from 'next-intl/server'
import { headers } from 'next/headers'
import { routing } from '@/i18n/routing'
import { getCurrentUser } from '@/lib/services/auth-service'
import { getTrialStatus } from '@/lib/services/subscriptions'
import Navbar from '@/components/layout/Navbar'
import TrialBanner from '@/components/layout/TrialBanner'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  const messages = await getMessages()
  const user = await getCurrentUser()
  const trialStatus = user ? await getTrialStatus(user.id) : null

  // Визначаємо поточний шлях щоб не показувати paywall на /billing
  const h = await headers()
  const pathname = h.get('x-pathname') ?? ''
  const isBillingPage = pathname.startsWith('/billing')
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname.endsWith('/login') ||
    pathname.endsWith('/register')

  // Якщо trial вичерпано і немає підписки — показуємо paywall замість контенту
  const showPaywall = !!trialStatus && !trialStatus.hasAccess && !isBillingPage

  if (showPaywall) {
    const t = await getTranslations('trial')
    return (
      <NextIntlClientProvider messages={messages}>
        {user && !isAuthPage && <Navbar />}
        <main style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
            {t('expiredTitle')}
          </h1>
          <p style={{ color: '#888', fontSize: '0.95rem', marginBottom: '2rem', maxWidth: '360px' }}>
            {t('expiredSub')}
          </p>
          <Link
            href={`/${locale}/billing`}
            style={{ padding: '0.75rem 1.5rem', background: '#39e600', color: '#000', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}
          >
            {t('subscribeCta')} →
          </Link>
        </main>
        {!isAuthPage && <Footer locale={locale} />}
      </NextIntlClientProvider>
    )
  }

  return (
    <NextIntlClientProvider messages={messages}>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {user && !isAuthPage && <Navbar />}
        {trialStatus?.showWarning && trialStatus.trialDaysLeft !== null && (
          <TrialBanner daysLeft={trialStatus.trialDaysLeft} locale={locale} />
        )}
        <div style={{ flex: 1 }}>{children}</div>
        {!isAuthPage && <Footer locale={locale} />}
      </div>
    </NextIntlClientProvider>
  )
}
