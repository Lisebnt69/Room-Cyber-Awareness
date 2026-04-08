// Sector-Specific Scenarios with Compliance Focus
// Each scenario maps to industry-specific threats and regulatory frameworks

export const sectors = [
  { id: 'healthcare', name: { fr: 'Santé', en: 'Healthcare' }, icon: '🏥', frameworks: ['HIPAA', 'GDPR', 'HDS'] },
  { id: 'finance', name: { fr: 'Finance', en: 'Finance' }, icon: '🏦', frameworks: ['PCI-DSS', 'DORA', 'SOX', 'GLBA'] },
  { id: 'government', name: { fr: 'Gouvernement', en: 'Government' }, icon: '🏛️', frameworks: ['CMMC', 'FedRAMP', 'NIST 800-53', 'RGS'] },
  { id: 'education', name: { fr: 'Éducation', en: 'Education' }, icon: '🎓', frameworks: ['FERPA', 'GDPR', 'COPPA'] },
  { id: 'industry', name: { fr: 'Industrie', en: 'Industry/Manufacturing' }, icon: '🏭', frameworks: ['IEC 62443', 'NIS2', 'ISO 27001'] },
  { id: 'retail', name: { fr: 'Commerce', en: 'Retail' }, icon: '🛒', frameworks: ['PCI-DSS', 'GDPR', 'CCPA'] },
  { id: 'energy', name: { fr: 'Énergie', en: 'Energy/Utilities' }, icon: '⚡', frameworks: ['NERC CIP', 'NIS2', 'TSA Pipeline'] },
  { id: 'legal', name: { fr: 'Juridique', en: 'Legal' }, icon: '⚖️', frameworks: ['Attorney-Client Privilege', 'GDPR', 'ABA'] },
  { id: 'tech', name: { fr: 'Tech/SaaS', en: 'Tech/SaaS' }, icon: '💻', frameworks: ['SOC 2', 'ISO 27001', 'GDPR'] },
  { id: 'transport', name: { fr: 'Transport', en: 'Transport/Logistics' }, icon: '🚚', frameworks: ['NIS2', 'TSA', 'GDPR'] }
]

