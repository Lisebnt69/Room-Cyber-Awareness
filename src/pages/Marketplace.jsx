import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import LangToggle from '../components/LangToggle'
import { sectors } from '../data/sectorScenarios'

const marketplaceItems = [
  { id: 1, title: 'Phishing Healthcare Kit', author: 'Dr. CyberSec', price: 49, rating: 4.9, downloads: 1284, sector: 'healthcare', scenarios: 12 },
  { id: 2, title: 'CMMC Level 2 Bundle', author: 'Defense Pro', price: 199, rating: 4.8, downloads: 567, sector: 'government', scenarios: 25 },
  { id: 3, title: 'PCI-DSS Complete', author: 'PaymentSec', price: 89, rating: 5.0, downloads: 2156, sector: 'finance', scenarios: 18 },
  { id: 4, title: 'OT/SCADA Industrial', author: 'IndustryGuard', price: 129, rating: 4.7, downloads: 432, sector: 'industry', scenarios: 15 },
  { id: 5, title: 'Free Phishing 101', author: 'ROOMCA', price: 0, rating: 4.6, downloads: 12450, sector: 'all', scenarios: 5 },
  { id: 6, title: 'NIS2 Compliance Pack', author: 'EU Sec Expert', price: 149, rating: 4.9, downloads: 821, sector: 'all', scenarios: 22 },
  { id: 7, title: 'GDPR Privacy Drills', author: 'PrivacyPro', price: 79, rating: 4.8, downloads: 1932, sector: 'all', scenarios: 14 },
  { id: 8, title: 'Banking BEC Defense', author: 'BankSec', price: 99, rating: 4.9, downloads: 743, sector: 'finance', scenarios: 10 },
  { id: 9, title: 'School Privacy FERPA', author: 'EduGuard', price: 59, rating: 4.5, downloads: 612, sector: 'education', scenarios: 8 },
  { id: 10, title: 'Energy Grid Defense', author: 'GridSec', price: 179, rating: 4.7, downloads: 298, sector: 'energy', scenarios: 16 }
]

export default function Marketplace() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('popular')
  const [cart, setCart] = useState([])

  const filtered = marketplaceItems.filter(i => filter === 'all' || i.sector === filter || i.sector === 'all')
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'popular') return b.downloads - a.downloads
    if (sort === 'rating') return b.rating - a.rating
    if (sort === 'price') return a.price - b.price
    return 0
  })

  const handleLogout = () => { logout(); navigate('/login') }
  const addToCart = (item) => setCart([...cart, item])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-black)' }}>
      <nav style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
        <Logo size="sm" />
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <LangToggle />
          <span style={{ color: '#22c55e', fontSize: '12px' }}>🛒 {cart.length}</span>
          <button onClick={() => navigate('/admin')} style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>← Dashboard</button>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '11px' }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: '40px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', color: 'var(--text-primary)', marginBottom: '8px' }}>🏪 Scenario Marketplace</h1>
          <p style={{ color: 'var(--text-muted)' }}>Bundles de scénarios créés par experts. Revenue share 70/30 aux créateurs.</p>
        </div>

        {/* Hero stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
          {[
            { label: 'Bundles', value: '247', icon: '📦' },
            { label: 'Créateurs', value: '89', icon: '👥' },
            { label: 'Téléchargements', value: '120K+', icon: '⬇️' },
            { label: 'Revenue Share', value: '70%', icon: '💰' }
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '20px', borderRadius: '12px' }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>{s.icon}</div>
              <div style={{ fontSize: '24px', color: '#eb2828', fontWeight: 'bold' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={() => setFilter('all')} style={{ padding: '8px 16px', background: filter === 'all' ? '#eb2828' : 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '20px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '12px' }}>Tous</button>
          {sectors.map(s => (
            <button key={s.id} onClick={() => setFilter(s.id)} style={{ padding: '8px 16px', background: filter === s.id ? '#eb2828' : 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '20px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '12px' }}>
              {s.icon} {s.name.fr}
            </button>
          ))}
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '8px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '8px', marginLeft: 'auto' }}>
            <option value="popular">Populaires</option>
            <option value="rating">Mieux notés</option>
            <option value="price">Prix croissant</option>
          </select>
        </div>

        {/* Items grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {sorted.map(item => (
            <div key={item.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '20px', borderRadius: '12px' }}>
              <div style={{ height: '120px', background: 'linear-gradient(135deg, #1e1e1e, #2a2a2a)', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
                {sectors.find(s => s.id === item.sector)?.icon || '📦'}
              </div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>{item.title}</h3>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>par {item.author}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                <span>⭐ {item.rating}</span>
                <span>⬇️ {item.downloads.toLocaleString()}</span>
                <span>📋 {item.scenarios} scénarios</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: item.price === 0 ? '#22c55e' : '#eb2828' }}>{item.price === 0 ? 'GRATUIT' : `€${item.price}`}</span>
                <button onClick={() => addToCart(item)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '11px' }}>Ajouter</button>
              </div>
            </div>
          ))}
        </div>

        {/* Become creator CTA */}
        <div style={{ marginTop: '40px', padding: '40px', background: 'linear-gradient(135deg, #eb2828, #b91c1c)', borderRadius: '12px', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', marginBottom: '12px' }}>Devenez créateur ROOMCA</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '24px' }}>Créez vos scénarios. Touchez 70% des ventes. Aidez la communauté.</p>
          <button className="btn-secondary" style={{ background: '#fff', color: '#eb2828' }}>Postuler comme créateur →</button>
        </div>
      </div>
    </div>
  )
}
