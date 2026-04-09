// ============================================================
// ROOMCA — Structure de données Conformité NIS2 / DORA
// Mapping scénarios → exigences réglementaires
// Génération automatisée de rapports PDF
// ============================================================

// ─── NIS2 — Directive (UE) 2022/2555 ───────────────────────

/** @type {Array<{id: string, article: string, title: string, description: string, category: string, subRequirements?: Array<{id: string, title: string}>}>} */
export const NIS2_REQUIREMENTS = [
  {
    id: 'nis2_art20',
    article: 'Article 20',
    title: 'Gouvernance',
    description: 'Les organes de direction doivent approuver et superviser les mesures de gestion des risques cyber.',
    category: 'Governance',
    subRequirements: [
      { id: 'nis2_art20_1', title: 'Approbation des mesures de gestion des risques par la direction' },
      { id: 'nis2_art20_2', title: 'Formation cybersécurité obligatoire pour les dirigeants' },
      { id: 'nis2_art20_3', title: 'Responsabilité de la direction en cas de non-conformité' }
    ]
  },
  {
    id: 'nis2_art21',
    article: 'Article 21',
    title: 'Mesures de gestion des risques en matière de cybersécurité',
    description: 'Mesures techniques, opérationnelles et organisationnelles appropriées et proportionnées.',
    category: 'Risk Management',
    subRequirements: [
      { id: 'nis2_art21_a', title: 'Politiques d\'analyse des risques et sécurité des SI' },
      { id: 'nis2_art21_b', title: 'Gestion des incidents' },
      { id: 'nis2_art21_c', title: 'Continuité d\'activité et gestion de crise' },
      { id: 'nis2_art21_d', title: 'Sécurité de la chaîne d\'approvisionnement' },
      { id: 'nis2_art21_e', title: 'Sécurité des réseaux et systèmes d\'information' },
      { id: 'nis2_art21_f', title: 'Politiques de gestion et divulgation des vulnérabilités' },
      { id: 'nis2_art21_g', title: 'Pratiques de base en matière de cyber-hygiène et formation' },
      { id: 'nis2_art21_h', title: 'Politiques d\'utilisation de la cryptographie et du chiffrement' },
      { id: 'nis2_art21_i', title: 'Sécurité des ressources humaines et contrôle d\'accès' },
      { id: 'nis2_art21_j', title: 'Authentification multi-facteurs et communications sécurisées' }
    ]
  },
  {
    id: 'nis2_art23',
    article: 'Article 23',
    title: 'Obligations de notification',
    description: 'Notification des incidents significatifs aux autorités compétentes et aux destinataires de services.',
    category: 'Incident Reporting',
    subRequirements: [
      { id: 'nis2_art23_1', title: 'Alerte précoce sous 24h (sans retard injustifié)' },
      { id: 'nis2_art23_2', title: 'Notification d\'incident sous 72h' },
      { id: 'nis2_art23_3', title: 'Rapport final sous 1 mois après la notification' },
      { id: 'nis2_art23_4', title: 'Information des destinataires de services si nécessaire' }
    ]
  },
  {
    id: 'nis2_art24',
    article: 'Article 24',
    title: 'Schémas européens de certification',
    description: 'Utilisation de produits, services et processus TIC certifiés.',
    category: 'Certification'
  },
  {
    id: 'nis2_art25',
    article: 'Article 25',
    title: 'Normalisation',
    description: 'Promotion de l\'utilisation de normes et spécifications techniques européennes et internationales.',
    category: 'Standards'
  }
]

// ─── DORA — Règlement (UE) 2022/2554 ───────────────────────

