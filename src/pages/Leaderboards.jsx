import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import Logo from '/roomca-logo.png'
import LangToggle from '../components/LangToggle'
import Leaderboard from '../components/Leaderboard'

// Mock data pour démo
const mockUsers = [
  { id: 1, name: 'Sophie Bernard', dept: 'Finance', points: 4250, badges: ['first', 'perfect', 'phish', 'streak30'], scenariosCompleted: 12 },
  { id: 2, name: 'Antoine Moreau', dept: 'IT', points: 5820, badges: ['first', 'perfect', 'speed', 'phish', 'streak30', 'champ'], scenariosCompleted: 18 },
  { id: 3, name: 'Julie Martin', dept: 'Direction', points: 3950, badges: ['first', 'perfect', 'streak7'], scenariosCompleted: 10 },
  { id: 4, name: 'Thomas Keller', dept: 'IT', points: 4100, badges: ['first', 'perfect', 'speed'], scenariosCompleted: 11 },
  { id: 5, name: 'Amélie Durand', dept: 'RH', points: 2850, badges: ['first', 'perfect'], scenariosCompleted: 8 },
  { id: 6, name: 'Marc Lefebvre', dept: 'Commercial', points: 1950, badges: ['first'], scenariosCompleted: 5 },
  { id: 7, name: 'Pierre Rousseau', dept: 'Finance', points: 3200, badges: ['first', 'speed', 'streak7'], scenariosCompleted: 9 },
  { id: 8, name: 'Nadia Chouaib', dept: 'Commercial', points: 1500, badges: ['first'], scenariosCompleted: 4 },
  { id: 9, name: 'David Moreau', dept: 'IT', points: 3800, badges: ['first', 'perfect'], scenariosCompleted: 10 },
  { id: 10, name: 'Isabelle Bouvier', dept: 'Finance', points: 2600, badges: ['first'], scenariosCompleted: 7 },
  { id: 11, name: 'Claire Fontaine', dept: 'RH', points: 1800, badges: ['first'], scenariosCompleted: 5 },
  { id: 12, name: 'Laurent Dupont', dept: 'Direction', points: 2300, badges: ['first', 'speed'], scenariosCompleted: 6 },
]

export default function Leaderboards() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { t } = useLang()
  const [activeTab, setActiveTab] = useState('global')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const userDept = user?.company || 'ROOMCA Corp'
  const deptUsers = mockUsers.filter(u => u.dept === user?.name?.split(' ')[1] || true)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-black)' }}>
      {/* Navigation */}
      <nav style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
        <img
  src={Logo}
  alt="ROOMCA"
  style={{ height: '32px', width: 'auto', display: 'block' }}
/>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <LangToggle />
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {user?.name}
          </div>
          <button onClick={() => navigate('/play')} style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            ← Retour au jeu
          </button>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '11px' }}>
            Déconnexion
          </button>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>
        {/* Title */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '36px', marginBottom: '8px' }}>
            {t('leaderboardsTitle') || 'Classements'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {t('leaderboardsSub') || 'Voir les meilleurs joueurs et compétitions'}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
          {[
            { id: 'global', label: '🌍 Global' },
            { id: 'dept', label: '🏢 Département' },
            { id: 'monthly', label: '📅 Ce mois' },
            { id: 'streak', label: '🔥 Streaks' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '8px 16px',
                color: activeTab === tab.id ? 'var(--text-light)' : 'var(--text-muted)',
                borderBottom: activeTab === tab.id ? '2px solid var(--red)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-title)',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? 700 : 400
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Leaderboard Display */}
        {activeTab === 'global' && (
          <Leaderboard
            users={mockUsers}
            type="global"
            title="Classement Global"
          />
        )}

        {activeTab === 'dept' && (
          <Leaderboard
            users={deptUsers}
            type="department"
            title={`Classement ${userDept}`}
          />
        )}

        {activeTab === 'monthly' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '40px', textAlign: 'center', borderRadius: '4px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>📊</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
              Les statistiques du mois actuel seront mises à jour demain
            </p>
            <Leaderboard
              users={mockUsers.slice(0, 5)}
              type="global"
              title="Top 5 Ce Mois"
            />
          </div>
        )}

        {activeTab === 'streak' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {[
              { emoji: '🔥', title: 'Meilleur Streak', users: [{ name: 'Antoine Moreau', value: '30 jours' }, { name: 'Sophie Bernard', value: '28 jours' }] },
              { emoji: '⭐', title: 'Points du Jour', users: [{ name: 'Julie Martin', value: '450 pts' }, { name: 'Thomas Keller', value: '380 pts' }] }
            ].map((category, idx) => (
              <div key={idx} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '24px', borderRadius: '4px' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{category.emoji}</div>
                <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '16px', marginBottom: '16px' }}>
                  {category.title}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {category.users.map((u, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '2px' }}>
                      <span>{i + 1}. {u.name}</span>
                      <span style={{ color: 'var(--red)', fontWeight: 700 }}>{u.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
