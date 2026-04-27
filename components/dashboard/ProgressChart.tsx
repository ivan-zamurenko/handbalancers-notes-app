'use client'
// Графік прогресу (Recharts)
// Відображає динаміку показників по вправі за обраний період: 1M / 3M / 6M / 1Y
// Дані: масив { date, value } з Supabase `workout_logs`
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ProgressChart() {
  // TODO: отримати дані з Supabase для поточного userId та обраної вправи
  // TODO: фільтр по dateRange (1M, 3M, 6M, ALL)
  const data: { date: string; value: number }[] = [] // placeholder

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#6366f1" />
      </LineChart>
    </ResponsiveContainer>
  )
}