/** @type {Array<{id: string, chapter: string, articles: string, title: string, description: string, category: string, subRequirements?: Array<{id: string, title: string}>}>} */
export const DORA_REQUIREMENTS = [
  {
    id: 'dora_ch2',
    chapter: 'Chapitre II',
    articles: 'Articles 5-16',
    title: 'Gestion des risques liés aux TIC',
    description: 'Cadre de gestion des risques TIC complet, documenté et révisé annuellement.',
    category: 'ICT Risk Management',
    subRequirements: [
      { id: 'dora_art5',  title: 'Gouvernance et organisation de la gestion des risques TIC' },
      { id: 'dora_art6',  title: 'Cadre de gestion des risques TIC' },
      { id: 'dora_art7',  title: 'Systèmes, protocoles et outils TIC' },
      { id: 'dora_art8',  title: 'Identification des risques' },
      { id: 'dora_art9',  title: 'Protection et prévention' },
      { id: 'dora_art10', title: 'Détection des anomalies et incidents' },
      { id: 'dora_art11', title: 'Réponse et rétablissement' },
      { id: 'dora_art12', title: 'Politique de sauvegarde et de restauration' },
      { id: 'dora_art13', title: 'Apprentissage et évolution' },
      { id: 'dora_art14', title: 'Communication' }
    ]
  },
  {
    id: 'dora_ch3',
    chapter: 'Chapitre III',
    articles: 'Articles 17-23',
    title: 'Gestion, classification et déclaration des incidents TIC',
    description: 'Processus de gestion des incidents liés aux TIC avec classification et déclaration.',
    category: 'Incident Management',
    subRequirements: [
      { id: 'dora_art17', title: 'Processus de gestion des incidents liés aux TIC' },
      { id: 'dora_art18', title: 'Classification des incidents liés aux TIC' },
      { id: 'dora_art19', title: 'Déclaration des incidents majeurs liés aux TIC' },
      { id: 'dora_art20', title: 'Harmonisation de la déclaration d\'incidents' },
      { id: 'dora_art23', title: 'Notification volontaire des cybermenaces significatives' }
    ]
  },
  {
    id: 'dora_ch4',
    chapter: 'Chapitre IV',
    articles: 'Articles 24-27',
    title: 'Tests de résilience opérationnelle numérique',
    description: 'Programme de tests incluant des tests de pénétration fondés sur la menace (TLPT).',
    category: 'Resilience Testing',
    subRequirements: [
      { id: 'dora_art24', title: 'Exigences générales pour les tests de résilience' },
      { id: 'dora_art25', title: 'Tests des outils et systèmes TIC' },
      { id: 'dora_art26', title: 'Tests de pénétration fondés sur la menace (TLPT)' },
      { id: 'dora_art27', title: 'Exigences applicables aux testeurs pour les TLPT' }
    ]
  },
  {
    id: 'dora_ch5',
    chapter: 'Chapitre V',
    articles: 'Articles 28-44',
    title: 'Gestion des risques liés aux prestataires tiers de services TIC',
    description: 'Cadre de gestion du risque lié aux prestataires tiers critiques.',
    category: 'Third-Party Risk',
    subRequirements: [
      { id: 'dora_art28', title: 'Principes généraux de gestion des risques tiers TIC' },
      { id: 'dora_art29', title: 'Évaluation préliminaire des risques liés aux prestataires' },
      { id: 'dora_art30', title: 'Dispositions contractuelles clés' },
      { id: 'dora_art31', title: 'Désignation de prestataires tiers critiques TIC' }
    ]
  },
  {
    id: 'dora_ch6',
    chapter: 'Chapitre VI',
    articles: 'Article 45',
    title: 'Partage d\'informations',
    description: 'Dispositions relatives au partage d\'informations et de renseignements sur les cybermenaces.',
    category: 'Information Sharing',
    subRequirements: [
      { id: 'dora_art45', title: 'Dispositions de partage d\'informations en matière de cyber-renseignement' }
    ]
  }
]

// ─── MAPPING SCÉNARIOS → EXIGENCES RÉGLEMENTAIRES ──────────

/**
 * Mappe chaque scénario aux exigences de conformité qu'il couvre.
 * coverageLevel : 'full' = le scénario valide complètement l'exigence
 *                 'partial' = contribue mais ne suffit pas seul
 * evidenceType : 'behavioral' = test du comportement réel
 *                'knowledge' = vérification de la connaissance
 *                'procedural' = respect d'une procédure
 */
