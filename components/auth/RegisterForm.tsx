// Форма реєстрації
// Поля: ім'я, email, пароль
// Надсилає дані через supabase.auth.signUp() та записує профіль у таблицю `profiles`
export default function RegisterForm() {
  // TODO: стан форми (name, email, password)
  // TODO: handleSubmit → supabase.auth.signUp → insert into profiles → redirect
  return (
    <form>
      <input type="text" placeholder="Ім'я" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Пароль" />
      <button type="submit">Зареєструватись</button>
    </form>
  )
}
