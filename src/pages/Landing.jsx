import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '/home/lise/Room-Cyber-Awareness/public/roomca-logo.png'
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

function VideoSection({ onOpenDemo }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <section style={{ padding: '100px 40px', background: '#000' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: '16px' }}>
          Voir ROOMCA en <span style={{ color: 'var(--red)' }}>action</span>
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '48px', maxWidth: '560px', margin: '0 auto 48px' }}>
          Une simulation complète en 3 minutes. Regardez comment vos employés apprennent à détecter une vraie attaque.
        </p>

        {/* Video Player Mockup */}
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setIsPlaying(p => !p)}
          style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', cursor: 'pointer', background: '#0a0a0a', aspectRatio: '16/9' }}
        >
          {/* Fake screenshot content */}
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0d0d0d 0%, #1a0505 100%)', minHeight: '400px' }}>
            {/* Fake terminal / email UI */}
            <div style={{ width: '80%', maxWidth: '600px', background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(235,40,40,0.3)', borderRadius: '8px', padding: '20px', textAlign: 'left', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                {['#eb2828', '#f59e0b', '#22c55e'].map((c, i) => <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: '#22c55e', lineHeight: 1.8 }}>
                <div style={{ color: 'var(--text-muted)' }}>De : <span style={{ color: '#f59e0b' }}>pdg@acme-corp.net</span> <span style={{ color: 'var(--red)', fontSize: '10px' }}>⚠ domaine suspect</span></div>
                <div style={{ color: 'var(--text-muted)' }}>À : marie.dupont@acme-corp.com</div>
                <div style={{ color: 'var(--text-muted)' }}>Objet : <span style={{ color: 'var(--text-secondary)' }}>ACTION URGENTE — Virement 47 000€</span></div>
                <div style={{ marginTop: '12px', color: 'var(--text-muted)', fontSize: '11px' }}>Marie,{'\n'}J'ai besoin que vous effectuiez un virement confidentiel...</div>
              </div>
            </div>

            {/* Play overlay */}
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: hovered ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)',
              transition: 'background 0.3s',
            }}>
              {!isPlaying ? (
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: hovered ? 'var(--red)' : 'rgba(235,40,40,0.8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '28px', transition: 'all 0.3s',
                  transform: hovered ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: hovered ? '0 0 40px rgba(235,40,40,0.5)' : 'none',
                }}>▶</div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>⏸</div>
                  <div style={{ color: '#fff', fontSize: '14px' }}>En lecture...</div>
                </div>
              )}
            </div>
          </div>

          {/* Duration badge */}
          <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', fontFamily: 'var(--mono)' }}>
            3:24
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '32px' }}>
          <button onClick={onOpenDemo} className="btn-primary" style={{ padding: '12px 32px', fontSize: '14px' }}>
            🎮 Essayer la démo interactive →
          </button>
          <button style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: '4px', fontSize: '13px' }}>
            📅 Voir une démo live
          </button>
        </div>
      </div>
    </section>
  )
}

