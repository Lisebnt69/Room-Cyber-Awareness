import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import BrandLogo from '../components/BrandLogo'
import LangToggle from '../components/LangToggle'
import Modal from '../components/Modal'
import Toast from '../components/Toast'

/* ============================================================
   ROOMCA LANDING — Aurora Soft v4.0
   Light-first, immersive, accessible-to-all
   ============================================================ */

function AuroraHeroBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div style={{
        position: 'absolute',
        top: '-10%', left: '-10%',
        width: '60vw', height: '60vw',
        maxWidth: '900px', maxHeight: '900px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,92,255,0.35) 0%, transparent 65%)',
        filter: 'blur(80px)',
        animation: 'floatBlob 22s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        top: '-5%', right: '-15%',
        width: '55vw', height: '55vw',
        maxWidth: '800px', maxHeight: '800px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.30) 0%, transparent 65%)',
        filter: 'blur(90px)',
        animation: 'floatBlob 26s ease-in-out infinite reverse',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%', left: '30%',
        width: '50vw', height: '50vw',
        maxWidth: '700px', maxHeight: '700px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(244,114,182,0.22) 0%, transparent 65%)',
        filter: 'blur(100px)',
        animation: 'floatBlob 30s ease-in-out infinite',
      }} />
      <div className="cyber-grid" style={{ position: 'absolute', inset: 0, opacity: 0.7 }} />
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
    ['Comment ça marche', '#how'],
    ['Fonctionnalités', '#features'],
    ['Tarifs', '#pricing'],
    ['FAQ', '#faq'],
  ]
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: scrolled ? '14px 40px' : '24px 40px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'var(--glass-bg-strong)' : 'transparent',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      backdropFilter: scrolled ? 'var(--glass-blur)' : 'none',
      WebkitBackdropFilter: scrolled ? 'var(--glass-blur)' : 'none',
      transition: 'all 0.35s var(--ease)',
    }}>
      <BrandLogo height={36} />

      <div className="nav-desktop" style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
        {links.map(([label, anchor]) => (
          <a key={anchor} href={anchor} style={{
            fontFamily: 'var(--font-title)',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--violet)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
          >{label}</a>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <LangToggle showTheme={false} />
        <button className="btn-ghost" style={{ padding: '10px 18px' }} onClick={onLogin}>Connexion</button>
        <button className="btn-primary" style={{ padding: '11px 22px' }} onClick={onLogin}>Essai gratuit</button>
      </div>
    </nav>
  )
}

function HeroSection({ onStart, setModal }) {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '160px 32px 100px',
      overflow: 'hidden',
    }}>
      <AuroraHeroBg />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', zIndex: 2, maxWidth: '960px' }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="tag tag-aurora"
          style={{
            marginBottom: '32px',
            fontSize: '13px',
            padding: '8px 18px',
            fontWeight: 600,
          }}
        >
          <span className="status-dot violet" />
          Simulation de cyberattaque immersive
        </motion.div>

        <h1 style={{
          fontFamily: 'var(--font-title)',
          fontSize: 'clamp(44px, 8vw, 92px)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.035em',
          marginBottom: '28px',
          color: 'var(--text)',
        }}>
          La cybersécurité<br />
          qui se <span className="text-gradient">vit</span>,<br />
          pas qui s'apprend.
        </h1>

        <p style={{
          fontSize: 'clamp(17px, 2vw, 22px)',
          color: 'var(--text-secondary)',
          lineHeight: 1.65,
          maxWidth: '680px',
          margin: '0 auto 16px',
          fontWeight: 400,
        }}>
          Plongez vos équipes dans des <strong style={{ color: 'var(--text)' }}>cyberattaques réalistes</strong>.
          Ils cliquent, doutent, se trompent — puis apprennent pour de vrai.
        </p>

        <p style={{
          fontSize: '15px',
          color: 'var(--text-muted)',
          margin: '0 auto 48px',
          maxWidth: '560px',
        }}>
          Accessible à tous · Aucune installation · Résultats mesurables en 7 jours
        </p>

        <div style={{
          display: 'flex',
          gap: '14px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '64px',
        }}>
          <button className="btn-primary" style={{ padding: '18px 36px', fontSize: '15px' }} onClick={onStart}>
            Démarrer gratuitement →
          </button>
          <button className="btn-secondary" style={{ padding: '18px 36px', fontSize: '15px' }} onClick={() => setModal('demo')}>
            ▶ Voir la démo 2 min
          </button>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            maxWidth: '780px',
            margin: '0 auto',
            padding: '24px',
            background: 'var(--glass-bg)',
            backdropFilter: 'var(--glass-blur)',
            WebkitBackdropFilter: 'var(--glass-blur)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-2xl)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {[
            { val: '90%', label: 'erreurs humaines', color: 'var(--violet)' },
            { val: '4×',  label: 'mieux retenu',     color: 'var(--cyan)' },
            { val: '48+', label: 'entreprises',      color: 'var(--rose)' },
            { val: '15',  label: 'frameworks',       color: 'var(--gold)' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '8px 12px' }}>
              <div style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(24px, 3vw, 36px)',
                fontWeight: 800,
                color: s.color,
                letterSpacing: '-0.02em',
              }}>{s.val}</div>
              <div style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                marginTop: '4px',
                fontWeight: 500,
              }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '12px',
          color: 'var(--text-muted)',
          fontWeight: 500,
          zIndex: 2,
        }}
      >
        ↓ défilez
      </motion.div>
    </section>
  )
}

