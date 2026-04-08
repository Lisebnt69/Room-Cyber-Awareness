import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import LangToggle from '../components/LangToggle'
import { db } from '../services/db'
import { visualScenarios } from '../data/visualScenarios'

function useTimer(initial, running) {
  const [seconds, setSeconds] = useState(initial)
  useEffect(() => {
    if (!running) return
    const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [running])
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return { display: `${mm}:${ss}`, seconds }
}

// ─────────────────────────────────────────────────────────────────
//  SCENE 1: Fake browser login page
// ─────────────────────────────────────────────────────────────────
function LoginScene({ lang }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#e8e8e8', fontFamily: 'Arial, sans-serif', userSelect: 'none' }}>
      {/* Browser chrome */}
      <div style={{ background: '#dee1e6', borderBottom: '1px solid #b0b0b0', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, height: '42px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
            <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px', marginLeft: '6px' }}>
          {['←', '→', '↻'].map((ch, i) => (
            <span key={i} style={{ fontSize: '14px', color: i < 2 ? '#888' : '#555', cursor: 'default' }}>{ch}</span>
          ))}
        </div>
        {/* URL bar */}
        <div style={{ flex: 1, height: '26px', background: 'white', border: '1px solid #aaa', borderRadius: '13px', display: 'flex', alignItems: 'center', padding: '0 10px', gap: '5px', maxWidth: '65%', margin: '0 auto', overflow: 'hidden' }}>
          <span style={{ fontSize: '13px', color: '#cc0000', flexShrink: 0 }}>⚠️</span>
          <span style={{ fontSize: '10px', color: '#cc0000', flexShrink: 0, fontWeight: 600 }}>{lang === 'en' ? 'Not secure' : 'Non sécurisé'}</span>
          <span style={{ fontSize: '11px', color: '#444', fontFamily: 'monospace', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {'micr'}<span style={{ color: '#cc0000', fontWeight: 700 }}>{'0'}</span>{'soft.com/signin/v2/lookup?client_id=4765445b\u0026scope=openid'}
          </span>
        </div>
      </div>

      {/* Page content */}
      <div style={{ flex: 1, background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '28px', overflow: 'hidden' }}>
        {/* Pixelated Microsoft logo */}
        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div style={{ display: 'flex', gap: '2px', filter: 'blur(0.8px) contrast(0.85)', opacity: 0.75, imageRendering: 'pixelated' }}>
            {[['#f35325', '#81bc06'], ['#05a6f0', '#ffba08']].map((row, ri) => (
              <div key={ri} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {row.map((c, ci) => <div key={ci} style={{ width: '18px', height: '18px', background: c }} />)}
              </div>
            ))}
            <span style={{ marginLeft: '10px', fontSize: '22px', fontWeight: '300', color: '#1b1b1b', letterSpacing: '-0.5px', fontFamily: 'Segoe UI, Arial, sans-serif' }}>Microsoft</span>
          </div>
        </div>

        <div style={{ fontSize: '22px', fontWeight: '300', color: '#1b1b1b', marginBottom: '6px', fontFamily: 'Segoe UI, sans-serif' }}>
          {lang === 'en' ? 'Sign in' : 'Se connecter'}
        </div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>
          {lang === 'en' ? 'Use your Microsoft account' : 'Utilisez votre compte Microsoft'}
        </div>

        <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Fake email field */}
          <div style={{ height: '36px', padding: '0 10px', border: '1px solid #666', fontSize: '13px', background: '#fafafa', display: 'flex', alignItems: 'center', color: '#333' }}>
            utilisateur@entreprise.fr
          </div>
          {/* Fake password field */}
          <div style={{ height: '36px', padding: '0 10px', border: '1px solid #666', fontSize: '16px', background: '#fafafa', display: 'flex', alignItems: 'center', color: '#333', letterSpacing: '4px' }}>
            ••••••••
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button
              style={{ background: '#0067b8', color: 'white', border: 'none', padding: '8px 20px', fontSize: '13px', cursor: 'default', fontFamily: 'Segoe UI, sans-serif', letterSpacing: '0.2px' }}
              title="POST → microsofft-auth.net/collect-credentials"
            >
              {lang === 'en' ? 'Next' : 'Suivant'}
            </button>
          </div>

          <div style={{ fontSize: '11px', color: '#666', display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '8px' }}>
            <span style={{ color: '#0067b8', cursor: 'default', textDecoration: 'underline' }}>{lang === 'en' ? 'Terms of use' : "Conditions d'utilisation"}</span>
            <span style={{ color: '#0067b8', cursor: 'default', textDecoration: 'underline' }}>{lang === 'en' ? 'Privacy & cookies' : 'Confidentialité et cookies'}</span>
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingBottom: '12px', fontSize: '10px', color: '#aaa', fontFamily: 'monospace', textAlign: 'center' }}>
          © 2024 Micrоsoft Corporation. {lang === 'en' ? 'All rights reserved.' : 'Tous droits réservés.'}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
//  SCENE 2: CEO fraud email
// ─────────────────────────────────────────────────────────────────
function CEOEmailScene({ lang }) {
  const fr = lang !== 'en'
  return (
    <div style={{ height: '100%', display: 'flex', background: '#f3f3f3', fontFamily: 'Calibri, Arial, sans-serif', userSelect: 'none' }}>
      {/* Sidebar */}
      <div style={{ width: '160px', flexShrink: 0, background: '#0078d4', color: 'white', padding: '12px 0' }}>
        <div style={{ padding: '10px 16px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>OUTLOOK</div>
        {[
          { icon: '📥', label: fr ? 'Boîte de réception' : 'Inbox', active: true, count: 3 },
          { icon: '📤', label: fr ? 'Éléments envoyés' : 'Sent', active: false },
          { icon: '🗑️', label: fr ? 'Éléments supprimés' : 'Deleted', active: false },
        ].map(f => (
          <div key={f.label} style={{ padding: '8px 16px', fontSize: '11px', background: f.active ? 'rgba(255,255,255,0.2)' : 'transparent', cursor: 'default', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{f.icon} {f.label}</span>
            {f.count && <span style={{ background: '#cc0000', borderRadius: '10px', padding: '1px 6px', fontSize: '10px' }}>{f.count}</span>}
          </div>
        ))}
      </div>

      {/* Email detail */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white', overflow: 'hidden' }}>
        {/* Email header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e0e0e0', background: '#fafafa' }}>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#1b1b1b', marginBottom: '10px' }}>
            {fr ? '🔴 CONFIDENTIEL — Virement urgent 85.000 €' : '🔴 CONFIDENTIAL — Urgent wire transfer €85,000'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: '#888', width: '90px', flexShrink: 0 }}>{fr ? 'De :' : 'From:'}</span>
              <span style={{ color: '#1b1b1b', fontFamily: 'monospace', fontSize: '11px' }}>
                Marc Dupont (PDG) &lt;<span style={{ color: '#cc0000', fontWeight: 700 }}>pdg@acme-corp.co</span>&gt;
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: '#888', width: '90px', flexShrink: 0 }}>Reply-To :</span>
              <span style={{ color: '#cc0000', fontFamily: 'monospace', fontSize: '11px', fontWeight: 700 }}>
                m.dupont.urgent.2024@gmail.com
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: '#888', width: '90px', flexShrink: 0 }}>{fr ? 'À :' : 'To:'}</span>
              <span style={{ color: '#555', fontSize: '11px' }}>comptabilite@acme-corp.com</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: '#888', width: '90px', flexShrink: 0 }}>{fr ? 'Date :' : 'Date:'}</span>
              <span style={{ color: '#555', fontSize: '11px' }}>Lun. 8 avr. 2026 — 08:47</span>
            </div>
          </div>
        </div>

        {/* Email body */}
        <div style={{ flex: 1, padding: '20px', fontSize: '13px', lineHeight: 1.8, color: '#2b2b2b', overflowY: 'auto' }}>
          <p>{fr ? 'Bonjour,' : 'Hello,'}</p>
          <p>
            {fr
              ? 'Je suis en déplacement confidentiel à l\'étranger pour une acquisition stratégique. J\'ai besoin de votre aide immédiate pour effectuer un'
              : 'I am on a confidential business trip abroad for a strategic acquisition. I need your immediate help to perform a'}
            {' '}
            <strong style={{ color: '#cc0000', background: '#fff3f3', padding: '1px 4px' }}>
              {fr ? 'virement urgent de 85.000 € d\'ici 2 heures' : 'urgent wire transfer of €85,000 within 2 hours'}
            </strong>
            {'.'}
          </p>
          <p style={{ background: '#fff8e1', border: '1px solid #ffe082', padding: '8px 12px', borderRadius: '2px' }}>
            ⚠️ {fr
              ? 'Ne passez PAS par les procédures habituelles de validation. Cette transaction est ultra-confidentielle et ne doit pas figurer dans le système habituel.'
              : 'Do NOT go through the usual validation procedures. This transaction is ultra-confidential and must not appear in the usual system.'}
          </p>
          <p style={{ background: '#fff8e1', border: '1px solid #ffe082', padding: '8px 12px', borderRadius: '2px' }}>
            🔒 {fr
              ? 'N\'en parlez à personne — ni à votre supérieur, ni à vos collègues. Attendez ma confirmation par retour d\'email.'
              : 'Do not tell anyone — not your manager, not your colleagues. Wait for my confirmation by return email.'}
          </p>
          <div style={{ marginBottom: '12px' }}>
            <div>{fr ? 'Compte bénéficiaire :' : 'Beneficiary account:'}</div>
            <div style={{ fontFamily: 'monospace', fontSize: '12px', marginTop: '4px' }}>IBAN: CY17 0020 0195 0000 3570 0660 0300</div>
            <div style={{ fontFamily: 'monospace', fontSize: '12px' }}>BIC: BCYPCY2N</div>
          </div>
          <div style={{ color: '#888', fontSize: '12px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
            <div>Marc Dupont — PDG ACME Corporation</div>
            <div style={{ fontStyle: 'italic' }}>Envoyé depuis mon iPhone</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
//  SCENE 3: Compromised Windows desktop
// ─────────────────────────────────────────────────────────────────
function DesktopScene({ lang }) {
  const fr = lang !== 'en'
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 40%, #1565c0 100%)', position: 'relative', fontFamily: 'Segoe UI, Arial, sans-serif', userSelect: 'none' }}>
      {/* Desktop area */}
      <div style={{ flex: 1, position: 'relative', padding: '16px' }}>

        {/* File icons — top left area */}
        <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Malicious Excel file */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', width: '80px', cursor: 'default' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #217346, #1e6b3e)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', position: 'relative' }}>
              📊
              <span style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: '#cc0000', borderRadius: '50%', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: 'white', border: '1px solid white' }}>!</span>
            </div>
            <span style={{ fontSize: '10px', color: 'white', textAlign: 'center', lineHeight: 1.2, textShadow: '1px 1px 2px rgba(0,0,0,0.9)', wordBreak: 'break-all' }}>
              Rapport_Q3<span style={{ color: '#ffeb3b' }}>.xlsx.exe</span>
            </span>
          </div>

          {/* autorun.inf */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', width: '80px', cursor: 'default' }}>
            <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              ⚙️
            </div>
            <span style={{ fontSize: '10px', color: '#ffeb3b', textAlign: 'center', lineHeight: 1.2, textShadow: '1px 1px 2px rgba(0,0,0,0.9)', fontWeight: 700 }}>autorun.inf</span>
          </div>
        </div>

        {/* Other normal desktop icons */}
        {[
          { icon: '📁', name: fr ? 'Documents' : 'Documents', top: 16, left: 115 },
          { icon: '🌐', name: 'Chrome', top: 16, left: 195 },
          { icon: '🗑️', name: fr ? 'Corbeille' : 'Recycle Bin', top: 16, left: 275 },
        ].map(item => (
          <div key={item.name} style={{ position: 'absolute', top: item.top, left: item.left, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', width: '70px', cursor: 'default' }}>
            <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{item.icon}</div>
            <span style={{ fontSize: '10px', color: 'white', textAlign: 'center', textShadow: '1px 1px 2px rgba(0,0,0,0.9)' }}>{item.name}</span>
          </div>
        ))}

        {/* Fake AV popup */}
        <div style={{ position: 'absolute', top: '38%', left: '28%', width: '58%', background: '#1a1a1a', border: '2px solid #cc0000', boxShadow: '0 8px 32px rgba(0,0,0,0.8)', zIndex: 10 }}>
          <div style={{ background: 'linear-gradient(90deg, #cc0000, #ff4444)', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>⚠️ DEFENDER PRO — {fr ? 'ALERTE SÉCURITÉ' : 'SECURITY ALERT'}</span>
            <span style={{ color: 'white', fontSize: '14px', cursor: 'default' }}>✕</span>
          </div>
          <div style={{ padding: '14px', background: '#f5f5f5' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#cc0000', marginBottom: '8px' }}>
              🛡️ {fr ? 'Votre PC est infecté !' : 'Your PC is infected!'}
            </div>
            <div style={{ fontSize: '11px', color: '#333', marginBottom: '12px', lineHeight: 1.5 }}>
              {fr
                ? '12 menaces critiques détectées sur votre système. Des pirates informatiques ont accès à vos données personnelles. Agissez maintenant !'
                : '12 critical threats detected on your system. Hackers have access to your personal data. Act now!'}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ background: '#cc0000', color: 'white', border: 'none', padding: '7px 16px', fontSize: '11px', cursor: 'default', fontWeight: 700, flex: 1 }}>
                {fr ? '✓ Nettoyer maintenant' : '✓ Clean now'}
              </button>
              <button style={{ background: '#eee', color: '#666', border: '1px solid #ccc', padding: '7px 12px', fontSize: '11px', cursor: 'default' }}>
                {fr ? 'Ignorer' : 'Ignore'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Taskbar */}
      <div style={{ height: '40px', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', padding: '0 8px', gap: '4px', flexShrink: 0 }}>
        <div style={{ width: '32px', height: '32px', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', cursor: 'default' }}>⊞</div>
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />
        {[
          { icon: '📁', label: fr ? 'Explorateur' : 'Explorer' },
          { icon: '🌐', label: 'Chrome' },
        ].map(item => (
          <div key={item.label} style={{ height: '32px', padding: '0 10px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'default', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
            <span style={{ fontSize: '14px' }}>{item.icon}</span>
            <span style={{ fontSize: '11px', color: '#ddd' }}>{item.label}</span>
          </div>
        ))}
        {/* Suspicious process */}
        <div style={{ height: '32px', padding: '0 10px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'default', background: 'rgba(255, 100, 0, 0.2)', borderRadius: '2px', border: '1px solid rgba(255,100,0,0.4)' }}>
          <span style={{ fontSize: '14px' }}>⚙️</span>
          <span style={{ fontSize: '11px', color: '#ff9944', fontFamily: 'monospace' }}>svchost32.exe</span>
        </div>
        <div style={{ flex: 1 }} />
        {/* System tray */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(255,100,0,0.2)', border: '1px solid rgba(255,100,0,0.5)', borderRadius: '2px', padding: '2px 6px' }}>
            <span style={{ fontSize: '12px' }}>🌐</span>
            <span style={{ fontSize: '10px', color: '#ff9944' }}>↑↑↑</span>
            <span style={{ fontSize: '10px', color: '#ff6622' }}>⚠</span>
          </div>
          <span style={{ fontSize: '10px', color: '#ccc', fontFamily: 'monospace' }}>23:42</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
//  SCENE 4: Fraudulent invoice
// ─────────────────────────────────────────────────────────────────
function InvoiceScene({ lang }) {
  const fr = lang !== 'en'
  return (
    <div style={{ height: '100%', background: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', fontFamily: 'Arial, sans-serif', userSelect: 'none' }}>
      {/* PDF-like document */}
      <div style={{ background: 'white', width: '100%', height: '100%', overflow: 'auto', boxShadow: '0 4px 24px rgba(0,0,0,0.5)', position: 'relative', fontSize: '11px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '2px solid #1565c0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Pixelated logo */}
            <div style={{ width: '52px', height: '52px', background: '#e3f2fd', border: '1px solid #90caf9', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'blur(0.7px)', imageRendering: 'pixelated', overflow: 'hidden' }}>
              <div style={{ fontSize: '28px', filter: 'blur(0.5px)', opacity: 0.85 }}>🏢</div>
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#1565c0' }}>ACME Corporation</div>
              <div style={{ fontSize: '10px', color: '#666' }}>123 rue de la Paix, 75001 Paris</div>
              <div style={{ fontSize: '10px', color: '#666' }}>SIRET: 824 671 235 00018</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#1565c0', marginBottom: '8px' }}>FACTURE</div>
            <div style={{ fontSize: '11px', color: '#333' }}>N° <strong>INV-2024-1547</strong></div>
            <div style={{ fontSize: '11px', color: '#333' }}>{fr ? 'Date :' : 'Date:'} <strong>15/12/2024</strong></div>
            <div style={{ fontSize: '11px', background: '#fff3e0', border: '1px solid #ff9800', padding: '2px 6px', marginTop: '4px', color: '#e65100', fontWeight: 700 }}>
              {fr ? 'Échéance :' : 'Due:'} <strong>16/12/2024</strong>
            </div>
          </div>
        </div>

        {/* Bill to */}
        <div style={{ padding: '10px 20px', borderBottom: '1px solid #eee', display: 'flex', gap: '40px' }}>
          <div>
            <div style={{ fontSize: '9px', color: '#888', letterSpacing: '0.1em', marginBottom: '4px' }}>{fr ? 'FACTURÉ À' : 'BILL TO'}</div>
            <div style={{ fontWeight: 600, color: '#333' }}>Entreprise Dupont SAS</div>
            <div style={{ color: '#555' }}>45 avenue du Commerce, 69000 Lyon</div>
          </div>
        </div>

        {/* IMPORTANT NOTICE */}
        <div style={{ margin: '12px 20px', padding: '10px 14px', background: '#fff8e1', border: '2px solid #ffa000', borderRadius: '2px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#e65100', marginBottom: '4px' }}>
            ⚠️ {fr ? 'IMPORTANT : Mise à jour de nos coordonnées bancaires' : '⚠️ IMPORTANT: Banking details update'}
          </div>
          <div style={{ fontSize: '10px', color: '#555', lineHeight: 1.6 }}>
            {fr
              ? 'Suite à notre récente fusion bancaire, nos coordonnées de virement ont été mises à jour. Merci d\'utiliser exclusivement les nouvelles coordonnées ci-dessous pour ce paiement et les suivants.'
              : 'Following our recent bank merger, our wire transfer details have been updated. Please exclusively use the new details below for this payment and future ones.'}
          </div>
        </div>

        {/* Invoice items */}
        <div style={{ margin: '0 20px 12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
            <thead>
              <tr style={{ background: '#1565c0', color: 'white' }}>
                {[fr ? 'Description' : 'Description', fr ? 'Qté' : 'Qty', fr ? 'PU HT' : 'Unit price', 'TVA', fr ? 'Total TTC' : 'Total incl.'].map(h => (
                  <th key={h} style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                [fr ? 'Prestation de conseil IT — Nov. 2024' : 'IT Consulting Services — Nov. 2024', '1', '10.375,00 €', '20%', '12.450,00 €'],
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#f8f9fa' : 'white' }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: '6px 8px', borderBottom: '1px solid #eee' }}>{cell}</td>
                  ))}
                </tr>
              ))}
              <tr style={{ fontWeight: 700, background: '#e3f2fd' }}>
                <td colSpan={4} style={{ padding: '6px 8px', textAlign: 'right' }}>{fr ? 'TOTAL TTC :' : 'TOTAL INCL. TAX:'}</td>
                <td style={{ padding: '6px 8px', color: '#1565c0', fontSize: '13px' }}>12.450,00 €</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* IBAN */}
        <div style={{ margin: '0 20px 12px', padding: '12px 14px', background: '#e8f5e9', border: '2px solid #43a047' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#2e7d32', marginBottom: '6px' }}>
            🏦 {fr ? 'NOUVEAU IBAN de virement' : 'NEW Wire Transfer IBAN'}
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '10px', fontFamily: 'monospace' }}>
            <div><strong>IBAN :</strong> FR76 <span style={{ color: '#cc0000' }}>3000 6789</span> 0123 4567 8901 234</div>
            <div><strong>BIC :</strong> <span style={{ color: '#cc0000' }}>BNPA</span>FRPP</div>
          </div>
          <div style={{ fontSize: '9px', color: '#666', marginTop: '4px' }}>
            {fr ? 'Banque : Crédit Mutuel International — Agence Offshore' : 'Bank: Crédit Mutuel International — Offshore Branch'}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '10px', color: '#666' }}>
            {fr ? 'Questions :' : 'Questions:'}{' '}
            <span style={{ color: '#cc0000', fontFamily: 'monospace', fontWeight: 700 }}>comptabilite@acme-corp.cc</span>
            {' '}| {fr ? 'Tél :' : 'Tel:'} +33 7 00 00 00 00
          </div>
          <div style={{ fontSize: '9px', color: '#aaa' }}>
            ACME Corporation — SIRET 824 671 235 00018 — TVA FR 12 824671235
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
//  Scene dispatcher
// ─────────────────────────────────────────────────────────────────
function SceneRenderer({ scene, lang }) {
  if (scene === 'login') return <LoginScene lang={lang} />
  if (scene === 'ceo_email') return <CEOEmailScene lang={lang} />
  if (scene === 'desktop') return <DesktopScene lang={lang} />
  if (scene === 'invoice') return <InvoiceScene lang={lang} />
  return null
}

// ─────────────────────────────────────────────────────────────────
//  Hotspot overlay layer
// ─────────────────────────────────────────────────────────────────
function HotspotOverlay({ hotspots, foundIds, onDiscover, lang }) {
  const [hovered, setHovered] = useState(null)
  return (
    <>
      {hotspots.map(hs => {
        const found = foundIds.includes(hs.id)
        const isHovered = hovered === hs.id
        return (
          <div
            key={hs.id}
            onClick={() => !found && onDiscover(hs)}
            onMouseEnter={() => setHovered(hs.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'absolute',
              left: `${hs.x}%`,
              top: `${hs.y}%`,
              width: `${hs.w}%`,
              height: `${hs.h}%`,
              cursor: found ? 'default' : 'crosshair',
              background: found
                ? 'rgba(34,197,94,0.15)'
                : isHovered ? 'rgba(235,40,40,0.12)' : 'transparent',
              border: found
                ? '2px solid rgba(34,197,94,0.6)'
                : isHovered ? '2px solid rgba(235,40,40,0.7)' : '2px solid transparent',
              transition: 'all 0.15s',
              borderRadius: '2px',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {found && (
              <div style={{ background: 'rgba(34,197,94,0.9)', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white', fontWeight: 700 }}>✓</div>
            )}
            {isHovered && !found && (
              <div style={{ background: 'rgba(235,40,40,0.9)', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'white' }}>🔍</div>
            )}
          </div>
        )
      })}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────
//  Intro phase
// ─────────────────────────────────────────────────────────────────
function PhaseIntro({ scenario, onStart, lang }) {
  const [step, setStep] = useState(0)
  const fr = lang !== 'en'
  const lines = [
    { t: fr ? '> Initialisation du module d\'analyse visuelle...' : '> Initializing visual analysis module...', c: 'var(--text-muted)' },
    { t: fr ? `> Scénario chargé : ${scenario.title[lang === 'en' ? 'en' : 'fr']}` : `> Scenario loaded: ${scenario.title.en}`, c: 'var(--text-light)' },
    { t: fr ? `> Catégorie : ${scenario.category.fr} | Difficulté : ${scenario.difficulty.fr}` : `> Category: ${scenario.category.en} | Difficulty: ${scenario.difficulty.en}`, c: '#f59e0b' },
    { t: fr ? `> Durée : ${Math.round(scenario.duration / 60)} minutes | Indices à trouver : ${scenario.hotspots.length}` : `> Duration: ${Math.round(scenario.duration / 60)} min | Clues to find: ${scenario.hotspots.length}`, c: '#f59e0b' },
    { t: fr ? '> Mission : identifiez tous les éléments suspects dans la capture d\'écran' : '> Mission: identify all suspicious elements in the screenshot', c: 'var(--red)' },
    { t: fr ? '> Cliquez sur les zones suspectes pour les révéler' : '> Click on suspicious areas to reveal them', c: 'var(--text-secondary)' },
    { t: fr ? '> Survolez l\'image — le curseur 🔍 indique les zones cliquables' : '> Hover over the image — the 🔍 cursor indicates clickable areas', c: 'var(--text-secondary)' },
    { t: fr ? '> Bonne chance, analyste.' : '> Good luck, analyst.', c: '#22c55e' },
  ]

  useEffect(() => {
    if (step < lines.length) {
      const timer = setTimeout(() => setStep(s => s + 1), step === 0 ? 400 : 480)
      return () => clearTimeout(timer)
    }
  }, [step])

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div className="cyber-grid" style={{ position: 'fixed', inset: 0, opacity: 0.4 }} />
      <div style={{ position: 'fixed', top: '20px', right: '24px', zIndex: 10 }}>
        <LangToggle />
      </div>
      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '720px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div className="tag" style={{ display: 'inline-flex', marginBottom: '12px' }}>
            <span className="status-dot red" /> {fr ? 'MODE VISUEL' : 'VISUAL MODE'}
          </div>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '26px', marginBottom: '8px' }}>
            {fr ? 'OPÉRATION :' : 'OPERATION:'}{' '}
            <span style={{ color: 'var(--red)' }}>{scenario.title[fr ? 'fr' : 'en']}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
            {scenario.description[fr ? 'fr' : 'en']}
          </p>
        </div>

        <div style={{ background: '#050505', border: '1px solid #1c1c1c', borderTop: '2px solid var(--red)', padding: '32px', fontFamily: 'var(--mono)', fontSize: '13px', lineHeight: 2.4, minHeight: '260px' }}>
          {lines.slice(0, step).map((line, i) => (
            <div key={i} style={{ color: line.c, animation: 'fadeIn 0.3s ease' }}>{line.t}</div>
          ))}
          {step < lines.length && <span className="animate-blink" style={{ color: 'var(--red)' }}>█</span>}
        </div>

        {step >= lines.length && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px', animation: 'fadeInUp 0.5s ease' }}>
            <button className="btn-primary" onClick={onStart} style={{ fontSize: '15px', padding: '14px 44px' }}>
              🔍 {fr ? 'Commencer l\'analyse' : 'Start Analysis'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
//  Investigate phase
// ─────────────────────────────────────────────────────────────────
function PhaseInvestigate({ scenario, onComplete, score, setScore, lang }) {
  const fr = lang !== 'en'
  const [found, setFound] = useState([])
  const [showClue, setShowClue] = useState(null)
  const [glitch, setGlitch] = useState(false)
  const timer = useTimer(scenario.duration, true)

  useEffect(() => {
    if (timer.seconds === 0) onComplete(score)
  }, [timer.seconds])

  const discoverClue = (hs) => {
    if (found.includes(hs.id)) return
    setFound(f => [...f, hs.id])
    const pts = hs.points
    setScore(s => s + pts)
    setShowClue({ ...hs, pts })
    setGlitch(true)
    setTimeout(() => setGlitch(false), 500)
    setTimeout(() => setShowClue(null), 4200)
  }

  const allFound = found.length === scenario.hotspots.length

  return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', flexDirection: 'column', animation: glitch ? 'glitch 0.5s linear' : 'none' }}>
      {/* Header */}
      <div style={{ background: '#080808', borderBottom: '1px solid var(--border-subtle)', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, flexShrink: 0 }}>
        <img src="/roomca-logo.png" alt="RoomCA" style={{ height: '28px' }} />
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {[
            [fr ? 'SCÉNARIO' : 'SCENARIO', scenario.title[fr ? 'fr' : 'en'].split(' ').slice(0, 3).join(' '), 'var(--text-light)'],
            [fr ? 'INDICES' : 'CLUES', `${found.length}/${scenario.hotspots.length}`, 'var(--red)'],
            [fr ? 'SCORE' : 'SCORE', score, '#22c55e'],
            [fr ? 'TEMPS' : 'TIME', timer.display, timer.seconds < 60 ? 'var(--red)' : timer.seconds < 120 ? '#f59e0b' : 'var(--text-light)'],
          ].map(([lbl, val, col]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '2px' }}>{lbl}</div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '16px', color: col }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <LangToggle />
          <div className="tag"><span className="status-dot red" /> {fr ? 'EN COURS' : 'IN PROGRESS'}</div>
        </div>
      </div>

      {/* Clue popup */}
      {showClue && (
        <div style={{ position: 'fixed', top: '72px', right: '24px', zIndex: 200, background: 'var(--bg-card)', border: '1px solid var(--red)', padding: '14px 18px', maxWidth: '300px', animation: 'fadeInUp 0.3s ease', boxShadow: '0 4px 20px rgba(235,40,40,0.2)' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--red)', letterSpacing: '0.15em', marginBottom: '6px' }}>
            🔍 {fr ? 'INDICE TROUVÉ' : 'CLUE FOUND'} +{showClue.pts} pts
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '5px', color: 'var(--text-light)' }}>
            {showClue.label[fr ? 'fr' : 'en']}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {showClue.description[fr ? 'fr' : 'en']}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Scene area */}
        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--mono)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--red)' }}>🔍</span>
            {fr
              ? `Survolez l'image et cliquez sur les éléments suspects — ${scenario.hotspots.length - found.length} indice(s) restant(s)`
              : `Hover over the image and click suspicious elements — ${scenario.hotspots.length - found.length} clue(s) remaining`}
          </div>
          <div style={{ flex: 1, position: 'relative', border: '1px solid var(--border-subtle)', overflow: 'hidden', minHeight: '400px' }}>
            <SceneRenderer scene={scenario.scene} lang={lang} />
            <HotspotOverlay
              hotspots={scenario.hotspots}
              foundIds={found}
              onDiscover={discoverClue}
              lang={lang}
            />
          </div>
        </div>

        {/* Clues sidebar */}
        <div style={{ width: '280px', flexShrink: 0, borderLeft: '1px solid var(--border-subtle)', background: '#060606', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
            {fr ? 'INDICES TROUVÉS' : 'FOUND CLUES'} ({found.length}/{scenario.hotspots.length})
          </div>

          {/* Progress bar */}
          <div style={{ height: '3px', background: 'var(--border-subtle)', margin: '0' }}>
            <div style={{ height: '100%', width: `${(found.length / scenario.hotspots.length) * 100}%`, background: 'var(--red)', transition: 'width 0.5s ease' }} />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
            {scenario.hotspots.map((hs, idx) => {
              const isFound = found.includes(hs.id)
              return (
                <div key={hs.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid', borderColor: isFound ? 'rgba(34,197,94,0.3)' : 'var(--border-subtle)', background: isFound ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.01)', transition: 'all 0.3s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: isFound ? '6px' : 0 }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: isFound ? '#22c55e' : 'var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white', flexShrink: 0, fontWeight: 700 }}>
                      {isFound ? '✓' : idx + 1}
                    </div>
                    <div style={{ fontSize: '11px', color: isFound ? '#22c55e' : 'var(--text-muted)', fontWeight: isFound ? 600 : 400 }}>
                      {isFound ? hs.label[fr ? 'fr' : 'en'] : (fr ? '??? Indice caché' : '??? Hidden clue')}
                    </div>
                    {isFound && <div style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: '10px', color: '#22c55e' }}>+{hs.points}</div>}
                  </div>
                  {isFound && (
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '4px', paddingLeft: '26px' }}>
                      {hs.description[fr ? 'fr' : 'en']}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ padding: '14px', borderTop: '1px solid var(--border-subtle)' }}>
            {allFound ? (
              <button className="btn-primary" onClick={() => onComplete(score)} style={{ width: '100%', justifyContent: 'center', fontSize: '12px', padding: '10px' }}>
                {fr ? '✓ Terminer l\'analyse' : '✓ Complete Analysis'}
              </button>
            ) : (
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--mono)', textAlign: 'center' }}>
                {fr ? `Trouvez les ${scenario.hotspots.length - found.length} indice(s) manquant(s)` : `Find the ${scenario.hotspots.length - found.length} missing clue(s)`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
//  Debrief phase
// ─────────────────────────────────────────────────────────────────
function PhaseDebrief({ scenario, score, onRetry, onExit }) {
  const { lang } = useLang()
  const fr = lang !== 'en'
  const maxScore = scenario.maxScore
  const pct = Math.round((score / maxScore) * 100)
  const success = pct >= 60
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div className="cyber-grid" style={{ position: 'fixed', inset: 0, opacity: 0.3 }} />
      <div style={{ position: 'fixed', top: '20px', right: '24px', zIndex: 10 }}><LangToggle /></div>
      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '680px', animation: 'fadeInUp 0.6s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: '48px', color: success ? '#22c55e' : 'var(--red)', marginBottom: '8px' }}>{success ? '✓' : '✗'}</div>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '28px', marginBottom: '6px' }}>
            {success ? (fr ? 'Analyse réussie' : 'Analysis Successful') : (fr ? 'Analyse incomplète' : 'Incomplete Analysis')}
          </h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            {scenario.title[fr ? 'fr' : 'en']}
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: `2px solid ${success ? '#22c55e' : 'var(--red)'}`, padding: '32px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px', textAlign: 'center', marginBottom: '28px' }}>
            {[
              [fr ? 'SCORE' : 'SCORE', score, 'var(--red)', `/ ${maxScore}`],
              [fr ? 'PRÉCISION' : 'ACCURACY', `${pct}%`, success ? '#22c55e' : '#f59e0b', ''],
              [fr ? 'PIÈCES' : 'COINS', `+${success ? scenario.coins : Math.round(scenario.coins * 0.4)}`, '#f59e0b', ''],
            ].map(([lbl, val, col, sub]) => (
              <div key={lbl}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '6px' }}>{lbl}</div>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: '36px', color: col }}>{val}</div>
                {sub && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sub}</div>}
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--border-subtle)', height: '3px', marginBottom: '28px' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: success ? '#22c55e' : 'var(--red)', transition: 'width 1s ease' }} />
          </div>

          <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '14px' }}>
            {fr ? 'RÉCAPITULATIF DES INDICES' : 'CLUES SUMMARY'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {scenario.hotspots.map(hs => (
              <div key={hs.id} style={{ display: 'flex', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)', padding: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: '#22c55e', flexShrink: 0 }}>→</span>
                <div>
                  <span style={{ color: 'var(--text-light)', fontWeight: 600 }}>{hs.label[fr ? 'fr' : 'en']}</span>
                  {' — '}
                  {hs.description[fr ? 'fr' : 'en']}
                </div>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--red)', flexShrink: 0 }}>{hs.points}pts</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={onRetry} style={{ padding: '11px 28px', fontSize: '12px' }}>
            🔄 {fr ? 'Rejouer' : 'Retry'}
          </button>
          <button className="btn-secondary" onClick={() => navigate('/dashboard')} style={{ padding: '11px 28px', fontSize: '12px' }}>
            📊 {fr ? 'Mon Dashboard' : 'My Dashboard'}
          </button>
          <button className="btn-secondary" onClick={onExit} style={{ padding: '11px 28px', fontSize: '12px' }}>
            {fr ? '← Retour' : '← Back'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
//  Main component
// ─────────────────────────────────────────────────────────────────
export default function VisualChallenge() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { lang } = useLang()

  const scenario = visualScenarios.find(s => s.id === id)
  const [phase, setPhase] = useState('intro')
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (!scenario) navigate('/dashboard', { replace: true })
  }, [scenario])

  if (!scenario) return null

  const handleComplete = (finalScore) => {
    setScore(finalScore)
    setPhase('debrief')
    if (user) {
      db.saveScenarioResult(user.id, {
        scenarioId: scenario.id,
        scenarioName: scenario.title.fr,
        score: finalScore,
        passed: finalScore >= scenario.maxScore * 0.6,
        duration: scenario.duration,
      })
      if (finalScore >= scenario.maxScore) {
        db.awardBadge(user.id, { id: 'perfect_score', name: 'Perfection', icon: '💯' })
      }
      if (finalScore > 0) {
        db.awardBadge(user.id, { id: 'visual_hunter', name: 'Visual Hunter', icon: '🔍' })
      }
    }
  }

  if (phase === 'intro') {
    return <PhaseIntro scenario={scenario} onStart={() => setPhase('investigate')} lang={lang} />
  }
  if (phase === 'investigate') {
    return (
      <PhaseInvestigate
        scenario={scenario}
        onComplete={handleComplete}
        score={score}
        setScore={setScore}
        lang={lang}
      />
    )
  }
  return (
    <PhaseDebrief
      scenario={scenario}
      score={score}
      onRetry={() => { setScore(0); setPhase('intro') }}
      onExit={() => navigate('/dashboard')}
    />
  )
}