function ROISection() {
  const [employees, setEmployees] = useState(200)
  const incidentCost = 4500000
  const probReduction = 0.70
  const planCost = employees <= 50 ? 49 : employees <= 500 ? 199 : 499
  const annualPlan = planCost * 12
  const riskBefore = Math.round(incidentCost * 0.12)
  const riskAfter = Math.round(riskBefore * (1 - probReduction))
  const saving = riskBefore - riskAfter
  const roi = Math.round((saving - annualPlan) / annualPlan * 100)

  return (
    <section style={{ padding: '100px 40px', background: 'var(--bg-dark)', borderTop: '1px solid var(--border-subtle)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: '12px' }}>
            Calculateur de ROI
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Combien coûte une cyberattaque vs. combien coûte ROOMCA ?
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
          {/* Controls */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '32px' }}>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>NOMBRE D'EMPLOYÉS</span>
                <span style={{ fontFamily: 'var(--font-title)', fontSize: '22px', color: 'var(--red)' }}>{employees}</span>
              </div>
              <input type="range" min="10" max="2000" step="10" value={employees}
                onChange={e => setEmployees(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#eb2828', cursor: 'pointer' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>10</span><span>2 000</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Coût moyen d\'un incident (source IBM)', value: `${incidentCost.toLocaleString('fr')} €`, color: 'var(--text-muted)' },
                { label: 'Réduction du risque avec ROOMCA', value: '-70%', color: '#22c55e' },
                { label: `Plan ROOMCA recommandé (${employees <= 50 ? 'Starter' : employees <= 500 ? 'Pro' : 'Enterprise'})`, value: `${planCost} €/mois`, color: '#f59e0b' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '200px', lineHeight: 1.3 }}>{r.label}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontWeight: 'bold', color: r.color }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(235,40,40,0.05)', border: '1px solid rgba(235,40,40,0.2)', padding: '24px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.1em' }}>RISQUE SANS FORMATION/AN</div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '36px', color: 'var(--red)', fontWeight: 700 }}>{riskBefore.toLocaleString('fr')} €</div>
            </div>
            <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', padding: '24px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.1em' }}>RISQUE AVEC ROOMCA/AN</div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '36px', color: '#22c55e', fontWeight: 700 }}>{riskAfter.toLocaleString('fr')} €</div>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '2px solid var(--red)', padding: '24px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-10px', left: '20px', background: 'var(--red)', padding: '2px 10px', fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em' }}>ROI ESTIMÉ</div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '52px', color: 'var(--red)', fontWeight: 700, lineHeight: 1 }}>{roi}x</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                Économie nette estimée : <strong style={{ color: '#22c55e' }}>{(saving - annualPlan).toLocaleString('fr')} €/an</strong>
              </div>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              * Estimation basée sur le rapport IBM Cost of a Data Breach 2024 (coût moyen 4,5M€) et les données sectorielles ANSSI. Non contractuel.
            </div>
          </div>
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

const HIDDEN_FLAGS = [
  { id: 'domain',   icon: '🌐', title: 'Faux domaine détecté',       detail: '"acme-corp.io" ≠ "acme.com" — domaine cloné pour imiter le PDG',     color: '#ef4444' },
  { id: 'urgency',  icon: '⚡', title: 'Urgence artificielle',        detail: '"immédiatement" — pression temporelle pour court-circuiter la réflexion', color: '#f59e0b' },
  { id: 'amount',   icon: '💸', title: 'Virement non autorisé',       detail: '78 500€ sans procédure officielle — aucun transfert sans double validation', color: '#ef4444' },
  { id: 'secret',   icon: '🤫', title: 'Demande de silence',          detail: '"N\'en parlez à personne" — isolation de la victime, technique BEC classique', color: '#f59e0b' },
  { id: 'dnd',      icon: '📵', title: 'PDG intentionnellement injoignable', detail: '"Ne Pas Déranger" rend toute vérification impossible — tactique délibérée', color: '#ef4444' },
]

function FlagSpan({ flagId, children, found, activeHint, onFind, setActiveHint }) {
  const isActive = activeHint === flagId
  return (
    <mark
      onClick={() => { onFind(flagId); setActiveHint(flagId) }}
      style={{
        cursor: 'pointer',
        background: found ? 'rgba(235,40,40,0.18)' : isActive ? 'rgba(245,158,11,0.15)' : 'transparent',
        color: 'inherit',
        borderBottom: found ? '2px solid #eb2828' : '2px dashed rgba(235,40,40,0.5)',
        borderRadius: '2px',
        padding: '0 2px',
        fontWeight: found ? '600' : 'inherit',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(235,40,40,0.12)' }}
      onMouseLeave={e => { e.currentTarget.style.background = found ? 'rgba(235,40,40,0.18)' : 'transparent' }}
    >{children}</mark>
  )
}

function DemoModal({ onClose }) {
  const [step, setStep] = useState(0)
  const [answer, setAnswer] = useState(null)
  const [found, setFound] = useState(new Set())
  const [activeHint, setActiveHint] = useState(null)
  const [shake, setShake] = useState(false)

  const total = HIDDEN_FLAGS.length
  const foundCount = found.size

  const findFlag = (id) => {
    if (!found.has(id)) setFound(prev => new Set([...prev, id]))
  }

  const reset = () => { setStep(0); setAnswer(null); setFound(new Set()); setActiveHint(null) }

  return (
    <div style={{ color: 'var(--text-primary)' }}>

      {/* Step 0 — Intro */}
      {step === 0 && (
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <div style={{ fontSize: '52px', marginBottom: '12px' }}>🕵️</div>
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Scénario : Attaque BEC</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '14px', lineHeight: 1.6 }}>
            Un email urgent arrive dans la boîte de votre collègue.<br />
            <strong style={{ color: '#eb2828' }}>Votre mission : trouver les {total} indices cachés</strong> avant de décider quoi faire.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {HIDDEN_FLAGS.map(f => (
              <span key={f.id} style={{ padding: '4px 10px', background: 'rgba(235,40,40,0.08)', border: '1px solid rgba(235,40,40,0.2)', borderRadius: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
                {f.icon} {f.title}
              </span>
            ))}
          </div>
          <button onClick={() => setStep(1)} className="btn-primary" style={{ padding: '12px 36px' }}>
            🔍 Lancer l'enquête
          </button>
        </div>
      )}

      {/* Step 1 — Interactive email with hidden objects */}
      {step === 1 && (
        <div>
          {/* HUD */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '8px 12px', background: 'rgba(235,40,40,0.06)', border: '1px solid rgba(235,40,40,0.2)', borderRadius: '6px' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#eb2828' }}>
              🕵️ MODE INVESTIGATION
            </span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '12px' }}>
              {[...Array(total)].map((_, i) => (
                <span key={i} style={{ marginLeft: '4px', fontSize: '14px', opacity: i < foundCount ? 1 : 0.25 }}>🔴</span>
              ))}
              <span style={{ marginLeft: '8px', color: foundCount === total ? '#22c55e' : 'var(--text-muted)', fontSize: '11px' }}>
                {foundCount}/{total} indices
              </span>
            </span>
          </div>

          {/* Active hint panel */}
          {activeHint ? (
            <div style={{ marginBottom: '8px', padding: '10px 14px', background: `${HIDDEN_FLAGS.find(f => f.id === activeHint)?.color}18`, border: `1px solid ${HIDDEN_FLAGS.find(f => f.id === activeHint)?.color}55`, borderRadius: '6px', fontSize: '12px', lineHeight: 1.5 }}>
              <span style={{ color: HIDDEN_FLAGS.find(f => f.id === activeHint)?.color, fontWeight: 'bold' }}>
                {HIDDEN_FLAGS.find(f => f.id === activeHint)?.icon} {HIDDEN_FLAGS.find(f => f.id === activeHint)?.title}
              </span>
              <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>
                — {HIDDEN_FLAGS.find(f => f.id === activeHint)?.detail}
              </span>
            </div>
          ) : (
            <div style={{ marginBottom: '8px', fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              💡 Cliquez sur les éléments soulignés pour révéler les indices cachés
            </div>
          )}

          {/* Email */}
          <div style={{ background: '#ffffff', color: '#111', padding: '18px', borderRadius: '8px', fontFamily: 'Arial, sans-serif', fontSize: '13px', marginBottom: '14px', lineHeight: 1.7 }}>
            {/* Header */}
            <div style={{ borderBottom: '1px solid #e5e5e5', paddingBottom: '12px', marginBottom: '14px', fontSize: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '4px' }}>
                <span style={{ color: '#666' }}>De :</span>
                <span>
                  Jean-Marc Dupont &lt;
                  <FlagSpan flagId="domain" found={found.has('domain')} onFind={findFlag} activeHint={activeHint} setActiveHint={setActiveHint}>pdg@acme-corp.io</FlagSpan>
                  &gt;
                </span>
                <span style={{ color: '#666' }}>À :</span>
                <span>marie.dupont@acme.com</span>
                <span style={{ color: '#666' }}>Objet :</span>
                <span style={{ fontWeight: 'bold', color: '#b00' }}>⚠️ URGENT — Virement confidentiel</span>
                <span style={{ color: '#666' }}>Reçu :</span>
                <span style={{ color: '#666' }}>Aujourd'hui 14:27</span>
              </div>
            </div>

            {/* Body — use div instead of p to allow absolute-positioned tooltip spans inside */}
            <div style={{ marginBottom: '8px' }}>Bonjour Marie,</div>
            <div style={{ margin: '10px 0' }}>
              Je suis actuellement en réunion confidentielle avec nos avocats. J'ai besoin que vous effectuiez{' '}
              <FlagSpan flagId="urgency" found={found.has('urgency')} onFind={findFlag} activeHint={activeHint} setActiveHint={setActiveHint}>
                <strong>immédiatement</strong>
              </FlagSpan>
              {' '}un virement de{' '}
              <FlagSpan flagId="amount" found={found.has('amount')} onFind={findFlag} activeHint={activeHint} setActiveHint={setActiveHint}>
                <strong style={{ color: '#b00' }}>78 500 €</strong>
              </FlagSpan>
              {' '}sur le compte suivant :
            </div>

            <div style={{ background: '#f8f8f8', padding: '10px 14px', margin: '10px 0', borderLeft: '3px solid #ccc', fontSize: '12px', fontFamily: 'monospace' }}>
              <div>IBAN : FR76 1234 5678 9012 3456 7890 123</div>
              <div>BIC : BNPAFRPP</div>
              <div>Motif : Règlement prestataire confidentiel</div>
            </div>

            <div style={{ margin: '10px 0' }}>
              <FlagSpan flagId="secret" found={found.has('secret')} onFind={findFlag} activeHint={activeHint} setActiveHint={setActiveHint}>
                N'en parlez à <strong>personne</strong>
              </FlagSpan>
              . Je suis en mode "{' '}
              <FlagSpan flagId="dnd" found={found.has('dnd')} onFind={findFlag} activeHint={activeHint} setActiveHint={setActiveHint}>
                Ne Pas Déranger
              </FlagSpan>
              ". Confirmez uniquement par retour email.
            </div>

            <p style={{ marginTop: '14px', color: '#555' }}>
              Cordialement,<br />
              <strong>Jean-Marc Dupont</strong><br />
              PDG, ACME Corp
            </p>
          </div>

          {/* Proceed button */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => setStep(2)}
              className={foundCount > 0 ? 'btn-primary' : 'btn-secondary'}
              style={{ flex: 1, padding: '11px', justifyContent: 'center' }}
            >
              {foundCount === total ? '🏆 Tous trouvés — Décider maintenant →' : foundCount > 0 ? `Continuer avec ${foundCount} indice${foundCount > 1 ? 's' : ''} →` : 'Passer directement →'}
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Decision */}
      {step === 2 && (
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', padding: '10px 14px', background: foundCount >= 3 ? 'rgba(34,197,94,0.08)' : 'rgba(245,158,11,0.08)', border: `1px solid ${foundCount >= 3 ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`, borderRadius: '6px', fontSize: '12px' }}>
            <span>{foundCount >= 3 ? '🟢' : '🟡'}</span>
            <span style={{ color: foundCount >= 3 ? '#22c55e' : '#f59e0b' }}>
              {foundCount === total ? `${total}/${total} indices trouvés — Excellente analyse !` : `${foundCount}/${total} indices identifiés${foundCount < 3 ? ' — quelques-uns vous ont échappé' : ''}`}
            </span>
          </div>
          <h4 style={{ marginBottom: '6px' }}>Quelle est votre décision ?</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>Choisissez la meilleure réponse face à cette situation.</p>
          {[
            { id: 'a', text: 'Appeler le PDG sur sa ligne directe connue pour vérifier', correct: true },
            { id: 'b', text: 'Effectuer le virement — le PDG en a besoin maintenant', correct: false },
            { id: 'c', text: 'Répondre à l\'email pour demander plus d\'informations', correct: false },
            { id: 'd', text: 'Alerter le responsable IT et le directeur financier', correct: true },
          ].map(opt => (
            <button key={opt.id} onClick={() => { setAnswer(opt); setStep(3) }} style={{
              display: 'block', width: '100%', padding: '13px 16px', marginBottom: '8px',
              background: 'var(--bg-black)', border: '1px solid var(--border-subtle)',
              borderRadius: '8px', color: 'var(--text-primary)', textAlign: 'left',
              cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#eb2828'; e.currentTarget.style.background = 'rgba(235,40,40,0.04)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--bg-black)' }}
            >{opt.text}</button>
          ))}
        </div>
      )}

      {/* Step 3 — Result */}
      {step === 3 && (
        <div>
          <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
            <div style={{ fontSize: '52px', marginBottom: '10px' }}>{answer?.correct ? '🏆' : '😬'}</div>
            <h3 style={{ fontSize: '20px', marginBottom: '8px', color: answer?.correct ? '#22c55e' : '#eb2828' }}>
              {answer?.correct ? 'Bon réflexe !' : 'C\'était un piège !'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.7, marginBottom: '16px', maxWidth: '380px', margin: '0 auto 16px' }}>
              {answer?.correct
                ? 'Vous avez réagi correctement face à une attaque BEC. La règle d\'or : toujours vérifier par un canal indépendant pour toute demande financière urgente.'
                : '95% des entreprises ont été victimes d\'une attaque BEC. Un virement sans vérification orale peut coûter des dizaines de milliers d\'euros.'}
            </p>
          </div>

          {/* Score + flags found */}
          <div style={{ background: 'rgba(235,40,40,0.05)', border: '1px solid rgba(235,40,40,0.2)', padding: '14px', borderRadius: '8px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '12px' }}>
              <span style={{ color: '#eb2828', fontWeight: 'bold' }}>🔍 Indices trouvés : {foundCount}/{total}</span>
              <span style={{ color: answer?.correct ? '#22c55e' : '#f59e0b', fontWeight: 'bold' }}>
                Score : {Math.round((foundCount / total * 50) + (answer?.correct ? 50 : 0))}/100
              </span>
            </div>
            {HIDDEN_FLAGS.map(f => (
              <div key={f.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '6px', opacity: found.has(f.id) ? 1 : 0.4 }}>
                <span style={{ fontSize: '14px', flexShrink: 0 }}>{found.has(f.id) ? '✅' : '❌'}</span>
                <div>
                  <span style={{ fontSize: '12px', color: f.color, fontWeight: 'bold' }}>{f.icon} {f.title}</span>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{f.detail}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={reset} className="btn-secondary" style={{ padding: '10px 20px' }}>🔄 Rejouer</button>
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
      <VideoSection onOpenDemo={() => setModal('demo')} />
      <ROISection />
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
