import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Handbalancers — Training Platform',
  description: 'Track your handstand, stretching and fitness progress',
}

// Кореневий layout — обгортає всі сторінки
// Сюди додамо: навігацію, Supabase auth provider, глобальні стилі
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  )
}
