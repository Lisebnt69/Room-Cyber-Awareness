import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth, ROLES } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Player from './pages/Player'
import Admin from './pages/Admin'
import SuperAdmin from './pages/SuperAdmin'

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/play" element={
            <ProtectedRoute allowedRoles={[ROLES.PLAYER]}>
              <Player />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/super-admin" element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
              <SuperAdmin />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
