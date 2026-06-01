// loading.tsx — показується миттєво при переході на сторінку трекінгу

export default function TrackingLoading() {
  return (
    <main style={{ padding: '1rem', maxWidth: '480px', margin: '0 auto' }}>

      {/* Заголовок */}
      <div className="skeleton" style={{ height: '32px', width: '120px', marginBottom: '1.5rem' }} />

      {/* Теплова карта активності */}
      <div className="skeleton" style={{ height: '100px', borderRadius: '16px', marginBottom: '1.5rem' }} />

      {/* Три стат-блоки в ряд */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ flex: 1, height: '70px', borderRadius: '12px' }} />
        ))}
      </div>

      {/* Список логів — 4 рядки */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
          <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: '14px', width: '60%', marginBottom: '0.4rem' }} />
            <div className="skeleton" style={{ height: '12px', width: '40%' }} />
          </div>
        </div>
      ))}

    </main>
  )
}
