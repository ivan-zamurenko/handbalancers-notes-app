type FaqItem = {
  q: string
  a: string
}

type Props = {
  title: string
  items: FaqItem[]
}

// Pattern: Module / LEGO
export default function FaqBlock({ title, items }: Props) {
  return (
    <section style={{ marginTop: '1.4rem' }}>
      <h3 style={{ color: '#555', fontSize: '0.72rem', fontWeight: 600, margin: '0 0 0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</h3>
      <div style={{ display: 'grid', gap: '0.6rem' }}>
        {items.map(item => (
          <div key={item.q} style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '0.75rem 0.85rem' }}>
            <p style={{ color: '#fff', fontSize: '0.86rem', fontWeight: 600, margin: '0 0 0.3rem' }}>{item.q}</p>
            <p style={{ color: '#777', fontSize: '0.82rem', lineHeight: 1.55, margin: 0 }}>{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}