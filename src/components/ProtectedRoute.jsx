import { Navigate } from 'react-router-dom'
import { useAuth, ROLES } from '../context/AuthContext'

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

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" replace />
  }

  return children
}
