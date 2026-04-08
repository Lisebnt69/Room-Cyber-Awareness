// Comprehensive Compliance Service
// Tracks 15+ compliance frameworks with controls, assessments, and reporting

export const frameworks = {
  GDPR: {
    id: 'GDPR',
    name: 'General Data Protection Regulation',
    region: 'EU',
    category: 'Privacy',
    controls: 99,
    description: 'Protection des données personnelles UE',
    penalty: '€20M ou 4% CA mondial',
    deadline: '72h breach notification',
    requirements: [
      { id: 'art5', name: 'Principles of processing', category: 'Lawfulness' },
      { id: 'art32', name: 'Security of processing', category: 'Security' },
      { id: 'art33', name: 'Breach notification', category: 'Incident Response' },
      { id: 'art35', name: 'DPIA', category: 'Risk Assessment' }
    ]
  },
  HIPAA: {
    id: 'HIPAA',
    name: 'Health Insurance Portability and Accountability Act',
    region: 'US',
    category: 'Healthcare',
    controls: 78,
    description: 'Protection des données de santé US',
    penalty: '$50K-$1.5M par violation',
    deadline: '60 days breach notification',
    requirements: [
      { id: 'admin', name: 'Administrative Safeguards', category: 'Policy' },
      { id: 'phys', name: 'Physical Safeguards', category: 'Physical' },
      { id: 'tech', name: 'Technical Safeguards', category: 'Technical' }
    ]
  },
  'PCI-DSS': {
    id: 'PCI-DSS',
    name: 'Payment Card Industry Data Security Standard',
    region: 'Global',
    category: 'Payments',
    controls: 12,
    description: 'Protection données de cartes bancaires',
    penalty: '$5K-$100K/mois',
    requirements: [
      { id: 'r1', name: 'Install firewall', category: 'Network' },
      { id: 'r3', name: 'Protect stored cardholder data', category: 'Crypto' },
      { id: 'r8', name: 'Identify and authenticate access', category: 'Access' },
      { id: 'r10', name: 'Track access to network resources', category: 'Logging' }
    ]
  },
  'SOC2': {
    id: 'SOC2',
    name: 'SOC 2 Type II',
    region: 'Global',
    category: 'SaaS',
    controls: 64,
    description: 'Trust Service Criteria pour SaaS',
    requirements: [
      { id: 'cc1', name: 'Control Environment', category: 'Governance' },
      { id: 'cc6', name: 'Logical Access', category: 'Access' },
      { id: 'cc7', name: 'System Operations', category: 'Operations' }
    ]
  },
  'ISO27001': {
    id: 'ISO27001',
    name: 'ISO/IEC 27001:2022',
    region: 'Global',
    category: 'ISMS',
    controls: 93,
    description: 'Système de management de la sécurité de l\'information',
    requirements: [
      { id: 'a5', name: 'Organizational controls', category: 'Org' },
      { id: 'a6', name: 'People controls', category: 'HR' },
      { id: 'a7', name: 'Physical controls', category: 'Physical' },
      { id: 'a8', name: 'Technological controls', category: 'Tech' }
    ]
  },
  NIS2: {
    id: 'NIS2',
    name: 'Directive NIS2',
    region: 'EU',
    category: 'Critical Infrastructure',
    controls: 22,
    description: 'Sécurité des réseaux et systèmes d\'information UE',
    penalty: '€10M ou 2% CA mondial',
    deadline: '24h initial, 72h détaillé',
    requirements: [
      { id: 'risk', name: 'Risk management', category: 'Governance' },
      { id: 'incident', name: 'Incident handling', category: 'IR' },
      { id: 'supply', name: 'Supply chain security', category: 'Vendor' }
    ]
  },
  DORA: {
    id: 'DORA',
    name: 'Digital Operational Resilience Act',
    region: 'EU',
    category: 'Finance',
    controls: 41,
    description: 'Résilience opérationnelle numérique secteur financier',
    penalty: '€10M ou 1% CA',
    deadline: '4h notification incident',
    requirements: [
      { id: 'ictrm', name: 'ICT Risk Management', category: 'Risk' },
      { id: 'ictinc', name: 'ICT-related Incident Reporting', category: 'IR' },
      { id: 'tlpt', name: 'Threat-Led Penetration Testing', category: 'Testing' }
    ]
  },
  'CMMC2': {
    id: 'CMMC2',
    name: 'Cybersecurity Maturity Model Certification 2.0',
    region: 'US',
    category: 'Defense',
    controls: 110,
    description: 'Certification pour sous-traitants DoD',
    requirements: [
      { id: 'l1', name: 'Level 1 - Foundational', category: 'Basic' },
      { id: 'l2', name: 'Level 2 - Advanced', category: 'NIST 800-171' },
      { id: 'l3', name: 'Level 3 - Expert', category: 'NIST 800-172' }
    ]
  },
  FERPA: {
    id: 'FERPA',
    name: 'Family Educational Rights and Privacy Act',
    region: 'US',
    category: 'Education',
    controls: 34,
    description: 'Protection dossiers éducatifs étudiants'
  },
  'NERC-CIP': {
    id: 'NERC-CIP',
    name: 'NERC Critical Infrastructure Protection',
    region: 'US/Canada',
    category: 'Energy',
    controls: 45,
    description: 'Protection infrastructures électriques',
    penalty: '$1.3M/jour'
  },
  'IEC62443': {
    id: 'IEC62443',
    name: 'IEC 62443',
    region: 'Global',
    category: 'OT/ICS',
    controls: 67,
    description: 'Sécurité des systèmes industriels'
  },
  CCPA: {
    id: 'CCPA',
    name: 'California Consumer Privacy Act',
    region: 'US-CA',
    category: 'Privacy',
    controls: 28,
    description: 'Vie privée consommateurs Californie',
    penalty: '$7,500/violation'
  },
  COPPA: {
    id: 'COPPA',
    name: 'Children\'s Online Privacy Protection Act',
    region: 'US',
    category: 'Privacy',
    controls: 18,
    description: 'Protection enfants en ligne'
  },
  HDS: {
    id: 'HDS',
    name: 'Hébergeur de Données de Santé',
    region: 'France',
    category: 'Healthcare',
    controls: 56,
    description: 'Certification française données santé'
  },
  RGS: {
    id: 'RGS',
    name: 'Référentiel Général de Sécurité',
    region: 'France',
    category: 'Government',
    controls: 38,
    description: 'Sécurité administrations françaises'
  }
}

