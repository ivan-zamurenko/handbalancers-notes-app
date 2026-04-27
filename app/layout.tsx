import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Handbalancers — Training Platform',
  description: 'Track your handstand, stretching and fitness progress',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
