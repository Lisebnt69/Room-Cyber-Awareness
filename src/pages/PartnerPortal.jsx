import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import LangToggle from '../components/LangToggle'

export default function PartnerPortal() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [tab, setTab] = useState('overview')

  const handleLogout = () => { logout(); navigate('/login') }

  const stats = {
    customers: 47,
    mrr: 9320,
    commission: 2796,
    leads: 12
  }

  const partners = [
    { name: 'CyberSecure SAS', tier: 'Gold', customers: 23, mrr: '€4,580', commission: '€1,374' },
    { name: 'IT Defense Pro', tier: 'Silver', customers: 12, mrr: '€2,388', commission: '€716' },
    { name: 'NetSecurity Inc', tier: 'Bronze', customers: 8, mrr: '€1,592', commission: '€478' }
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-black)' }}>
      <nav style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
        <Logo size="sm" />
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <LangToggle />
          <button onClick={() => navigate('/admin')} style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}>← Dashboard</button>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '11px' }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: '40px' }}>
        <h1 style={{ fontSize: '36px', color: 'var(--text-primary)', marginBottom: '8px' }}>🤝 Portail Partenaires</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Programme revendeur - 30% commission récurrente</p>

        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
          {['overview', 'partners', 'leads', 'resources', 'commission'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '12px 20px', background: 'transparent',
              border: 'none', borderBottom: '2px solid', borderColor: tab === t ? '#eb2828' : 'transparent',
              color: tab === t ? '#eb2828' : 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', textTransform: 'capitalize'
            }}>{t}</button>
          ))}
        </div>

        {tab === 'overview' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
              <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Clients revendus</div>
                <div style={{ fontSize: '40px', color: 'var(--text-primary)', fontWeight: 'bold' }}>{stats.customers}</div>
                <div style={{ fontSize: '11px', color: '#22c55e' }}>↑ +8 ce mois</div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MRR généré</div>
                <div style={{ fontSize: '40px', color: '#22c55e', fontWeight: 'bold' }}>€{stats.mrr}</div>
                <div style={{ fontSize: '11px', color: '#22c55e' }}>↑ +18%</div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Vos commissions</div>
                <div style={{ fontSize: '40px', color: '#eb2828', fontWeight: 'bold' }}>€{stats.commission}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>30% de €9,320</div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Leads en cours</div>
                <div style={{ fontSize: '40px', color: '#3b82f6', fontWeight: 'bold' }}>{stats.leads}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>À convertir</div>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #eb2828, #b91c1c)', padding: '32px', borderRadius: '12px', color: '#fff' }}>
              <h2 style={{ marginBottom: '16px' }}>Devenez Partenaire Gold 🏆</h2>
              <p style={{ marginBottom: '16px', opacity: 0.9 }}>Atteignez 25 clients pour passer Gold et obtenir : 40% commission, support dédié, formations exclusives.</p>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', marginBottom: '8px' }}>
                <div style={{ width: '92%', height: '100%', background: '#fff', borderRadius: '4px' }}></div>
              </div>
              <div style={{ fontSize: '11px' }}>23/25 clients - 92% complété</div>
            </div>
          </>
        )}

        {tab === 'partners' && (
          <div style={{ background: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr style={{ background: 'var(--bg-black)' }}>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '11px' }}>PARTENAIRE</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '11px' }}>TIER</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '11px' }}>CLIENTS</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '11px' }}>MRR</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '11px' }}>COMMISSION</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((p, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '16px', color: 'var(--text-primary)' }}>{p.name}</td>
                    <td style={{ padding: '16px' }}><span style={{ padding: '4px 12px', background: '#eb2828', color: '#fff', borderRadius: '12px', fontSize: '11px' }}>{p.tier}</span></td>
                    <td style={{ padding: '16px', color: 'var(--text-primary)' }}>{p.customers}</td>
                    <td style={{ padding: '16px', color: '#22c55e' }}>{p.mrr}</td>
                    <td style={{ padding: '16px', color: '#eb2828' }}>{p.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'resources' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { icon: '📊', title: 'Sales Deck', desc: 'Présentation commerciale 30 slides' },
              { icon: '📋', title: 'Battle Cards', desc: 'Comparatifs concurrents' },
              { icon: '🎓', title: 'Sales Training', desc: 'Formation vente 4h' },
              { icon: '🎨', title: 'Marketing Kit', desc: 'Logos, bannières, templates' },
              { icon: '📝', title: 'Contracts', desc: 'Modèles de contrats partenaires' },
              { icon: '💬', title: 'Slack Community', desc: 'Échangez avec partenaires' }
            ].map((r, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>{r.icon}</div>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>{r.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{r.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
