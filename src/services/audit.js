// Audit & Compliance Service (Logging, GDPR, Exports)

export const auditLog = {
  logs: [],

  log(event) {
    const entry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: event.action,
      actor: event.actor,
      resource: event.resource,
      changes: event.changes,
      ipAddress: event.ipAddress || '127.0.0.1',
      status: event.status || 'success'
    }
    this.logs.push(entry)
    console.log('[AUDIT]', entry)
    return entry
  },

  query(filters) {
    let filtered = [...this.logs]

    if (filters.action) {
      filtered = filtered.filter(l => l.action === filters.action)
    }
    if (filters.actor) {
      filtered = filtered.filter(l => l.actor === filters.actor)
    }
    if (filters.resource) {
      filtered = filtered.filter(l => l.resource === filters.resource)
    }
    if (filters.startDate) {
      filtered = filtered.filter(l => new Date(l.timestamp) >= new Date(filters.startDate))
    }
    if (filters.endDate) {
      filtered = filtered.filter(l => new Date(l.timestamp) <= new Date(filters.endDate))
    }

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  },

  export(filters, format = 'json') {
    const data = this.query(filters)

    if (format === 'csv') {
      const headers = ['Timestamp', 'Action', 'Actor', 'Resource', 'Status', 'IP Address']
      const rows = data.map(l => [
        l.timestamp,
        l.action,
        l.actor,
        l.resource,
        l.status,
        l.ipAddress
      ])
      return this._convertToCsv(headers, rows)
    }

    return JSON.stringify(data, null, 2)
  },

  _convertToCsv(headers, rows) {
    const csv = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n')
    return csv
  }
}

// GDPR Compliance
export const gdprCompliance = {
  async exportUserData(userId) {
    const userData = {
      profile: { id: userId, email: 'user@example.com', name: 'User Name' },
      scenarios: [{ title: 'Inbox Zero', completedAt: '2026-04-01' }],
      points: 1250,
      badges: ['first', 'perfect'],
      auditLog: auditLog.query({ actor: userId })
    }
    return userData
  },

  async deleteUserData(userId) {
    // Implement right to be forgotten
    console.log(`[GDPR] Deleting all data for user ${userId}`)
    // In production: Cascade delete from all tables
    return { deleted: true, userId, timestamp: new Date().toISOString() }
  },

  async anonymizeUserData(userId) {
    console.log(`[GDPR] Anonymizing user ${userId}`)
    // Replace personal data with generic identifiers
    return { anonymized: true, userId: `anon_${Date.now()}` }
  }
}

// Data Export
export const dataExport = {
  async generateReport(tenantId, reportType) {
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `${reportType}_${tenantId}_${timestamp}.pdf`

    const report = {
      filename,
      generatedAt: new Date().toISOString(),
      type: reportType,
      status: 'ready',
      downloadUrl: `/downloads/${filename}`
    }

    console.log(`[Export] Generated ${reportType} report for tenant ${tenantId}`)
    return report
  },

  async exportScenarios(tenantId) {
    const data = {
      tenantId,
      scenarios: [
        { id: 's1', title: 'Inbox Zero', category: 'Phishing' },
        { id: 's2', title: 'Compromised Desktop', category: 'Ransomware' }
      ],
      exportDate: new Date().toISOString()
    }
    return this._saveAsJson(data, `scenarios_${tenantId}`)
  },

  async exportUsers(tenantId) {
    const data = {
      tenantId,
      users: [
        { id: 1, name: 'User 1', email: 'user1@example.com', role: 'player' },
        { id: 2, name: 'User 2', email: 'user2@example.com', role: 'admin' }
      ],
      exportDate: new Date().toISOString()
    }
    return this._saveAsJson(data, `users_${tenantId}`)
  },

  async exportAuditLog(tenantId) {
    const logs = auditLog.query({ resource: `tenant:${tenantId}` })
    return this._saveAsJson(logs, `audit_${tenantId}`)
  },

  _saveAsJson(data, filename) {
    const json = JSON.stringify(data, null, 2)
    console.log(`[Export] Saved ${filename}.json`)
    return { filename: `${filename}.json`, size: json.length, status: 'ready' }
  }
}

// Compliance Checklist
export const complianceChecklist = {
  items: [
    { id: 1, name: 'GDPR Compliance', status: 'completed', dueDate: '2026-04-15' },
    { id: 2, name: 'SSO Configuration', status: 'in_progress', dueDate: '2026-04-30' },
    { id: 3, name: 'Audit Logging', status: 'completed', dueDate: '2026-03-15' },
    { id: 4, name: '2FA Enforcement', status: 'pending', dueDate: '2026-05-15' },
    { id: 5, name: 'Data Encryption', status: 'completed', dueDate: '2026-02-15' },
    { id: 6, name: 'DLP Configuration', status: 'pending', dueDate: '2026-06-01' }
  ],

  getStatus() {
    const total = this.items.length
    const completed = this.items.filter(i => i.status === 'completed').length
    const inProgress = this.items.filter(i => i.status === 'in_progress').length
    return {
      total,
      completed,
      inProgress,
      pending: total - completed - inProgress,
      percentage: Math.round((completed / total) * 100)
    }
  }
}

// Log common actions
export const logAction = (action, actor, resource, changes) => {
  auditLog.log({ action, actor, resource, changes })
}