export const SCENARIO_COMPLIANCE_MAP = {
  // Phishing scenarios
  scenario_1: [ // Inbox Zero
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_g', coverageLevel: 'full', evidenceType: 'behavioral' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_i', coverageLevel: 'partial', evidenceType: 'behavioral' },
    { frameworkId: 'DORA', requirementId: 'dora_art9',    coverageLevel: 'partial', evidenceType: 'behavioral' },
    { frameworkId: 'DORA', requirementId: 'dora_art13',   coverageLevel: 'partial', evidenceType: 'knowledge' },
    { frameworkId: 'ISO27001', requirementId: 'a6', coverageLevel: 'full', evidenceType: 'behavioral' }
  ],
  scenario_2: [ // La Fausse Urgence (BEC)
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_g', coverageLevel: 'full', evidenceType: 'behavioral' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_b', coverageLevel: 'partial', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art9',    coverageLevel: 'partial', evidenceType: 'behavioral' },
    { frameworkId: 'DORA', requirementId: 'dora_art17',   coverageLevel: 'partial', evidenceType: 'procedural' }
  ],
  scenario_3: [ // Credential Theft
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_g', coverageLevel: 'full', evidenceType: 'behavioral' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_j', coverageLevel: 'partial', evidenceType: 'knowledge' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_h', coverageLevel: 'partial', evidenceType: 'knowledge' },
    { frameworkId: 'DORA', requirementId: 'dora_art9',    coverageLevel: 'full', evidenceType: 'behavioral' }
  ],
  scenario_4: [ // Spear Phishing
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_g', coverageLevel: 'full', evidenceType: 'behavioral' },
    { frameworkId: 'DORA', requirementId: 'dora_art10',   coverageLevel: 'partial', evidenceType: 'behavioral' }
  ],
  scenario_5: [ // Whaling Attack (PDG)
    { frameworkId: 'NIS2', requirementId: 'nis2_art20_2', coverageLevel: 'full', evidenceType: 'behavioral' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_g', coverageLevel: 'full', evidenceType: 'behavioral' },
    { frameworkId: 'DORA', requirementId: 'dora_art9',    coverageLevel: 'partial', evidenceType: 'behavioral' }
  ],

  // Ransomware scenarios
  scenario_6: [ // USB Mystérieux
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_e', coverageLevel: 'partial', evidenceType: 'behavioral' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_g', coverageLevel: 'full', evidenceType: 'behavioral' },
    { frameworkId: 'DORA', requirementId: 'dora_art9',    coverageLevel: 'partial', evidenceType: 'behavioral' },
    { frameworkId: 'DORA', requirementId: 'dora_art12',   coverageLevel: 'partial', evidenceType: 'knowledge' }
  ],
  scenario_7: [ // Ransomware Hôpital
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_b', coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_c', coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art23_1', coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art11',   coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art12',   coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art17',   coverageLevel: 'full', evidenceType: 'procedural' }
  ],
  scenario_8: [ // Ransomware Corporate
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_b', coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_c', coverageLevel: 'partial', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art11',   coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art18',   coverageLevel: 'partial', evidenceType: 'knowledge' }
  ],

  // Social Engineering scenarios
  scenario_9: [ // Appel du "Support IT"
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_g', coverageLevel: 'full', evidenceType: 'behavioral' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_i', coverageLevel: 'partial', evidenceType: 'behavioral' },
    { frameworkId: 'DORA', requirementId: 'dora_art9',    coverageLevel: 'partial', evidenceType: 'behavioral' }
  ],
  scenario_10: [ // Tailgating
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_i', coverageLevel: 'full', evidenceType: 'behavioral' },
    { frameworkId: 'ISO27001', requirementId: 'a7', coverageLevel: 'full', evidenceType: 'behavioral' }
  ],
  scenario_11: [ // Pretexting (Faux fournisseur)
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_d', coverageLevel: 'partial', evidenceType: 'behavioral' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_g', coverageLevel: 'full', evidenceType: 'behavioral' },
    { frameworkId: 'DORA', requirementId: 'dora_art28',   coverageLevel: 'partial', evidenceType: 'behavioral' }
  ],

  // Incident Response scenarios
  scenario_12: [ // Data Breach Response
    { frameworkId: 'NIS2', requirementId: 'nis2_art23_1', coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art23_2', coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art23_3', coverageLevel: 'partial', evidenceType: 'knowledge' },
    { frameworkId: 'DORA', requirementId: 'dora_art17',   coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art18',   coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art19',   coverageLevel: 'full', evidenceType: 'procedural' }
  ],
  scenario_13: [ // Insider Threat
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_i', coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_b', coverageLevel: 'partial', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art10',   coverageLevel: 'full', evidenceType: 'behavioral' }
  ],
  scenario_14: [ // DDoS Simulation
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_e', coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_c', coverageLevel: 'partial', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art11',   coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art24',   coverageLevel: 'partial', evidenceType: 'procedural' }
  ],

  // Supply Chain scenarios
  scenario_15: [ // Compromission fournisseur
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_d', coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art28',   coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art29',   coverageLevel: 'partial', evidenceType: 'knowledge' },
    { frameworkId: 'DORA', requirementId: 'dora_art30',   coverageLevel: 'partial', evidenceType: 'knowledge' }
  ],
  scenario_16: [ // SaaS Vendor Breach
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_d', coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art28',   coverageLevel: 'partial', evidenceType: 'knowledge' },
    { frameworkId: 'DORA', requirementId: 'dora_art31',   coverageLevel: 'partial', evidenceType: 'knowledge' }
  ],

  // Access Control scenarios
  scenario_17: [ // Password Cracking Demo
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_j', coverageLevel: 'full', evidenceType: 'knowledge' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_h', coverageLevel: 'partial', evidenceType: 'knowledge' },
    { frameworkId: 'DORA', requirementId: 'dora_art9',    coverageLevel: 'partial', evidenceType: 'knowledge' }
  ],
  scenario_18: [ // MFA Bypass
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_j', coverageLevel: 'full', evidenceType: 'behavioral' },
    { frameworkId: 'DORA', requirementId: 'dora_art9',    coverageLevel: 'partial', evidenceType: 'behavioral' }
  ],

  // Data Protection scenarios
  scenario_19: [ // GDPR Data Leak
    { frameworkId: 'NIS2', requirementId: 'nis2_art23_1', coverageLevel: 'partial', evidenceType: 'procedural' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art23_4', coverageLevel: 'full', evidenceType: 'procedural' }
  ],
  scenario_20: [ // Cloud Misconfiguration
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_e', coverageLevel: 'full', evidenceType: 'knowledge' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_f', coverageLevel: 'partial', evidenceType: 'knowledge' },
    { frameworkId: 'DORA', requirementId: 'dora_art7',    coverageLevel: 'partial', evidenceType: 'knowledge' },
    { frameworkId: 'DORA', requirementId: 'dora_art8',    coverageLevel: 'partial', evidenceType: 'knowledge' }
  ],

  // Crisis Management scenarios
  scenario_21: [ // Cellule de crise cyber
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_c', coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art23_1', coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art23_2', coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art11',   coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art14',   coverageLevel: 'full', evidenceType: 'procedural' }
  ],
  scenario_22: [ // Communication de crise
    { frameworkId: 'NIS2', requirementId: 'nis2_art23_4', coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art14',   coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art45',   coverageLevel: 'partial', evidenceType: 'knowledge' }
  ],

  // Governance scenarios
  scenario_23: [ // Risk Assessment Workshop
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_a', coverageLevel: 'full', evidenceType: 'knowledge' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art20_1', coverageLevel: 'partial', evidenceType: 'knowledge' },
    { frameworkId: 'DORA', requirementId: 'dora_art5',    coverageLevel: 'partial', evidenceType: 'knowledge' },
    { frameworkId: 'DORA', requirementId: 'dora_art6',    coverageLevel: 'partial', evidenceType: 'knowledge' },
    { frameworkId: 'DORA', requirementId: 'dora_art8',    coverageLevel: 'full', evidenceType: 'knowledge' }
  ],
  scenario_24: [ // Board Cyber Briefing
    { frameworkId: 'NIS2', requirementId: 'nis2_art20_1', coverageLevel: 'full', evidenceType: 'knowledge' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art20_2', coverageLevel: 'full', evidenceType: 'knowledge' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art20_3', coverageLevel: 'partial', evidenceType: 'knowledge' },
    { frameworkId: 'DORA', requirementId: 'dora_art5',    coverageLevel: 'full', evidenceType: 'knowledge' }
  ],

  // Resilience Testing scenarios
  scenario_25: [ // Pentest Simulation
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_f', coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art24',   coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art25',   coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art26',   coverageLevel: 'partial', evidenceType: 'knowledge' }
  ],
  scenario_26: [ // Red Team Exercise
    { frameworkId: 'DORA', requirementId: 'dora_art26',   coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art27',   coverageLevel: 'partial', evidenceType: 'knowledge' }
  ],

  // Sector-specific scenarios
  scenario_27: [ // Finance — Wire Fraud
    { frameworkId: 'DORA', requirementId: 'dora_art9',    coverageLevel: 'full', evidenceType: 'behavioral' },
    { frameworkId: 'DORA', requirementId: 'dora_art17',   coverageLevel: 'partial', evidenceType: 'procedural' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_g', coverageLevel: 'full', evidenceType: 'behavioral' }
  ],
  scenario_28: [ // Énergie — SCADA Attack
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_e', coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_c', coverageLevel: 'full', evidenceType: 'procedural' }
  ],
  scenario_29: [ // Santé — Patient Data
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_g', coverageLevel: 'full', evidenceType: 'behavioral' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art23_4', coverageLevel: 'partial', evidenceType: 'procedural' }
  ],
  scenario_30: [ // Backup & Recovery Drill
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_c', coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'DORA', requirementId: 'dora_art12',   coverageLevel: 'full', evidenceType: 'procedural' }
  ],
  scenario_31: [ // Threat Intelligence Briefing
    { frameworkId: 'DORA', requirementId: 'dora_art13',   coverageLevel: 'full', evidenceType: 'knowledge' },
    { frameworkId: 'DORA', requirementId: 'dora_art45',   coverageLevel: 'full', evidenceType: 'knowledge' }
  ],
  scenario_32: [ // Vulnerability Disclosure
    { frameworkId: 'NIS2', requirementId: 'nis2_art21_f', coverageLevel: 'full', evidenceType: 'procedural' },
    { frameworkId: 'NIS2', requirementId: 'nis2_art24',   coverageLevel: 'partial', evidenceType: 'knowledge' },
    { frameworkId: 'DORA', requirementId: 'dora_art13',   coverageLevel: 'partial', evidenceType: 'procedural' }
  ]
}

