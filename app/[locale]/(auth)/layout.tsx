import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

// Auth layout — ізольований від nav і footer.
// Apple-standard: login/register — чистий екран без зайвих елементів.
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages()
  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