export const sectorScenarios = [
  // === HEALTHCARE / HIPAA ===
  {
    id: 'health_1',
    sector: 'healthcare',
    title: { fr: 'Vol de Dossier Patient', en: 'Patient Record Theft' },
    framework: 'HIPAA',
    difficulty: 'hard',
    duration: 1200,
    description: 'Email demande accès aux dossiers patients pour "audit qualité". HIPAA viole si vous transmettez sans autorisation.',
    narrative: `[14:23] Email d'un "auditeur qualité externe" demande l'envoi de 50 dossiers patients par email pour vérification.

    "Cher Dr Martin, dans le cadre de l'audit annuel de la qualité des soins, merci de m'envoyer les dossiers complets des patients suivants : [liste]. C'est urgent, nous devons rendre le rapport demain."`,
    complianceImpact: {
      framework: 'HIPAA',
      violation: 'Unauthorized disclosure of PHI (Protected Health Information)',
      penalty: 'Up to $50,000 per violation, $1.5M annual maximum',
      breach: 'Mandatory breach notification within 60 days'
    },
    decisions: [
      { id: 1, text: 'Envoyer les dossiers par email', isSafe: false, consequence: '❌ VIOLATION HIPAA: PHI transmis sans chiffrement, sans BAA. Amende potentielle $1.5M. -3000 points' },
      { id: 2, text: 'Vérifier l\'identité avec le RSSI', isSafe: true, consequence: '✅ CONFORME: RSSI confirme aucun audit prévu. Email signalé. +2000 points' },
      { id: 3, text: 'Demander une demande formelle écrite avec autorisation', isSafe: true, consequence: '✅ EXCELLENT: Réponse formelle requise = procédure HIPAA respectée. +1800 points' }
    ]
  },
  {
    id: 'health_2',
    sector: 'healthcare',
    title: { fr: 'Ransomware Hôpital', en: 'Hospital Ransomware' },
    framework: 'HIPAA',
    difficulty: 'hard',
    duration: 1800,
    description: 'Le système de l\'hôpital est chiffré par ransomware. Patients en chirurgie. Décision critique.',
    narrative: `[03:47] Toutes les données médicales sont chiffrées. Demande de rançon : 5 BTC.
    Patients en réanimation. Dossiers médicaux inaccessibles. Vies en jeu.`,
    complianceImpact: { framework: 'HIPAA', violation: 'PHI breach + service disruption', penalty: '$50K-$1.5M + class action lawsuits' },
    decisions: [
      { id: 1, text: 'Payer la rançon immédiatement', isSafe: false, consequence: '❌ Pas de garantie de récupération. Sanctions OFAC possibles. -2500 points' },
      { id: 2, text: 'Activer le plan de continuité, isoler le réseau, alerter ANSSI/HHS', isSafe: true, consequence: '✅ Plan DR activé. Sauvegardes restaurées. Notification HIPAA dans les 60 jours. +2500 points' }
    ]
  },
  {
    id: 'health_3',
    sector: 'healthcare',
    title: { fr: 'Téléconsultation Compromise', en: 'Compromised Telemedicine' },
    framework: 'HIPAA',
    difficulty: 'medium',
    duration: 900,
    description: 'Une plateforme de téléconsultation gratuite n\'est pas conforme HIPAA. Le médecin l\'utilise quand même.',
    complianceImpact: { framework: 'HIPAA', violation: 'Use of non-BAA platform', penalty: '$10K-$50K per consultation' },
    decisions: [
      { id: 1, text: 'Continuer à utiliser la plateforme', isSafe: false, consequence: '❌ Chaque consultation = violation. -2000 points' },
      { id: 2, text: 'Migrer vers une solution conforme HIPAA', isSafe: true, consequence: '✅ Doxy.me, Zoom for Healthcare. +1500 points' }
    ]
  },

  // === FINANCE / PCI-DSS / DORA ===
  {
    id: 'fin_1',
    sector: 'finance',
    title: { fr: 'Wire Transfer Fraud BEC', en: 'Wire Transfer Fraud BEC' },
    framework: 'DORA',
    difficulty: 'hard',
    duration: 900,
    description: 'CFO reçoit un email de la PDG demandant un virement urgent de 2M€ pour acquisition confidentielle.',
    narrative: `[16:45] "Pierre, opération confidentielle. Vire 2M€ à : IBAN FR76 1234 5678 9012 3456 7890 123. URGENT, ne discute avec personne. -Marie, PDG"`,
    complianceImpact: {
      framework: 'DORA / NIS2',
      violation: 'Lack of operational resilience controls',
      penalty: '€10M ou 2% CA mondial',
      reportingDeadline: '4h pour incident initial à ACPR/AMF'
    },
    decisions: [
      { id: 1, text: 'Virer immédiatement', isSafe: false, consequence: '❌ FRAUDE BEC: 2M€ perdus. Reporting DORA obligatoire. -3500 points' },
      { id: 2, text: 'Appeler la PDG sur sa ligne directe', isSafe: true, consequence: '✅ PDG : "Je n\'ai jamais envoyé ça". Protocole 4-eyes activé. +2500 points' }
    ]
  },
  {
    id: 'fin_2',
    sector: 'finance',
    title: { fr: 'Carte Bancaire en Clair', en: 'Cardholder Data in Clear' },
    framework: 'PCI-DSS',
    difficulty: 'medium',
    duration: 900,
    description: 'Un employé stocke des numéros de CB clients dans un Excel sur son bureau.',
    complianceImpact: {
      framework: 'PCI-DSS',
      violation: 'Requirement 3: Protect stored cardholder data',
      penalty: '$5K-$100K/mois + perte certification PCI'
    },
    decisions: [
      { id: 1, text: 'Laisser le fichier', isSafe: false, consequence: '❌ Audit PCI échoué. -2500 points' },
      { id: 2, text: 'Supprimer, alerter RSSI, formation PCI-DSS', isSafe: true, consequence: '✅ Tokenisation mise en place. +2000 points' }
    ]
  },
  {
    id: 'fin_3',
    sector: 'finance',
    title: { fr: 'Insider Trading', en: 'Insider Trading' },
    framework: 'SOX',
    difficulty: 'hard',
    duration: 900,
    description: 'Un trader utilise des informations privilégiées partagées dans Slack pour ses propres trades.',
    complianceImpact: { framework: 'SOX / MAR', violation: 'Insider trading', penalty: 'Prison + 10x les gains' },
    decisions: [
      { id: 1, text: 'Tout report au compliance officer', isSafe: true, consequence: '✅ Investigation interne. +2500 points' },
      { id: 2, text: 'Ignorer', isSafe: false, consequence: '❌ Complicité. Carrière finie. -3000 points' }
    ]
  },

  // === GOVERNMENT / CMMC ===
  {
    id: 'gov_1',
    sector: 'government',
    title: { fr: 'CUI Exfiltration', en: 'CUI Exfiltration' },
    framework: 'CMMC 2.0',
    difficulty: 'hard',
    duration: 1200,
    description: 'Sous-traitant DoD reçoit demande d\'envoyer des Controlled Unclassified Information par email non-chiffré.',
    complianceImpact: { framework: 'CMMC Level 2', violation: 'CUI handling violation', penalty: 'Perte contrats DoD ($M)' },
    decisions: [
      { id: 1, text: 'Envoyer via canal classifié SIPRNet/DoD SAFE', isSafe: true, consequence: '✅ CMMC respecté. +2500 points' },
      { id: 2, text: 'Email standard', isSafe: false, consequence: '❌ Violation CMMC. Contrat $50M perdu. -4000 points' }
    ]
  },
  {
    id: 'gov_2',
    sector: 'government',
    title: { fr: 'Espionnage Étatique', en: 'Nation-State Espionage' },
    framework: 'NIST 800-171',
    difficulty: 'hard',
    duration: 1500,
    description: 'Email spear-phishing très sophistiqué semble venir d\'un collègue connu, utilisant un sujet réel récent.',
    complianceImpact: { framework: 'NIST 800-171', violation: 'APT compromise', penalty: 'Perte clearances + investigations' },
    decisions: [
      { id: 1, text: 'Cliquer le lien', isSafe: false, consequence: '❌ APT installé. Données classifiées exfiltrées. -4000 points' },
      { id: 2, text: 'Vérifier en personne avec le collègue + alerter SOC', isSafe: true, consequence: '✅ Compte du collègue compromis. SOC traque l\'APT. +3000 points' }
    ]
  },

  // === EDUCATION / FERPA ===
  {
    id: 'edu_1',
    sector: 'education',
    title: { fr: 'Notes d\'Élèves Publiées', en: 'Student Grades Leaked' },
    framework: 'FERPA',
    difficulty: 'medium',
    duration: 900,
    description: 'Un enseignant publie les notes par nom complet sur un drive partagé public par erreur.',
    complianceImpact: { framework: 'FERPA', violation: 'Disclosure of education records', penalty: 'Perte financements fédéraux' },
    decisions: [
      { id: 1, text: 'Retirer immédiatement, notifier parents et FERPA', isSafe: true, consequence: '✅ Containment rapide. +2000 points' },
      { id: 2, text: 'Espérer que personne ne remarque', isSafe: false, consequence: '❌ Découvert par un parent. Plainte FERPA. -3000 points' }
    ]
  },
  {
    id: 'edu_2',
    sector: 'education',
    title: { fr: 'Cyberbullying Détecté', en: 'Cyberbullying Detected' },
    framework: 'COPPA',
    difficulty: 'medium',
    duration: 900,
    description: 'Un compte usurpe un élève pour harceler. Gestion conformité + protection mineurs.',
    complianceImpact: { framework: 'COPPA', violation: 'Failure to protect minors', penalty: '$50K/violation' },
    decisions: [
      { id: 1, text: 'Activer protocole anti-harcèlement + alerte parents', isSafe: true, consequence: '✅ Protection mineur. +2000 points' }
    ]
  },

  // === INDUSTRY / IEC 62443 / NIS2 ===
  {
    id: 'ind_1',
    sector: 'industry',
    title: { fr: 'SCADA Compromis', en: 'SCADA System Compromised' },
    framework: 'IEC 62443',
    difficulty: 'hard',
    duration: 1500,
    description: 'Un USB inconnu est branché sur un poste de contrôle SCADA d\'une chaîne de production.',
    complianceImpact: {
      framework: 'IEC 62443 / NIS2',
      violation: 'OT security breach',
      penalty: '€10M ou 2% CA + arrêt production',
      directive: 'NIS2 reporting 24h'
    },
    decisions: [
      { id: 1, text: 'Débrancher, isoler, scanner avec antivirus OT', isSafe: true, consequence: '✅ Stuxnet-like neutralisé. +3000 points' },
      { id: 2, text: 'Laisser pour plus tard', isSafe: false, consequence: '❌ Malware se propage à 200 PLCs. Production arrêtée 2 semaines. -4000 points' }
    ]
  },
  {
    id: 'ind_2',
    sector: 'industry',
    title: { fr: 'Vol de Propriété Intellectuelle', en: 'IP Theft' },
    framework: 'NIS2',
    difficulty: 'hard',
    duration: 1200,
    description: 'Un employé démissionne et télécharge tous les plans CAO sur sa clé USB personnelle.',
    decisions: [
      { id: 1, text: 'DLP bloque + investigation forensic', isSafe: true, consequence: '✅ IP protégée. +2500 points' },
      { id: 2, text: 'Aucune surveillance', isSafe: false, consequence: '❌ 10 ans de R&D volés. -3500 points' }
    ]
  },

  // === RETAIL / PCI-DSS ===
  {
    id: 'ret_1',
    sector: 'retail',
    title: { fr: 'Skimmer POS', en: 'POS Skimmer Detected' },
    framework: 'PCI-DSS',
    difficulty: 'medium',
    duration: 900,
    description: 'Un appareil suspect est trouvé connecté à un terminal de paiement.',
    complianceImpact: { framework: 'PCI-DSS Req 9', violation: 'Physical security failure', penalty: '$5K-$100K/mois' },
    decisions: [
      { id: 1, text: 'Isoler le terminal, alerter banque + acquéreur', isSafe: true, consequence: '✅ Skimmer retiré. Investigation. +2500 points' }
    ]
  },
  {
    id: 'ret_2',
    sector: 'retail',
    title: { fr: 'Vol de Données Clients', en: 'Customer Data Theft' },
    framework: 'CCPA',
    difficulty: 'medium',
    duration: 1200,
    description: 'Un employé exporte la base clients (1M lignes) vers un compte personnel.',
    complianceImpact: { framework: 'CCPA / GDPR', violation: 'Data breach', penalty: '$7,500/record + €20M GDPR' },
    decisions: [
      { id: 1, text: 'DLP alert + révocation accès', isSafe: true, consequence: '✅ Containment. +2500 points' }
    ]
  },

  // === ENERGY / NERC CIP ===
  {
    id: 'eng_1',
    sector: 'energy',
    title: { fr: 'Attaque Smart Grid', en: 'Smart Grid Attack' },
    framework: 'NERC CIP',
    difficulty: 'hard',
    duration: 1800,
    description: 'Détection d\'activité inhabituelle sur les Bulk Electric System Cyber Assets (BCAs).',
    complianceImpact: {
      framework: 'NERC CIP',
      violation: 'BES Cyber System compromise',
      penalty: '$1.3M/jour + obligation de divulgation FERC'
    },
    decisions: [
      { id: 1, text: 'Activer ICS-CERT + isoler segment', isSafe: true, consequence: '✅ Grid sécurisé. +3000 points' },
      { id: 2, text: 'Continuer normalement', isSafe: false, consequence: '❌ Blackout régional. Vies en jeu. -5000 points' }
    ]
  },

  // === LEGAL ===
  {
    id: 'law_1',
    sector: 'legal',
    title: { fr: 'Privilège Avocat-Client', en: 'Attorney-Client Privilege' },
    framework: 'ABA Model Rules',
    difficulty: 'medium',
    duration: 900,
    description: 'Un avocat utilise Gmail personnel pour communiquer avec un client sur une affaire sensible.',
    complianceImpact: { framework: 'ABA Rule 1.6', violation: 'Confidentiality breach', penalty: 'Disbarment + malpractice' },
    decisions: [
      { id: 1, text: 'Migrer vers messagerie chiffrée du cabinet', isSafe: true, consequence: '✅ Privilège protégé. +2000 points' }
    ]
  },

  // === TECH / SOC 2 ===
  {
    id: 'tech_1',
    sector: 'tech',
    title: { fr: 'Secret API sur GitHub', en: 'API Secret on GitHub' },
    framework: 'SOC 2',
    difficulty: 'medium',
    duration: 900,
    description: 'Un dev push une clé AWS dans un repo public. Détecté en 2 minutes par des bots.',
    complianceImpact: { framework: 'SOC 2 CC6.1', violation: 'Logical access control', penalty: 'Échec audit SOC 2' },
    decisions: [
      { id: 1, text: 'Rotation immédiate des clés + audit', isSafe: true, consequence: '✅ Damage limité. +2500 points' }
    ]
  },
  {
    id: 'tech_2',
    sector: 'tech',
    title: { fr: 'Supply Chain Attack', en: 'Supply Chain Attack' },
    framework: 'SOC 2 / SLSA',
    difficulty: 'hard',
    duration: 1500,
    description: 'Une dépendance npm populaire est compromise et injecte du code malveillant dans votre build.',
    complianceImpact: { framework: 'SOC 2', violation: 'Third-party risk', penalty: 'Customer breach notification' },
    decisions: [
      { id: 1, text: 'SBOM + dependency scanning + rollback', isSafe: true, consequence: '✅ Build sécurisé. +3000 points' }
    ]
  },

  // === TRANSPORT ===
  {
    id: 'trans_1',
    sector: 'transport',
    title: { fr: 'GPS Spoofing Flotte', en: 'Fleet GPS Spoofing' },
    framework: 'NIS2',
    difficulty: 'hard',
    duration: 1200,
    description: 'Des camions sont détournés par GPS spoofing. Cargaison volée.',
    complianceImpact: { framework: 'NIS2', violation: 'OT security', penalty: 'Reporting 24h + perte cargaison' },
    decisions: [
      { id: 1, text: 'Activer géofencing + double validation', isSafe: true, consequence: '✅ Détection spoofing. +2500 points' }
    ]
  }
]

export function getScenariosBySector(sectorId) {
  return sectorScenarios.filter(s => s.sector === sectorId)
}

export function getScenariosByFramework(framework) {
  return sectorScenarios.filter(s => s.framework === framework || s.complianceImpact?.framework?.includes(framework))
}

export function getAllSectors() {
  return sectors
}
