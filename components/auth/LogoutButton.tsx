'use client'
import { logoutAction } from './LoginForm'

type Props = { label: string }

export default function LogoutButton({ label }: Props) {
  return (
    <button
      onClick={() => logoutAction()}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#555',
        fontSize: '0.875rem',
        padding: 0,
        transition: 'color 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
      onMouseLeave={e => (e.currentTarget.style.color = '#555')}
    >
      {label}
    </button>
  )
}
