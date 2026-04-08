import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, ROLES } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Player from './pages/Player'
import Admin from './pages/Admin'
import SuperAdmin from './pages/SuperAdmin'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/play" element={
            <ProtectedRoute requiredRole={ROLES.PLAYER}>
              <Player />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requiredRole={ROLES.ADMIN}>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/super-admin" element={
            <ProtectedRoute requiredRole={ROLES.SUPER_ADMIN}>
              <SuperAdmin />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
