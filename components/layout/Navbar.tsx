'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function Navbar() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #eee' }}>
      <Link href="/dashboard">Дашборд</Link>
      <Link href="/programs">Програми</Link>
      <Link href="/tracking">Трекінг</Link>
      <Link href="/billing">Підписка</Link>
      <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>Вийти</button>
    </nav>
  )
}
