import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '/roomca-logo.png'
import LangToggle from '../components/LangToggle'

const articles = [
  { cat: 'Démarrage', items: [
    { title: 'Première connexion', read: '2 min', url: '#' },
    { title: 'Configurer votre première campagne', read: '5 min', url: '#' },
    { title: 'Importer vos employés', read: '3 min', url: '#' }
  ]},
  { cat: 'Scénarios', items: [
    { title: 'Comprendre les difficultés', read: '4 min' },
    { title: 'Personnaliser un scénario', read: '8 min' },
    { title: 'Créer un scénario from scratch', read: '15 min' }
  ]},
  { cat: 'Conformité', items: [
    { title: 'GDPR : checklist complète', read: '10 min' },
    { title: 'HIPAA : guide pratique', read: '12 min' },
    { title: 'Préparer un audit SOC 2', read: '20 min' },
    { title: 'NIS2 : ce qu\'il faut savoir', read: '8 min' }
  ]},
  { cat: 'Intégrations', items: [
    { title: 'Connecter Slack', read: '3 min' },
    { title: 'Intégration Microsoft Teams', read: '4 min' },
    { title: 'API REST documentation', read: '15 min' },
    { title: 'Webhooks events', read: '6 min' }
  ]},
  { cat: 'Facturation', items: [
    { title: 'Choisir le bon plan', read: '5 min' },
    { title: 'Mettre à niveau', read: '2 min' },
    { title: 'Annuler son abonnement', read: '3 min' }
  ]}
]

const faqs = [
  { q: 'Combien de scénarios sont inclus ?', a: '32 scénarios immersifs + 22 scénarios sectoriels = 54 scénarios. Plus marketplace.' },
  { q: 'ROOMCA est-il GDPR compliant ?', a: 'Oui, nous sommes certifiés GDPR. Données hébergées en UE. DPA disponible sur demande.' },
  { q: 'Puis-je créer mes propres scénarios ?', a: 'Oui, avec le Scenario Builder visuel (plan Pro et +).' },
  { q: 'Quelles intégrations sont disponibles ?', a: 'Slack, Teams, Google Workspace, Microsoft 365, Okta, Azure AD, SCIM, Webhooks, API REST.' },
  { q: 'Comment fonctionne le pricing ?', a: '4 plans : Free (2 scénarios), Starter €49/mois, Pro €199/mois, Enterprise sur devis.' },
  { q: 'Y a-t-il un essai gratuit ?', a: 'Oui, 14 jours gratuits sans carte bancaire.' }
]

export default function HelpCenter() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [search, setSearch] = useState('')
  const [openFaq, setOpenFaq] = useState(null)

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-black)' }}>
      <nav style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
        <img
  src={Logo}
  alt="ROOMCA"
  style={{ height: '32px', width: 'auto', display: 'block' }}
/>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <LangToggle />
          <button onClick={() => navigate('/admin')} style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}>← Dashboard</button>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '11px' }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', color: 'var(--text-primary)', marginBottom: '12px' }}>📚 Centre d'Aide</h1>
          <p style={{ color: 'var(--text-muted)' }}>Tutoriels, FAQ, documentation API</p>
          <input type="text" placeholder="🔍 Rechercher dans l'aide..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', maxWidth: '600px', padding: '16px', marginTop: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '14px' }} />
        </div>

        {/* Quick links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
          {[
            { icon: '🚀', title: 'Démarrage rapide', link: '/onboarding' },
            { icon: '📖', title: 'Documentation API', link: '/api-docs' },
            { icon: '💬', title: 'Support live', link: '#chat' },
            { icon: '🎓', title: 'Formations', link: '/play' }
          ].map((item, i) => (
            <div key={i} onClick={() => item.link.startsWith('/') && navigate(item.link)} style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>{item.icon}</div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{item.title}</div>
            </div>
          ))}
        </div>

        {/* Articles by category */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {articles.map((cat, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ color: '#eb2828', marginBottom: '16px' }}>{cat.cat}</h3>
              {cat.items.map((item, j) => (
                <div key={j} style={{ padding: '12px 0', borderBottom: j < cat.items.length - 1 ? '1px solid var(--border-subtle)' : 'none', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <span style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{item.title}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{item.read}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>❓ Questions Fréquentes</h2>
          {faqs.map((faq, i) => (
            <div key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '8px', marginBottom: '12px', cursor: 'pointer', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{faq.q}</strong>
                <span style={{ color: '#eb2828' }}>{openFaq === i ? '−' : '+'}</span>
              </div>
              {openFaq === i && (
                <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '13px' }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
