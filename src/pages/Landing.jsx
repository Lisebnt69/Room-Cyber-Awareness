import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '/roomca-logo.png'
import LangToggle from '../components/LangToggle'
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
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,255,0.07) 0%, transparent 70%)' }}>
      <div className="cyber-grid" style={{ position: 'absolute', inset: 0 }} />
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ position: 'absolute', left: `${10 + i * 16}%`, top: 0, bottom: 0, width: '1px', background: `linear-gradient(180deg, transparent, rgba(0,212,255,${0.04 + i * 0.012}) 50%, transparent)`, animation: `fadeIn ${1 + i * 0.3}s ease` }} />
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

      <img src={Logo} alt="ROOMCA" style={{ height: '32px', width: 'auto' }} />

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
          <span style={{ color: 'var(--cyan)' }}>Les attaquants espèrent que non.</span>
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

        <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--cyan)', letterSpacing: '0.1em', minHeight: '18px', marginBottom: '56px' }}>
          {typed}<span className="animate-blink">█</span>
        </div>

        <div style={{ display: 'flex', gap: '48px', justifyContent: 'center', flexWrap: 'wrap', padding: '24px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '32px', color: 'var(--cyan)', fontWeight: 700 }}>90%</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>erreurs humaines</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '32px', color: 'var(--cyan)', fontWeight: 700 }}>4x</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>mieux retenu</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '32px', color: 'var(--cyan)', fontWeight: 700 }}>48+</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>entreprises actives</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '32px', color: 'var(--cyan)', fontWeight: 700 }}>15</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>frameworks conformité</div>
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

function LiveDemoTeaser({ onOpenDemo }) {
  const [revealed, setRevealed] = useState(false)
  const threats = [
    { id: 'domain', x: '54%', y: '18%', label: 'Faux domaine', detail: 'acme-corp.io ≠ acme.com', color: '#ef4444' },
    { id: 'urgency', x: '28%', y: '44%', label: 'Urgence artificielle', detail: '"immédiatement"', color: '#f59e0b' },
    { id: 'amount', x: '60%', y: '44%', label: 'Virement 78 500€', detail: 'Sans procédure officielle', color: '#ef4444' },
    { id: 'secret', x: '20%', y: '62%', label: 'Demande de silence', detail: '"N\'en parlez à personne"', color: '#f59e0b' },
    { id: 'dnd', x: '56%', y: '62%', label: 'PDG injoignable', detail: '"Ne Pas Déranger"', color: '#ef4444' },
  ]
  return (
    <section style={{ padding: '100px 40px', background: 'var(--bg-base)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{ display: 'inline-block', padding: '4px 14px', background: 'rgba(235,40,40,0.1)', border: '1px solid rgba(235,40,40,0.3)', borderRadius: '20px', fontSize: '12px', color: 'var(--red)', letterSpacing: '0.1em', marginBottom: '20px' }}>
            SIMULATION EN DIRECT
          </div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: '16px' }}>
            Vos équipes reconnaîtraient-elles<br />
            <span style={{ color: 'var(--red)' }}>cette attaque ?</span>
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto' }}>
            Cet email est arrivé hier dans une PME française. En 4 heures, 78 500€ étaient virés.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
          {/* Email preview */}
          <div style={{ position: 'relative' }}>
            <div style={{ background: '#ffffff', color: '#111', borderRadius: '10px', padding: '20px', fontFamily: 'Arial, sans-serif', fontSize: '13px', lineHeight: 1.7, boxShadow: '0 20px 60px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ borderBottom: '1px solid #e5e5e5', paddingBottom: '12px', marginBottom: '14px', fontSize: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '4px' }}>
                  <span style={{ color: '#666' }}>De :</span>
                  <span style={{ color: revealed ? '#ef4444' : '#111', fontWeight: revealed ? 700 : 400, transition: 'all 0.3s' }}>
                    Jean-Marc Dupont &lt;pdg@acme-corp<span style={{ background: revealed ? '#fef2f2' : 'transparent', transition: 'all 0.3s' }}>.io</span>&gt;
                  </span>
                  <span style={{ color: '#666' }}>Objet :</span>
                  <span style={{ fontWeight: 'bold', color: '#b00' }}>⚠️ URGENT — Virement confidentiel</span>
                </div>
              </div>
              <div style={{ marginBottom: '8px' }}>Bonjour Marie,</div>
              <div style={{ margin: '10px 0' }}>
                Je suis en réunion confidentielle. J'ai besoin que vous effectuiez{' '}
                <strong style={{ color: revealed ? '#f59e0b' : '#111', transition: 'color 0.3s' }}>immédiatement</strong>
                {' '}un virement de{' '}
                <strong style={{ color: revealed ? '#ef4444' : '#b00', transition: 'color 0.3s' }}>78 500 €</strong>.
              </div>
              <div style={{ background: '#f8f8f8', padding: '8px 12px', margin: '10px 0', borderLeft: '3px solid #ccc', fontSize: '11px', fontFamily: 'monospace' }}>
                IBAN : FR76 1234 5678 9012 3456 7890 123
              </div>
              <div style={{ margin: '10px 0', color: revealed ? '#f59e0b' : '#111', transition: 'color 0.3s' }}>
                <strong>N'en parlez à personne.</strong> Je suis en mode "<strong>Ne Pas Déranger</strong>".
              </div>
              <div style={{ marginTop: '14px', color: '#555', fontSize: '12px' }}>
                Cordialement,<br /><strong>Jean-Marc Dupont</strong>, PDG ACME Corp
              </div>

              {/* Threat badges — shown on reveal */}
              {revealed && threats.map(t => (
                <div key={t.id} style={{ position: 'absolute', left: t.x, top: t.y, transform: 'translate(-50%, -50%)', zIndex: 10 }}>
                  <div style={{ background: t.color, color: '#fff', fontSize: '10px', padding: '3px 8px', borderRadius: '10px', whiteSpace: 'nowrap', fontWeight: 700, boxShadow: `0 0 12px ${t.color}88` }}>
                    ⚠ {t.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Reveal overlay */}
            {!revealed && (
              <div
                onClick={() => setRevealed(true)}
                style={{ position: 'absolute', inset: 0, borderRadius: '10px', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>Repérer les indices</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '4px' }}>Cliquez pour révéler</div>
              </div>
            )}
          </div>

          {/* Right side */}
          <div>
            {revealed ? (
              <div>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>😱</div>
                <h3 style={{ fontSize: '22px', color: 'var(--red)', marginBottom: '12px' }}>5 signaux d'alarme ignorés</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7, marginBottom: '24px' }}>
                  En moyenne, <strong style={{ color: 'var(--text-light)' }}>1 employé sur 3</strong> aurait effectué le virement sans vérifier.
                  ROOMCA forme vos équipes à repérer chaque indice — avant qu'il ne coûte cher.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
                  {threats.map(t => (
                    <div key={t.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '8px 12px', background: `${t.color}10`, border: `1px solid ${t.color}33`, borderRadius: '6px' }}>
                      <span style={{ color: t.color, fontSize: '14px' }}>⚠</span>
                      <div>
                        <span style={{ fontSize: '13px', color: t.color, fontWeight: 700 }}>{t.label}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px' }}>{t.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={onOpenDemo} className="btn-primary" style={{ padding: '14px 32px', fontSize: '15px' }}>
                  Tester la simulation complète →
                </button>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '22px', marginBottom: '16px' }}>
                  1 clic peut coûter<br />
                  <span style={{ color: 'var(--red)' }}>des milliers d'euros</span>
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7, marginBottom: '24px' }}>
                  Les attaques BEC (Business Email Compromise) ont coûté <strong style={{ color: 'var(--text-light)' }}>2,7 milliards €</strong> aux entreprises européennes en 2023.
                </p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '28px' }}>
                  {[['95%', 'des entreprises ciblées'], ['78k€', 'montant moyen détourné'], ['4h', 'pour virer les fonds']].map(([val, lbl]) => (
                    <div key={lbl} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--red)' }}>{val}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{lbl}</div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  ← Ouvrez l'email pour voir si vous repériez l'attaque
                </p>
              </div>
            )}
          </div>
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
    {
      name: 'Starter',
      price: '99',
      badge: null,
      highlight: false,
      color: 'var(--cyan)',
      features: [
        { text: "Jusqu'à 50 employés", included: true },
        { text: '8 scénarios immersifs', included: true },
        { text: 'Analytics basique', included: true },
        { text: 'Support email 48h', included: true },
        { text: 'Rapports conformité', included: false },
        { text: 'Moteur Risk Score IA', included: false },
        { text: 'White-label', included: false },
      ]
    },
    {
      name: 'Business',
      price: '449',
      badge: 'RECOMMANDÉ RSSI',
      highlight: true,
      color: 'var(--cyan)',
      features: [
        { text: "Jusqu'à 500 employés", included: true },
        { text: '32 scénarios + sectoriels', included: true },
        { text: 'Analytics avancée + heatmap', included: true },
        { text: 'Support prioritaire 4h', included: true },
        { text: 'Rapports PDF NIS2 & DORA auto', included: true },
        { text: 'Moteur Risk Score IA comportemental', included: true },
        { text: 'White-label basique', included: false },
      ]
    },
    {
      name: 'Enterprise MSP',
      price: 'Sur devis',
      badge: null,
      highlight: false,
      color: 'var(--white-70)',
      features: [
        { text: 'Employés illimités', included: true },
        { text: 'Scénarios custom + builder', included: true },
        { text: 'SSO / SAML + 2FA', included: true },
        { text: 'API REST complète', included: true },
        { text: 'Rapports conformité multi-frameworks', included: true },
        { text: 'Multi-tenant MSP full white-label', included: true },
        { text: 'SLA 99,9% · Hébergement FR dédié', included: true },
      ]
    },
  ]

  return (
    <section id="pricing" style={{ padding: '100px 40px', background: 'var(--navy-800)' }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto', textAlign: 'center' }}>

        <div className="tag" style={{ marginBottom: '20px', display: 'inline-flex' }}>
          <span className="status-dot cyan" /> Tarifs transparents · Hébergement 100% France
        </div>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(30px, 4vw, 46px)', marginBottom: '16px' }}>
          Un incident coûte <span style={{ color: 'var(--cyan)' }}>4,5 M€</span> en moyenne.<br />
          ROOMCA vous en protège dès 99 €/mois.
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '64px' }}>
          Engagements annuels · Sans frais cachés · Données souveraines (OVHcloud France)
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', alignItems: 'start' }}>
          {plans.map((p, idx) => (
            <div key={idx} style={{
              position: 'relative',
              background: p.highlight ? 'rgba(0,212,255,0.06)' : 'var(--glass-bg)',
              border: p.highlight ? '2px solid var(--cyan)' : '1px solid var(--border)',
              borderRadius: 'var(--r-xl)',
              padding: '40px 32px',
              backdropFilter: 'var(--glass-blur)',
              boxShadow: p.highlight ? '0 0 48px rgba(0,212,255,0.12), var(--glass-shadow)' : 'var(--glass-shadow)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
            >
              {p.badge && (
                <div style={{
                  position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, var(--cyan), var(--cyan-dim))',
                  color: 'var(--navy-900)', padding: '4px 16px', fontSize: '10px',
                  fontWeight: 700, letterSpacing: '0.12em', borderRadius: '100px',
                  whiteSpace: 'nowrap', fontFamily: 'var(--font-title)'
                }}>
                  {p.badge}
                </div>
              )}

              <div style={{ fontFamily: 'var(--font-title)', fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
                {p.name}
              </div>

              {p.price === 'Sur devis' ? (
                <div style={{ fontFamily: 'var(--font-title)', fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Sur devis
                </div>
              ) : (
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-title)', fontSize: '52px', fontWeight: 700, color: p.highlight ? 'var(--cyan)' : 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    {p.price} €
                  </span>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/mois HT</span>
                </div>
              )}

              <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '24px 0' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px', textAlign: 'left' }}>
                {p.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px', color: f.included ? 'var(--text-secondary)' : 'var(--text-muted)', opacity: f.included ? 1 : 0.45 }}>
                    <span style={{ color: f.included ? (p.highlight ? 'var(--cyan)' : 'var(--success)') : 'var(--text-muted)', fontSize: '14px', flexShrink: 0 }}>
                      {f.included ? '✓' : '–'}
                    </span>
                    {f.text}
                  </div>
                ))}
              </div>

              <button
                className={p.highlight ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%', justifyContent: 'center', fontSize: '13px' }}
                onClick={() => showToast(`Plan "${p.name}" sélectionné — notre équipe vous contacte sous 24h.`)}
              >
                {p.price === 'Sur devis' ? 'Demander un devis' : 'Démarrer l\'essai gratuit'}
              </button>

              {p.highlight && (
                <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
                  14 jours d'essai gratuit · Sans carte bancaire
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
          {[
            { icon: '🇫🇷', label: 'Données hébergées en France' },
            { icon: '🔒', label: 'Conforme RGPD & NIS2' },
            { icon: '📄', label: 'Facture mensuelle · Sans engagement min.' },
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>{t.icon}</span> {t.label}
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
          <span style={{ color: 'var(--red)' }}>Avant que quelqu'un d'autre le fasse.</span>
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.8 }}>
          Aucune carte bancaire requise. Accès complet pendant 14 jours. Prêt à découvrir vos vraies vulnérabilités ?
        </p>
        <button className="btn-primary" style={{ fontSize: '16px', padding: '16px 48px' }} onClick={onStart}>
          Lancer l'essai gratuit
        </button>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>

        <img src={Logo} alt="ROOMCA" style={{ height: '24px', width: 'auto' }} />
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>Cyber Awareness</span>

      </div>
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

const SCENARIOS = [
  {
    id: 'bec', icon: '💼', name: 'Arnaque au Président', tag: 'BEC', difficulty: 'Intermédiaire', diffColor: '#f59e0b',
    desc: 'Un email urgent prétend venir du PDG. Trouvez les signaux d\'alerte avant de décider.',
    context: 'Vous êtes Marie, assistante de direction chez ACME Corp. Il est 14h27. Votre PDG est en déplacement depuis ce matin.',
    mission: 'Analysez cet email attentivement avant de prendre une décision. Cliquez sur chaque élément qui vous semble suspect pour le révéler.',
    lookFor: 'Adresse expéditeur · Ton d\'urgence · Nature de la demande · Possibilité de vérification',
    flags: [
      { id: 'domain',  icon: '🌐', title: 'Faux domaine',           detail: '"acme-corp.io" ≠ "acme.com"',             color: '#ef4444', tip: 'Un caractère différent suffit pour cloner une identité. Vérifiez toujours l\'adresse expéditeur complète.' },
      { id: 'urgency', icon: '⚡', title: 'Urgence artificielle',   detail: '"immédiatement"',                         color: '#f59e0b', tip: 'La pression temporelle est le premier levier d\'une attaque BEC. Prenez toujours le temps de vérifier.' },
      { id: 'amount',  icon: '💸', title: 'Virement sans procédure',detail: '78 500€ sans double validation',           color: '#ef4444', tip: 'Aucune demande financière urgente ne devrait bypasser le processus de validation habituel.' },
      { id: 'secret',  icon: '🤫', title: 'Demande de silence',     detail: '"N\'en parlez à personne"',               color: '#f59e0b', tip: 'L\'isolation est une tactique BEC classique. Au contraire — alertez immédiatement votre responsable.' },
      { id: 'dnd',     icon: '📵', title: 'PDG injoignable',        detail: '"Ne Pas Déranger"',                       color: '#ef4444', tip: 'L\'attaquant se rend volontairement injoignable. Utilisez un numéro connu, jamais celui de l\'email.' },
    ],
    options: [
      { id: 'a', text: 'Appeler le PDG sur sa ligne directe connue pour vérifier', correct: true },
      { id: 'b', text: 'Effectuer le virement — le PDG en a besoin maintenant', correct: false },
      { id: 'c', text: 'Répondre à l\'email pour demander plus d\'informations', correct: false },
      { id: 'd', text: 'Alerter le responsable IT et le directeur financier', correct: true },
    ],
    result: {
      correct: 'Bon réflexe. Règle d\'or : toujours vérifier par téléphone sur un numéro connu pour toute demande financière urgente, même si elle semble venir d\'un supérieur.',
      wrong: '95% des PME françaises ont été ciblées par une attaque BEC. Un virement sans vérification orale peut coûter des dizaines de milliers d\'euros en quelques heures.',
    },
  },
  {
    id: 'ransomware', icon: '🖥️', name: 'Infection Ransomware', tag: 'Ransomware', difficulty: 'Intermédiaire', diffColor: '#f59e0b',
    desc: 'Votre écran affiche ce message au démarrage. Identifiez les indices et décidez quoi faire.',
    context: 'Il est 8h47. Vous allumez votre poste au bureau. Tous vos fichiers semblent inaccessibles. Cet écran s\'affiche à la place de votre bureau Windows.',
    mission: 'Ne paniquez pas. Lisez attentivement ce message de rançon et identifiez les éléments qui révèlent la nature réelle de cette attaque.',
    lookFor: 'Mode de paiement · Menaces utilisées · Coordonnées de contact · Instructions paradoxales',
    flags: [
      { id: 'bitcoin',  icon: '₿',  title: 'Paiement crypto anonyme', detail: '0.3 BTC (~13 200€)',                  color: '#ef4444', tip: 'Aucune entité légitime ne demande un paiement en Bitcoin. C\'est conçu pour être intraçable et irrécupérable.' },
      { id: 'timer',    icon: '⏰', title: 'Compte à rebours 48h',    detail: 'Pression temporelle extrême',          color: '#f59e0b', tip: 'Ce délai empêche de consulter votre DSI ou les autorités. Ne décidez jamais sous pression en cas d\'attaque.' },
      { id: 'noreport', icon: '🚫', title: 'Interdit d\'alerter',     detail: '"Ne contactez pas la police"',        color: '#ef4444', tip: 'Au contraire — alertez immédiatement votre DSI et signalez à l\'ANSSI (anssi.fr). Ne payez jamais la rançon.' },
      { id: 'email',    icon: '📧', title: 'Adresse .onion (dark web)',detail: 'ransom@darkmail.onion',               color: '#ef4444', tip: 'Une adresse .onion appartient au dark web. Aucune autorité ni entreprise légitime n\'utilise ce type d\'adresse.' },
      { id: 'backup',   icon: '💾', title: 'Sauvegardes compromises', detail: '"Vos backups ont été chiffrés"',      color: '#f59e0b', tip: 'Les attaquants ciblent aussi les sauvegardes. La règle 3-2-1 (3 copies, 2 supports, 1 hors-ligne) protège contre ça.' },
    ],
    options: [
      { id: 'a', text: 'Payer la rançon rapidement pour récupérer les fichiers', correct: false },
      { id: 'b', text: 'Débrancher immédiatement le réseau et alerter le DSI', correct: true },
      { id: 'c', text: 'Attendre et voir si le virus se supprime seul', correct: false },
      { id: 'd', text: 'Signaler à l\'ANSSI et activer le plan de reprise d\'activité', correct: true },
    ],
    result: {
      correct: 'Excellent. Isoler la machine (câble réseau débranché, Wi-Fi coupé) limite la propagation. Payer n\'est jamais conseillé — ça finance les attaquants et ne garantit pas la récupération.',
      wrong: 'Les ransomwares coûtent en moyenne 620 000€ aux PME (rançon + reprise). Payer encourage les attaquants et ne garantit pas la récupération des fichiers.',
    },
  },
  {
    id: 'smishing', icon: '📱', name: 'Phishing par SMS', tag: 'Smishing', difficulty: 'Débutant', diffColor: '#22c55e',
    desc: 'Vous recevez ce SMS sur votre téléphone professionnel. Repérez les signaux d\'alerte.',
    context: 'Vous venez d\'arriver au bureau. Ce SMS arrive sur votre téléphone professionnel. Vous attendez effectivement un colis commandé la semaine dernière.',
    mission: 'Analysez ce SMS avant de faire quoi que ce soit. Cliquez sur les éléments suspects pour les identifier — même quand le contexte semble plausible.',
    lookFor: 'Numéro expéditeur · Lien fourni · Nature de la demande · Pression temporelle',
    flags: [
      { id: 'sender',  icon: '📱', title: 'Numéro mobile inconnu',   detail: '+33 7 XX — pas un numéro court officiel', color: '#ef4444', tip: 'La Poste utilise des numéros courts officiels (36 31). Un mobile inconnu en +33 7 est systématiquement une usurpation.' },
      { id: 'amount',  icon: '💳', title: 'Micro-paiement par lien', detail: '2€90 à payer via un lien SMS',           color: '#f59e0b', tip: 'Les frais de douane réels arrivent par courrier officiel, jamais par SMS avec un lien de paiement direct.' },
      { id: 'urgency', icon: '⚡', title: 'Délai court ("24h")',     detail: '"Sinon retour à l\'expéditeur"',         color: '#f59e0b', tip: 'La pression temporelle sur un micro-paiement est le signal classique du smishing. Prenez le temps de vérifier.' },
      { id: 'domain',  icon: '🔗', title: 'URL frauduleuse',         detail: '"laposte-livraison.net"',               color: '#ef4444', tip: 'La Poste utilise uniquement laposte.fr. Tout autre domaine est une page de vol de coordonnées bancaires.' },
    ],
    options: [
      { id: 'a', text: 'Cliquer sur le lien et payer 2€90 pour recevoir mon colis', correct: false },
      { id: 'b', text: 'Vérifier l\'état du colis directement sur laposte.fr (jamais via le lien)', correct: true },
      { id: 'c', text: 'Répondre au SMS pour contester la demande', correct: false },
      { id: 'd', text: 'Signaler le SMS à 33700 et bloquer le numéro', correct: true },
    ],
    result: {
      correct: 'Bonne réaction. Ces SMS capturent vos coordonnées bancaires sur une fausse page. Toujours vérifier sur le site officiel, jamais via un lien reçu par message.',
      wrong: 'Ce smishing vole les coordonnées bancaires. En France, 3,5 millions de personnes ont été ciblées en 2023. La Poste ne demande jamais un paiement par SMS avec un lien externe.',
    },
  },
]

function FlagSpan({ flagId, children, found, activeHint, onFind, setActiveHint }) {
  const isActive = activeHint === flagId
  return (
    <mark
      onClick={() => { onFind(flagId); setActiveHint(flagId) }}
      title="Investiguer cet élément"
      style={{
        cursor: 'pointer',
        background: found ? 'rgba(235,40,40,0.18)' : isActive ? 'rgba(245,158,11,0.12)' : 'transparent',
        color: found ? 'inherit' : 'inherit',
        borderBottom: found ? '2px solid #eb2828' : '1px dashed rgba(160,160,160,0.2)',
        borderRadius: '2px',
        padding: '0 2px',
        fontWeight: found ? '600' : 'inherit',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => { if (!found) e.currentTarget.style.background = 'rgba(160,160,160,0.08)' }}
      onMouseLeave={e => { e.currentTarget.style.background = found ? 'rgba(235,40,40,0.18)' : 'transparent' }}
    >{children}</mark>
  )
}

function ScenarioEmail({ scenarioId, found, findFlag, activeHint, setActiveHint }) {
  const FS = ({ id, children }) => (
    <FlagSpan flagId={id} found={found.has(id)} onFind={findFlag} activeHint={activeHint} setActiveHint={setActiveHint}>
      {children}
    </FlagSpan>
  )
  const emailBox = { background: '#fff', color: '#111', padding: '18px', borderRadius: '8px', fontFamily: 'Arial, sans-serif', fontSize: '13px', marginBottom: '14px', lineHeight: 1.7 }
  const hdr = { borderBottom: '1px solid #e5e5e5', paddingBottom: '12px', marginBottom: '14px', fontSize: '12px' }
  const grid = { display: 'grid', gridTemplateColumns: '80px 1fr', gap: '4px' }

  if (scenarioId === 'bec') return (
    <div style={emailBox}>
      <div style={hdr}>
        <div style={grid}>
          <span style={{ color: '#666' }}>De :</span>
          <span>Jean-Marc Dupont &lt;<FS id="domain">pdg@acme-corp.io</FS>&gt;</span>
          <span style={{ color: '#666' }}>À :</span><span>marie.dupont@acme.com</span>
          <span style={{ color: '#666' }}>Objet :</span><span style={{ fontWeight: 'bold', color: '#b00' }}>⚠️ URGENT — Virement confidentiel</span>
          <span style={{ color: '#666' }}>Reçu :</span><span style={{ color: '#666' }}>Aujourd'hui 14:27</span>
        </div>
      </div>
      <div style={{ marginBottom: '8px' }}>Bonjour Marie,</div>
      <div style={{ margin: '10px 0' }}>
        Je suis en réunion confidentielle avec nos avocats. J'ai besoin que vous effectuiez{' '}
        <FS id="urgency"><strong>immédiatement</strong></FS>{' '}un virement de{' '}
        <FS id="amount"><strong style={{ color: '#b00' }}>78 500 €</strong></FS>{' '}sur le compte suivant :
      </div>
      <div style={{ background: '#f8f8f8', padding: '10px 14px', margin: '10px 0', borderLeft: '3px solid #ccc', fontSize: '12px', fontFamily: 'monospace' }}>
        <div>IBAN : FR76 1234 5678 9012 3456 7890 123</div>
        <div>BIC : BNPAFRPP · Motif : Règlement prestataire confidentiel</div>
      </div>
      <div style={{ margin: '10px 0' }}>
        <FS id="secret">N'en parlez à <strong>personne</strong></FS>. Je suis en mode "<FS id="dnd">Ne Pas Déranger</FS>". Confirmez uniquement par retour email.
      </div>
      <p style={{ marginTop: '14px', color: '#555' }}>Cordialement,<br /><strong>Jean-Marc Dupont</strong><br />PDG, ACME Corp</p>
    </div>
  )

  if (scenarioId === 'ransomware') return (
    <div style={{ background: '#0a0a0a', color: '#eee', padding: '20px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '13px', marginBottom: '14px', border: '2px solid #ef4444', lineHeight: 1.7 }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '40px', marginBottom: '6px' }}>💀</div>
        <div style={{ fontSize: '16px', color: '#ef4444', fontWeight: 700, letterSpacing: '0.05em' }}>VOS FICHIERS ONT ÉTÉ CHIFFRÉS</div>
        <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>YOUR FILES HAVE BEEN ENCRYPTED</div>
      </div>
      <div style={{ background: '#1a0000', border: '1px solid #ef444444', padding: '14px', borderRadius: '4px', marginBottom: '12px', fontSize: '12px' }}>
        <div style={{ marginBottom: '8px' }}>Tous vos fichiers ont été chiffrés avec AES-256-CBC.</div>
        <div style={{ marginBottom: '8px' }}>Pour récupérer vos données, envoyez :</div>
        <div style={{ color: '#f59e0b', margin: '10px 0', fontSize: '13px' }}>
          <FS id="bitcoin">▶ 0,3 BTC (~13 200€) vers : 1A2B3CXmX9f7kLpQzR...</FS>
        </div>
        <div>Délai : <FS id="timer"><strong style={{ color: '#ef4444' }}>48 HEURES</strong></FS> — passé ce délai le prix double.</div>
        <div style={{ marginTop: '8px' }}><FS id="noreport">⚠ Ne contactez pas la police — nous le détecterons.</FS></div>
        <div style={{ marginTop: '6px' }}>Contact : <FS id="email">support@darkmail.onion</FS></div>
      </div>
      <div style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
        <FS id="backup">⚠ Vos sauvegardes locales et cloud ont également été chiffrées.</FS>
      </div>
    </div>
  )

  // smishing
  return (
    <div style={{ background: '#f2f2f7', borderRadius: '12px', padding: '16px 16px 12px', marginBottom: '14px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ fontSize: '11px', color: '#8e8e93', textAlign: 'center', marginBottom: '12px' }}>
        <FS id="sender">+33 7 58 23 14 97</FS> · il y a 3 min
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
        <div style={{ background: '#e5e5ea', borderRadius: '18px 18px 18px 4px', padding: '10px 14px', maxWidth: '85%', fontSize: '13px', color: '#000', lineHeight: 1.5 }}>
          <div style={{ marginBottom: '6px' }}>Bonjour, votre colis <strong>#FR847291</strong> est en attente.</div>
          <div style={{ marginBottom: '6px' }}>Des frais de <FS id="amount"><strong>2€90</strong></FS> sont à régler <FS id="urgency"><strong>sous 24h</strong></FS>, sinon retour à l'expéditeur.</div>
          <div style={{ color: '#007aff', textDecoration: 'underline' }}>
            <FS id="domain">laposte-livraison.net/payer</FS>
          </div>
        </div>
      </div>
      <div style={{ fontSize: '11px', color: '#8e8e93', textAlign: 'center' }}>La Poste · Service client</div>
    </div>
  )
}

function DemoModal({ onClose }) {
  const navigate = useNavigate()
  const [scenario, setScenario] = useState(null)
  const [step, setStep] = useState(0)   // 0=pick, 1=email, 2=decision, 3=result
  const [answer, setAnswer] = useState(null)
  const [found, setFound] = useState(new Set())
  const [activeHint, setActiveHint] = useState(null)

  const flags = scenario?.flags ?? []
  const total = flags.length
  const foundCount = found.size

  const findFlag = (id) => { if (!found.has(id)) setFound(prev => new Set([...prev, id])) }
  const reset = () => { setScenario(null); setStep(0); setAnswer(null); setFound(new Set()); setActiveHint(null) }

  const score = answer ? Math.round((foundCount / (total || 1)) * 50) + (answer.correct ? 50 : 0) : 0
  const percentile = score >= 80 ? 82 : score >= 60 ? 57 : score >= 40 ? 31 : 14
  const profil = score >= 80 ? { label: 'Expert Cyber', color: '#22c55e' } : score >= 60 ? { label: 'Vigilant', color: '#f59e0b' } : { label: 'À Former', color: '#ef4444' }

  return (
    <div style={{ color: 'var(--text-primary)' }}>

      {/* Step 0 — Scenario picker */}
      {step === 0 && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🕵️</div>
            <h3 style={{ fontSize: '17px', marginBottom: '4px' }}>Simulation d'attaque réelle</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Choisissez un scénario et testez vos réflexes en conditions réelles.</p>
          </div>

          {/* How it works */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '18px', border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
            {[
              { n: '1', icon: '🔍', label: 'Investiguer', desc: 'Analysez le document et cliquez sur les éléments suspects' },
              { n: '2', icon: '🎯', label: 'Décider', desc: 'Choisissez la meilleure réaction face à la menace' },
              { n: '3', icon: '📊', label: 'Résultat', desc: 'Obtenez votre score, profil et les conseils personnalisés' },
            ].map((s, i) => (
              <div key={s.n} style={{ flex: 1, padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRight: i < 2 ? '1px solid var(--border-subtle)' : 'none', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', marginBottom: '3px' }}>{s.icon}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: 600, marginBottom: '2px' }}>{s.label}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{s.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {SCENARIOS.map(s => (
              <button key={s.id} onClick={() => { setScenario(s); setStep(1) }} style={{
                display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 16px',
                background: 'var(--bg-black)', border: '1px solid var(--border-subtle)',
                borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.background = 'rgba(235,40,40,0.04)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--bg-black)' }}
              >
                <span style={{ fontSize: '26px' }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 600 }}>{s.name}</span>
                    <span style={{ fontSize: '10px', padding: '1px 7px', background: `${s.diffColor}18`, color: s.diffColor, border: `1px solid ${s.diffColor}44`, borderRadius: '10px' }}>{s.difficulty}</span>
                    <span style={{ fontSize: '10px', padding: '1px 7px', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>{s.tag}</span>
                    <span style={{ fontSize: '10px', padding: '1px 7px', background: 'rgba(235,40,40,0.06)', color: 'var(--red)', border: '1px solid rgba(235,40,40,0.2)', borderRadius: '10px' }}>{s.flags.length} indices</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{s.desc}</div>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '18px' }}>›</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1 — Interactive email */}
      {step === 1 && scenario && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '8px 12px', background: 'rgba(235,40,40,0.06)', border: '1px solid rgba(235,40,40,0.2)', borderRadius: '6px' }}>
            <span style={{ fontSize: '11px', color: '#eb2828' }}>🕵️ {scenario.name}</span>
            <span style={{ fontSize: '12px' }}>
              {[...Array(total)].map((_, i) => (
                <span key={i} style={{ marginLeft: '4px', fontSize: '14px', opacity: i < foundCount ? 1 : 0.25 }}>🔴</span>
              ))}
              <span style={{ marginLeft: '8px', color: foundCount === total ? '#22c55e' : 'var(--text-muted)', fontSize: '11px' }}>
                {foundCount}/{total} indices
              </span>
            </span>
          </div>

          {/* Mission briefing */}
          <div style={{ marginBottom: '10px', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', flexShrink: 0 }}>📋</span>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>CONTEXTE</span>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '1px' }}>{scenario.context}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', flexShrink: 0 }}>🎯</span>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>MISSION</span>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '1px' }}>{scenario.mission}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '13px', flexShrink: 0 }}>🔍</span>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>À SURVEILLER</span>
                <div style={{ fontSize: '11px', color: 'var(--red)', marginTop: '2px', lineHeight: 1.5 }}>{scenario.lookFor}</div>
              </div>
            </div>
          </div>

          {/* Active hint / default tip */}
          {activeHint ? (
            <div style={{ marginBottom: '8px', padding: '10px 14px', background: `${flags.find(f => f.id === activeHint)?.color}18`, border: `1px solid ${flags.find(f => f.id === activeHint)?.color}55`, borderRadius: '6px', fontSize: '12px', lineHeight: 1.5 }}>
              <span style={{ color: flags.find(f => f.id === activeHint)?.color, fontWeight: 'bold' }}>
                {flags.find(f => f.id === activeHint)?.icon} {flags.find(f => f.id === activeHint)?.title}
              </span>
              <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>— {flags.find(f => f.id === activeHint)?.detail}</span>
            </div>
          ) : (
            <div style={{ marginBottom: '8px', fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              💡 Cliquez sur les éléments du document pour révéler les {total} indices cachés
            </div>
          )}

          <ScenarioEmail scenarioId={scenario.id} found={found} findFlag={findFlag} activeHint={activeHint} setActiveHint={setActiveHint} />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => { setFound(new Set()); setActiveHint(null); setStep(0) }} style={{ padding: '10px 14px', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>← Changer</button>
            <button onClick={() => setStep(2)} className={foundCount > 0 ? 'btn-primary' : 'btn-secondary'} style={{ flex: 1, padding: '11px', justifyContent: 'center' }}>
              {foundCount === total ? '🏆 Tous trouvés — Décider →' : foundCount > 0 ? `Continuer avec ${foundCount}/${total} →` : 'Passer directement →'}
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Decision */}
      {step === 2 && scenario && (
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', padding: '10px 14px', background: foundCount >= Math.ceil(total * 0.6) ? 'rgba(34,197,94,0.08)' : 'rgba(245,158,11,0.08)', border: `1px solid ${foundCount >= Math.ceil(total * 0.6) ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`, borderRadius: '6px', fontSize: '12px' }}>
            <span>{foundCount >= Math.ceil(total * 0.6) ? '🟢' : '🟡'}</span>
            <span style={{ color: foundCount >= Math.ceil(total * 0.6) ? '#22c55e' : '#f59e0b' }}>
              {foundCount}/{total} indices identifiés{foundCount === total ? ' — Analyse parfaite !' : foundCount < Math.ceil(total * 0.4) ? ' — Quelques-uns vous ont échappé' : ''}
            </span>
          </div>
          <h4 style={{ marginBottom: '6px' }}>Quelle est votre décision ?</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>Plusieurs réponses peuvent être correctes.</p>
          {scenario.options.map(opt => (
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
      {step === 3 && scenario && answer && (
        <div>
          {/* Score header */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', marginBottom: '14px', background: answer.correct ? 'rgba(34,197,94,0.06)' : 'rgba(235,40,40,0.06)', border: `1px solid ${answer.correct ? 'rgba(34,197,94,0.3)' : 'rgba(235,40,40,0.3)'}`, borderRadius: '8px' }}>
            <div style={{ textAlign: 'center', minWidth: '60px' }}>
              <div style={{ fontSize: '32px', lineHeight: 1 }}>{score >= 80 ? '🏆' : score >= 50 ? '🎯' : '😬'}</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: answer.correct ? '#22c55e' : '#eb2828', lineHeight: 1.2 }}>{score}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>/100</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: answer.correct ? '#22c55e' : '#eb2828', marginBottom: '4px' }}>
                {answer.correct ? 'Bon réflexe !' : 'C\'était un piège !'}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                {answer.correct ? scenario.result.correct : scenario.result.wrong}
              </p>
            </div>
          </div>

          {/* Profil + benchmark */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
            <div style={{ flex: 1, padding: '10px', background: `${profil.color}10`, border: `1px solid ${profil.color}33`, borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px', letterSpacing: '0.1em' }}>PROFIL</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: profil.color }}>{profil.label}</div>
            </div>
            <div style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px', letterSpacing: '0.1em' }}>MEILLEUR QUE</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-light)' }}>{percentile}% des joueurs</div>
            </div>
            <div style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px', letterSpacing: '0.1em' }}>SCÉNARIO</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-light)' }}>{scenario.tag}</div>
            </div>
          </div>

          {/* Flags avec tips sur les manqués */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', padding: '12px', borderRadius: '8px', marginBottom: '14px', maxHeight: '210px', overflowY: 'auto' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '10px' }}>ANALYSE DES INDICES</div>
            {flags.map((f, i) => (
              <div key={f.id} style={{ marginBottom: i < flags.length - 1 ? '10px' : 0, paddingBottom: i < flags.length - 1 ? '10px' : 0, borderBottom: i < flags.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: found.has(f.id) ? 0 : '4px' }}>
                  <span style={{ fontSize: '13px' }}>{found.has(f.id) ? '✅' : '❌'}</span>
                  <span style={{ fontSize: '12px', color: f.color, fontWeight: 'bold' }}>{f.icon} {f.title}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{f.detail}</span>
                </div>
                {!found.has(f.id) && (
                  <div style={{ marginLeft: '22px', fontSize: '11px', color: '#f59e0b', lineHeight: 1.5, padding: '4px 8px', background: 'rgba(245,158,11,0.06)', borderRadius: '4px' }}>
                    💡 {f.tip}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={reset} className="btn-secondary" style={{ padding: '10px 16px', fontSize: '13px' }}>🔄 Autre scénario</button>
            <button onClick={() => { onClose(); navigate('/login') }} className="btn-primary" style={{ padding: '10px 24px', fontSize: '13px' }}>
              Tester mes équipes gratuitement →
            </button>
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
    <div className="landing-page" style={{ minHeight: '100vh', background: 'var(--bg-black)' }}>
      <Navbar onLogin={onLogin} />
      <HeroSection onStart={onStart} setModal={setModal} />
      <ProblemsSection />
      <SolutionSection />
      <FeaturesSection />
      <LiveDemoTeaser onOpenDemo={() => setModal('demo')} />
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
