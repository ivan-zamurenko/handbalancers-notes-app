import { getTranslations } from 'next-intl/server'
import { loginAction } from '@/components/auth/LoginForm'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const t = await getTranslations('auth.login')

  return (
    <main>
      <h1>{t('title')}</h1>
      {error && <p style={{ color: 'red' }}>{decodeURIComponent(error)}</p>}
      <form action={loginAction}>
        <input type="email" name="email" placeholder={t('email')} required />
        <input type="password" name="password" placeholder={t('password')} required />
        <button type="submit">{t('submit')}</button>
      </form>
    </main>
  )
}
