import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '/roomca-logo.png'
import LangToggle from '../components/LangToggle'

export default function ScenarioBuilder() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [scenario, setScenario] = useState({
    title: '',
    category: 'Phishing',
    difficulty: 'medium',
    duration: 600,
    description: '',
    narrative: '',
    framework: '',
    sector: '',
    decisions: []
  })
  const [newDecision, setNewDecision] = useState({ text: '', isSafe: true, consequence: '' })

  const handleLogout = () => { logout(); navigate('/login') }

  const addDecision = () => {
    if (!newDecision.text) return
    setScenario({ ...scenario, decisions: [...scenario.decisions, { ...newDecision, id: Date.now() }] })
    setNewDecision({ text: '', isSafe: true, consequence: '' })
  }

  const removeDecision = (id) => {
    setScenario({ ...scenario, decisions: scenario.decisions.filter(d => d.id !== id) })
  }

  const save = () => {
    alert(`Scénario "${scenario.title}" sauvegardé !`)
  }

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

      <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '36px', color: 'var(--text-primary)', marginBottom: '8px' }}>🛠️ Scenario Builder</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Créez vos scénarios immersifs personnalisés</p>

        <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '12px', marginBottom: '24px' }}>
          <h3 style={{ color: '#eb2828', marginBottom: '20px' }}>1. Informations de base</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Titre du scénario</label>
              <input type="text" value={scenario.title} onChange={e => setScenario({...scenario, title: e.target.value})}
                placeholder="Ex: Phishing CEO Wire"
                style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', marginTop: '4px' }} />
            </div>
            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Catégorie</label>
              <select value={scenario.category} onChange={e => setScenario({...scenario, category: e.target.value})}
                style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', marginTop: '4px' }}>
                <option>Phishing</option>
                <option>Malware</option>
                <option>Social Engineering</option>
                <option>Credentials</option>
                <option>Compliance</option>
              </select>
            </div>
            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Difficulté</label>
              <select value={scenario.difficulty} onChange={e => setScenario({...scenario, difficulty: e.target.value})}
                style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', marginTop: '4px' }}>
                <option value="easy">Facile</option>
                <option value="medium">Moyen</option>
                <option value="hard">Difficile</option>
              </select>
            </div>
            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Durée (secondes)</label>
              <input type="number" value={scenario.duration} onChange={e => setScenario({...scenario, duration: parseInt(e.target.value) || 0})}
                style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', marginTop: '4px' }} />
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Description courte</label>
            <input type="text" value={scenario.description} onChange={e => setScenario({...scenario, description: e.target.value})}
              style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', marginTop: '4px' }} />
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '12px', marginBottom: '24px' }}>
          <h3 style={{ color: '#eb2828', marginBottom: '20px' }}>2. Narration immersive</h3>
          <textarea value={scenario.narrative} onChange={e => setScenario({...scenario, narrative: e.target.value})}
            placeholder="Écrivez la mise en situation immersive..."
            rows={8}
            style={{ width: '100%', padding: '12px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', resize: 'vertical' }} />
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '12px', marginBottom: '24px' }}>
          <h3 style={{ color: '#eb2828', marginBottom: '20px' }}>3. Décisions ({scenario.decisions.length})</h3>
          {scenario.decisions.map(d => (
            <div key={d.id} style={{ padding: '16px', background: 'var(--bg-black)', borderRadius: '8px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>{d.isSafe ? '✅' : '❌'} {d.text}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{d.consequence}</div>
                </div>
                <button onClick={() => removeDecision(d.id)} style={{ background: 'transparent', border: 'none', color: '#eb2828', cursor: 'pointer' }}>×</button>
              </div>
            </div>
          ))}
          <div style={{ marginTop: '16px', padding: '16px', background: 'var(--bg-black)', borderRadius: '8px' }}>
            <input type="text" value={newDecision.text} onChange={e => setNewDecision({...newDecision, text: e.target.value})}
              placeholder="Texte de la décision..."
              style={{ width: '100%', padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)', marginBottom: '8px' }} />
            <input type="text" value={newDecision.consequence} onChange={e => setNewDecision({...newDecision, consequence: e.target.value})}
              placeholder="Conséquence..."
              style={{ width: '100%', padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)', marginBottom: '8px' }} />
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                <input type="checkbox" checked={newDecision.isSafe} onChange={e => setNewDecision({...newDecision, isSafe: e.target.checked})} /> Décision sûre
              </label>
              <button onClick={addDecision} style={{ marginLeft: 'auto', padding: '6px 16px', background: '#eb2828', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>+ Ajouter décision</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={save} className="btn-primary" style={{ padding: '12px 32px' }}>💾 Sauvegarder</button>
          <button className="btn-secondary" style={{ padding: '12px 32px' }}>👁️ Aperçu</button>
          <button className="btn-secondary" style={{ padding: '12px 32px' }}>🚀 Publier sur Marketplace</button>
        </div>
      </div>
    </div>
  )
}
