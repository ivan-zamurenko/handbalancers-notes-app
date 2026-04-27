import { getTranslations } from 'next-intl/server'
import { registerAction } from '@/components/auth/RegisterForm'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const t = await getTranslations('auth.register')

  return (
    <main>
      <h1>{t('title')}</h1>
      {error && <p style={{ color: 'red' }}>{decodeURIComponent(error)}</p>}
      <form action={registerAction}>
        <input type="text" name="name" placeholder={t('name')} required />
        <input type="email" name="email" placeholder={t('email')} required />
        <input type="password" name="password" placeholder={t('password')} minLength={6} required />
        <button type="submit">{t('submit')}</button>
      </form>
    </main>
  )
}
