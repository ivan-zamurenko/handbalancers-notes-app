// Хук для отримання поточного авторизованого користувача
// Повертає { user, loading } — використовується у компонентах
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    // TODO: supabase.auth.getUser() → setUser
    // TODO: supabase.auth.onAuthStateChange → оновлювати user
    setLoading(false)
  }, [])

  return { user, loading }
}
