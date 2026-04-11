import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthProvider, ROLES } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Player from './pages/Player'
import Leaderboards from './pages/Leaderboards'
import Analytics from './pages/Analytics'
import Campaigns from './pages/Campaigns'
import Integrations from './pages/Integrations'
import Settings from './pages/Settings'
import Admin from './pages/Admin'
import SuperAdmin from './pages/SuperAdmin'
import Compliance from './pages/Compliance'
import Reports from './pages/Reports'
import RiskScore from './pages/RiskScore'
import EmailTemplates from './pages/EmailTemplates'
import ScenarioBuilder from './pages/ScenarioBuilder'
import ScenarioPreview from './pages/ScenarioPreview'
import WhiteLabel from './pages/WhiteLabel'
import PlayerDashboard from './pages/PlayerDashboard'
import VisualChallenge from './pages/VisualChallenge'

// Route wrapper that connects ScenarioBuilder to the backend.
// `?id=` in the URL → loads the scenario for editing; missing → creates a new one.
function ScenarioBuilderRoute() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const id = params.get('id')
  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(!!id)

  useEffect(() => {
    if (!id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInitialData(null)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    fetch(`/api/scenarios/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject('not found')))
      .then((data) => { if (!cancelled) { setInitialData(data); setLoading(false) } })
      .catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  const handleSave = async (payload) => {
    const isEdit = !!id
    const url = isEdit ? `/api/scenarios/${id}` : '/api/scenarios'
    const method = isEdit ? 'PUT' : 'POST'
    const body = {
      title_fr: payload.titleFr,
      title_en: payload.titleEn || payload.titleFr,
      category: payload.category,
      difficulty: payload.difficulty,
      duration: payload.duration,
      description: payload.description,
      status: payload.status || 'draft',
      audio_url: payload.audio_url ?? payload.audioUrl ?? null,
      audio_volume: payload.audioVolume ?? 50,
      blocks: payload.blocks || [],
    }
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error('Save failed')
    const saved = await res.json()
    if (!isEdit && saved?.id) navigate(`/scenario-builder?id=${saved.id}`, { replace: true })
    return saved
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', color: 'var(--text-muted)', fontSize: '12px', letterSpacing: '0.2em' }}>
        CHARGEMENT...
      </div>
    )
  }

  return (
    <ScenarioBuilder
      initialData={initialData}
      onSave={handleSave}
      onBack={() => navigate('/admin')}
    />
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public ── */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* ── Player ── */}
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole={ROLES.PLAYER}>
              <PlayerDashboard />
            </ProtectedRoute>
          } />
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
          <Route path="/preview/:id" element={
            <ProtectedRoute requiredRole={ROLES.PLAYER}>
              <ScenarioPreview />
            </ProtectedRoute>
          } />
          <Route path="/visual/:id" element={
            <ProtectedRoute requiredRole={ROLES.PLAYER}>
              <VisualChallenge />
            </ProtectedRoute>
          } />

          {/* ── Admin ── */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole={ROLES.ADMIN}>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute requiredRole={ROLES.ADMIN}>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute requiredRole={ROLES.ADMIN}>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/compliance" element={
            <ProtectedRoute requiredRole={ROLES.ADMIN}>
              <Compliance />
            </ProtectedRoute>
          } />
          <Route path="/campaigns" element={
            <ProtectedRoute requiredRole={ROLES.ADMIN}>
              <Campaigns />
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
            <ProtectedRoute requiredRole={ROLES.SUPER_ADMIN}>
              <ScenarioBuilderRoute />
            </ProtectedRoute>
          } />

          {/* ── Super-admin only ── */}
          <Route path="/super-admin" element={
            <ProtectedRoute requiredRole={ROLES.SUPER_ADMIN}>
              <SuperAdmin />
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

          {/* ── Shared ── */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
