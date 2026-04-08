// Integration Services (Slack, Teams, Email, SCIM)

export const INTEGRATIONS = {
  SLACK: {
    id: 'slack',
    name: 'Slack',
    icon: '💬',
    description: 'Send notifications and reports to Slack channels',
    scope: ['chat:write', 'team:read'],
    features: [
      'Real-time alerts',
      'Daily/Weekly reports',
      'Campaign results',
      'Leaderboard updates'
    ]
  },
  TEAMS: {
    id: 'teams',
    name: 'Microsoft Teams',
    icon: '👥',
    description: 'Integrate with Microsoft Teams webhooks',
    scope: ['team:manage'],
    features: [
      'Channel notifications',
      'Adaptive cards',
      'Scheduled reports',
      'Campaign tracking'
    ]
  },
  EMAIL: {
    id: 'email',
    name: 'Email',
    icon: '📧',
    description: 'Configure email notifications',
    scope: ['mail:send'],
    features: [
      'Daily digests',
      'Campaign results',
      'Monthly reports',
      'Alert notifications'
    ]
  },
  SCIM: {
    id: 'scim',
    name: 'SCIM (Identity)',
    icon: '👤',
    description: 'Synchronize users from your identity provider',
    scope: ['identity:read', 'identity:write'],
    features: [
      'Auto-sync from AD/Okta',
      'User provisioning',
      'Group management',
      'License assignment'
    ]
  }
}

// Slack Integration
export const slackIntegration = {
  async connect(webhookUrl) {
    try {
      // Validate webhook URL format
      if (!webhookUrl.includes('hooks.slack.com')) {
        throw new Error('Invalid Slack webhook URL')
      }
      console.log('Slack webhook configured:', webhookUrl.substring(0, 50) + '...')
      return { success: true, integration: 'slack' }
    } catch (error) {
      return { error: error.message }
    }
  },

  async sendMessage(message, channel = '#security') {
    try {
      // In production: POST to webhook URL
      console.log(`[Slack] ${channel}: ${message}`)
      return { success: true }
    } catch (error) {
      return { error: error.message }
    }
  },

  async sendReport(data, channel) {
    const message = `📊 Security Report\n\nCampaigns: ${data.campaigns}\nClicks: ${data.clicks}\nReported: ${data.reported}`
    return this.sendMessage(message, channel)
  }
}

// Microsoft Teams Integration
export const teamsIntegration = {
  async connect(webhookUrl) {
    try {
      if (!webhookUrl.includes('webhook.office.com')) {
        throw new Error('Invalid Teams webhook URL')
      }
      console.log('Teams webhook configured:', webhookUrl.substring(0, 50) + '...')
      return { success: true, integration: 'teams' }
    } catch (error) {
      return { error: error.message }
    }
  },

  async sendCard(title, content) {
    try {
      // Adaptive Card format
      const card = {
        type: 'message',
        attachments: [{
          contentType: 'application/vnd.microsoft.card.adaptive',
          contentUrl: null,
          content: {
            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
            type: 'AdaptiveCard',
            version: '1.4',
            body: [
              { type: 'TextBlock', text: title, weight: 'bolder', size: 'large' },
              { type: 'TextBlock', text: content, wrap: true }
            ]
          }
        }]
      }
      console.log('[Teams] Card sent:', title)
      return { success: true }
    } catch (error) {
      return { error: error.message }
    }
  }
}

// Email Integration
export const emailIntegration = {
  async configureSmtp(config) {
    try {
      const { host, port, user, password } = config
      if (!host || !port || !user) {
        throw new Error('Missing SMTP configuration')
      }
      console.log('SMTP configured for:', user)
      return { success: true }
    } catch (error) {
      return { error: error.message }
    }
  },

  async sendEmail(to, subject, html) {
    try {
      // In production: Use nodemailer or similar
      console.log(`[Email] To: ${to}\nSubject: ${subject}`)
      return { success: true, messageId: `msg_${Date.now()}` }
    } catch (error) {
      return { error: error.message }
    }
  },

  async sendBulkReport(recipients, reportData) {
    const promises = recipients.map(email =>
      this.sendEmail(
        email,
        '📊 Monthly Security Report',
        `<h1>Security Report</h1><p>Campaigns: ${reportData.campaigns}</p>`
      )
    )
    return Promise.all(promises)
  }
}

// SCIM Integration (Identity)
export const scimIntegration = {
  async connect(baseUrl, bearerToken) {
    try {
      if (!baseUrl || !bearerToken) {
        throw new Error('Missing SCIM configuration')
      }
      console.log('SCIM connected to:', baseUrl)
      return { success: true }
    } catch (error) {
      return { error: error.message }
    }
  },

  async syncUsers() {
    try {
      // In production: Call SCIM API
      const users = [
        { id: 'user1', name: 'John Doe', email: 'john@example.com', department: 'IT' },
        { id: 'user2', name: 'Jane Smith', email: 'jane@example.com', department: 'Finance' }
      ]
      console.log(`[SCIM] Synced ${users.length} users`)
      return { success: true, synced: users.length }
    } catch (error) {
      return { error: error.message }
    }
  },

  async createUser(userData) {
    try {
      console.log('[SCIM] Creating user:', userData.email)
      return { success: true, userId: `user_${Date.now()}` }
    } catch (error) {
      return { error: error.message }
    }
  },

  async updateUserGroup(userId, groups) {
    try {
      console.log(`[SCIM] Updating groups for ${userId}:`, groups)
      return { success: true }
    } catch (error) {
      return { error: error.message }
    }
  }
}

// Notification Types
export const NOTIFICATION_TYPES = {
  CAMPAIGN_STARTED: 'campaign_started',
  CAMPAIGN_COMPLETED: 'campaign_completed',
  USER_CLICKED: 'user_clicked',
  NEW_BADGE: 'new_badge',
  LEADERBOARD_CHANGE: 'leaderboard_change',
  REPORT_READY: 'report_ready'
}

// Send notification to all configured integrations
export const broadcastNotification = async (notification, enabledIntegrations) => {
  const results = {}

  if (enabledIntegrations.includes('slack')) {
    results.slack = await slackIntegration.sendMessage(notification.message, notification.channel)
  }

  if (enabledIntegrations.includes('teams')) {
    results.teams = await teamsIntegration.sendCard(notification.title, notification.message)
  }

  if (enabledIntegrations.includes('email') && notification.recipients) {
    results.email = await emailIntegration.sendBulkReport(notification.recipients, notification.data)
  }

  return results
}