// ─── GÉNÉRATEUR DE RAPPORT DE CONFORMITÉ ────────────────────

/**
 * Génère un rapport de conformité pour un framework donné
 * @param {string} frameworkId - 'NIS2' | 'DORA'
 * @param {Array<{scenarioId: string, score: number, completionTime: number, passed: boolean}>} scenarioResults
 * @returns {object} Rapport de conformité structuré
 */
export function generateComplianceReport(frameworkId, scenarioResults) {
  const requirements = frameworkId === 'NIS2' ? NIS2_REQUIREMENTS : DORA_REQUIREMENTS
  const allSubReqs = requirements.flatMap(r => r.subRequirements || [{ id: r.id, title: r.title }])

  // Collecter la couverture par exigence
  const coverageMap = {}
  allSubReqs.forEach(req => { coverageMap[req.id] = { scores: [], evidenceTypes: new Set(), coverageLevels: [] } })

  scenarioResults.forEach(result => {
    const mappings = SCENARIO_COMPLIANCE_MAP[result.scenarioId] || []
    mappings
      .filter(m => m.frameworkId === frameworkId)
      .forEach(m => {
        if (coverageMap[m.requirementId]) {
          coverageMap[m.requirementId].scores.push(result.score)
          coverageMap[m.requirementId].evidenceTypes.add(m.evidenceType)
          coverageMap[m.requirementId].coverageLevels.push(m.coverageLevel)
        }
      })
  })

  // Évaluer le statut par exigence
  const requirementStatuses = allSubReqs.map(req => {
    const data = coverageMap[req.id]
    let status = 'not_assessed'
    let avgScore = 0

    if (data.scores.length > 0) {
      avgScore = Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length)
      const hasFull = data.coverageLevels.includes('full')

      if (avgScore >= 80 && hasFull) status = 'compliant'
      else if (avgScore >= 50) status = 'partially_compliant'
      else status = 'non_compliant'
    }

    return {
      requirementId: req.id,
      title: req.title,
      status,
      score: avgScore,
      scenariosCovered: data.scores.length,
      evidenceTypes: [...data.evidenceTypes]
    }
  })

  const compliant = requirementStatuses.filter(r => r.status === 'compliant').length
  const partial = requirementStatuses.filter(r => r.status === 'partially_compliant').length
  const nonCompliant = requirementStatuses.filter(r => r.status === 'non_compliant').length
  const notAssessed = requirementStatuses.filter(r => r.status === 'not_assessed').length
  const total = requirementStatuses.length

  const overallPct = total > 0 ? Math.round(((compliant * 1 + partial * 0.5) / total) * 100) : 0

  // Gaps & recommandations
  const gaps = requirementStatuses
    .filter(r => r.status === 'non_compliant' || r.status === 'not_assessed')
    .map(r => ({
      requirementId: r.requirementId,
      title: r.title,
      status: r.status,
      priority: r.status === 'non_compliant' ? 'high' : 'medium'
    }))

  const recommendations = gaps.map(g => ({
    requirementId: g.requirementId,
    priority: g.priority,
    action: g.status === 'not_assessed'
      ? `Assigner des scénarios couvrant l'exigence "${g.title}" pour obtenir des preuves mesurables.`
      : `Renforcer la formation sur "${g.title}" — le score actuel est insuffisant. Planifier des sessions ciblées.`
  }))

  return {
    reportId: `RPT-${frameworkId}-${Date.now().toString(36).toUpperCase()}`,
    frameworkId,
    frameworkName: frameworkId === 'NIS2' ? 'Directive NIS2 (UE 2022/2555)' : 'Règlement DORA (UE 2022/2554)',
    generatedAt: new Date().toISOString(),
    generatedBy: 'ROOMCA — Moteur de conformité automatisé',
    hosting: 'Données hébergées 100% en France',

    summary: {
      overallCompliancePct: overallPct,
      compliant,
      partiallyCompliant: partial,
      nonCompliant,
      notAssessed,
      totalRequirements: total
    },

    requirementStatuses,
    gaps,
    recommendations,

    scenariosAnalyzed: scenarioResults.length,
    avgScenarioScore: scenarioResults.length > 0
      ? Math.round(scenarioResults.reduce((a, r) => a + r.score, 0) / scenarioResults.length)
      : 0
  }
}

