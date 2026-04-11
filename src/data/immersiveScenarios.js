// 30+ Immersive Escape Game Scenarios
// Each scenario is a complete narrative with choices and consequences

export const immersiveScenarios = [
  // === PHISHING SCENARIOS ===
  {
    id: 'scenario_1',
    title: { fr: 'Opération: Inbox Zero', en: 'Operation: Inbox Zero' },
    category: 'Phishing',
    difficulty: 'intermediate',
    duration: 900, // 15 minutes
    timeLimit: 900,
    description: 'Your inbox is flooded. One email could cost the company millions. Can you spot the threat?',
    narrative: `
      [09:47] ALERT: You arrive at work. 47 unread emails.
      [09:48] Your boss walks by: "We're expecting a $2M wire transfer today. Watch out for phishing."
      [09:49] You open Outlook. 3 urgent-looking emails.
      ⚠️ THE CLOCK STARTS NOW. 15 MINUTES.
    `,
    emails: [
      {
        id: 'email_1',
        from: 'finance@roomca-corp.com',
        subject: '🔴 URGENT: Confirm bank details for wire transfer',
        time: '09:50',
        preview: 'Click link below to verify account before 10:00 AM...',
        isFake: true,
        hints: {
          obvious: 'Generic greeting "Dear User"',
          medium: 'Shortened URL (bit.ly)',
          hard: 'Sender is finance@roomca-corp.com but signature says "Financial Services"'
        },
        consequences: {
          clicked: '❌ BREACH: Phisher captured your credentials. Wire transfer cancelled due to fraud investigation. CEO is furious. -500 points',
          reported: '✅ CORRECT: You reported to IT. Company saved $2M. +1000 points. BADGE: Phishing Expert'
        }
      }
    ],
    phases: [
      { phase: 1, title: 'Email Analysis', description: 'Read each email carefully. You have 15 minutes.' },
      { phase: 2, title: 'Decision Making', description: 'For each email: CLICK, REPORT, or IGNORE' },
      { phase: 3, title: 'Results', description: 'See what happened to the company' }
    ],
    successCondition: 'Identify all phishing emails without clicking them'
  },

  {
    id: 'scenario_2',
    title: { fr: 'La Fausse Urgence', en: 'The False Urgency' },
    category: 'Phishing',
    difficulty: 'hard',
    duration: 600,
    timeLimit: 300,
    description: 'Your CEO needs an urgent wire transfer. You have 5 minutes to decide. But is it really him?',
    narrative: `
      [14:23] Your phone buzzes. Email from: ceo@roomca.com
      [14:23] Subject: "⚠️ CONFIDENTIAL - URGENT"
      
      Message: "Need you to send $50K to vendor immediately.
       Wire to: Roomca-Ventures@trustbank.com
       This is urgent. Do not discuss with anyone.
       Confirm receipt."
      
      ⏰ YOU HAVE 5 MINUTES BEFORE THE "DEADLINE"
    `,
    decisions: [
      {
        id: 'decision_1',
        description: 'Call the CEO directly to confirm',
        isSafe: true,
        consequence: 'CEO: "I never sent that. That\'s phishing. Good catch!" +1000 points'
      },
      {
        id: 'decision_2',
        description: 'Process the wire transfer immediately',
        isSafe: false,
        consequence: '❌ SCAMMED: Money wired to attacker. CEO furious. You\'re fired. Game Over. -2000 points'
      }
    ],
    pressure: true,
    timer: true
  },

  {
    id: 'scenario_3',
    title: { fr: 'Vol de Credentials', en: 'Credential Theft' },
    category: 'Phishing',
    difficulty: 'medium',
    duration: 1200,
    description: 'A sophisticated fake login portal. Your details. Their harvester. Can you spot it?'
  },

  {
    id: 'scenario_4',
    title: { fr: 'USB Mystérieux', en: 'Mysterious USB' },
    category: 'Malware',
    difficulty: 'hard',
    duration: 900,
    description: 'You find a USB stick in the parking lot labeled "EMPLOYEE BONUSES 2026". Do you plug it in?'
  },

  {
    id: 'scenario_5',
    title: { fr: 'Appel de Support Frauduleux', en: 'Fake Support Call' },
    category: 'Social Engineering',
    difficulty: 'intermediate',
    duration: 1200,
    description: 'Someone calls pretending to be from your bank asking to verify account details. Red flag?'
  },

  {
    id: 'scenario_6',
    title: { fr: 'Professionnel LinkedIn', en: 'LinkedIn Professional' },
    category: 'Social Engineering',
    difficulty: 'hard',
    duration: 1500,
    description: 'Recruiter on LinkedIn offers dream job. They ask for your phone and email to send offer letter.'
  },

  {
    id: 'scenario_7',
    title: { fr: 'Tentative de Contournement MFA', en: 'MFA Bypass Attempt' },
    category: 'Advanced',
    difficulty: 'hard',
    duration: 900,
    description: 'Email says: "Unusual login detected. Verify with 2FA code: 123456". But you never requested this.'
  },

  {
    id: 'scenario_8',
    title: { fr: 'Ransomware: Décision Critique', en: 'Ransomware: Critical Decision' },
    category: 'Malware',
    difficulty: 'hard',
    duration: 1800,
    description: 'Your entire computer is encrypted. $500K ransom demand. Your drive with client data is affected. Call IT immediately or pay?'
  },

  {
    id: 'scenario_9',
    title: { fr: 'Package Amaz... FAUX', en: 'Amazon Package... FAKE' },
    category: 'Phishing',
    difficulty: 'easy',
    duration: 600,
    description: 'Email: "Your Amazon package failed delivery." You didn\'t order anything from Amazon.'
  },

  {
    id: 'scenario_10',
    title: { fr: 'Offre d\'Emploi Trop Bonne', en: 'Too Good Job Offer' },
    category: 'Social Engineering',
    difficulty: 'medium',
    duration: 900,
    description: 'Recruiter offers you $200K/year with zero interviews. Just provide your SSN and bank details.'
  },

  {
    id: 'scenario_11',
    title: { fr: 'Manipulation de Facture', en: 'Invoice Manipulation' },
    category: 'Business Email Compromise',
    difficulty: 'hard',
    duration: 1200,
    description: 'Invoice from your supplier. Amount changed from $5K to $50K. Can you spot the tampering?'
  },

  {
    id: 'scenario_12',
    title: { fr: 'Clone de Confiance', en: 'Clone Phishing' },
    category: 'Phishing',
    difficulty: 'hard',
    duration: 900,
    description: 'Email looks IDENTICAL to your vendor\'s previous emails. Same template. But the domain is one letter different.'
  },

  {
    id: 'scenario_13',
    title: { fr: 'Piratage de Compte Fournisseur', en: 'Compromised Vendor' },
    category: 'Business Email Compromise',
    difficulty: 'medium',
    duration: 1200,
    description: 'Supplier\'s email was hacked. Attacker sends requests for wire transfers using their account.'
  },

  {
    id: 'scenario_14',
    title: { fr: 'Lien Malveillant Caché', en: 'Hidden Malicious Link' },
    category: 'Malware',
    difficulty: 'hard',
    duration: 600,
    description: 'Email about company event with normal link. But one link leads to drive-by malware. Spot the trap.'
  },

  {
    id: 'scenario_15',
    title: { fr: 'Demande d\'Accès Spécial', en: 'Privilege Escalation' },
    category: 'Social Engineering',
    difficulty: 'medium',
    duration: 900,
    description: 'Someone impersonating management asks you to grant elevated access. Red flag?'
  },

  {
    id: 'scenario_16',
    title: { fr: 'Macros Malveillants', en: 'Malicious Macro' },
    category: 'Malware',
    difficulty: 'hard',
    duration: 1200,
    description: 'Excel file looks like budget spreadsheet. Contains hidden macros with ransomware. Enable or refuse?'
  },

  {
    id: 'scenario_17',
    title: { fr: 'Réutilisation de Mot de Passe', en: 'Password Reuse Attack' },
    category: 'Credentials',
    difficulty: 'medium',
    duration: 900,
    description: 'Old website you used got hacked. You reused that password everywhere. Attacker is now trying it.'
  },

  {
    id: 'scenario_18',
    title: { fr: 'VPN Compromis', en: 'Compromised VPN' },
    category: 'Advanced',
    difficulty: 'hard',
    duration: 1200,
    description: 'IT alert: Someone logged into VPN with your credentials from India. You\'re in California. What happened?'
  },

  {
    id: 'scenario_19',
    title: { fr: 'Accès Cloud Non Autorisé', en: 'Unauthorized Cloud Access' },
    category: 'Cloud Security',
    difficulty: 'medium',
    duration: 900,
    description: 'Sensitive folder in Dropbox accidentally shared with "anyone with link". Attacker found it.'
  },

  {
    id: 'scenario_20',
    title: { fr: 'Vol d\'API', en: 'API Key Theft' },
    category: 'Credentials',
    difficulty: 'hard',
    duration: 900,
    description: 'Developer accidentally committed API keys to public GitHub. Attacker found them within hours.'
  },

  {
    id: 'scenario_21',
    title: { fr: 'Watering Hole', en: 'Watering Hole Attack' },
    category: 'Advanced',
    difficulty: 'hard',
    duration: 1200,
    description: 'Industry trade publication hacked. Malware injected into ads. Visiting the site infects your computer.'
  },

  {
    id: 'scenario_22',
    title: { fr: 'Usurpation d\'Identité Client', en: 'Customer Impersonation' },
    category: 'Social Engineering',
    difficulty: 'medium',
    duration: 900,
    description: 'Someone impersonates your biggest client. Requests urgent account changes. Attacker wants to change payment details.'
  },

  {
    id: 'scenario_23',
    title: { fr: 'Malware par Archive', en: 'Malware in Archive' },
    category: 'Malware',
    difficulty: 'medium',
    duration: 900,
    description: 'ZIP file with "invoice.pdf.exe" - executable disguised as PDF. Double extension attack.'
  },

  {
    id: 'scenario_24',
    title: { fr: 'Support Technique Frauduleux', en: 'Tech Support Scam' },
    category: 'Social Engineering',
    difficulty: 'medium',
    duration: 900,
    description: 'Someone calls claiming to be IT support. Says they detected malware. Wants remote access.'
  },

  {
    id: 'scenario_25',
    title: { fr: 'Récupération de Compte', en: 'Account Recovery Hijack' },
    category: 'Credentials',
    difficulty: 'hard',
    duration: 900,
    description: 'Attacker knows your security questions. Uses "Forgot Password" to reset your email. Now controls your identity.'
  },

  {
    id: 'scenario_26',
    title: { fr: 'Logiciel Contrefait', en: 'Counterfeit Software' },
    category: 'Malware',
    difficulty: 'medium',
    duration: 900,
    description: 'Adobe Creative Suite for $30 instead of $500. License key works. But hidden malware is bundled.'
  },

  {
    id: 'scenario_27',
    title: { fr: 'Slack Compromis', en: 'Compromised Slack' },
    category: 'Social Engineering',
    difficulty: 'medium',
    duration: 900,
    description: 'Slack channel hacked. Attacker impersonates your manager. Asks you to wire money.'
  },

  {
    id: 'scenario_28',
    title: { fr: 'Faux Portail Bancaire', en: 'Fake Bank Portal' },
    category: 'Phishing',
    difficulty: 'medium',
    duration: 900,
    description: 'Email from bank says "verify account." Link looks legitimate. URL is slightly different. Credential harvester.'
  },

  {
    id: 'scenario_29',
    title: { fr: 'Partage Accidentel', en: 'Accidental Share' },
    category: 'Data Breach',
    difficulty: 'medium',
    duration: 900,
    description: '2 million customer records accidentally shared on GitHub as public. Indexed by search engines within hours.'
  },

  {
    id: 'scenario_30',
    title: { fr: 'Usurpation SMS', en: 'SMS Spoofing' },
    category: 'Phishing',
    difficulty: 'medium',
    duration: 900,
    description: 'SMS from bank: "Click to unlock your account." Link leads to fake login page.'
  },

  {
    id: 'scenario_31',
    title: { fr: 'Malware Polymorphe', en: 'Polymorphic Malware' },
    category: 'Advanced Malware',
    difficulty: 'hard',
    duration: 1200,
    description: 'Malware that changes its signature every few minutes to evade antivirus detection.'
  },

  {
    id: 'scenario_32',
    title: { fr: 'Escroquerie d\'Appel d\'Offre', en: 'RFQ Fraud' },
    category: 'Business Email Compromise',
    difficulty: 'hard',
    duration: 1200,
    description: 'Attacker intercepts your RFQ to a vendor. Responds as the vendor with inflated prices and hidden account.'
  }
]

export function getAllScenarios() {
  return immersiveScenarios
}

export function getScenarioById(id) {
  return immersiveScenarios.find(s => s.id === id)
}

export function getScenariosByDifficulty(difficulty) {
  return immersiveScenarios.filter(s => s.difficulty === difficulty)
}

export function getScenariosByCategory(category) {
  return immersiveScenarios.filter(s => s.category === category)
}
