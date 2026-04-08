import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, ROLES } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AIChatbot from './components/AIChatbot'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Player from './pages/Player'
import Leaderboards from './pages/Leaderboards'
import Analytics from './pages/Analytics'
import Campaigns from './pages/Campaigns'
import Billing from './pages/Billing'
import Integrations from './pages/Integrations'
import Settings from './pages/Settings'
import Admin from './pages/Admin'
import SuperAdmin from './pages/SuperAdmin'
import Compliance from './pages/Compliance'
import Marketplace from './pages/Marketplace'
import Certification from './pages/Certification'
import Onboarding from './pages/Onboarding'
import HelpCenter from './pages/HelpCenter'
import Reports from './pages/Reports'
import RiskScore from './pages/RiskScore'
import EmailTemplates from './pages/EmailTemplates'
import ScenarioBuilder from './pages/ScenarioBuilder'
import PartnerPortal from './pages/PartnerPortal'
import WhiteLabel from './pages/WhiteLabel'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/help" element={<HelpCenter />} />

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
          <Route path="/certification" element={
            <ProtectedRoute requiredRole={ROLES.PLAYER}>
              <Certification />
            </ProtectedRoute>
          } />
          <Route path="/marketplace" element={
            <ProtectedRoute requiredRole={ROLES.PLAYER}>
              <Marketplace />
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
          <Route path="/compliance" element={
            <ProtectedRoute requiredRole={ROLES.ADMIN}>
              <Compliance />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute requiredRole={ROLES.ADMIN}>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/risk-score" element={
            <ProtectedRoute requiredRole={ROLES.ADMIN}>
              <RiskScore />
            </ProtectedRoute>
          } />
          <Route path="/email-templates" element={
            <ProtectedRoute requiredRole={ROLES.ADMIN}>
              <EmailTemplates />
            </ProtectedRoute>
          } />
          <Route path="/scenario-builder" element={
            <ProtectedRoute requiredRole={ROLES.ADMIN}>
              <ScenarioBuilder />
            </ProtectedRoute>
          } />
          <Route path="/partners" element={
            <ProtectedRoute requiredRole={ROLES.ADMIN}>
              <PartnerPortal />
            </ProtectedRoute>
          } />

          <Route path="/integrations" element={
            <ProtectedRoute requiredRole={ROLES.SUPER_ADMIN}>
              <Integrations />
            </ProtectedRoute>
          } />
          <Route path="/white-label" element={
            <ProtectedRoute requiredRole={ROLES.SUPER_ADMIN}>
              <WhiteLabel />
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
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
        <AIChatbot />
      </BrowserRouter>
    </AuthProvider>
  )
}
