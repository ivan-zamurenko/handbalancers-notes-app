// Сторінка входу в акаунт
// Форма: email + пароль → Supabase signInWithPassword
// Після входу → redirect на /dashboard
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main>
      <h1>Увійти</h1>
      <LoginForm />
    </main>
  )
}
