import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title: 'Handbalancers — Training Platform',
  description: 'Track your handstand, stretching and fitness progress',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="uk">
      <body>
        {user && <Navbar />}
        {children}
      </body>
    </html>
  )
}
