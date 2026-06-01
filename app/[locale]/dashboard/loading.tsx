// loading.tsx показується МИТТЄВО після кліку по навігації,
// поки сервер виконує DB-запити. Скелетон повторює форму реального контенту.

export default function DashboardLoading() {
  return (
    <main style={{ padding: '1rem', maxWidth: '480px', margin: '0 auto' }}>

      {/* Заголовок сторінки */}
      <div className="skeleton" style={{ height: '32px', width: '140px', marginBottom: '1.5rem' }} />

      {/* Тижневий календар — 7 кругів */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ flex: 1, aspectRatio: '1', borderRadius: '50%' }}
          />
        ))}
      </div>

      {/* Картка "Сьогодні" */}
      <div className="skeleton" style={{ height: '110px', borderRadius: '16px', marginBottom: '1rem' }} />

      {/* Бейдж серії */}
      <div className="skeleton" style={{ height: '44px', borderRadius: '12px', width: '160px' }} />

    </main>
  )
}
