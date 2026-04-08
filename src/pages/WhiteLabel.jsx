import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import LangToggle from '../components/LangToggle'

export default function WhiteLabel() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [config, setConfig] = useState({
    brandName: 'ROOMCA',
    primaryColor: '#eb2828',
    logo: null,
    customDomain: '',
    favicon: null,
    emailFrom: 'noreply@roomca.io',
    supportEmail: 'support@roomca.io',
    footer: '© 2026 ROOMCA. All rights reserved.',
    hideRoomcaBranding: false
  })

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
          <button onClick={() => navigate('/super-admin')} style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}>← Super Admin</button>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '11px' }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '36px', color: 'var(--text-primary)', marginBottom: '8px' }}>🎨 White-Label Configurator</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Personnalisez ROOMCA avec votre marque (Plan Enterprise)</p>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div>
            <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '12px', marginBottom: '24px' }}>
              <h3 style={{ color: '#eb2828', marginBottom: '20px' }}>Identité de marque</h3>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Nom de marque</label>
                <input type="text" value={config.brandName} onChange={e => setConfig({...config, brandName: e.target.value})}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', marginTop: '4px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Couleur primaire</label>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <input type="color" value={config.primaryColor} onChange={e => setConfig({...config, primaryColor: e.target.value})}
                      style={{ width: '50px', height: '40px', border: 'none', background: 'transparent', cursor: 'pointer' }} />
                    <input type="text" value={config.primaryColor} onChange={e => setConfig({...config, primaryColor: e.target.value})}
                      style={{ flex: 1, padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)' }} />
                  </div>
                </div>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Logo (PNG/SVG)</label>
                  <input type="file" accept="image/*" style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', marginTop: '4px', fontSize: '11px' }} />
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '12px', marginBottom: '24px' }}>
              <h3 style={{ color: '#eb2828', marginBottom: '20px' }}>Domaine personnalisé</h3>
              <input type="text" value={config.customDomain} onChange={e => setConfig({...config, customDomain: e.target.value})}
                placeholder="awareness.votre-entreprise.com"
                style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '8px' }}>Configurez un CNAME vers cname.roomca.io</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '12px', marginBottom: '24px' }}>
              <h3 style={{ color: '#eb2828', marginBottom: '20px' }}>Communications</h3>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Email expéditeur</label>
                <input type="email" value={config.emailFrom} onChange={e => setConfig({...config, emailFrom: e.target.value})}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Email support</label>
                <input type="email" value={config.supportEmail} onChange={e => setConfig({...config, supportEmail: e.target.value})}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', marginTop: '4px' }} />
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '12px', marginBottom: '24px' }}>
              <label style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" checked={config.hideRoomcaBranding} onChange={e => setConfig({...config, hideRoomcaBranding: e.target.checked})} />
                Masquer "Powered by ROOMCA"
              </label>
            </div>

            <button className="btn-primary" style={{ padding: '14px 32px' }}>💾 Appliquer la configuration</button>
          </div>

          <div>
            <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', position: 'sticky', top: '20px' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Aperçu</h4>
              <div style={{ background: '#000', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: config.primaryColor, marginBottom: '12px' }}>{config.brandName}</div>
                <button style={{ padding: '10px 20px', background: config.primaryColor, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px' }}>Bouton Primaire</button>
                <p style={{ fontSize: '10px', color: '#666', marginTop: '12px' }}>{config.footer}</p>
                {!config.hideRoomcaBranding && <p style={{ fontSize: '9px', color: '#444', marginTop: '8px' }}>Powered by ROOMCA</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
