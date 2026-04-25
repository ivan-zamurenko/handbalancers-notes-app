// Сторінка реєстрації нового акаунту
// Форма: ім'я + email + пароль → Supabase signUp
// Після реєстрації → підтвердження email або redirect на /dashboard
import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <main>
      <h1>Реєстрація</h1>
      <RegisterForm />
    </main>
  )
}
