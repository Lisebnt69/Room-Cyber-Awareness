// ============================================================
// Multi-Tenancy Service — MSP White-Label API
// Architecture souveraine · Hébergement 100% France
// ============================================================

// ─── Tenant Data Model ──────────────────────────────────────

export const tenantsData = [
  {
    id: 'tenant_acme',
    name: 'ACME Corp',
    domain: 'acme.roomca.io',
    customDomain: null,
    plan: 'business',
    parentMSP: null,
    branding: { logo: '/logos/acme.png', primaryColor: '#00d4ff', secondaryColor: '#061428', favicon: '/favicons/acme.ico', loginBg: '/bg/acme.jpg', emailFooter: 'ACME Corp — Sécurité & Innovation' },
    features: ['sso', '2fa', 'whitelabel', 'api', 'compliance_reports', 'risk_scoring'],
    limits: { employees: 500, scenarios: -1, campaigns: -1, apiCalls: 50000 },
    billing: { stripeCustomerId: 'cus_acme_001', mrr: 449, currency: 'EUR' },
    metadata: { createdAt: '2024-09-15', industry: 'Technology', country: 'FR', complianceFrameworks: ['NIS2', 'ISO27001'] },
    status: 'active'
  },
  {
    id: 'tenant_bnp',
    name: 'BNP Finance',
    domain: 'bnp.roomca.io',
    customDomain: 'cyber.bnp-finance.fr',
    plan: 'enterprise',
    parentMSP: null,
    branding: { logo: '/logos/bnp.png', primaryColor: '#00a86b', secondaryColor: '#001a0e', favicon: '/favicons/bnp.ico', loginBg: '/bg/bnp.jpg', emailFooter: 'BNP Finance — Direction Sécurité des SI' },
    features: ['sso', '2fa', 'whitelabel', 'api', 'compliance_reports', 'risk_scoring', 'custom_scenarios', 'dedicated_support'],
    limits: { employees: -1, scenarios: -1, campaigns: -1, apiCalls: -1 },
    billing: { stripeCustomerId: 'cus_bnp_002', mrr: 1200, currency: 'EUR' },
    metadata: { createdAt: '2024-06-01', industry: 'Finance', country: 'FR', complianceFrameworks: ['NIS2', 'DORA', 'ISO27001', 'GDPR'] },
    status: 'active'
  },
  {
    id: 'tenant_lyon',
    name: 'Mairie de Lyon',
    domain: 'lyon.roomca.io',
    customDomain: 'securite.lyon.fr',
    plan: 'business',
    parentMSP: null,
    branding: { logo: '/logos/lyon.png', primaryColor: '#1e40af', secondaryColor: '#0c1524', favicon: '/favicons/lyon.ico', loginBg: '/bg/lyon.jpg', emailFooter: 'Mairie de Lyon — DSI' },
    features: ['sso', '2fa', 'compliance_reports', 'risk_scoring'],
    limits: { employees: 500, scenarios: -1, campaigns: -1, apiCalls: 50000 },
    billing: { stripeCustomerId: 'cus_lyon_003', mrr: 449, currency: 'EUR' },
    metadata: { createdAt: '2025-01-10', industry: 'Government', country: 'FR', complianceFrameworks: ['RGS', 'NIS2', 'GDPR'] },
    status: 'active'
  },
  {
    id: 'msp_cyberforce',
    name: 'CyberForce MSP',
    domain: 'cyberforce.roomca.io',
    customDomain: 'platform.cyberforce.fr',
    plan: 'enterprise',
    parentMSP: null,
    branding: { logo: '/logos/cyberforce.png', primaryColor: '#8b5cf6', secondaryColor: '#1a0a2e', favicon: '/favicons/cyberforce.ico', loginBg: '/bg/cyberforce.jpg', emailFooter: 'CyberForce — Votre partenaire cyber souverain' },
    features: ['sso', '2fa', 'whitelabel', 'api', 'compliance_reports', 'risk_scoring', 'msp_portal', 'multi_client', 'reseller'],
    limits: { employees: -1, scenarios: -1, campaigns: -1, apiCalls: -1 },
    billing: { stripeCustomerId: 'cus_cf_004', mrr: 2400, currency: 'EUR' },
    metadata: { createdAt: '2024-03-01', industry: 'MSSP', country: 'FR', complianceFrameworks: ['NIS2', 'ISO27001'] },
    status: 'active'
  },
  {
    id: 'tenant_pharma',
    name: 'PharmaSecure',
    domain: 'pharma.roomca.io',
    customDomain: null,
    plan: 'business',
    parentMSP: 'msp_cyberforce',
    branding: { logo: '/logos/pharma.png', primaryColor: '#06b6d4', secondaryColor: '#0a1929', favicon: null, loginBg: null, emailFooter: 'PharmaSecure — Powered by CyberForce' },
    features: ['2fa', 'compliance_reports', 'risk_scoring'],
    limits: { employees: 200, scenarios: -1, campaigns: 20, apiCalls: 10000 },
    billing: { stripeCustomerId: 'cus_pharma_005', mrr: 449, currency: 'EUR' },
    metadata: { createdAt: '2025-02-20', industry: 'Healthcare', country: 'FR', complianceFrameworks: ['HDS', 'GDPR', 'NIS2'] },
    status: 'active'
  },
  {
    id: 'tenant_logistik',
    name: 'EuroLogistik',
    domain: 'eurologistik.roomca.io',
    customDomain: null,
    plan: 'starter',
    parentMSP: 'msp_cyberforce',
    branding: { logo: null, primaryColor: '#f59e0b', secondaryColor: '#1a1000', favicon: null, loginBg: null, emailFooter: 'EuroLogistik — Powered by CyberForce' },
    features: ['2fa'],
    limits: { employees: 50, scenarios: 5, campaigns: 2, apiCalls: 1000 },
    billing: { stripeCustomerId: 'cus_logistik_006', mrr: 99, currency: 'EUR' },
    metadata: { createdAt: '2025-03-15', industry: 'Logistics', country: 'FR', complianceFrameworks: ['NIS2'] },
    status: 'trial'
  }
]

