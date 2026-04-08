import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import LangToggle from '../components/LangToggle'
import { sectors } from '../data/sectorScenarios'

const steps = [
  { id: 1, name: 'Bienvenue', icon: '👋' },
  { id: 2, name: 'Secteur', icon: '🏢' },
  { id: 3, name: 'Conformité', icon: '🛡️' },
  { id: 4, name: 'Équipe', icon: '👥' },
  { id: 5, name: 'Premier Scénario', icon: '🚀' }
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState({ sector: '', frameworks: [], teamSize: '', name: '' })

  const next = () => currentStep < 5 ? setCurrentStep(currentStep + 1) : navigate('/admin')
  const back = () => currentStep > 1 && setCurrentStep(currentStep - 1)
  const toggleFramework = (fw) => {
    setData({
      ...data,
      frameworks: data.frameworks.includes(fw) ? data.frameworks.filter(f => f !== fw) : [...data.frameworks, fw]
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-black)' }}>
      <nav style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
        <Logo size="sm" />
        <LangToggle />
      </nav>

      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Progress */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          {steps.map(s => (
            <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: s.id <= currentStep ? '#eb2828' : 'var(--bg-card)',
                color: s.id <= currentStep ? '#fff' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                border: '2px solid', borderColor: s.id <= currentStep ? '#eb2828' : 'var(--border-subtle)'
              }}>{s.icon}</div>
              <div style={{ marginTop: '8px', fontSize: '11px', color: s.id === currentStep ? '#eb2828' : 'var(--text-muted)' }}>{s.name}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '12px' }}>
          {currentStep === 1 && (
            <>
              <h2 style={{ fontSize: '32px', color: 'var(--text-primary)', marginBottom: '16px' }}>👋 Bienvenue sur ROOMCA</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '16px' }}>
                Configurons votre plateforme en 5 étapes. Cela prend 3 minutes.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {[
                  { icon: '🎯', label: 'Personnalisation par secteur' },
                  { icon: '🛡️', label: 'Frameworks de conformité' },
                  { icon: '👥', label: 'Import de votre équipe' },
                  { icon: '🚀', label: 'Premier scénario en 1 clic' }
                ].map((f, i) => (
                  <div key={i} style={{ padding: '16px', background: 'var(--bg-black)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '24px' }}>{f.icon}</div>
                    <div style={{ color: 'var(--text-primary)', fontSize: '13px', marginTop: '8px' }}>{f.label}</div>
                  </div>
                ))}
              </div>
              <input type="text" placeholder="Nom de votre entreprise" value={data.name} onChange={e => setData({...data, name: e.target.value})}
                style={{ width: '100%', padding: '12px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)' }} />
            </>
          )}

          {currentStep === 2 && (
            <>
              <h2 style={{ fontSize: '32px', color: 'var(--text-primary)', marginBottom: '16px' }}>Quel est votre secteur ?</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Nous personnaliserons les scénarios pour vous.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {sectors.map(s => (
                  <button key={s.id} onClick={() => setData({...data, sector: s.id})} style={{
                    padding: '20px', textAlign: 'left',
                    background: data.sector === s.id ? '#eb2828' : 'var(--bg-black)',
                    border: '1px solid', borderColor: data.sector === s.id ? '#eb2828' : 'var(--border-subtle)',
                    borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{s.icon}</div>
                    <div style={{ fontWeight: 'bold' }}>{s.name.fr}</div>
                    <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>{s.frameworks.join(', ')}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <h2 style={{ fontSize: '32px', color: 'var(--text-primary)', marginBottom: '16px' }}>Frameworks de conformité</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Sélectionnez ceux qui vous concernent.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {['GDPR', 'HIPAA', 'PCI-DSS', 'SOC 2', 'ISO 27001', 'NIS2', 'DORA', 'CMMC', 'FERPA', 'NERC-CIP', 'IEC 62443', 'CCPA'].map(fw => (
                  <button key={fw} onClick={() => toggleFramework(fw)} style={{
                    padding: '12px', background: data.frameworks.includes(fw) ? '#eb2828' : 'var(--bg-black)',
                    border: '1px solid', borderColor: data.frameworks.includes(fw) ? '#eb2828' : 'var(--border-subtle)',
                    borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '12px'
                  }}>{fw}</button>
                ))}
              </div>
            </>
          )}

          {currentStep === 4 && (
            <>
              <h2 style={{ fontSize: '32px', color: 'var(--text-primary)', marginBottom: '16px' }}>Taille de votre équipe</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
                {['1-10', '11-50', '51-200', '201-1000', '1000+'].map(size => (
                  <button key={size} onClick={() => setData({...data, teamSize: size})} style={{
                    padding: '20px', background: data.teamSize === size ? '#eb2828' : 'var(--bg-black)',
                    border: '1px solid', borderColor: data.teamSize === size ? '#eb2828' : 'var(--border-subtle)',
                    borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '16px'
                  }}>{size} employés</button>
                ))}
              </div>
              <button style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px dashed var(--border-subtle)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer' }}>
                📁 Importer CSV de votre équipe
              </button>
            </>
          )}

          {currentStep === 5 && (
            <>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '72px', marginBottom: '16px' }}>🎉</div>
                <h2 style={{ fontSize: '32px', color: 'var(--text-primary)', marginBottom: '16px' }}>Tout est prêt !</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Votre plateforme est configurée pour le secteur <strong style={{ color: '#eb2828' }}>{sectors.find(s => s.id === data.sector)?.name.fr || 'sélectionné'}</strong>
                  <br />avec {data.frameworks.length} frameworks de conformité.
                </p>
                <div style={{ background: 'var(--bg-black)', padding: '24px', borderRadius: '8px', marginBottom: '24px', textAlign: 'left' }}>
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>Premier scénario recommandé :</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>📧 "Inbox Zero" - Phishing fundamentals · 15 min</p>
                </div>
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
            <button onClick={back} disabled={currentStep === 1} className="btn-secondary" style={{ padding: '12px 24px', opacity: currentStep === 1 ? 0.3 : 1 }}>← Précédent</button>
            <button onClick={next} className="btn-primary" style={{ padding: '12px 24px' }}>{currentStep === 5 ? 'Commencer 🚀' : 'Suivant →'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
