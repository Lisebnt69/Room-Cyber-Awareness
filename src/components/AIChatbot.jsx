import { useState, useRef, useEffect } from 'react'

const knowledgeBase = [
  { keywords: ['phishing', 'hameçon', 'email suspect', 'faux email'], answer: "🎣 **Prévenir le phishing :**\n\n1. Vérifiez toujours l'expéditeur (domaine exact)\n2. Ne cliquez JAMAIS sur les liens en urgence\n3. Activez le MFA/2FA sur tous les comptes\n4. Survolez les liens avant de cliquer\n5. Signalez immédiatement à l'IT\n\n👉 Règle d'or : Urgence + lien = phishing suspect." },
  { keywords: ['gdpr', 'rgpd', 'données personnelles', 'cnil'], answer: "🛡️ **GDPR / RGPD :**\n\n• Notification de breach : **72 heures** (CNIL)\n• Droit à l'oubli : suppression sur demande\n• DPIA obligatoire pour traitements à risque\n• DPO requis pour organismes publics ou traitements massifs\n• Consentement : explicite, libre, éclairé\n\n⚠️ Sanctions : jusqu'à **€20M ou 4% CA mondial**" },
  { keywords: ['hipaa', 'santé', 'phi', 'patient', 'médical', 'hôpital'], answer: "🏥 **HIPAA :**\n\n• Protège les PHI (Protected Health Information)\n• Notification de breach : **60 jours** (HHS OCR)\n• BAA (Business Associate Agreement) obligatoire avec partenaires\n• Encryption requise pour PHI en transit et au repos\n• Formation annuelle obligatoire\n\n⚠️ Sanctions : $50K-$1.5M par violation" },
  { keywords: ['pci', 'carte bancaire', 'paiement', 'cardholder'], answer: "💳 **PCI-DSS :**\n\n• 12 exigences principales\n• Req 3 : Ne jamais stocker CVV, cryptogramme\n• Req 8 : MFA pour accès admin\n• Req 10 : Logs 12 mois (3 mois accessibles)\n• Tokenisation recommandée\n\n⚠️ Sanctions : $5K-$100K/mois + perte certification" },
  { keywords: ['ransomware', 'rançon', 'chiffrement', 'cryptolocker', 'malware'], answer: "🔒 **Ransomware - Procédure d'urgence :**\n\n1. **ISOLER** immédiatement le poste (débrancher réseau)\n2. **NE PAS PAYER** (aucune garantie + sanctionné par OFAC)\n3. **ALERTER** RSSI, IT, direction\n4. **PRÉSERVER** les preuves\n5. **RESTAURER** depuis sauvegardes propres\n6. **NOTIFIER** sous 72h (GDPR) ou 24h (NIS2)\n7. **DÉPOSER** plainte (ANSSI, police)\n\n⚠️ Sauvegardes 3-2-1 : vitales !" },
  { keywords: ['mot de passe', 'password', 'authentification', 'mfa', '2fa'], answer: "🔑 **Bonnes pratiques mots de passe :**\n\n• Minimum **16 caractères**\n• Unique par service (gestionnaire = obligatoire)\n• MFA/2FA partout (préférer app plutôt que SMS)\n• Gestionnaires recommandés : Bitwarden (gratuit), 1Password, Dashlane\n• Vérifier vos breaches : haveibeenpwned.com\n\n❌ Jamais : date de naissance, prénom, réutilisation" },
  { keywords: ['nis2', 'directive nis', 'opérateur essentiel'], answer: "📋 **Directive NIS2 :**\n\n• En vigueur : octobre 2024 (UE)\n• Concerne ~160 000 entités en France\n• Notification initiale : **24 heures**\n• Rapport complet : **72 heures**\n• Mesures : gestion des risques, continuité, supply chain\n\n⚠️ Sanctions : €10M ou 2% CA mondial" },
  { keywords: ['dora', 'résilience', 'financier', 'banque', 'assurance'], answer: "🏦 **DORA (Finance) :**\n\n• En vigueur : janvier 2025\n• Secteur financier (banques, assurances, fintechs)\n• Notification incident : **4 heures** (initial)\n• TLPT (tests de pénétration) obligatoires\n• Gestion risques tiers ICT\n\n⚠️ Sanctions : €10M ou 1% CA" },
  { keywords: ['iso 27001', 'isms', 'système management'], answer: "📊 **ISO/IEC 27001:2022 :**\n\n• 93 contrôles de sécurité\n• Certification par audit externe\n• Révision annuelle obligatoire\n• Basé sur le cycle PDCA\n• Nouveaux contrôles 2022 : threat intelligence, cloud, DevSecOps\n\n✅ Reconnu mondialement comme standard de référence" },
  { keywords: ['soc 2', 'soc2', 'saas', 'cloud security'], answer: "☁️ **SOC 2 Type II :**\n\n• Trust Service Criteria (TSC) : sécurité, disponibilité, confidentialité\n• Audit sur 6-12 mois de période\n• Rapport remis aux clients/prospects\n• Contrôle CC6.1 : gestion des accès logiques\n\n✅ Standard attendu par tous les clients enterprise SaaS" },
  { keywords: ['social engineering', 'ingénierie sociale', 'manipulation'], answer: "🎭 **Ingénierie sociale :**\n\nTechniques courantes :\n• **Pretexting** : fausse identité crédible\n• **Baiting** : clé USB abandonnée\n• **Vishing** : arnaque par téléphone\n• **Tailgating** : suivre quelqu'un en zone sécurisée\n\n🛡️ Protection : vérification d'identité hors-bande, procédures strictes, sensibilisation" },
  { keywords: ['usb', 'clé usb', 'périphérique'], answer: "💾 **Risque clé USB :**\n\n⛔ Ne JAMAIS brancher une clé USB inconnue\n\nUne clé USB abandonnée peut :\n• Installer un keylogger silencieux\n• Déployer un ransomware\n• Exfiltrer des données\n• Simuler un clavier (Rubber Ducky)\n\n🛡️ Procédure : remettre à l'IT pour analyse en environnement isolé" },
  { keywords: ['backup', 'sauvegarde', 'restauration'], answer: "💾 **Règle des sauvegardes 3-2-1 :**\n\n• **3** copies des données\n• **2** supports différents (disque + cloud)\n• **1** copie hors site (off-site)\n\nBonus :\n• Tester la restauration régulièrement\n• Sauvegardes immuables (protection ransomware)\n• RTO et RPO définis dans le PCA" },
  { keywords: ['vpn', 'télétravail', 'remote', 'accès distant'], answer: "🔐 **Sécurité télétravail :**\n\n• VPN avec MFA obligatoire\n• Segmentation réseau (ZTNA > VPN classique)\n• Postes de travail chiffrés\n• Patch management régulier\n• Pas de WiFi public non sécurisé\n\n✅ Zero Trust : \"Never trust, always verify\"" },
  { keywords: ['aide', 'help', 'bonjour', 'salut', 'hello', 'commencer'], answer: "👋 Bonjour ! Je suis l'assistant ROOMCA.\n\nJe peux vous aider sur :\n🎣 Phishing & emails suspects\n🔑 Mots de passe & MFA\n🛡️ GDPR, HIPAA, PCI-DSS, NIS2, DORA\n🔒 Ransomware, malware, USB\n📊 ISO 27001, SOC 2\n🎭 Social engineering\n\nPosez votre question !" }
]

