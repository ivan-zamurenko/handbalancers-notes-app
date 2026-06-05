type Props = {
  title: string
  features: string[]
}

// Pattern: Module / LEGO
export default function IncludedFeaturesBlock({ title, features }: Props) {
  return (
    <section style={{ marginTop: '1.5rem' }}>
      <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#666', margin: '0 0 0.75rem' }}>
        {title}
      </p>
      <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {features.map(feature => (
          <li key={feature} style={{ fontSize: '0.875rem', color: '#888', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ color: '#39e600', fontWeight: 700, flexShrink: 0 }}>✓</span>
            {feature}
          </li>
        ))}
      </ul>
    </section>
  )
}