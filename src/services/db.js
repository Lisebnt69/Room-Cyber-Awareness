// ROOMCA localStorage database service
// Provides CRUD operations with automatic serialization

const PREFIX = 'roomca_db_'

export const db = {
  // --- Core ops ---
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key)
      return raw ? JSON.parse(raw) : fallback
    } catch { return fallback }
  },

  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
      return true
    } catch { return false }
  },

  delete(key) {
    localStorage.removeItem(PREFIX + key)
  },

  // --- Collections (arrays) ---
  getAll(collection) {
    return this.get(collection, [])
  },

  push(collection, item) {
    const items = this.getAll(collection)
    const newItem = { ...item, id: item.id || `${collection}_${Date.now()}_${Math.random().toString(36).slice(2,7)}`, createdAt: item.createdAt || new Date().toISOString() }
    items.push(newItem)
    this.set(collection, items)
    return newItem
  },

  update(collection, id, updates) {
    const items = this.getAll(collection)
    const idx = items.findIndex(i => i.id === id)
    if (idx === -1) return null
    items[idx] = { ...items[idx], ...updates, updatedAt: new Date().toISOString() }
    this.set(collection, items)
    return items[idx]
  },

  remove(collection, id) {
    const items = this.getAll(collection)
    this.set(collection, items.filter(i => i.id !== id))
  },

  findBy(collection, field, value) {
    return this.getAll(collection).filter(i => i[field] === value)
  },

  findOne(collection, field, value) {
    return this.getAll(collection).find(i => i[field] === value) || null
  },

  // --- User-specific data ---
  getUserData(userId, key, fallback = null) {
    return this.get(`user_${userId}_${key}`, fallback)
  },

  setUserData(userId, key, value) {
    return this.set(`user_${userId}_${key}`, value)
  },

  // --- Scenario progress ---
  saveScenarioResult(userId, result) {
    return this.push('scenario_results', {
      ...result,
      userId,
      completedAt: new Date().toISOString()
    })
  },

  getUserResults(userId) {
    return this.findBy('scenario_results', 'userId', userId)
  },

  getUserStats(userId) {
    const results = this.getUserResults(userId)
    if (!results.length) return { totalScore: 0, scenariosCompleted: 0, avgScore: 0, bestScore: 0, streak: 0 }
    const scores = results.map(r => r.score)
    return {
      totalScore: scores.reduce((a, b) => a + b, 0),
      scenariosCompleted: results.length,
      avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      bestScore: Math.max(...scores),
      streak: this.getUserStreak(userId),
      lastActivity: results[results.length - 1]?.completedAt
    }
  },

  getUserStreak(userId) {
    const results = this.getUserResults(userId)
    if (!results.length) return 0
    const sorted = [...results].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    const lastDate = new Date(sorted[0].completedAt).toDateString()
    if (lastDate !== today && lastDate !== yesterday) return 0
    let streak = 1
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1].completedAt)
      const curr = new Date(sorted[i].completedAt)
      const diff = Math.round((prev - curr) / 86400000)
      if (diff === 1) streak++
      else break
    }
    return streak
  },

  // --- Badges ---
  awardBadge(userId, badge) {
    const badges = this.getUserData(userId, 'badges', [])
    if (badges.some(b => b.id === badge.id)) return false
    badges.push({ ...badge, awardedAt: new Date().toISOString() })
    this.setUserData(userId, 'badges', badges)
    return true
  },

  getUserBadges(userId) {
    return this.getUserData(userId, 'badges', [])
  },

  // --- Notifications ---
  addNotification(userId, notification) {
    return this.push(`notifications_${userId}`, { ...notification, read: false })
  },

  getNotifications(userId) {
    return this.getAll(`notifications_${userId}`)
  },

  markNotificationRead(userId, notifId) {
    return this.update(`notifications_${userId}`, notifId, { read: true })
  },

  // --- Seed demo data ---
  seedIfEmpty() {
    if (this.get('seeded')) return
    // Seed some scenario results for demo
    const users = [1, 2, 3]
    const scenarios = ['scenario_1', 'scenario_2', 'scenario_3']
    users.forEach(uid => {
      scenarios.forEach(sid => {
        this.saveScenarioResult(uid, {
          scenarioId: sid,
          score: Math.floor(Math.random() * 600) + 400,
          passed: true,
          duration: Math.floor(Math.random() * 600) + 120
        })
      })
    })
    this.set('seeded', true)
  }
}
