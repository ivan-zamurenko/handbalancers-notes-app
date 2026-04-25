// Форма входу
// Поля: email, пароль
// Надсилає дані через supabase.auth.signInWithPassword()
export default function LoginForm() {
  // TODO: стан форми (email, password)
  // TODO: handleSubmit → supabase.auth.signInWithPassword → redirect /dashboard
  return (
    <form>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Пароль" />
      <button type="submit">Увійти</button>
    </form>
  )
}
