'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: { date: string; value: number }[]
}

export default function ProgressChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
        <XAxis dataKey="date" stroke="#555" tick={{ fill: '#555', fontSize: 11 }} />
        <YAxis stroke="#555" tick={{ fill: '#555', fontSize: 11 }} />
        <Tooltip contentStyle={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '8px', color: '#fff' }} />
        <Line type="monotone" dataKey="value" stroke="#39e600" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
