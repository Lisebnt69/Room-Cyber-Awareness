import { Navigate } from 'react-router-dom'
import { useAuth, ROLES } from '../context/AuthContext'

const ROLE_LEVEL = {
  [ROLES.PLAYER]: 1,
  [ROLES.ADMIN]: 2,
  [ROLES.SUPER_ADMIN]: 3,
}

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-black)',
        fontFamily: 'var(--mono)',
        fontSize: '14px',
        color: 'var(--text-muted)'
      }}>
        Loading...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole) {
    const userLevel = ROLE_LEVEL[user.role] ?? 0
    const requiredLevel = ROLE_LEVEL[requiredRole] ?? 0
    if (userLevel < requiredLevel) {
      return <Navigate to="/login" replace />
    }
  }

  return children
}
