// Список програм із фільтром по рівню
// Завантажує програми з Supabase `programs`, показує ProgramCard для кожної
import ProgramCard from './ProgramCard'
import type { Program } from '@/types'

export default function ProgramList() {
  // TODO: fetch programs from Supabase
  const programs: Program[] = [] // placeholder

  return (
    <div>
      {/* TODO: фільтр beginner / intermediate / advanced */}
      {programs.map((p) => <ProgramCard key={p.id} program={p} />)}
    </div>
  )
}
