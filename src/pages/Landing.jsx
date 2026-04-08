import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import LangToggle from '../components/LangToggle'
import { useLang } from '../context/LangContext'
import Modal from '../components/Modal'
import Toast from '../components/Toast'

function GlitchText({ children, className = '' }) {
  const [glitching, setGlitching] = useState(false)
  useEffect(() => {
    const t = setInterval(() => { setGlitching(true); setTimeout(() => setGlitching(false), 600) }, 5000)
    return () => clearInterval(t)
  }, [])
  return <span className={`${className} ${glitching ? 'animate-glitch-text' : ''}`}>{children}</span>
}

function CyberGridHero() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(235,40,40,0.08) 0%, transparent 70%)' }}>
      <div className="cyber-grid" style={{ position: 'absolute', inset: 0 }} />
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ position: 'absolute', left: `${10 + i * 16}%`, top: 0, bottom: 0, width: '1px', background: `linear-gradient(180deg, transparent, rgba(235,40,40,${0.03 + i * 0.01}) 50%, transparent)`, animation: `fadeIn ${1 + i * 0.3}s ease` }} />
      ))}
    </div>
  )
}

function Navbar({ onLogin }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  const links = [
    ['Comment ça marche', 'how'],
    ['Fonctionnalités', 'features'],
    ['Tarifs', 'pricing'],
  ]
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: scrolled ? 'rgba(0,0,0,0.92)' : 'transparent', borderBottom: scrolled ? '1px solid rgba(84,84,84,0.3)' : '1px solid transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none', transition: 'all 0.3s ease' }}>
      <Logo size="md" />
      <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
        {links.map(([label, anchor]) => (
          <a key={anchor} href={`#${anchor}`} style={{ fontFamily: 'var(--font-title)', fontSize: '13px', letterSpacing: '0.08em', color: 'var(--text-secondary)', textTransform: 'uppercase', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--text-light)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
          >{label}</a>
        ))}
        <LangToggle />
        <button className="btn-secondary" style={{ padding: '8px 20px', fontSize: '12px' }} onClick={onLogin}>Connexion</button>
        <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '12px' }} onClick={onLogin}>Essai gratuit</button>
      </div>
    </nav>
  )
}