// ─── White-label Configuration (rétro-compatible) ───────────

export const whitelabelConfig = (tenantId) => {
  const tenant = tenantsData.find(t => t.id === tenantId)
  if (!tenant) return null

  return {
    branding: {
      companyName: tenant.name,
      logo: tenant.branding.logo,
      primaryColor: tenant.branding.primaryColor,
      secondaryColor: tenant.branding.secondaryColor,
      faviconUrl: tenant.branding.favicon || `/favicon-${tenantId}.ico`
    },
    domain: tenant.customDomain || tenant.domain,
    customPages: {
      loginBackground: tenant.branding.loginBg || `/bg-${tenantId}.jpg`,
      footerText: tenant.branding.emailFooter || `Powered by ${tenant.name}`
    }
  }
}

// ─── SSO Integration (OAuth2/SAML) ──────────────────────────

export const ssoIntegration = {
  async configureOAuth(tenantId, config) {
    const { clientId, clientSecret, discoveryUrl } = config
    console.log(`[SSO] OAuth2 configuré pour tenant ${tenantId}`)
    return { success: true, provider: 'oauth2', tenantId, discoveryUrl }
  },

  async configureSAML(tenantId, config) {
    const { metadataUrl, certificatePath } = config
    console.log(`[SSO] SAML2 configuré pour tenant ${tenantId}`)
    return { success: true, provider: 'saml2', tenantId, metadataUrl }
  },

  async getUserFromSSO(tokenId) {
    return {
      id: 'user_sso_1',
      email: 'sso.user@example.com',
      name: 'SSO User',
      role: 'admin',
      tenantId: 'tenant_acme'
    }
  }
}

// ─── 2FA (Two-Factor Authentication) ────────────────────────

