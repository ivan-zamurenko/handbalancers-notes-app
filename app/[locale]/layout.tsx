import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { getUser } from '@/lib/db/auth'
import Navbar from '@/components/layout/Navbar'

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

  const user = await getUser()

  return (
    <NextIntlClientProvider messages={messages}>
      {user && <Navbar />}
      {children}
    </NextIntlClientProvider>
  )
}
