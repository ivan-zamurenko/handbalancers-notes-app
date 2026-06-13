'use client'
import { logoutAction } from './LoginForm'

type Props = { label: string }

export default function LogoutButton({ label }: Props) {
  return (
    <button
      onClick={() => logoutAction()}
      style={{
        width: '100%',
        background: 'rgba(239,68,68,0.06)',
        border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: '12px',
        cursor: 'pointer',
        color: '#ef4444',
        fontSize: '0.875rem',
        fontWeight: 500,
        padding: '0.875rem 1rem',
        minHeight: '44px',
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(239,68,68,0.12)'
        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(239,68,68,0.06)'
        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'
      }}
    >
      {label}
    </button>
  )
}
