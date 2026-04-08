// WebSocket Service for Real-time Notifications

class NotificationService {
  constructor() {
    this.ws = null
    this.url = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000
    this.listeners = {}
    this.messageQueue = []
  }

  connect(url) {
    this.url = url || `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`

    try {
      // In production: Use real WebSocket
      // this.ws = new WebSocket(this.url)

      // For demo: Simulate WebSocket events
      console.log('[WebSocket] Connected to:', this.url)
      this._simulateConnection()
      return true
    } catch (error) {
      console.error('[WebSocket] Connection failed:', error)
      return false
    }
  }

  _simulateConnection() {
    // Simulate real-time events
    this._emitEvent('connected', { message: 'Connected to notification service' })

    // Simulate periodic notifications
    setInterval(() => {
      const events = [
        { type: 'campaign_update', data: { name: 'Phishing Campaign #1', clicked: Math.floor(Math.random() * 50) } },
        { type: 'user_achievement', data: { user: 'John Doe', badge: 'Perfect Score' } },
        { type: 'leaderboard_update', data: { rank: 1, user: 'Antoine Moreau', points: 5820 } }
      ]
      const randomEvent = events[Math.floor(Math.random() * events.length)]
      this._emitEvent(randomEvent.type, randomEvent.data)
    }, 15000)
  }

  on(eventType, callback) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = []
    }
    this.listeners[eventType].push(callback)
  }

  off(eventType, callback) {
    if (this.listeners[eventType]) {
      this.listeners[eventType] = this.listeners[eventType].filter(cb => cb !== callback)
    }
  }

  _emitEvent(eventType, data) {
    if (this.listeners[eventType]) {
      this.listeners[eventType].forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in listener for ${eventType}:`, error)
        }
      })
    }
  }

  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      this.messageQueue.push(message)
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN
  }
}

// Singleton instance
const notificationService = new NotificationService()

// Notification types
export const NOTIFICATIONS = {
  CAMPAIGN_STARTED: (data) => ({
    type: 'campaign_started',
    title: `Campaign Started: ${data.name}`,
    message: `"${data.name}" has been sent to ${data.recipients} employees`,
    icon: '🚀',
    timestamp: new Date()
  }),

  CAMPAIGN_CLICK: (data) => ({
    type: 'campaign_click',
    title: `Phishing Click Detected`,
    message: `${data.userName} clicked on "${data.campaignName}"`,
    icon: '🎣',
    severity: 'warning',
    timestamp: new Date()
  }),

  USER_ACHIEVED: (data) => ({
    type: 'user_achievement',
    title: `New Achievement!`,
    message: `${data.userName} earned badge: ${data.badge}`,
    icon: '🏆',
    timestamp: new Date()
  }),

  LEADERBOARD_CHANGE: (data) => ({
    type: 'leaderboard_change',
    title: `Leaderboard Update`,
    message: `${data.userName} moved to rank #${data.rank}`,
    icon: '📈',
    timestamp: new Date()
  }),

  CAMPAIGN_COMPLETED: (data) => ({
    type: 'campaign_completed',
    title: `Campaign Complete`,
    message: `"${data.campaignName}": ${data.clicked} clicks out of ${data.sent} sent (${data.rate}%)`,
    icon: '✅',
    timestamp: new Date()
  }),

  REPORT_READY: (data) => ({
    type: 'report_ready',
    title: `Report Ready`,
    message: `Your ${data.reportType} report is ready to download`,
    icon: '📊',
    timestamp: new Date()
  })
}

// Hook-like function for React components
export const useNotifications = () => {
  return {
    subscribe: (eventType, callback) => notificationService.on(eventType, callback),
    unsubscribe: (eventType, callback) => notificationService.off(eventType, callback),
    connect: () => notificationService.connect(),
    disconnect: () => notificationService.disconnect(),
    isConnected: () => notificationService.isConnected(),
    send: (message) => notificationService.send(message)
  }
}

export default notificationService
