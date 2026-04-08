// AI/ML Recommendation Engine

export const aiRecommendations = {
  // Analyze user performance and recommend scenarios
  getRecommendations(userStats = {}) {
    const { failureRate = 0, lastScenario, completedCount = 0, avgTime = 0, accuracy = 0 } = userStats

    const recommendations = []

    // Difficulty recommendation
    if (failureRate > 70) {
      recommendations.push({
        type: 'difficulty',
        priority: 'high',
        title: '📉 Réduisez la difficulté',
        message: 'Vous échouez souvent. Essayez des scénarios faciles d\'abord.',
        suggestedScenarios: ['Password Reset', 'Survey Scam']
      })
    } else if (failureRate < 20 && completedCount > 3) {
      recommendations.push({
        type: 'difficulty',
        priority: 'medium',
        title: '📈 Augmentez la difficulté',
        message: 'Vous maîtrisez ces scénarios. Prêt pour un défi ?',
        suggestedScenarios: ['CEO Fraud', 'Banking Alert']
      })
    }

    // Speed optimization
    if (avgTime > 600) {
      recommendations.push({
        type: 'speed',
        priority: 'medium',
        title: '⚡ Améliorez votre vitesse',
        message: 'Vous prenez plus de temps. Pratiquez la décision rapide.',
        suggestedScenarios: ['Phishing Quick Decision']
      })
    }

    // Accuracy improvement
    if (accuracy < 70 && accuracy > 0) {
      recommendations.push({
        type: 'accuracy',
        priority: 'high',
        title: '🎯 Améliorez votre précision',
        message: 'Trop d\'erreurs. Recommencez les scénarios échoués.',
        suggestedScenarios: [lastScenario]
      })
    }

    // Streak bonus
    if (completedCount % 5 === 0 && completedCount > 0) {
      recommendations.push({
        type: 'milestone',
        priority: 'low',
        title: '🔥 Vous êtes en feu!',
        message: `Vous avez complété ${completedCount} scénarios. Continuez !`,
        suggestedScenarios: ['Advanced Challenge']
      })
    }

    return recommendations
  },

  // Predict vulnerability likelihood
  predictVulnerabilities(departmentStats = {}) {
    const { avgScore = 0, failureRate = 0, trainingCount = 0 } = departmentStats

    const vulnerabilities = [
      {
        type: 'Phishing',
        riskScore: Math.max(0, Math.min(100, 100 - avgScore)),
        trend: 'increasing',
        recommendations: 'Intensifier formation phishing'
      },
      {
        type: 'Weak Passwords',
        riskScore: Math.max(0, failureRate * 1.5),
        trend: 'stable',
        recommendations: 'Implémenter SSO & 2FA'
      },
      {
        type: 'Social Engineering',
        riskScore: 100 - (trainingCount * 5),
        trend: 'decreasing',
        recommendations: 'Continuer sensibilisation'
      }
    ]

    return vulnerabilities.sort((a, b) => b.riskScore - a.riskScore)
  },

  // Anomaly detection
  detectAnomalies(userBehavior = {}) {
    const { successRate, avgSessionTime, clickPattern, loginFrequency } = userBehavior

    const anomalies = []

    if (successRate > 95) {
      anomalies.push({
        type: 'suspiciousSuccess',
        severity: 'warning',
        message: 'Taux de réussite anormalement élevé. Possible triche détectée.'
      })
    }

    if (avgSessionTime < 30) {
      anomalies.push({
        type: 'tooFast',
        severity: 'info',
        message: 'Sessions très courtes. Vérifier compréhension réelle.'
      })
    }

    return anomalies
  },

  // Churn prediction
  predictChurn(userHistory = {}) {
    const { daysSinceLastActivity = 0, engagementScore = 0, streak = 0 } = userHistory

    if (daysSinceLastActivity > 30) {
      return {
        riskLevel: 'high',
        daysInactive: daysSinceLastActivity,
        message: 'Cet utilisateur a abandonné. Re-engagement urgent.',
        suggestedAction: 'Envoyer email personnalisé avec nouveau scénario'
      }
    }

    if (engagementScore < 30) {
      return {
        riskLevel: 'medium',
        message: 'Engagement faible. Risque de départ.',
        suggestedAction: 'Recommandations personnalisées'
      }
    }

    return { riskLevel: 'low', message: 'Utilisateur actif.' }
  }
}
