import { useState, useRef, useEffect } from 'react'
import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `Tu es l'assistant ROOMCA, expert en cybersécurité et conformité réglementaire pour entreprises. Tu travailles pour la plateforme ROOMCA Cyber Awareness, une solution SaaS de sensibilisation à la cybersécurité via des scénarios interactifs gamifiés.

## Ton expertise couvre :

### Réglementations et conformité
- GDPR/RGPD : droits des personnes, notification breach 72h CNIL, DPIA, DPO, sanctions €20M ou 4% CA mondial
- HIPAA : PHI, notification breach 60 jours HHS OCR, BAA, chiffrement, formation annuelle
- PCI-DSS v4.0 : 12 exigences, stockage CVV interdit, MFA admin (req 8), logs 12 mois (req 10), tokenisation
- NIS2 : en vigueur octobre 2024, ~160 000 entités France, notification 24h initial/72h complet, €10M ou 2% CA
- DORA : janvier 2025, secteur financier, notification 4h initial, TLPT obligatoires
- ISO 27001:2022 : 93 contrôles, cycle PDCA, certification externe, révision annuelle
- SOC 2 Type II : TSC 5 critères, audit 6-12 mois, CC6.1 accès logiques
- CMMC 2.0 : 3 niveaux, fournisseurs DoD, 110 pratiques niveau 2
- FERPA : données éducatives US, consentement parental, droits d'accès
- HDS : hébergement données de santé France, agrément ANSSI
- ISO 27701 : extension ISO 27001 pour vie privée/RGPD

### Cybermenaces et attaques
- Phishing : vérification expéditeur, liens suspects, urgence artificielle, BEC (Business Email Compromise)
- Ransomware : isolation immédiate, ne pas payer (OFAC), sauvegardes 3-2-1, notification 72h GDPR/24h NIS2
- Social engineering : pretexting, baiting, vishing, tailgating, techniques de manipulation
- Malware : types (trojans, keyloggers, spyware), vecteurs d'infection, détection
- Attaques réseau : man-in-the-middle, DNS poisoning, ARP spoofing, WiFi rouge
- Insider threat : exfiltration données, sabotage, erreur humaine non intentionnelle
- Supply chain attacks : compromission fournisseurs, SolarWinds, Log4Shell
- APT (Advanced Persistent Threats) : phases kill chain, persistance, lateral movement

### Bonnes pratiques sécurité
- Mots de passe : 16+ caractères, unique par service, gestionnaires (Bitwarden, 1Password, Dashlane)
- MFA/2FA : apps préférées (TOTP) vs SMS (SIM swapping), clés hardware (YubiKey)
- Chiffrement : AES-256, RSA, TLS 1.3, chiffrement au repos et en transit
- Zero Trust : "Never trust, always verify", micro-segmentation, ZTNA vs VPN
- Sauvegardes 3-2-1 : 3 copies, 2 supports, 1 hors site, tester la restauration, RTO/RPO
- Patch management : fenêtres de maintenance, CVE, CVSS scoring, zero-day
- SIEM/SOC : alertes, corrélation événements, threat intelligence, IOC
- Pentest : black/white/grey box, OWASP Top 10, rapport de vulnérabilités

### Secteurs spécialisés
- Santé : HIPAA + HDS + RGPD, dossier patient, IoMT, systèmes legacy
- Finance/Banque : DORA + PCI-DSS + RGPD, fraude, open banking
- Industrie/OT : IEC 62443, NERC-CIP, systèmes SCADA, air gap
- Administration publique : RGS, SecNumCloud, ANSSI, données régaliennes
- Éducation : FERPA + RGPD, données mineurs, COPPA

### Réponse aux incidents
- Plan de réponse (PRIR) : préparation, identification, confinement, éradication, récupération
- Forensique numérique : préservation preuves, chaîne de custody, analyse logs
- Notification breaches : délais légaux par réglementation, contenu obligatoire, CNIL/ANSSI/HHS OCR
- Communication de crise : cellule de crise, communication interne/externe, presse
- BCP/PCA/PRA : RTO, RPO, tests de continuité, failover

### ROOMCA Platform
- Scénarios disponibles : Opération Inbox Zero (phishing), Bureau Compromis (ransomware), Ingénierie Sociale, Fuite de Données, WiFi Piégé
- Secteurs couverts : Santé, Finance, Administration, Éducation, Industrie, Commerce, Énergie, Juridique, Tech, Transport
- Plans : Starter (50 employés, 4 scénarios), Pro (500 employés, tous scénarios), Enterprise (illimité)
- Fonctionnalités : Analytics, Campaigns phishing, Certifications, Compliance tracking, API, SSO

## Style de réponse :
- Réponds TOUJOURS en français sauf si on te parle en anglais
- Sois précis, pratique et actionnable
- Utilise des listes à puces pour les étapes et procédures
- Cite les délais légaux exacts et les montants de sanctions quand pertinent
- Utilise **gras** pour les termes importants et les chiffres clés
- Si on te pose une question hors cybersécurité/conformité, recentre poliment sur ton domaine
- Longueur : adapte — courte pour les définitions, détaillée pour les procédures`

function formatMessage(text) {
  return text.split('\n').map((line, i) => {
    const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    return <div key={i} style={{ marginBottom: line === '' ? '6px' : '1px' }} dangerouslySetInnerHTML={{ __html: bold }} />
  })
}

const QUICK_QUESTIONS = [
  'Que faire face à un phishing ?',
  'Délais de notification GDPR ?',
  'Comment réagir à un ransomware ?',
  'Qu\'est-ce que le MFA ?',
]

