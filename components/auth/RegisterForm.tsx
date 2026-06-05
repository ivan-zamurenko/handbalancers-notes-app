'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getLocale, getTranslations } from 'next-intl/server'
import { registerWithEmail } from '@/lib/services/auth-service'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function registerAction(formData: FormData) {
  const locale = await getLocale()
  const t = await getTranslations('auth.register')

  const name = (formData.get('name') as string | null)?.trim() ?? ''
  const email = (formData.get('email') as string | null)?.trim() ?? ''
  const password = (formData.get('password') as string | null) ?? ''

  if (!name) redirect(`/${locale}/register?error=` + encodeURIComponent(t('errorNameRequired')))
  if (!email) redirect(`/${locale}/register?error=` + encodeURIComponent(t('errorEmailRequired')))
  if (!EMAIL_REGEX.test(email)) redirect(`/${locale}/register?error=` + encodeURIComponent(t('errorEmailInvalid')))
  if (!password) redirect(`/${locale}/register?error=` + encodeURIComponent(t('errorPasswordRequired')))
  if (password.length < 6) redirect(`/${locale}/register?error=` + encodeURIComponent(t('errorPasswordShort')))

  let authError: string | null = null
  try {
    await registerWithEmail({ email, password, name })
  } catch (err: unknown) {
    authError = err instanceof Error ? err.message : 'Registration failed'
  }

  if (authError) redirect(`/${locale}/register?error=` + encodeURIComponent(authError))

  revalidatePath('/', 'layout')
  redirect(`/${locale}/dashboard`)
}
