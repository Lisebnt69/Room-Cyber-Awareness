import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, ROLES } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Player from './pages/Player'
import Leaderboards from './pages/Leaderboards'
import Analytics from './pages/Analytics'
import Campaigns from './pages/Campaigns'
import Billing from './pages/Billing'
import Integrations from './pages/Integrations'
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
          <Route path="/leaderboards" element={
            <ProtectedRoute requiredRole={ROLES.PLAYER}>
              <Leaderboards />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute requiredRole={ROLES.ADMIN}>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/campaigns" element={
            <ProtectedRoute requiredRole={ROLES.ADMIN}>
              <Campaigns />
            </ProtectedRoute>
          } />
          <Route path="/billing" element={
            <ProtectedRoute requiredRole={ROLES.ADMIN}>
              <Billing />
            </ProtectedRoute>
          } />
          <Route path="/integrations" element={
            <ProtectedRoute requiredRole={ROLES.SUPER_ADMIN}>
              <Integrations />
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
