// Security Hardening Features

// API Keys & Rate Limiting
export const securityFeatures = {
  // API Keys
  apiKeys: [],

  generateAPIKey(name) {
    const key = {
      id: `key_${Date.now()}`,
      name,
      key: `sk_live_${Math.random().toString(36).substring(2, 50)}`,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      active: true
    }
    this.apiKeys.push(key)
    return key
  },

  revokeAPIKey(keyId) {
    const key = this.apiKeys.find(k => k.id === keyId)
    if (key) key.active = false
    return key
  },

  // Rate Limiting
  rateLimits: {
    default: { requests: 1000, window: 3600 }, // 1000 req/hour
    endpoints: {
      '/api/campaigns': { requests: 100, window: 3600 },
      '/api/users': { requests: 500, window: 3600 },
      '/api/admin': { requests: 50, window: 60 } // Stricter for admin
    }
  },

  checkRateLimit(ip, endpoint) {
    const limit = this.rateLimits.endpoints[endpoint] || this.rateLimits.default
    // In production: check Redis/Memcached
    return { allowed: true, remaining: limit.requests - 1 }
  },

  // Encryption & HTTPS
  tlsConfig: {
    minVersion: 'TLSv1.3',
    ciphers: ['TLS_AES_256_GCM_SHA384', 'TLS_CHACHA20_POLY1305_SHA256'],
    hsts: true,
    hstsMaxAge: 31536000 // 1 year
  },

  // CORS
  corsConfig: {
    allowedOrigins: ['https://roomca.io', 'https://app.roomca.io'],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowCredentials: true
  }
}