function getResponse(message) {
  const lower = message.toLowerCase().trim()
  if (!lower) return "Posez-moi une question sur la cybersécurité ou la conformité 🛡️"

  for (const item of knowledgeBase) {
    if (item.keywords.some(kw => lower.includes(kw))) {
      return item.answer
    }
  }

  return `Je n'ai pas de réponse précise pour "${message}".\n\nEssayez : phishing, GDPR, HIPAA, ransomware, mot de passe, MFA, NIS2, ISO 27001...`
}

function formatMessage(text) {
  return text.split('\n').map((line, i) => {
    const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    return <div key={i} style={{ marginBottom: line === '' ? '6px' : '2px' }} dangerouslySetInnerHTML={{ __html: bold }} />
  })
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Bonjour ! Je suis l'assistant ROOMCA 🤖\n\nPosez-moi vos questions sur la cybersécurité, GDPR, HIPAA, phishing, mots de passe, ou conformité !" }
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = () => {
    if (!input.trim() || thinking) return
    const userMsg = { role: 'user', text: input }
    setMessages(m => [...m, userMsg])
    setInput('')
    setThinking(true)
    const response = getResponse(input)
    setTimeout(() => {
      setMessages(m => [...m, { role: 'bot', text: response }])
      setThinking(false)
    }, 400 + Math.random() * 400)
  }

  const quickQuestions = ['Phishing ?', 'GDPR ?', 'Ransomware ?', 'MFA ?']

  return (
    <>
      <button onClick={() => setOpen(!open)} title="Assistant ROOMCA" aria-label="Ouvrir l'assistant" style={{
        position: 'fixed', bottom: '24px', right: '24px', width: '56px', height: '56px',
        borderRadius: '50%', background: '#eb2828', border: 'none', cursor: 'pointer',
        fontSize: '26px', boxShadow: '0 4px 20px rgba(235,40,40,0.5)', zIndex: 1000,
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(235,40,40,0.7)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(235,40,40,0.5)' }}
      >{open ? '✕' : '🤖'}</button>

      {open && (
        <div style={{
          position: 'fixed', bottom: '88px', right: '24px', width: '360px', height: '520px',
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px',
          display: 'flex', flexDirection: 'column', boxShadow: '0 12px 40px rgba(0,0,0,0.6)', zIndex: 1000
        }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(235,40,40,0.05)', borderRadius: '16px 16px 0 0' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(235,40,40,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '14px' }}>ROOMCA Assistant</div>
              <div style={{ fontSize: '11px', color: '#22c55e' }}>● En ligne · Expert cybersécurité</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '14px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: '12px', display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '86%', padding: '10px 14px', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.role === 'user' ? '#eb2828' : 'var(--bg-black)',
                  color: 'var(--text-primary)', fontSize: '12px', lineHeight: 1.6
                }}>
                  {m.role === 'bot' ? formatMessage(m.text) : m.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div style={{ display: 'flex', gap: '4px', padding: '10px 14px' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#eb2828', animation: `pulse 1s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick questions */}
          {messages.length === 1 && (
            <div style={{ padding: '0 14px 10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {quickQuestions.map(q => (
                <button key={q} onClick={() => { setInput(q); setTimeout(send, 50) }}
                  onMouseDown={(e) => { e.preventDefault(); setInput(q) }}
                  style={{ padding: '5px 10px', background: 'rgba(235,40,40,0.1)', border: '1px solid rgba(235,40,40,0.3)', borderRadius: '12px', color: '#eb2828', cursor: 'pointer', fontSize: '11px' }}>{q}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px' }}>
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Posez une question..." aria-label="Message"
              style={{ flex: 1, padding: '9px 12px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '13px' }} />
            <button onClick={send} disabled={!input.trim() || thinking} style={{
              padding: '9px 16px', background: input.trim() ? '#eb2828' : '#333', border: 'none',
              borderRadius: '10px', color: '#fff', cursor: input.trim() ? 'pointer' : 'default', fontSize: '16px'
            }}>→</button>
          </div>
        </div>
      )}
    </>
  )
}