export default function AIChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Bonjour ! Je suis l'assistant ROOMCA 🛡️\n\nPosez-moi vos questions sur la **cybersécurité**, le **GDPR**, **HIPAA**, **NIS2**, le **phishing**, les **ransomwares** ou toute autre thématique de conformité et sécurité." }
  ])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState(null)
  const endRef = useRef(null)
  const clientRef = useRef(null)

  useEffect(() => {
    const key = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (key) {
      clientRef.current = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true })
    }
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  const send = async (text) => {
    const msg = (text || input).trim()
    if (!msg || streaming) return
    setInput('')
    setError(null)

    const userMessage = { role: 'user', content: msg }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setStreaming(true)

    // Optimistic empty assistant message for streaming
    setMessages(m => [...m, { role: 'assistant', content: '', streaming: true }])

    try {
      if (!clientRef.current) {
        throw new Error('API key not configured. Add VITE_ANTHROPIC_API_KEY to .env.local')
      }

      // Build history for API (exclude initial greeting and streaming placeholder)
      const apiMessages = newMessages
        .filter(m => !m.streaming)
        .map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }))

      const stream = clientRef.current.messages.stream({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: apiMessages,
      })

      let accumulated = ''
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
          accumulated += chunk.delta.text
          setMessages(m => {
            const updated = [...m]
            updated[updated.length - 1] = { role: 'assistant', content: accumulated, streaming: true }
            return updated
          })
        }
      }

      setMessages(m => {
        const updated = [...m]
        updated[updated.length - 1] = { role: 'assistant', content: accumulated }
        return updated
      })
    } catch (err) {
      const errMsg = err.message?.includes('API key') || err.status === 401
        ? '⚠ Clé API non configurée. Ajoutez VITE_ANTHROPIC_API_KEY dans .env.local'
        : `⚠ Erreur: ${err.message || 'Impossible de contacter l\'API'}`
      setMessages(m => {
        const updated = [...m]
        updated[updated.length - 1] = { role: 'assistant', content: errMsg }
        return updated
      })
      setError(errMsg)
    } finally {
      setStreaming(false)
    }
  }

  const showQuickActions = messages.length <= 1

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        title="Assistant ROOMCA"
        aria-label="Ouvrir l'assistant"
        style={{
          position: 'fixed', bottom: '24px', right: '24px', width: '56px', height: '56px',
          borderRadius: '50%', background: '#eb2828', border: 'none', cursor: 'pointer',
          fontSize: '26px', boxShadow: '0 4px 20px rgba(235,40,40,0.5)', zIndex: 1000,
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(235,40,40,0.7)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(235,40,40,0.5)' }}
      >
        {open ? '✕' : '🤖'}
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: '88px', right: '24px', width: '380px', height: '560px',
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px',
          display: 'flex', flexDirection: 'column', boxShadow: '0 12px 40px rgba(0,0,0,0.6)', zIndex: 1000,
        }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(235,40,40,0.05)', borderRadius: '16px 16px 0 0' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(235,40,40,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🛡️</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '14px' }}>ROOMCA Assistant IA</div>
              <div style={{ fontSize: '11px', color: streaming ? '#f59e0b' : '#22c55e' }}>
                {streaming ? '● Analyse en cours...' : '● Expert cybersécurité & conformité'}
              </div>
            </div>
            <button onClick={() => setMessages([messages[0]])} title="Effacer la conversation" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px', padding: '4px' }}>🗑</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '14px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: '12px', display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {m.role === 'assistant' && (
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(235,40,40,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', marginRight: '8px', flexShrink: 0, marginTop: '2px' }}>🛡</div>
                )}
                <div style={{
                  maxWidth: '82%', padding: '10px 14px',
                  borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.role === 'user' ? '#eb2828' : 'var(--bg-black)',
                  color: 'var(--text-primary)', fontSize: '12px', lineHeight: 1.65,
                  border: m.role === 'assistant' ? '1px solid var(--border-subtle)' : 'none',
                }}>
                  {m.role === 'assistant' ? formatMessage(m.content) : m.content}
                  {m.streaming && m.content === '' && (
                    <div style={{ display: 'flex', gap: '4px', padding: '2px 0' }}>
                      {[0, 1, 2].map(j => (
                        <div key={j} style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#eb2828', animation: `pulse 1s ${j * 0.2}s infinite` }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Quick questions */}
          {showQuickActions && (
            <div style={{ padding: '0 14px 10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {QUICK_QUESTIONS.map(q => (
                <button key={q} onClick={() => send(q)} disabled={streaming}
                  style={{ padding: '5px 10px', background: 'rgba(235,40,40,0.1)', border: '1px solid rgba(235,40,40,0.3)', borderRadius: '12px', color: '#eb2828', cursor: 'pointer', fontSize: '10px', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(235,40,40,0.2)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(235,40,40,0.1)' }}
                >{q}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Posez une question..."
              aria-label="Message"
              disabled={streaming}
              style={{ flex: 1, padding: '9px 12px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '13px', opacity: streaming ? 0.7 : 1 }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || streaming}
              style={{
                padding: '9px 16px', background: input.trim() && !streaming ? '#eb2828' : '#333',
                border: 'none', borderRadius: '10px', color: '#fff',
                cursor: input.trim() && !streaming ? 'pointer' : 'default', fontSize: '16px', transition: 'background 0.2s',
              }}
            >→</button>
          </div>
        </div>
      )}
    </>
  )
}
