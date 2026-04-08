// Multi-Tenancy Service (White-label, SSO, 2FA)

export const tenantsData = [
  { id: 'tenant_1', name: 'ACME Corp', domain: 'acme.roomca.io', plan: 'enterprise', logo: '/logo-acme.png', primaryColor: '#eb2828', features: ['sso', '2fa', 'whitelabel'] },
  { id: 'tenant_2', name: 'Tech Inc', domain: 'tech.roomca.io', plan: 'pro', logo: '/logo-tech.png', primaryColor: '#3b82f6', features: ['2fa'] },
]

// White-label Configuration
export const whitelabelConfig = (tenantId) => {
  const tenant = tenantsData.find(t => t.id === tenantId)
  if (!tenant) return null

  return {
    branding: {
      companyName: tenant.name,
      logo: tenant.logo,
      primaryColor: tenant.primaryColor,
      faviconUrl: `/favicon-${tenantId}.ico`
    },
    domain: tenant.domain,
    customPages: {
      loginBackground: `/bg-${tenantId}.jpg`,
      footerText: `Powered by ${tenant.name}`
    }
  }
}

// SSO Integration (OAuth2/SAML)
export const ssoIntegration = {
  async configureOAuth(tenantId, config) {
    const { clientId, clientSecret, discoveryUrl } = config
    console.log(`[SSO] OAuth configured for tenant ${tenantId}`)
    return { success: true, provider: 'oauth2' }
  },

  async configureSAML(tenantId, config) {
    const { metadataUrl, certificatePath } = config
    console.log(`[SSO] SAML configured for tenant ${tenantId}`)
    return { success: true, provider: 'saml2' }
  },

  async getUserFromSSO(tokenId) {
    // In production: Verify token with IdP
    return {
      id: 'user_sso_1',
      email: 'sso.user@example.com',
      name: 'SSO User',
      role: 'admin'
    }
  }
}

// 2FA (Two-Factor Authentication)
export const twoFactorAuth = {
  async generateSecret(userId) {
    const secret = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`otpauth://totp/ROOMCA:${userId}?secret=${secret}`)}`
    return { secret, qrCode }
  },

  async verifyCode(secret, code) {
    // In production: Use speakeasy or similar
    console.log(`[2FA] Verifying code for secret ${secret.substring(0, 5)}...`)
    // Simulate 30-second window verification
    return { valid: code.length === 6, remaining: 25 }
  },

  async enableForUser(userId, secret) {
    console.log(`[2FA] Enabled for user ${userId}`)
    return {
      enabled: true,
      backupCodes: [
        '123456',
        '234567',
        '345678',
        '456789',
        '567890'
      ]
    }
  },

  async disableForUser(userId) {
    console.log(`[2FA] Disabled for user ${userId}`)
    return { disabled: true }
  }
}

// Tenant Isolation
export const tenantIsolation = {
  checkAccess(userId, tenantId, resource) {
    // Verify user belongs to tenant
    console.log(`[Isolation] Checking access: user ${userId} to ${resource} in ${tenantId}`)
    return true // In production: Check database
  },

  getScopedData(userId, tenantId, dataType) {
    // Only return data scoped to tenant
    return {
      filtered: true,
      tenantId,
      dataType
    }
  }
}

// License Management
export const licenseManagement = {
  getTenantLimits(tenantId) {
    const tenant = tenantsData.find(t => t.id === tenantId)
    const limits = {
      free: { employees: 50, scenarios: 2, campaigns: 0 },
      pro: { employees: 500, scenarios: -1, campaigns: -1 },
      enterprise: { employees: -1, scenarios: -1, campaigns: -1 }
    }
    return limits[tenant?.plan] || limits.free
  },

  validateLicenseUsage(tenantId, resourceType, quantity) {
    const limits = this.getTenantLimits(tenantId)
    const limit = limits[resourceType]
    // -1 = unlimited
    if (limit === -1) return { valid: true }
    return { valid: true, remaining: limit - quantity }
  }
}