export const complianceService = {
  getAllFrameworks() {
    return Object.values(frameworks)
  },

  getFramework(id) {
    return frameworks[id]
  },

  getFrameworksBySector(sector) {
    const sectorMap = {
      healthcare: ['HIPAA', 'GDPR', 'HDS'],
      finance: ['PCI-DSS', 'DORA', 'SOC2'],
      government: ['CMMC2', 'RGS'],
      education: ['FERPA', 'GDPR', 'COPPA'],
      industry: ['IEC62443', 'NIS2', 'ISO27001'],
      retail: ['PCI-DSS', 'GDPR', 'CCPA'],
      energy: ['NERC-CIP', 'NIS2'],
      tech: ['SOC2', 'ISO27001', 'GDPR']
    }
    return (sectorMap[sector] || []).map(id => frameworks[id]).filter(Boolean)
  },

  // Self-assessment scoring
  assessCompliance(frameworkId, answers) {
    const framework = frameworks[frameworkId]
    if (!framework) return null

    const total = answers.length
    const compliant = answers.filter(a => a.compliant).length
    const score = Math.round((compliant / total) * 100)

    return {
      framework: framework.name,
      score,
      compliant,
      total,
      gaps: answers.filter(a => !a.compliant).length,
      status: score >= 90 ? 'compliant' : score >= 70 ? 'partial' : 'non-compliant',
      readyForAudit: score >= 95
    }
  },

  // Generate compliance roadmap
  generateRoadmap(frameworkId, currentScore) {
    return {
      framework: frameworkId,
      currentScore,
      targetScore: 95,
      phases: [
        { phase: 1, name: 'Gap Analysis', duration: '2 weeks', status: 'in-progress' },
        { phase: 2, name: 'Remediation', duration: '8 weeks', status: 'pending' },
        { phase: 3, name: 'Internal Audit', duration: '2 weeks', status: 'pending' },
        { phase: 4, name: 'External Audit', duration: '4 weeks', status: 'pending' },
        { phase: 5, name: 'Certification', duration: '1 week', status: 'pending' }
      ],
      estimatedCost: '€15K-€50K',
      estimatedTime: '4-6 months'
    }
  },

  // Track breach notification deadlines
  getBreachDeadlines() {
    return [
      { framework: 'GDPR', deadline: '72 hours', authority: 'CNIL/DPA' },
      { framework: 'HIPAA', deadline: '60 days', authority: 'HHS OCR' },
      { framework: 'NIS2', deadline: '24 hours', authority: 'CSIRT national' },
      { framework: 'DORA', deadline: '4 hours', authority: 'ACPR/AMF' },
      { framework: 'CCPA', deadline: 'Without delay', authority: 'CA AG' }
    ]
  },

  // Generate compliance evidence
  generateEvidence(frameworkId) {
    return {
      framework: frameworkId,
      evidence: [
        { type: 'Policy', name: 'Information Security Policy', status: 'approved' },
        { type: 'Procedure', name: 'Incident Response Procedure', status: 'approved' },
        { type: 'Training', name: 'ROOMCA Awareness Training', status: 'completed' },
        { type: 'Test', name: 'Phishing Simulation Results', status: 'passed' },
        { type: 'Audit Log', name: 'Access logs 12 months', status: 'available' }
      ],
      generatedAt: new Date().toISOString()
    }
  }
}