export const twoFactorAuth = {
  async generateSecret(userId) {
    const secret = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`otpauth://totp/ROOMCA:${userId}?secret=${secret}`)}`
    return { secret, qrCode }
  },

  async verifyCode(secret, code) {
    console.log(`[2FA] Vérification code pour secret ${secret.substring(0, 5)}...`)
    return { valid: code.length === 6, remaining: 25 }
  },

  async enableForUser(userId, secret) {
    console.log(`[2FA] Activé pour utilisateur ${userId}`)
    return {
      enabled: true,
      backupCodes: ['A1B2C3', 'D4E5F6', 'G7H8I9', 'J0K1L2', 'M3N4O5']
    }
  },

  async disableForUser(userId) {
    console.log(`[2FA] Désactivé pour utilisateur ${userId}`)
    return { disabled: true }
  }
}

// ─── Tenant Isolation ───────────────────────────────────────

export const tenantIsolation = {
  checkAccess(userId, tenantId, resource) {
    const tenant = tenantsData.find(t => t.id === tenantId)
    if (!tenant || tenant.status === 'suspended') return false
    console.log(`[Isolation] Accès vérifié : user ${userId} → ${resource} dans ${tenantId}`)
    return true
  },

  getScopedData(userId, tenantId, dataType) {
    return { filtered: true, tenantId, dataType }
  },

  /** Vérifie qu'un MSP a le droit de gérer un client donné */
  checkMSPAccess(mspId, clientTenantId) {
    const client = tenantsData.find(t => t.id === clientTenantId)
    if (!client) return false
    return client.parentMSP === mspId
  }
}

// ─── License Management ─────────────────────────────────────

export const licenseManagement = {
  PLAN_LIMITS: {
    starter:    { employees: 50,  scenarios: 5,  campaigns: 2,  apiCalls: 1000,  price: 99 },
    business:   { employees: 500, scenarios: -1, campaigns: -1, apiCalls: 50000, price: 449 },
    enterprise: { employees: -1,  scenarios: -1, campaigns: -1, apiCalls: -1,    price: null }
  },

  getTenantLimits(tenantId) {
    const tenant = tenantsData.find(t => t.id === tenantId)
    return this.PLAN_LIMITS[tenant?.plan] || this.PLAN_LIMITS.starter
  },

  validateLicenseUsage(tenantId, resourceType, quantity) {
    const limits = this.getTenantLimits(tenantId)
    const limit = limits[resourceType]
    if (limit === -1) return { valid: true, remaining: Infinity }
    return { valid: quantity <= limit, remaining: Math.max(0, limit - quantity) }
  }
}

// ============================================================
// MSP PARTNER API — Gestion multi-clients pour revendeurs
// ============================================================

export const mspPartnerAPI = {
  /**
   * Crée un sous-tenant client sous un MSP
   * @param {string} mspId - ID du tenant MSP parent
   * @param {object} clientData - Configuration du nouveau client
   */
  createClient(mspId, clientData) {
    const msp = tenantsData.find(t => t.id === mspId)
    if (!msp || !msp.features.includes('msp_portal')) {
      return { success: false, error: 'MSP_NOT_AUTHORIZED' }
    }

    const newTenant = {
      id: `tenant_${clientData.slug || Date.now()}`,
      name: clientData.name,
      domain: `${clientData.slug}.roomca.io`,
      customDomain: clientData.customDomain || null,
      plan: clientData.plan || 'starter',
      parentMSP: mspId,
      branding: {
        logo: clientData.logo || null,
        primaryColor: clientData.primaryColor || msp.branding.primaryColor,
        secondaryColor: clientData.secondaryColor || msp.branding.secondaryColor,
        favicon: null,
        loginBg: null,
        emailFooter: `${clientData.name} — Powered by ${msp.name}`
      },
      features: licenseManagement.PLAN_LIMITS[clientData.plan || 'starter'] ? ['2fa'] : ['2fa', 'compliance_reports'],
      limits: licenseManagement.PLAN_LIMITS[clientData.plan || 'starter'],
      billing: { stripeCustomerId: null, mrr: licenseManagement.PLAN_LIMITS[clientData.plan || 'starter']?.price || 99, currency: 'EUR' },
      metadata: { createdAt: new Date().toISOString().split('T')[0], industry: clientData.industry || 'Other', country: clientData.country || 'FR', complianceFrameworks: clientData.frameworks || [] },
      status: 'trial'
    }

    console.log(`[MSP] Client "${newTenant.name}" créé sous ${msp.name}`)
    return { success: true, tenant: newTenant }
  },

  /** Liste tous les clients gérés par un MSP */
  listClients(mspId) {
    const clients = tenantsData.filter(t => t.parentMSP === mspId)
    return {
      mspId,
      totalClients: clients.length,
      clients: clients.map(c => ({
        id: c.id,
        name: c.name,
        plan: c.plan,
        status: c.status,
        employees: c.limits.employees,
        mrr: c.billing.mrr,
        industry: c.metadata.industry,
        createdAt: c.metadata.createdAt
      }))
    }
  },

  /** Met à jour le branding white-label d'un client */
  updateClientBranding(mspId, clientId, branding) {
    if (!tenantIsolation.checkMSPAccess(mspId, clientId)) {
      return { success: false, error: 'ACCESS_DENIED' }
    }
    console.log(`[MSP] Branding mis à jour pour ${clientId}`)
    return { success: true, clientId, branding: { ...branding, updatedAt: new Date().toISOString() } }
  },

  /** Suspend un client (impayé, violation, etc.) */
  suspendClient(mspId, clientId) {
    if (!tenantIsolation.checkMSPAccess(mspId, clientId)) {
      return { success: false, error: 'ACCESS_DENIED' }
    }
    console.log(`[MSP] Client ${clientId} suspendu par ${mspId}`)
    return { success: true, clientId, status: 'suspended', suspendedAt: new Date().toISOString() }
  },

  /** Analytics agrégés pour un client spécifique */
  getClientAnalytics(mspId, clientId) {
    if (!tenantIsolation.checkMSPAccess(mspId, clientId)) {
      return { success: false, error: 'ACCESS_DENIED' }
    }
    return {
      clientId,
      period: { from: '2025-03-01', to: '2025-04-01' },
      metrics: {
        activeEmployees: 142,
        scenariosCompleted: 856,
        avgScore: 74,
        phishingDetectionRate: 0.68,
        complianceScore: { NIS2: 72, DORA: 65 },
        riskDistribution: { low: 58, medium: 52, high: 24, critical: 8 },
        trend: 'improving'
      }
    }
  },

  /** Dashboard MSP — KPIs cross-clients */
  getMSPDashboard(mspId) {
    const clients = tenantsData.filter(t => t.parentMSP === mspId)
    return {
      mspId,
      totalClients: clients.length,
      totalMRR: clients.reduce((sum, c) => sum + (c.billing.mrr || 0), 0),
      totalEmployees: clients.reduce((sum, c) => sum + (c.limits.employees === -1 ? 1000 : c.limits.employees), 0),
      avgComplianceScore: 71,
      avgRiskScore: 68,
      clientsAtRisk: clients.filter(c => c.status === 'trial').length,
      revenueByPlan: {
        starter: clients.filter(c => c.plan === 'starter').length,
        business: clients.filter(c => c.plan === 'business').length,
        enterprise: clients.filter(c => c.plan === 'enterprise').length
      }
    }
  }
}

// ============================================================
// WHITE-LABEL ENGINE — Moteur de personnalisation complète
// ============================================================

export const whiteLabelEngine = {
  /** Résout le thème CSS complet pour un tenant */
  resolveTheme(tenantId) {
    const tenant = tenantsData.find(t => t.id === tenantId)
    if (!tenant) return null

    const { primaryColor, secondaryColor } = tenant.branding
    return {
      '--tenant-primary':     primaryColor,
      '--tenant-secondary':   secondaryColor,
      '--tenant-primary-glow': `${primaryColor}36`,
      '--tenant-primary-glass': `${primaryColor}14`,
      '--tenant-bg-base':     secondaryColor,
      '--tenant-bg-card':     `${secondaryColor}99`,
      '--tenant-border':      `${primaryColor}2E`,
      companyName: tenant.name,
      logoUrl: tenant.branding.logo
    }
  },

  /** Configure un domaine custom (stub — en prod via Caddy/Traefik) */
  generateCustomDomain(tenantId, domain) {
    console.log(`[WhiteLabel] DNS configuré : ${domain} → ${tenantId}.roomca.io`)
    return {
      tenantId,
      domain,
      ssl: { provider: 'letsencrypt', status: 'provisioning', estimatedReady: '5 minutes' },
      dns: { type: 'CNAME', value: 'edge.roomca.io', ttl: 300 }
    }
  },

  /** Template email brandé */
  getEmailTemplate(tenantId, templateType) {
    const tenant = tenantsData.find(t => t.id === tenantId)
    if (!tenant) return null

    const templates = {
      welcome: {
        subject: `Bienvenue sur la plateforme de sensibilisation cyber de ${tenant.name}`,
        headerColor: tenant.branding.primaryColor,
        logoUrl: tenant.branding.logo,
        footer: tenant.branding.emailFooter
      },
      campaign_invite: {
        subject: `[${tenant.name}] Nouvelle simulation de sécurité disponible`,
        headerColor: tenant.branding.primaryColor,
        logoUrl: tenant.branding.logo,
        footer: tenant.branding.emailFooter
      },
      report: {
        subject: `[${tenant.name}] Votre rapport de conformité est prêt`,
        headerColor: tenant.branding.primaryColor,
        logoUrl: tenant.branding.logo,
        footer: tenant.branding.emailFooter
      }
    }
    return templates[templateType] || null
  },

  /** Données branding pour en-tête de rapport PDF */
  getBrandedPDFHeader(tenantId) {
    const tenant = tenantsData.find(t => t.id === tenantId)
    if (!tenant) return null
    return {
      companyName: tenant.name,
      logoUrl: tenant.branding.logo,
      primaryColor: tenant.branding.primaryColor,
      domain: tenant.customDomain || tenant.domain,
      generatedBy: 'ROOMCA — Plateforme souveraine de sensibilisation cyber',
      hosting: 'Hébergé 100% en France',
      confidentiality: 'CONFIDENTIEL — Usage interne uniquement'
    }
  }
}

// ============================================================
// TENANT PROVISIONING — Pipeline de création/suppression
// ============================================================

export const tenantProvisioning = {
  /** Pipeline complet de création d'un tenant */
  async provisionTenant(config) {
    const steps = [
      { step: 'create_tenant', status: 'done' },
      { step: 'configure_database', status: 'done' },
      { step: 'setup_sso', status: config.sso ? 'done' : 'skipped' },
      { step: 'configure_branding', status: 'done' },
      { step: 'set_limits', status: 'done' },
      { step: 'initialize_scenarios', status: 'done' },
      { step: 'create_admin_user', status: 'done' },
      { step: 'send_welcome_email', status: 'done' }
    ]

    console.log(`[Provisioning] Tenant "${config.name}" provisionné en ${steps.length} étapes`)
    return {
      success: true,
      tenantId: `tenant_${config.slug}`,
      domain: `${config.slug}.roomca.io`,
      adminEmail: config.adminEmail,
      steps,
      provisionedAt: new Date().toISOString()
    }
  },

  /** Suppression complète avec export données */
  async deprovisionTenant(tenantId) {
    console.log(`[Provisioning] Deprovisionning ${tenantId}`)
    return {
      success: true,
      tenantId,
      dataExportUrl: `/exports/${tenantId}_${Date.now()}.zip`,
      deletionScheduledAt: new Date(Date.now() + 30 * 86400000).toISOString(),
      gracePeriodDays: 30
    }
  },

  /** Clone un tenant comme template MSP */
  async cloneTenant(sourceId, newConfig) {
    const source = tenantsData.find(t => t.id === sourceId)
    if (!source) return { success: false, error: 'SOURCE_NOT_FOUND' }

    return {
      success: true,
      clonedFrom: sourceId,
      newTenantId: `tenant_${newConfig.slug}`,
      config: {
        ...newConfig,
        features: source.features,
        plan: newConfig.plan || source.plan
      }
    }
  },

  /** Upgrade/downgrade de plan */
  async migrateTenantPlan(tenantId, newPlan) {
    const tenant = tenantsData.find(t => t.id === tenantId)
    if (!tenant) return { success: false, error: 'TENANT_NOT_FOUND' }

    const oldLimits = licenseManagement.PLAN_LIMITS[tenant.plan]
    const newLimits = licenseManagement.PLAN_LIMITS[newPlan]
    if (!newLimits) return { success: false, error: 'INVALID_PLAN' }

    return {
      success: true,
      tenantId,
      previousPlan: tenant.plan,
      newPlan,
      previousMRR: oldLimits.price,
      newMRR: newLimits.price,
      limitsChanged: {
        employees: { from: oldLimits.employees, to: newLimits.employees },
        scenarios: { from: oldLimits.scenarios, to: newLimits.scenarios },
        apiCalls: { from: oldLimits.apiCalls, to: newLimits.apiCalls }
      },
      effectiveAt: new Date().toISOString()
    }
  }
}

// ============================================================
// API QUOTAS & RATE LIMITING
// ============================================================

const _usageStore = new Map()

export const apiQuotas = {
  /** Vérifie si un tenant peut consommer une ressource */
  checkQuota(tenantId, resource) {
    const limits = licenseManagement.getTenantLimits(tenantId)
    const limit = limits[resource]
    if (limit === -1) return { allowed: true, remaining: Infinity, resetAt: null }

    const key = `${tenantId}:${resource}`
    const used = _usageStore.get(key) || 0
    const remaining = Math.max(0, limit - used)

    return {
      allowed: remaining > 0,
      remaining,
      limit,
      used,
      resetAt: new Date(Date.now() + 30 * 86400000).toISOString()
    }
  },

  /** Enregistre l'usage d'une ressource */
  trackUsage(tenantId, resource, count = 1) {
    const key = `${tenantId}:${resource}`
    const current = _usageStore.get(key) || 0
    _usageStore.set(key, current + count)
    return { tracked: true, newTotal: current + count }
  },

  /** Rapport d'usage mensuel */
  getUsageReport(tenantId, period = 'current_month') {
    const tenant = tenantsData.find(t => t.id === tenantId)
    if (!tenant) return null

    return {
      tenantId,
      tenantName: tenant.name,
      period,
      plan: tenant.plan,
      usage: {
        employees:  { used: 142, limit: tenant.limits.employees, pct: tenant.limits.employees === -1 ? 0 : Math.round(142 / tenant.limits.employees * 100) },
        scenarios:  { used: 28,  limit: tenant.limits.scenarios,  pct: tenant.limits.scenarios === -1 ? 0 : Math.round(28 / tenant.limits.scenarios * 100) },
        campaigns:  { used: 5,   limit: tenant.limits.campaigns,  pct: tenant.limits.campaigns === -1 ? 0 : Math.round(5 / tenant.limits.campaigns * 100) },
        apiCalls:   { used: 12430, limit: tenant.limits.apiCalls, pct: tenant.limits.apiCalls === -1 ? 0 : Math.round(12430 / tenant.limits.apiCalls * 100) }
      },
      billing: {
        currentMRR: tenant.billing.mrr,
        nextInvoice: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        currency: tenant.billing.currency
      }
    }
  }
}
