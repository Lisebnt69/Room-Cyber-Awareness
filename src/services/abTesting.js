// A/B Testing Service for Campaigns

export const abTesting = {
  tests: [
    { id: 'test_1', campaignId: 'camp_1', name: 'Subject Line A/B', variantA: { subject: 'Urgent: Verify Your Account' }, variantB: { subject: 'Action Required Now' }, traffic: 50, startDate: '2026-04-01' }
  ],

  createTest(campaignId, name, variantA, variantB, traffic = 50) {
    const test = {
      id: `test_${Date.now()}`,
      campaignId,
      name,
      variantA,
      variantB,
      traffic,
      startDate: new Date().toISOString().split('T')[0],
      resultsA: { sent: 0, clicked: 0, reported: 0 },
      resultsB: { sent: 0, clicked: 0, reported: 0 },
      winner: null,
      confidence: 0
    }
    this.tests.push(test)
    return test
  },

  recordResult(testId, variant, event) {
    const test = this.tests.find(t => t.id === testId)
    if (!test) return null

    const results = variant === 'A' ? test.resultsA : test.resultsB
    results[event] = (results[event] || 0) + 1

    // Calculate winner
    const rateA = test.resultsA.sent > 0 ? (test.resultsA.clicked / test.resultsA.sent) : 0
    const rateB = test.resultsB.sent > 0 ? (test.resultsB.clicked / test.resultsB.sent) : 0

    if (test.resultsA.sent > 30 && test.resultsB.sent > 30) {
      const diff = Math.abs(rateA - rateB)
      test.confidence = Math.min(100, (diff * 100))
      test.winner = rateA > rateB ? 'A' : rateB > rateA ? 'B' : null
    }

    return test
  },

  getResults(testId) {
    const test = this.tests.find(t => t.id === testId)
    if (!test) return null

    const rateA = test.resultsA.sent > 0 ? ((test.resultsA.clicked / test.resultsA.sent) * 100).toFixed(1) : 0
    const rateB = test.resultsB.sent > 0 ? ((test.resultsB.clicked / test.resultsB.sent) * 100).toFixed(1) : 0

    return {
      test,
      variantA: { ...test.variantA, clickRate: rateA, results: test.resultsA },
      variantB: { ...test.variantB, clickRate: rateB, results: test.resultsB },
      winner: test.winner,
      confidence: test.confidence,
      recommendation: test.confidence > 95 ? `Use Variant ${test.winner}` : 'Need more data'
    }
  }
}
