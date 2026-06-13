'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: { date: string; value: number }[]
  height?: number
  unit?: string
}

export default function ProgressChart({ data, height = 220, unit }: Props) {
  const fmtDate = (d: string) => d.slice(5).replace('-', '/')
  const fmtVal = (v: number) => unit ? `${v}${unit}` : String(v)

  // Динамічний діапазон: min - 10% до max + 10%, але не менше 0
  const values = data.map(d => d.value)
  const min = values.length ? Math.min(...values) : 0
  const max = values.length ? Math.max(...values) : 10
  const range = max - min || 1
  const margin = Math.ceil(range * 0.15)
  const yMin = Math.max(0, min - margin)
  const yMax = max + margin

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" vertical={false} />
        <XAxis
          dataKey="date"
          stroke="#2a2a2a"
          tick={{ fill: '#555', fontSize: 10 }}
          tickLine={false}
          tickFormatter={fmtDate}
          padding={{ left: 16, right: 16 }}
          axisLine={false}
          interval="preserveStartEnd"
          minTickGap={32}
        />
        <YAxis
          stroke="#2a2a2a"
          tick={{ fill: '#555', fontSize: 10 }}
          tickLine={false}
          width={40}
          allowDecimals={false}
          tickFormatter={fmtVal}
          domain={[yMin, yMax]}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '8px', color: '#fff', fontSize: '0.8rem' }}
          formatter={(v: number) => [unit ? `${v}${unit}` : v, '']}
          labelFormatter={fmtDate}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#39e600"
          strokeWidth={2}
          dot={{ r: 3, fill: '#39e600', strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