// ─── STRUCTURE DU RAPPORT PDF ───────────────────────────────

export const PDF_REPORT_STRUCTURE = {
  version: '2.0',
  format: 'A4',
  sections: [
    {
      id: 'cover',
      title: 'Page de couverture',
      content: ['Logo entreprise (white-label)', 'Nom du framework', 'Date de génération', 'Classification : CONFIDENTIEL', 'Hébergé 100% en France']
    },
    {
      id: 'executive_summary',
      title: 'Résumé exécutif',
      content: [
        'Score global de conformité (%)',
        'Nombre d\'exigences conformes / partielles / non-conformes',
        'Top 3 des risques prioritaires',
        'Évolution depuis le dernier rapport',
        'Recommandation principale'
      ]
    },
    {
      id: 'framework_overview',
      title: 'Présentation du framework',
      content: [
        'Description du cadre réglementaire',
        'Périmètre d\'application',
        'Échéances et sanctions',
        'Articles et chapitres couverts'
      ]
    },
    {
      id: 'compliance_matrix',
      title: 'Matrice de conformité',
      content: [
        'Tableau : Exigence × Scénarios couverts',
        'Statut par exigence (icône couleur)',
        'Score moyen par exigence',
        'Type de preuve (comportemental / connaissance / procédural)',
        'Niveau de couverture (complète / partielle)'
      ]
    },
    {
      id: 'gap_analysis',
      title: 'Analyse des écarts',
      content: [
        'Exigences non couvertes',
        'Exigences partiellement couvertes',
        'Priorisation des écarts (critique / élevé / moyen)',
        'Impact réglementaire de chaque écart'
      ]
    },
    {
      id: 'risk_assessment',
      title: 'Évaluation des risques',
      content: [
        'Score de risque par département',
        'Corrélation risque comportemental ↔ conformité',
        'Heatmap : départements × exigences',
        'Employés à risque critique (anonymisés)'
      ]
    },
    {
      id: 'recommendations',
      title: 'Plan de remédiation',
      content: [
        'Actions correctives par priorité',
        'Scénarios à déployer pour combler les écarts',
        'Planning de mise en conformité (30 / 60 / 90 jours)',
        'Ressources nécessaires estimées'
      ]
    },
    {
      id: 'evidence_log',
      title: 'Journal de preuves',
      content: [
        'Liste des scénarios complétés avec horodatage',
        'Score par scénario et par employé (agrégé)',
        'Temps moyen de complétion',
        'Taux de réussite par catégorie'
      ]
    },
    {
      id: 'appendices',
      title: 'Annexes',
      content: [
        'Glossaire réglementaire',
        'Méthodologie de scoring ROOMCA',
        'Mapping complet scénarios ↔ exigences',
        'Références : textes officiels NIS2 / DORA',
        'Coordonnées ANSSI / autorités compétentes'
      ]
    }
  ],
  styling: {
    primaryColor: 'var(--cyan)',
    fontFamily: 'Roboto, sans-serif',
    headerFont: 'Monda, sans-serif',
    watermark: 'ROOMCA — Document confidentiel',
    footer: 'Généré automatiquement par ROOMCA · Hébergement souverain France'
  }
}
