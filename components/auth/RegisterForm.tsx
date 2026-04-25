'use client'
// Форма реєстрації
// Поля: ім'я, email, пароль
// supabase.auth.signUp() → профіль створюється автоматично через DB trigger
// name передається у metadata → trigger записує у profiles.name
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }, // trigger читає raw_user_meta_data->>'full_name'
      },
    })

    if (signUpError) { setError(signUpError.message); return }
    router.push('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Ім'я" value={name} onChange={e => setName(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />
      {error && <p>{error}</p>}
      <button type="submit">Зареєструватись</button>
    </form>
  )
}
