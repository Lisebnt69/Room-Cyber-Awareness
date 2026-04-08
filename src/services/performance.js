// Performance Optimization - Caching & CDN

export const caching = {
  cache: new Map(),

  set(key, value, ttl = 3600) {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + (ttl * 1000)
    })
    return true
  },

  get(key) {
    const item = this.cache.get(key)
    if (!item) return null
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key)
      return null
    }
    return item.value
  },

  invalidate(pattern) {
    // Invalidate all keys matching pattern
    for (const [key] of this.cache) {
      if (key.includes(pattern)) this.cache.delete(key)
    }
  }
}

// CDN Configuration
export const cdnConfig = {
  provider: 'Cloudflare',
  regions: ['us', 'eu', 'asia'],
  caching: {
    images: { ttl: 86400, compress: true }, // 24h
    scripts: { ttl: 3600, compress: true }, // 1h
    static: { ttl: 604800 } // 1 week
  },
  minification: {
    css: true,
    js: true,
    html: true
  }
}

// Performance metrics
export const metrics = {
  track(event) {
    console.log(`[PERF] ${event.action}: ${event.duration}ms`)
    return {
      timestamp: new Date().toISOString(),
      ...event
    }
  }
}