function HeroSection({ onStart, setModal }) {
  const [typed, setTyped] = useState('')
  const msg = '> ATTAQUE DÉTECTÉE...'
  useEffect(() => {
    let i = 0
    const tick = setInterval(() => { setTyped(msg.slice(0, i + 1)); i++; if (i >= msg.length) clearInterval(tick) }, 55)
    return () => clearInterval(tick)
  }, [])

  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 40px 80px' }}>
      <CyberGridHero />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '920px' }}>
        <div className="tag" style={{ marginBottom: '28px', display: 'inline-flex' }}>
          <span className="status-dot red" /> Simulation de cyberattaque
        </div>

        <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(48px, 7vw, 88px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '24px', color: 'var(--text-light)' }}>
          Vous pensez être prêts.<br />
          <span style={{ color: 'var(--red)' }}>Les attaquants espèrent que non.</span>
        </h1>

        <p style={{ fontSize: '20px', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '700px', margin: '0 auto 20px' }}>
          <strong>ROOMCA plonge vos équipes dans des cyberattaques réalistes.</strong>
        </p>

        <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: '700px', margin: '0 auto 48px', fontStyle: 'italic' }}>
          Ils cliquent. Ils doutent. Ils font des erreurs. Puis ils apprennent — pour de vrai.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '56px' }}>
          <button className="btn-primary" style={{ fontSize: '15px', padding: '16px 40px' }} onClick={onStart}>
            Essai gratuit
          </button>
          <button className="btn-secondary" style={{ fontSize: '15px', padding: '16px 40px' }} onClick={() => setModal('demo')}>
            Voir la démo
          </button>
        </div>

        <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--red)', letterSpacing: '0.1em', minHeight: '18px', marginBottom: '56px' }}>
          {typed}<span className="animate-blink">█</span>
        </div>

        <div style={{ display: 'flex', gap: '48px', justifyContent: 'center', flexWrap: 'wrap', padding: '24px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '32px', color: 'var(--red)', fontWeight: 700 }}>90%</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>erreurs humaines</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '32px', color: 'var(--red)', fontWeight: 700 }}>4x</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>mieux retenu</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '32px', color: 'var(--red)', fontWeight: 700 }}>100%</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>sans risque réel</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProblemsSection() {
  const problems = [
    { icon: '⚠️', title: 'Le facteur humain', desc: '90% des cyberattaques exploitent une erreur humaine. Pas une faille technique.' },
    { icon: '💤', title: 'La fausse confiance', desc: 'Une formation ≠ un réflexe. Sous pression, tout change. Vos équipes hésitent.' },
    { icon: '⚡', title: 'Les attaques évoluent', desc: 'Vos collaborateurs affrontent des menaces qu\'ils n\'ont jamais vues. Sont-ils vraiment prêts ?' },
  ]

  return (
    <section id="how" style={{ padding: '100px 40px', background: 'var(--bg-dark)', borderTop: '1px solid var(--border-subtle)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(32px, 4vw, 48px)', textAlign: 'center', marginBottom: '16px' }}>
          Votre équipe est formée.<br />
          <span style={{ color: 'var(--red)' }}>Mais face à une vraie attaque ?</span>
        </h2>
        <p style={{ textAlign: 'center', fontSize: '16px', color: 'var(--text-muted)', marginBottom: '60px', maxWidth: '600px', margin: '16px auto 60px' }}>
          Elle hésite. Elle doute. Elle clique.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {problems.map((p, idx) => (
            <div key={idx} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '32px 28px', borderRadius: '4px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--red)' }} />
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>{p.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '18px', marginBottom: '12px' }}>{p.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SolutionSection() {
  return (
    <section id="features" style={{ padding: '100px 40px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: '16px' }}>
            Vous ne formez pas vos équipes.<br />
            <span style={{ color: 'var(--red)' }}>Vous les testez.</span>
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.8 }}>
            ROOMCA simule de vraies attaques. Vos collaborateurs doivent agir — ou échouer. Sans conséquence.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 0 60px rgba(235,40,40,0.1)' }}>
              <div style={{ background: '#0a0a0a', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', marginLeft: '12px' }}>roomca://simulation-active</span>
              </div>
              <div style={{ padding: '24px', fontFamily: 'var(--mono)', fontSize: '12px', lineHeight: 2 }}>
                <div style={{ color: 'var(--text-muted)' }}>// ALERTE SÉCURITÉ — 09:47:21</div>
                <div style={{ color: 'var(--red)' }}>[CRITIQUE] Tentative d'exfiltration détectée</div>
                <div style={{ color: '#f59e0b' }}>[WARN]   Email: suspicious@company-clone.com</div>
                <div style={{ color: 'var(--text-muted)' }}>[INFO]   Objet: Mise à jour urgente du compte</div>
                <div style={{ color: '#22c55e' }}>[TASK]   Que faites-vous maintenant ?</div>
                <div style={{ color: 'var(--red)' }}>█<span className="animate-blink" style={{ display: 'inline-block' }}>_</span></div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { icon: '🔍', title: 'Repérer un phishing', desc: 'dans un environnement réel' },
              { icon: '🧠', title: 'Prendre des décisions', desc: 'sous pression et timing réaliste' },
              { icon: '💥', title: 'Subir les conséquences', desc: 'sans risque réel pour l\'entreprise' },
              { icon: '🔁', title: 'Rejouer & s\'améliorer', desc: 'apprentissage par expérience' },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '28px', minWidth: '40px' }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-light)' }}>{item.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    { icon: '🎬', title: 'Immersion totale', desc: 'Interface réaliste, emails, terminal — tout ce qu\'une vraie attaque a' },
    { icon: '📊', title: 'Résultats exploitables', desc: 'Scores, erreurs, progression — directement actionnables pour votre équipe' },
    { icon: '🧠', title: 'Apprentissage réel', desc: 'On retient ce qu\'on vit. Pas ce qu\'on lit dans un slide PowerPoint' },
    { icon: '⚡', title: 'Déploiement instantané', desc: 'Aucune installation. Jouable en quelques minutes, accessible partout' },
    { icon: '🤖', title: 'Recommandations IA', desc: 'Suggestions de scénarios basées sur vos vulnérabilités détectées' },
    { icon: '📈', title: 'Progression garantie', desc: 'Chaque simulation améliore les réflexes. Mesurable et prouvé.' },
  ]

  return (
    <section style={{ padding: '100px 40px', background: 'var(--bg-dark)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: '16px' }}>
          Pas des modules.<br />
          <span style={{ color: 'var(--red)' }}>Des scénarios vécus.</span>
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '60px', maxWidth: '600px', margin: '16px auto 60px' }}>
          Chaque simulation est conçue pour reproduire le stress, les erreurs et les décisions réelles.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {features.map((f, idx) => (
            <div key={idx} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '32px 24px', textAlign: 'left', borderRadius: '4px' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '16px', marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingSection({ showToast }) {
  const plans = [
    { name: 'Starter', price: '49', features: ['Jusqu\'à 50 employés', '4 scénarios', 'Analytics basique', 'Support email'], highlight: false },
    { name: 'Pro', price: '199', features: ['Jusqu\'à 500 employés', 'Tous les scénarios', 'Analytics avancée', 'Phishing campaigns', 'Support prioritaire'], highlight: true },
    { name: 'Entreprise', price: 'Sur devis', features: ['Employés illimités', 'Intégrations custom', 'SSO & 2FA', 'API access', 'Support dédié'], highlight: false },
  ]

  return (
    <section id="pricing" style={{ padding: '100px 40px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: '16px' }}>
          Un incident coûte des milliers.<br />
          <span style={{ color: 'var(--red)' }}>Ici, vous payez pour l\'éviter.</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '60px' }}>
          {plans.map((p, idx) => (
            <div key={idx} style={{ background: p.highlight ? '#0d0d0d' : 'var(--bg-card)', border: p.highlight ? '2px solid var(--red)' : '1px solid var(--border)', padding: '40px 32px', position: 'relative', borderRadius: '4px' }}>
              {p.highlight && (
                <div style={{ position: 'absolute', top: '-12px', right: '20px', background: 'var(--red)', color: '#fff', padding: '4px 12px', fontSize: '10px', fontWeight: 700, borderRadius: '2px' }}>
                  MEILLEUR CHOIX
                </div>
              )}
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>{p.name}</div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '42px', fontWeight: 700, color: p.highlight ? 'var(--red)' : 'var(--text-light)', marginBottom: '8px' }}>
                {p.price} €<span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 400 }}>/mois</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '32px', marginBottom: '32px' }}>
                {p.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--red)', fontWeight: 700 }}>›</span> {f}
                  </div>
                ))}
              </div>
              <button
                className={p.highlight ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => showToast(`Plan "${p.name}" sélectionné!`)}
              >
                Essayer maintenant
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection({ onStart }) {
  return (
    <section style={{ padding: '100px 40px', background: 'var(--bg-dark)', borderTop: '1px solid var(--border-subtle)' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: '20px', lineHeight: 1.2 }}>
          Testez votre équipe.<br />
          <span style={{ color: 'var(--red)' }}>Avant que quelqu\'un d\'autre le fasse.</span>
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.8 }}>
          Aucune carte bancaire requise. Accès complet pendant 14 jours. Prêt à découvrir vos vraies vulnérabilités ?
        </p>
        <button className="btn-primary" style={{ fontSize: '16px', padding: '16px 48px' }} onClick={onStart}>
          Lancer l\'essai gratuit
        </button>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
      <Logo size="sm" showSub />
      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>© 2026 ROOMCA. Tous droits réservés.</div>
      <div style={{ display: 'flex', gap: '24px' }}>
        {['Politique de confidentialité', 'Conditions d\'utilisation', 'Sécurité'].map(l => (
          <a key={l} href="#" style={{ fontSize: '12px', color: 'var(--text-muted)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--text-light)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >{l}</a>
        ))}
      </div>
    </footer>
  )
}

function DemoModal({ onClose }) {
  const [step, setStep] = useState(0)
  const [answer, setAnswer] = useState(null)

  const steps = [
    { type: 'intro' },
    { type: 'email' },
    { type: 'question' },
    { type: 'result' }
  ]

  const next = () => setStep(s => Math.min(s + 1, steps.length - 1))

  return (
    <div style={{ color: 'var(--text-primary)' }}>
      {step === 0 && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
          <h3 style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--text-primary)' }}>Mini-scénario phishing</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px' }}>
            Vous recevez un email urgent de votre PDG. Que faites-vous ?
          </p>
          <button onClick={next} className="btn-primary" style={{ padding: '12px 32px' }}>Commencer ▶</button>
        </div>
      )}

      {step === 1 && (
        <div>
          <div style={{ background: 'rgba(235,40,40,0.06)', border: '1px solid rgba(235,40,40,0.2)', borderRadius: '6px', padding: '8px 12px', marginBottom: '12px', fontSize: '11px', color: '#eb2828', fontFamily: 'var(--mono)' }}>
            🎯 ROOMCA SIMULATION — Analysez cet email suspect
          </div>
          <div style={{ background: '#ffffff', color: '#000', padding: '20px', borderRadius: '8px', fontFamily: 'Arial, sans-serif', fontSize: '13px', marginBottom: '20px' }}>
            <div style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong>De :</strong> <span style={{ color: '#c00' }}>Jean-Marc Dupont &lt;pdg@acme-corp.io&gt;</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong>Objet :</strong> <span style={{ color: '#c00', fontWeight: 'bold' }}>⚠️ URGENT - Virement confidentiel</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Reçu :</strong> <span style={{ color: '#666' }}>Aujourd'hui 14:27</span>
              </div>
            </div>
            <p>Bonjour,</p>
            <p style={{ margin: '8px 0' }}>Je suis en réunion confidentielle avec nos avocats. J'ai besoin que vous effectuiez <strong>immédiatement</strong> un virement de <strong style={{ color: '#c00' }}>78 500 €</strong> sur le compte suivant :</p>
            <div style={{ background: '#f5f5f5', padding: '10px', margin: '12px 0', borderLeft: '3px solid #c00' }}>
              <div>IBAN : FR76 1234 5678 9012 3456 7890 123</div>
              <div>BIC : BNPAFRPP</div>
              <div>Motif : Règlement prestataire confidentiel</div>
            </div>
            <p>N'en parlez à <strong>personne</strong>. Je suis en mode "Ne Pas Déranger". Confirmez par retour email.</p>
            <p style={{ marginTop: '12px', color: '#666' }}>Cordialement,<br/><strong>Jean-Marc Dupont</strong><br/>PDG, ACME Corp</p>
          </div>
          <button onClick={next} className="btn-primary" style={{ width: '100%', padding: '12px' }}>Analyser cet email →</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Que faites-vous ?</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Choisissez la meilleure réponse face à cette situation.</p>
          {[
            { id: 'a', text: 'Appeler le PDG sur sa ligne directe pour confirmer', correct: true },
            { id: 'b', text: 'Effectuer le virement — c\'est le PDG qui demande', correct: false },
            { id: 'c', text: 'Répondre par email pour obtenir plus d\'informations', correct: false },
            { id: 'd', text: 'Signaler à l\'IT et au responsable financier immédiatement', correct: true }
          ].map(opt => (
            <button key={opt.id} onClick={() => { setAnswer(opt); next() }} style={{
              display: 'block', width: '100%', padding: '14px 16px', marginBottom: '10px',
              background: 'var(--bg-black)', border: '1px solid var(--border-subtle)',
              borderRadius: '8px', color: 'var(--text-primary)', textAlign: 'left',
              cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#eb2828'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
            >{opt.text}</button>
          ))}
        </div>
      )}

      {step === 3 && (
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>{answer?.correct ? '🏆' : '😬'}</div>
          <h3 style={{ fontSize: '22px', marginBottom: '12px', color: answer?.correct ? '#22c55e' : '#eb2828' }}>
            {answer?.correct ? 'Excellent réflexe !' : 'C\'était un piège !'}
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '14px', lineHeight: 1.7 }}>
            {answer?.correct
              ? 'Bravo ! Vous avez identifié une attaque BEC (Business Email Compromise). La clé : toujours vérifier par téléphone pour les demandes financières urgentes.'
              : '95% des entreprises ont déjà été victimes d\'une attaque BEC. Ne jamais virer sans confirmation orale directe.'}
          </p>
          <div style={{ background: 'rgba(235,40,40,0.08)', border: '1px solid rgba(235,40,40,0.2)', padding: '16px', borderRadius: '8px', marginBottom: '20px', textAlign: 'left' }}>
            <div style={{ fontSize: '12px', color: '#eb2828', fontWeight: 'bold', marginBottom: '8px' }}>🔴 Signaux d'alerte dans cet email :</div>
            {['Domaine suspect (acme-corp.io vs acme.com)', 'Urgence artificielle + secret', 'Demande financière inhabituelle', 'PDG "indisponible" pour confirmer'].map((f, i) => (
              <div key={i} style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>• {f}</div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => { setStep(0); setAnswer(null) }} className="btn-secondary" style={{ padding: '10px 20px' }}>Rejouer</button>
            <button onClick={onClose} className="btn-primary" style={{ padding: '10px 24px' }}>Essai gratuit →</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const [modal, setModal] = useState(null)
  const [toastMsg, setToastMsg] = useState(null)
  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 2500) }
  const onLogin = () => navigate('/login')
  const onStart = () => navigate('/login')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-black)' }}>
      <Navbar onLogin={onLogin} />
      <HeroSection onStart={onStart} setModal={setModal} />
      <ProblemsSection />
      <SolutionSection />
      <FeaturesSection />
      <PricingSection showToast={showToast} />
      <CTASection onStart={onStart} />
      <Footer />
      {toastMsg && <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 300, background: '#0a0a0a', border: '1px solid #22c55e', padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '12px', color: '#22c55e', animation: 'fadeInUp 0.3s ease', borderRadius: '4px' }}>✓ {toastMsg}</div>}
      <Modal isOpen={modal === 'demo'} onClose={() => setModal(null)} title="ROOMCA en action">
        <DemoModal onClose={() => setModal(null)} />
      </Modal>
    </div>
  )
}
