import { useState, useRef, useEffect } from 'react'

const responses = {
  phishing: "Pour prévenir le phishing : 1) Vérifiez toujours l'expéditeur, 2) Ne cliquez pas sur les liens suspects, 3) Activez 2FA, 4) Signalez les emails douteux à l'IT.",
  gdpr: "GDPR exige : Consentement explicite, droit à l'oubli, notification de breach sous 72h, DPO obligatoire pour grandes structures, DPIA pour traitements à risque.",
  hipaa: "HIPAA protège PHI (Protected Health Information). Exige : BAA avec partenaires, encryption, contrôle d'accès, audit trail, formation annuelle.",
  password: "Bons mots de passe : 12+ caractères, mélange majuscules/minuscules/chiffres/symboles, uniques par compte, gestionnaire de mots de passe (1Password, Bitwarden), MFA obligatoire.",
  ransomware: "Si ransomware : 1) Isoler immédiatement, 2) Ne PAS payer, 3) Alerter IT/RSSI, 4) Préserver les preuves, 5) Activer plan DR, 6) Notifier autorités sous 72h (GDPR).",
  default: "Je suis l'assistant ROOMCA. Posez-moi vos questions sur la cybersécurité, GDPR, HIPAA, phishing, mots de passe, ou compliance. 🛡️"
}

function getResponse(msg) {
  const lower = msg.toLowerCase()
  if (lower.includes('phish')) return responses.phishing
  if (lower.includes('gdpr') || lower.includes('rgpd')) return responses.gdpr
  if (lower.includes('hipaa')) return responses.hipaa
  if (lower.includes('password') || lower.includes('mot de passe')) return responses.password
  if (lower.includes('ransomware') || lower.includes('rançon')) return responses.ransomware
  return responses.default
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Bonjour ! Je suis ROOMCA AI. Comment puis-je vous aider aujourd\'hui ? 🤖' }
  ])
  const [input, setInput] = useState('')
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input }
    setMessages([...messages, userMsg])
    setTimeout(() => {
      setMessages(m => [...m, { role: 'bot', text: getResponse(input) }])
    }, 600)
    setInput('')
  }

  return (
    <>
      <button onClick={() => setOpen(!open)} style={{
        position: 'fixed', bottom: '20px', right: '20px', width: '60px', height: '60px',
        borderRadius: '50%', background: '#eb2828', border: 'none', cursor: 'pointer',
        fontSize: '28px', boxShadow: '0 4px 20px rgba(235,40,40,0.4)', zIndex: 1000
      }}>{open ? '✕' : '🤖'}</button>

      {open && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '20px', width: '360px', height: '500px',
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px',
          display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 1000
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(235,40,40,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🤖</div>
            <div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '14px' }}>ROOMCA AI Assistant</div>
              <div style={{ fontSize: '11px', color: '#22c55e' }}>● En ligne</div>
            </div>
          </div>

          <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: '12px', display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: '12px',
                  background: m.role === 'user' ? '#eb2828' : 'var(--bg-black)',
                  color: m.role === 'user' ? '#fff' : 'var(--text-primary)',
                  fontSize: '13px'
                }}>{m.text}</div>
              </div>
            ))}
            <div ref={endRef}></div>
          </div>

          <div style={{ padding: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px' }}>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Posez une question..."
              style={{ flex: 1, padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px' }} />
            <button onClick={send} style={{ padding: '10px 16px', background: '#eb2828', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>→</button>
          </div>
        </div>
      )}
    </>
  )
}