function ProblemsSection() {
  const problems = [
    {
      emoji: '⚠️',
      title: 'Le facteur humain',
      desc: '90% des cyberattaques exploitent une erreur humaine — pas une faille technique.',
      tint: 'var(--violet)',
    },
    {
      emoji: '💭',
      title: 'La fausse confiance',
      desc: 'Une formation ≠ un réflexe. Sous pression, vos équipes hésitent.',
      tint: 'var(--cyan)',
    },
    {
      emoji: '⚡',
      title: 'Des menaces inédites',
      desc: 'Chaque jour, de nouvelles attaques. Vos collaborateurs sont-ils prêts ?',
      tint: 'var(--rose)',
    },
  ]

  return (
    <section id="how" style={{
      padding: '120px 32px',
      position: 'relative',
      background: 'var(--bg-soft)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '72px' }}
        >
          <div className="tag tag-aurora" style={{ marginBottom: '20px' }}>
            <span className="status-dot red" /> Le problème
          </div>
          <h2 style={{
            fontFamily: 'var(--font-title)',
            fontWeight: 800,
            marginBottom: '20px',
            letterSpacing: '-0.03em',
          }}>
            Votre équipe est formée.<br />
            <span className="text-gradient-cta">Mais face à une vraie attaque ?</span>
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'var(--text-muted)',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Elle hésite. Elle doute. Elle clique. Et c'est trop tard.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {problems.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              className="card-aurora"
              style={{ padding: '40px 32px' }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--r-lg)',
                background: `color-mix(in srgb, ${p.tint} 14%, transparent)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginBottom: '24px',
              }}>
                {p.emoji}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-title)',
                fontSize: '22px',
                marginBottom: '12px',
                letterSpacing: '-0.02em',
              }}>{p.title}</h3>
              <p style={{
                fontSize: '15px',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
              }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    { n: '01', icon: '🎯', title: 'Choisissez vos scénarios', desc: 'Plus de 40 scénarios d\'attaques clés en main : phishing, ransomware, social engineering.' },
    { n: '02', icon: '✉️', title: 'Lancez la simulation', desc: 'Vos équipes reçoivent des attaques réalistes, sans savoir quand ni comment.' },
    { n: '03', icon: '📊', title: 'Analysez & formez', desc: 'Tableau de bord en temps réel, modules adaptatifs et certifications officielles.' },
  ]

  return (
    <section style={{ padding: '120px 32px', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <div className="tag tag-aurora" style={{ marginBottom: '20px' }}>
            <span className="status-dot violet" /> Notre approche
          </div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Trois étapes, <span className="text-gradient">résultats immédiats</span>
          </h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px',
          position: 'relative',
        }}>
          {steps.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              style={{ position: 'relative' }}
            >
              <div style={{
                fontFamily: 'var(--font-title)',
                fontSize: '80px',
                fontWeight: 800,
                lineHeight: 1,
                background: 'var(--grad-aurora)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                opacity: 0.18,
                marginBottom: '-40px',
                letterSpacing: '-0.04em',
              }}>{s.n}</div>
              <div className="card-glass" style={{ padding: '32px 28px', borderRadius: 'var(--r-xl)' }}>
                <div style={{ fontSize: '40px', marginBottom: '18px' }}>{s.icon}</div>
                <h3 style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: '22px',
                  marginBottom: '12px',
                  letterSpacing: '-0.02em',
                }}>{s.title}</h3>
                <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    { icon: '🎮', title: 'Scénarios immersifs', desc: 'Des attaques jouables, pas des slides. Vos équipes vivent l\'incident.' },
    { icon: '📈', title: 'Analytics temps réel', desc: 'Visualisez le risque par équipe, département ou individu.' },
    { icon: '🏆', title: 'Gamification', desc: 'Badges, classements, défis hebdos. La sécurité devient fun.' },
    { icon: '🛡️', title: 'Conformité intégrée', desc: 'RGPD, NIS2, ISO 27001, SOC2. Rapports d\'audit en 1 clic.' },
    { icon: '🤖', title: 'IA adaptative', desc: 'Les scénarios s\'ajustent au niveau et aux erreurs de chacun.' },
    { icon: '🌍', title: 'Multilingue', desc: 'FR, EN, DE, ES, IT et plus. Pour des équipes internationales.' },
  ]

  return (
    <section id="features" style={{
      padding: '120px 32px',
      background: 'var(--bg-soft)',
      position: 'relative',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '72px' }}
        >
          <div className="tag tag-aurora" style={{ marginBottom: '20px' }}>
            <span className="status-dot cyan" /> Fonctionnalités
          </div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Tout ce qu'il faut pour une <span className="text-gradient">cyberdéfense humaine</span>
          </h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="card"
              style={{
                borderRadius: 'var(--r-xl)',
                padding: '28px',
                background: 'var(--bg-card)',
              }}
            >
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--r-md)',
                background: 'var(--grad-aurora-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                marginBottom: '18px',
              }}>{f.icon}</div>
              <h3 style={{
                fontFamily: 'var(--font-title)',
                fontSize: '18px',
                marginBottom: '8px',
                letterSpacing: '-0.015em',
              }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingSection({ onStart }) {
  const plans = [
    {
      name: 'Starter',
      price: '0',
      period: '/ 14 jours',
      desc: 'Parfait pour tester',
      features: ['Jusqu\'à 10 utilisateurs', '5 scénarios', 'Rapports basiques', 'Support email'],
      cta: 'Commencer',
      highlighted: false,
    },
    {
      name: 'Business',
      price: '9',
      period: '€ / mois / user',
      desc: 'Pour les équipes en croissance',
      features: ['Utilisateurs illimités', '40+ scénarios', 'Analytics avancés', 'Scénarios sur mesure', 'Support prioritaire', 'Certifications incluses'],
      cta: 'Essai gratuit',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Sur mesure',
      period: '',
      desc: 'Pour les grandes organisations',
      features: ['SSO / SAML', 'API & intégrations', 'White-label', 'CSM dédié', 'SLA 99.9%', 'Déploiement on-prem'],
      cta: 'Nous contacter',
      highlighted: false,
    },
  ]

  return (
    <section id="pricing" style={{ padding: '120px 32px', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <div className="tag tag-aurora" style={{ marginBottom: '20px' }}>
            <span className="status-dot green" /> Tarifs simples
          </div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Un plan pour <span className="text-gradient">chaque équipe</span>
          </h2>
          <p style={{ fontSize: '17px', color: 'var(--text-muted)', marginTop: '16px' }}>
            Sans engagement. Sans carte bancaire pour démarrer.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          alignItems: 'stretch',
        }}>
          {plans.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              style={{
                position: 'relative',
                padding: '40px 32px',
                borderRadius: 'var(--r-2xl)',
                background: p.highlighted ? 'var(--grad-aurora)' : 'var(--bg-card)',
                color: p.highlighted ? 'var(--white)' : 'var(--text)',
                border: p.highlighted ? 'none' : '1px solid var(--border)',
                boxShadow: p.highlighted ? 'var(--shadow-aurora)' : 'var(--shadow-sm)',
                transform: p.highlighted ? 'scale(1.03)' : 'none',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {p.highlighted && (
                <div style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--white)',
                  color: 'var(--violet)',
                  padding: '6px 16px',
                  borderRadius: 'var(--r-full)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  boxShadow: 'var(--shadow-md)',
                }}>
                  ⭐ Plus populaire
                </div>
              )}
              <div style={{
                fontFamily: 'var(--font-title)',
                fontSize: '22px',
                fontWeight: 700,
                marginBottom: '8px',
              }}>{p.name}</div>
              <div style={{
                fontSize: '14px',
                opacity: p.highlighted ? 0.9 : 0.7,
                marginBottom: '24px',
              }}>{p.desc}</div>
              <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: p.price.length > 3 ? '28px' : '48px',
                  fontWeight: 800,
                  letterSpacing: '-0.025em',
                }}>{p.price}</span>
                <span style={{ fontSize: '13px', opacity: 0.7 }}>{p.period}</span>
              </div>
              <ul style={{ listStyle: 'none', marginBottom: '32px', flex: 1 }}>
                {p.features.map((f, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    padding: '8px 0',
                    opacity: p.highlighted ? 0.95 : 1,
                  }}>
                    <span style={{
                      width: '18px', height: '18px',
                      borderRadius: '50%',
                      background: p.highlighted ? 'rgba(255,255,255,0.25)' : 'var(--grad-aurora-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      color: p.highlighted ? 'var(--white)' : 'var(--violet)',
                      flexShrink: 0,
                    }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={onStart}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 'var(--r-full)',
                  fontFamily: 'var(--font-title)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: p.highlighted ? 'var(--white)' : 'var(--grad-aurora)',
                  color: p.highlighted ? 'var(--violet)' : 'var(--white)',
                  border: 'none',
                  boxShadow: p.highlighted ? 'var(--shadow-md)' : 'var(--shadow-aurora)',
                  transition: 'all 0.25s var(--ease)',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {p.cta} →
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqSection() {
  const [open, setOpen] = useState(0)
  const items = [
    { q: 'Combien de temps pour déployer ROOMCA ?', a: 'Moins de 10 minutes. Vous créez votre compte, importez votre équipe, et lancez votre première simulation le jour même.' },
    { q: 'Est-ce vraiment accessible aux non-techniciens ?', a: 'Absolument. ROOMCA est conçu pour tous les niveaux — de l\'employé au RSSI. Interface intuitive, explications pédagogiques, et IA qui adapte la difficulté.' },
    { q: 'Mes données sont-elles en sécurité ?', a: 'Chiffrement AES-256, hébergement UE, conformité RGPD & SOC2. Vos données ne quittent jamais l\'Europe.' },
    { q: 'Puis-je créer mes propres scénarios ?', a: 'Oui, via notre éditeur visuel ou notre IA générative. Plus de 40 modèles prêts à l\'emploi pour démarrer.' },
    { q: 'Quelle différence avec une formation classique ?', a: 'Une formation passive est oubliée à 70% en 7 jours. Les simulations actives sont mémorisées 4× mieux et créent des vrais réflexes.' },
  ]

  return (
    <section id="faq" style={{
      padding: '120px 32px',
      background: 'var(--bg-soft)',
      position: 'relative',
    }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <div className="tag tag-aurora" style={{ marginBottom: '20px' }}>
            💬 Questions fréquentes
          </div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Les <span className="text-gradient">réponses</span> à vos questions
          </h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map((it, i) => {
            const isOpen = open === i
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-xl)',
                  overflow: 'hidden',
                  boxShadow: isOpen ? 'var(--shadow-md)' : 'var(--shadow-xs)',
                  transition: 'box-shadow 0.3s var(--ease)',
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    width: '100%',
                    padding: '22px 28px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'var(--text)',
                  }}>{it.q}</span>
                  <span style={{
                    fontSize: '20px',
                    color: 'var(--violet)',
                    fontWeight: 300,
                    transition: 'transform 0.3s var(--ease)',
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                    flexShrink: 0,
                  }}>+</span>
                </button>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    style={{ padding: '0 28px 22px' }}
                  >
                    <p style={{
                      fontSize: '15px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                    }}>{it.a}</p>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CtaSection({ onStart }) {
  return (
    <section style={{ padding: '120px 32px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'relative',
            padding: '80px 48px',
            borderRadius: 'var(--r-3xl)',
            background: 'var(--grad-aurora)',
            color: 'var(--white)',
            textAlign: 'center',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-aurora)',
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)',
          }} />
          <div style={{ position: 'relative' }}>
            <h2 style={{
              fontFamily: 'var(--font-title)',
              fontWeight: 800,
              marginBottom: '20px',
              color: 'var(--white)',
              letterSpacing: '-0.03em',
            }}>
              Prêts à transformer<br />votre cyberdéfense ?
            </h2>
            <p style={{
              fontSize: '18px',
              opacity: 0.95,
              marginBottom: '40px',
              maxWidth: '560px',
              margin: '0 auto 40px',
            }}>
              Essai gratuit 14 jours. Sans carte bancaire. Résultats dès la première simulation.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={onStart}
                style={{
                  padding: '18px 40px',
                  borderRadius: 'var(--r-full)',
                  background: 'var(--white)',
                  color: 'var(--violet)',
                  fontFamily: 'var(--font-title)',
                  fontSize: '15px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-lg)',
                  transition: 'all 0.25s var(--ease)',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Démarrer gratuitement →
              </button>
              <button
                onClick={onStart}
                style={{
                  padding: '18px 40px',
                  borderRadius: 'var(--r-full)',
                  background: 'rgba(255,255,255,0.15)',
                  color: 'var(--white)',
                  fontFamily: 'var(--font-title)',
                  fontSize: '15px',
                  fontWeight: 600,
                  border: '1px solid rgba(255,255,255,0.35)',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                Parler à un expert
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{
      padding: '60px 32px 40px',
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-soft)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <BrandLogo height={28} />
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            © 2026 ROOMCA · La cybersécurité qui se vit
          </span>
        </div>
        <div style={{ display: 'flex', gap: '24px', fontSize: '13px' }}>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Confidentialité</a>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Conditions</a>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Sécurité</a>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState(null)

  const onStart = () => navigate('/login')
  const onLogin = () => navigate('/login')

  return (
    <div className="landing-page" style={{ background: 'var(--bg)', minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
      <div className="aurora-bg" style={{ opacity: 0.5 }} />
      <Navbar onLogin={onLogin} />
      <HeroSection onStart={onStart} setModal={setModal} />
      <ProblemsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PricingSection onStart={onStart} />
      <FaqSection />
      <CtaSection onStart={onStart} />
      <Footer />

      {modal === 'demo' && (
        <Modal onClose={() => setModal(null)} title="Démo ROOMCA">
          <div style={{ padding: '20px 0' }}>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Découvrez ROOMCA en 2 minutes. Une démo interactive vous attend après inscription.
            </p>
            <button className="btn-primary" onClick={() => { setModal(null); onStart() }} style={{ width: '100%', padding: '14px' }}>
              Démarrer la démo →
            </button>
          </div>
        </Modal>
      )}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
