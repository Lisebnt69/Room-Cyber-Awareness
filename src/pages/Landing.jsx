import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import LangToggle from '../components/LangToggle'
import { useLang } from '../context/LangContext'

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
            {toastMsg && <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 300, background: '#0a0a0a', border: '1px solid #22c55e', padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '12px', color: '#22c55e', animation: 'fadeInUp 0.3s ease' }}>✓ {toastMsg}</div>}
      {modal === 'demo' && <DemoModal onClose={() => setModal(null)} />}
    </div>
  )
}

function Navbar({ onLogin }) {
  const [scrolled, setScrolled] = useState(false)
  const { t } = useLang()
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  const links = [
    [t('navPlatform'), 'platform'],
    [t('navScenarios'), 'scenarios'],
    [t('navPricing'), 'pricing'],
    [t('navAbout'), 'about'],
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
        <button className="btn-secondary" style={{ padding: '8px 20px', fontSize: '12px' }} onClick={onLogin}>{t('navSignIn')}</button>
        <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '12px' }} onClick={onLogin}>{t('navGetStarted')}</button>
      </div>
    </nav>
  )
}

function HeroSection({ onStart }) {
  const { t } = useLang()
  const [typed, setTyped] = useState('')
  const msg = '> BREACH SIMULATION READY...'
  useEffect(() => {
    let i = 0
    const tick = setInterval(() => { setTyped(msg.slice(0, i + 1)); i++; if (i >= msg.length) clearInterval(tick) }, 55)
    return () => clearInterval(tick)
  }, [])
  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 40px 80px' }}>
      <CyberGridHero />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '860px' }}>
        <div className="tag" style={{ marginBottom: '28px' }}>
          <span className="status-dot red" /> {t('heroTag')}
        </div>
        <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(40px, 7vw, 82px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.01em', marginBottom: '28px', color: 'var(--text-light)' }}>
          <GlitchText>{t('heroH1a')}</GlitchText><br />
          <span style={{ color: 'var(--red)' }}>{t('heroH1b')}</span><br />
          {t('heroH1c')}
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 40px' }}>
          {t('heroSub')}
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" style={{ fontSize: '15px', padding: '14px 36px' }} onClick={onStart}>{t('heroCta1')}</button>
          <button className="btn-secondary" style={{ fontSize: '15px', padding: '14px 36px' }} onClick={() => setModal('demo')}>{t('heroCta2')}</button>
        </div>
        <div style={{ marginTop: '56px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--red)', letterSpacing: '0.1em', minHeight: '18px' }}>
          {typed}<span className="animate-blink">█</span>
        </div>
        <div style={{ display: 'flex', gap: '48px', justifyContent: 'center', marginTop: '56px', padding: '24px', borderTop: '1px solid var(--border-subtle)' }}>
          {[[t('heroStat1Val'), t('heroStat1Label')], [t('heroStat2Val'), t('heroStat2Label')], [t('heroStat3Val'), t('heroStat3Label')]].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '28px', color: 'var(--red)', fontWeight: 700 }}>{val}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProblemSection() {
  const { t } = useLang()
  const problems = [
    { icon: '⚠', label: t('problem1Label'), desc: t('problem1Desc') },
    { icon: '💤', label: t('problem2Label'), desc: t('problem2Desc') },
    { icon: '📈', label: t('problem3Label'), desc: t('problem3Desc') },
  ]
  return (
    <section id="platform" style={{ padding: '100px 40px', background: 'var(--bg-dark)', borderTop: '1px solid var(--border-subtle)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div className="tag" style={{ marginBottom: '20px' }}>{t('problemTag')}</div>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: '16px' }}>
          {t('problemH2a')}<br /><span style={{ color: 'var(--red)' }}>{t('problemH2b')}</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '60px', fontSize: '16px', maxWidth: '500px' }}>{t('problemSub')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: 'var(--border-subtle)' }}>
          {problems.map(p => (
            <div key={p.label} className="card" style={{ margin: 0, borderRadius: 0, border: 'none', background: 'var(--bg-card)' }}>
              <div style={{ fontSize: '28px', marginBottom: '16px' }}>{p.icon}</div>
              <div className="red-line" />
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '18px', marginBottom: '12px' }}>{p.label}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SolutionSection() {
  const { t } = useLang()
  return (
    <section id="scenarios" style={{ padding: '100px 40px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
        <div>
          <div className="tag" style={{ marginBottom: '20px' }}>{t('solutionTag')}</div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(28px, 4vw, 42px)', marginBottom: '20px', lineHeight: 1.15 }}>
            {t('solutionH2a')}<br /><span style={{ color: 'var(--red)' }}>{t('solutionH2b')}</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.8, marginBottom: '32px' }}>{t('solutionP')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[t('solutionItem1'), t('solutionItem2'), t('solutionItem3'), t('solutionItem4')].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--red)' }}>›</span> {item}
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 0 60px rgba(235,40,40,0.1)' }}>
            <div style={{ background: '#0a0a0a', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', marginLeft: '12px' }}>scenario://inbox-zero</span>
            </div>
            <div style={{ padding: '24px', fontFamily: 'var(--mono)', fontSize: '12px', lineHeight: 2 }}>
              <div style={{ color: 'var(--text-muted)' }}>// SECURITY ALERT — 11:47:21</div>
              <div style={{ color: 'var(--red)' }}>[CRITICAL] Credential exfiltration detected</div>
              <div style={{ color: '#f59e0b' }}>[WARN]   User: sophieb@acme-corp.com</div>
              <div style={{ color: 'var(--text-muted)' }}>[INFO]   Analyzing email inbox...</div>
              <div style={{ color: '#22c55e' }}>[TASK]   Identify the phishing vector</div>
              <div style={{ color: 'var(--text-muted)' }}>[TIMER]  14:32 remaining</div>
              <div style={{ color: 'var(--red)' }}>█<span className="animate-blink" style={{ display: 'inline-block' }}>_</span></div>
            </div>
          </div>
          <div style={{ position: 'absolute', top: '-1px', left: '-1px', right: '-1px', height: '2px', background: 'var(--red)' }} />
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const { t } = useLang()
  const features = [
    { icon: '🎮', title: t('feat1Title'), desc: t('feat1Desc') },
    { icon: '📊', title: t('feat2Title'), desc: t('feat2Desc') },
    { icon: '🏆', title: t('feat3Title'), desc: t('feat3Desc') },
    { icon: '🔐', title: t('feat4Title'), desc: t('feat4Desc') },
    { icon: '🌐', title: t('feat5Title'), desc: t('feat5Desc') },
    { icon: '⚡', title: t('feat6Title'), desc: t('feat6Desc') },
  ]
  return (
    <section id="platform" style={{ padding: '100px 40px', background: 'var(--bg-dark)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <div className="tag" style={{ marginBottom: '20px', display: 'inline-flex' }}>{t('featuresTag')}</div>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(28px, 4vw, 42px)', marginBottom: '16px' }}>
          {t('featuresH2a')}<br /><span style={{ color: 'var(--red)' }}>{t('featuresH2b')}</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 60px' }}>{t('featuresSub')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1px', background: 'var(--border-subtle)' }}>
          {features.map(f => (
            <div key={f.title} className="card" style={{ margin: 0, borderRadius: 0, border: 'none', textAlign: 'left', background: 'var(--bg-card)' }}>
              <div style={{ fontSize: '24px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '16px', marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  const { t } = useLang()
  const plans = [
    { name: t('plan1Name'), price: t('plan1Price'), period: t('plan1Period'), target: t('plan1Target'), features: [t('plan1F1'), t('plan1F2'), t('plan1F3'), t('plan1F4')], cta: t('plan1Cta'), highlight: false },
    { name: t('plan2Name'), price: t('plan2Price'), period: t('plan2Period'), target: t('plan2Target'), features: [t('plan2F1'), t('plan2F2'), t('plan2F3'), t('plan2F4'), t('plan2F5')], cta: t('plan2Cta'), highlight: true },
    { name: t('plan3Name'), price: t('plan3Price'), period: t('plan3Period'), target: t('plan3Target'), features: [t('plan3F1'), t('plan3F2'), t('plan3F3'), t('plan3F4'), t('plan3F5')], cta: t('plan3Cta'), highlight: false },
  ]
  const coins = [
    { amount: '500', price: '€9', desc: t('coin1Desc') },
    { amount: '1,000', price: '€17', desc: t('coin2Desc') },
    { amount: '2,000', price: '€29', desc: t('coin3Desc') },
  ]
  return (
    <section id="pricing" style={{ padding: '100px 40px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <div className="tag" style={{ marginBottom: '20px', display: 'inline-flex' }}>{t('pricingTag')}</div>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(28px, 4vw, 42px)', marginBottom: '16px' }}>
          {t('pricingH2a')}<br /><span style={{ color: 'var(--red)' }}>{t('pricingH2b')}</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: 'var(--border-subtle)', marginTop: '60px' }}>
          {plans.map(p => (
            <div key={p.name} style={{ background: p.highlight ? '#0d0d0d' : 'var(--bg-card)', padding: '40px 32px', position: 'relative', borderTop: p.highlight ? '2px solid var(--red)' : '2px solid transparent' }}>
              {p.highlight && (
                <div style={{ position: 'absolute', top: '-1px', right: '24px' }}>
                  <span className="tag" style={{ background: 'var(--red)', color: '#fff', borderColor: 'var(--red)' }}>{t('pricingPopular')}</span>
                </div>
              )}
              <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '20px' }}>{p.name}</div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '42px', fontWeight: 700, color: p.highlight ? 'var(--red)' : 'var(--text-light)' }}>
                {p.price}<span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 400 }}>{p.period}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '32px', marginTop: '8px' }}>{p.target}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', marginBottom: '36px' }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--red)', fontWeight: 700 }}>›</span> {f}
                  </div>
                ))}
              </div>
              <button className={p.highlight ? 'btn-primary' : 'btn-secondary'} style={{ width: '100%', justifyContent: 'center' }}>{p.cta}</button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '80px' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '22px', marginBottom: '8px' }}>
            <span style={{ color: 'var(--red)' }}>RoomCoins</span> — {t('coinsTitle').split('—')[1]?.trim() || 'Pay per play'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '32px' }}>{t('coinsSub')}</p>
          <div style={{ display: 'flex', gap: '1px', background: 'var(--border-subtle)', justifyContent: 'center', flexWrap: 'wrap' }}>
            {coins.map(c => (
              <div key={c.amount} style={{ background: 'var(--bg-card)', padding: '28px 48px', textAlign: 'center', minWidth: '200px' }}>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: '28px', color: 'var(--text-light)', marginBottom: '4px' }}>{c.amount}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>RoomCoins</div>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: '20px', color: 'var(--red)', marginBottom: '4px' }}>{c.price}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CTASection({ onStart }) {
  const { t } = useLang()
  return (
    <section style={{ padding: '100px 40px', background: 'var(--bg-dark)', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ background: 'rgba(235,40,40,0.06)', border: '1px solid rgba(235,40,40,0.2)', padding: '60px 40px' }}>
          <div className="tag" style={{ marginBottom: '24px', display: 'inline-flex' }}>
            <span className="status-dot red" /> {t('ctaTag')}
          </div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(28px, 4vw, 42px)', marginBottom: '20px' }}>{t('ctaH2')}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '16px' }}>{t('ctaSub')}</p>
          <button className="btn-primary" style={{ fontSize: '16px', padding: '16px 48px' }} onClick={onStart}>{t('ctaBtn')}</button>
          <div style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-muted)' }}>{t('ctaTrust')}</div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const { t } = useLang()
  return (
    <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
      <Logo size="sm" showSub />
      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('footerRights')}</div>
      <div style={{ display: 'flex', gap: '24px' }}>
        {[t('footerPrivacy'), t('footerTerms'), t('footerSecurity')].map(l => (
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
  const [line, setLine] = useState(0)
  const lines = ['$ roomca-cli --scenario inbox-zero', '✓ Loading ROOMCA...', '⚠ ALERT: Detected exfiltration', '→ Time limit: 15:00 seconds', '📧 Analyzing emails...', '[1] Support IT (SAFE)', '[2] Microsoft (PHISHING) ⚠', '[3] HR (SAFE)', '[4] DHL (PHISHING) ⚠', '[5] Slack (SAFE)', '✓ Complete! Score: 920/1000', '✓ Accuracy: 100%', '🏆 Certificate awarded']
  useEffect(() => { if (line < lines.length) { const t = setTimeout(() => setLine(l => l + 1), 300); return () => clearTimeout(t) } }, [line])
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#000', border: '1px solid #333', width: '90%', maxWidth: '700px', padding: '24px', fontFamily: 'var(--mono)', fontSize: '12px', maxHeight: '70vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ marginBottom: '16px', color: 'var(--red)' }}>$ roomca-demo.sh</div>
        <div style={{ color: 'var(--text-secondary)', lineHeight: 2 }}>
          {lines.slice(0, line).map((l, i) => <div key={i} style={{ color: l.includes('✓') ? '#22c55e' : l.includes('⚠') ? '#f59e0b' : l.includes('PHISHING') ? 'var(--red)' : 'inherit' }}>{l}</div>)}
          {line < lines.length && <span className="animate-blink" style={{ color: 'var(--red)' }}>█</span>}
        </div>
      </div>
            {toastMsg && <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 300, background: '#0a0a0a', border: '1px solid #22c55e', padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '12px', color: '#22c55e', animation: 'fadeInUp 0.3s ease' }}>✓ {toastMsg}</div>}
      {modal === 'demo' && <DemoModal onClose={() => setModal(null)} />}
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const onLogin = () => navigate('/login')
  const onStart = () => navigate('/login')
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-black)' }}>
      <Navbar onLogin={onLogin} />
      <HeroSection onStart={onStart} />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection onStart={onStart} />
      <Footer />
            {toastMsg && <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 300, background: '#0a0a0a', border: '1px solid #22c55e', padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '12px', color: '#22c55e', animation: 'fadeInUp 0.3s ease' }}>✓ {toastMsg}</div>}
      {modal === 'demo' && <DemoModal onClose={() => setModal(null)} />}
    </div>
  )
}
