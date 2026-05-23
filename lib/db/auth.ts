// Pattern: Repository — ізолює всі Supabase auth виклики від решти коду
import { createClient } from '@/lib/supabase-server'

/** Авторизує користувача за email та паролем. Кидає помилку якщо невірні дані. */
export async function signIn(email: string, password: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

/** Реєструє нового користувача. Кидає помилку якщо email вже зайнятий. */
export async function signUp(email: string, password: string, name: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  })
  if (error) throw error
}

/** Завершує сесію поточного користувача. */
export async function signOut(): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/** Повертає поточного авторизованого користувача або null. */
export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
