// Webhook System Service
// Manages event subscriptions and dispatch

export const webhookEvents = {
  CAMPAIGN_CREATED: 'campaign.created',
  CAMPAIGN_COMPLETED: 'campaign.completed',
  USER_CLICKED: 'user.phishing_clicked',
  USER_REPORTED: 'user.phishing_reported',
  USER_TRAINED: 'user.training_completed',
  CERTIFICATION_PASSED: 'certification.passed',
  HIGH_RISK_DETECTED: 'risk.high_detected',
  COMPLIANCE_VIOLATION: 'compliance.violation',
  BREACH_DETECTED: 'breach.detected',
  REPORT_GENERATED: 'report.generated'
}

export const webhookService = {
  // Create webhook subscription
  createWebhook(url, events, secret) {
    return {
      id: `wh_${Date.now()}`,
      url,
      events,
      secret: secret || this.generateSecret(),
      active: true,
      created: new Date().toISOString(),
      lastDelivery: null,
      successRate: 100
    }
  },

  // List all webhooks
  listWebhooks() {
    return [
      { id: 'wh_1', url: 'https://hooks.slack.com/services/T00/B00/XXX', events: ['user.phishing_clicked', 'risk.high_detected'], active: true, successRate: 98 },
      { id: 'wh_2', url: 'https://acme.com/api/roomca-webhook', events: ['campaign.completed', 'report.generated'], active: true, successRate: 100 },
      { id: 'wh_3', url: 'https://zapier.com/hooks/catch/123/abc', events: ['certification.passed'], active: true, successRate: 95 }
    ]
  },

  // Test webhook delivery
  async testWebhook(webhookId, event) {
    return {
      success: true,
      statusCode: 200,
      latency: 142,
      response: 'OK'
    }
  },

  // Send webhook (mock)
  async dispatch(event, payload) {
    const signature = this.signPayload(payload)
    return {
      delivered: true,
      timestamp: new Date().toISOString(),
      event,
      signature
    }
  },

  signPayload(payload) {
    return `sha256=${btoa(JSON.stringify(payload)).slice(0, 32)}`
  },

  generateSecret() {
    return 'whsec_' + Array(32).fill(0).map(() => Math.random().toString(36)[2]).join('')
  },

  // Get delivery logs
  getDeliveryLogs(webhookId, limit = 50) {
    return Array(20).fill(0).map((_, i) => ({
      id: `del_${i}`,
      webhookId,
      event: Object.values(webhookEvents)[i % Object.values(webhookEvents).length],
      status: i % 10 === 0 ? 'failed' : 'success',
      statusCode: i % 10 === 0 ? 500 : 200,
      latency: Math.floor(Math.random() * 500) + 50,
      timestamp: new Date(Date.now() - i * 60000).toISOString()
    }))
  }
}
