// Custom Scenario Builder

export const scenarioBuilder = {
  templates: [
    { id: 'tmpl_phishing', name: 'Phishing Email', fields: ['sender', 'subject', 'body', 'link_url', 'urgency_level'] },
    { id: 'tmpl_phone', name: 'Phone Social Engineering', fields: ['caller_name', 'company', 'request_type', 'urgency_level'] },
    { id: 'tmpl_usb', name: 'USB Drop', fields: ['file_type', 'filename', 'location', 'temptation_level'] }
  ],

  customScenarios: [],

  createScenario(template, values) {
    const scenario = {
      id: `scenario_${Date.now()}`,
      templateId: template.id,
      name: values.name || 'Custom Scenario',
      description: values.description || '',
      values,
      createdAt: new Date().toISOString(),
      difficulty: values.difficulty || 'medium',
      estimatedTime: values.estimatedTime || 900,
      published: false,
      usageCount: 0
    }
    this.customScenarios.push(scenario)
    return scenario
  },

  publishScenario(scenarioId) {
    const scenario = this.customScenarios.find(s => s.id === scenarioId)
    if (scenario) scenario.published = true
    return scenario
  },

  previewScenario(scenarioId) {
    const scenario = this.customScenarios.find(s => s.id === scenarioId)
    if (!scenario) return null
    return { ...scenario, preview: true, readonly: true }
  },

  getTemplateFields(templateId) {
    const template = this.templates.find(t => t.id === templateId)
    return template ? template.fields : []
  }
}
