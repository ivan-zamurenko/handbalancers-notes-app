'use client'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import type { RadarDataPoint } from '@/lib/db/workoutLogs'

// Фіксовані 5 осей — завжди показуємо всі, навіть якщо count=0
const AXES = [
  { slug: 'handstand',   ua: 'Баланс',     en: 'Balance' },
  { slug: 'prehab',      ua: 'Здоров\'я',  en: 'Prehab' },
  { slug: 'conditioning',ua: 'Підкачка',   en: 'Conditioning' },
  { slug: 'stretching',  ua: 'Розтяжка',   en: 'Stretching' },
  { slug: 'coordination',ua: 'Координація',en: 'Coordination' },
]

interface Props {
  data: RadarDataPoint[]
  locale: string
}

export default function ActivityRadar({ data, locale }: Props) {
  const countMap: Record<string, number> = {}
  for (const d of data) countMap[d.category] = d.count

  const chartData = AXES.map(a => ({
    label: locale === 'en' ? a.en : a.ua,
    value: countMap[a.slug] ?? 0,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={chartData} margin={{ top: 16, right: 28, bottom: 16, left: 28 }}>
        <PolarGrid
          stroke="#2a2a2a"
          gridType="polygon"
        />
        <PolarAngleAxis
          dataKey="label"
          tick={{ fill: '#888', fontSize: 9, fontWeight: 500 }}
          tickLine={false}
        />
        <PolarRadiusAxis tick={false} axisLine={false} />
        <Radar
          dataKey="value"
          stroke="#39e600"
          strokeWidth={1.5}
          fill="#39e600"
          fillOpacity={0.25}
          dot={{ r: 3, fill: '#39e600', strokeWidth: 0 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
