import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Handbalancer's Studio",
  description: 'Your daily studio for handstand and flexibility',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={inter.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
