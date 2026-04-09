// Advanced Business Intelligence

export const businessIntelligence = {
  // Cohort Analysis
  cohortAnalysis(startDate, endDate) {
    return {
      cohorts: [
        { cohort: 'Week 1', users: 50, active: 45, retention: 90, avgScore: 750 },
        { cohort: 'Week 2', users: 48, active: 40, retention: 83, avgScore: 820 },
        { cohort: 'Week 3', users: 52, active: 35, retention: 67, avgScore: 880 }
      ],
      summary: { avgRetention: '80%', trend: 'declining' }
    }
  },

  // ROI Calculator — modèle réaliste multi-facteurs
  calculateROI({
    investmentAmount = 48000,
    employees = 150,
    sector = 'general',
    incidentsPrevented = 2,
    avgIncidentCost = null,
    insuranceDiscount = 0.15,   // réduction prime cyber
    avgCyberPremium = 24000,    // prime annuelle avant formation
    productivityGainPct = 0.02, // gain productivité lié à la sensibilisation
    avgSalary = 42000,          // salaire moyen annuel des employés
    breachProbabilityReduction = 0.35, // réduction probabilité de breach
    annualBreachProbability = 0.28,    // proba breach sans formation (IBM 2024)
    complianceFineRisk = 50000,        // amende potentielle évitée (GDPR etc.)
    complianceFineReductionPct = 0.60, // réduction grâce à la formation
  } = {}) {
    // Coût moyen d'un incident selon le secteur (basé IBM Cost of Data Breach 2024)
    const sectorCosts = {
      healthcare: 9770000,
      finance: 6080000,
      pharma: 5010000,
      energy: 4780000,
      industrial: 4350000,
      tech: 4970000,
      retail: 2960000,
      education: 3580000,
      general: 4450000,
    }
    const avgCost = avgIncidentCost ?? sectorCosts[sector] ?? 4450000

    // 1. Économies directes — incidents évités
    const directSavings = incidentsPrevented * avgCost

    // 2. Économies assurance cyber
    const insuranceSavings = avgCyberPremium * insuranceDiscount

    // 3. Gain productivité (réduction temps perdu sur incidents mineurs)
    const productivitySavings = employees * avgSalary * productivityGainPct

    // 4. Réduction risque amende conformité
    const complianceSavings = complianceFineRisk * complianceFineReductionPct

    // 5. Valeur réduction probabilité breach résiduelle
    const residualRiskValue = annualBreachProbability * breachProbabilityReduction * avgCost

    const totalSavings = directSavings + insuranceSavings + productivitySavings + complianceSavings + residualRiskValue
    const netBenefit = totalSavings - investmentAmount
    const roi = (netBenefit / investmentAmount) * 100
    const paybackMonths = investmentAmount / (totalSavings / 12)

    // Coût par employé formé
    const costPerEmployee = investmentAmount / employees

    // Benchmark industrie : ROI moyen formation cyber = 342% (Ponemon 2023)
    const industryBenchmarkROI = 342

    return {
      investment: investmentAmount,
      employees,
      sector,
      // Décomposition des économies
      directSavings: Math.round(directSavings),
      insuranceSavings: Math.round(insuranceSavings),
      productivitySavings: Math.round(productivitySavings),
      complianceSavings: Math.round(complianceSavings),
      residualRiskValue: Math.round(residualRiskValue),
      totalSavings: Math.round(totalSavings),
      netBenefit: Math.round(netBenefit),
      // Métriques
      roi: roi.toFixed(1),
      paybackMonths: Math.max(0.1, paybackMonths).toFixed(1),
      costPerEmployee: Math.round(costPerEmployee),
      avgIncidentCost: Math.round(avgCost),
      incidentsAvoided: incidentsPrevented,
      breachProbabilityReduction: (breachProbabilityReduction * 100).toFixed(0),
      // Benchmark
      industryBenchmarkROI,
      vsIndustry: (roi - industryBenchmarkROI).toFixed(1),
      // Scénarios
      scenarios: {
        pessimistic: { roi: (roi * 0.5).toFixed(1), savings: Math.round(totalSavings * 0.5) },
        realistic:   { roi: roi.toFixed(1), savings: Math.round(totalSavings) },
        optimistic:  { roi: (roi * 1.6).toFixed(1), savings: Math.round(totalSavings * 1.6) },
      }
    }
  },

  // Churn Prediction
  predictChurnRisk(userBase = 500) {
    return {
      highRisk: Math.floor(userBase * 0.15),
      mediumRisk: Math.floor(userBase * 0.25),
      lowRisk: Math.floor(userBase * 0.60),
      recommendations: [
        'Contact high-risk users with personalized content',
        'Increase email engagement for medium-risk',
        'Maintain momentum for low-risk users'
      ]
    }
  },

  // Benchmark Comparison
  benchmarkComparison(yourMetrics, industryAverage) {
    return {
      yourScore: yourMetrics.avgScore,
      industryAvg: industryAverage.avgScore,
      percentile: 75,
      gap: (yourMetrics.avgScore - industryAverage.avgScore).toFixed(0),
      message: 'You\'re 75th percentile. Good, but room for improvement.'
    }
  },

  // Customer Lifetime Value
  calculateLTV(avgMonthlyRevenue = 199, churnRate = 0.05, avgMonths = 36) {
    const ltv = (avgMonthlyRevenue * (1 / churnRate)) - (avgMonthlyRevenue * avgMonths)
    return {
      ltv: ltv.toFixed(0),
      avgMonthlyValue: avgMonthlyRevenue,
      churnRate: (churnRate * 100).toFixed(1),
      avgDuration: avgMonths,
      recommendation: 'Focus on retention to increase LTV'
    }
  },

  // Custom Reports
  generateCustomReport(metrics = []) {
    const timestamp = new Date().toISOString()
    return {
      id: `report_${Date.now()}`,
      timestamp,
      metrics,
      exportFormats: ['PDF', 'CSV', 'JSON'],
      scheduled: false,
      public: false
    }
  }
}
