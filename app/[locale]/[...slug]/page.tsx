// Pattern: Catch-all route
// Перехоплює будь-який невідомий шлях в [locale] сегменті
// і викликає notFound() — це тригерить наш кастомний not-found.tsx

import { notFound } from 'next/navigation'

// async дозволяє Turbopack коректно виміряти час рендеру
// навіть коли notFound() кидає виключення
export default async function CatchAllPage() {
  notFound()
}
