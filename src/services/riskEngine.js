// Risk Engine — Behavioral Risk Scoring Algorithm
// Scores employee, department, and organization cyber-risk levels
// based on scenario performance, phishing detection, training recency, and incident history.

/**
 * Tunable weight configuration for each risk factor.
 * All weights must sum to 1.0.
 * @type {Object.<string, number>}
 */
export const RISK_WEIGHTS = {
  scenarioScore: 0.30,
  reactionTime: 0.15,
  phishingDetection: 0.25,
  trainingRecency: 0.15,
  incidentHistory: 0.10,
  completionRate: 0.05
};

/**
 * Risk level thresholds mapping a label to an inclusive [min, max] score range.
 * @type {Object.<string, [number, number]>}
 */
export const RISK_THRESHOLDS = {
  low: [80, 100],
  medium: [60, 79],
  high: [30, 59],
  critical: [0, 29]
};

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Clamp a value between 0 and 100.
 * @param {number} value
 * @returns {number}
 */
function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

/**
 * Derive a risk level label from a numeric score using RISK_THRESHOLDS.
 * @param {number} score — 0-100
 * @returns {'low'|'medium'|'high'|'critical'}
 */
function getRiskLevel(score) {
  const rounded = Math.round(score);
  for (const [level, [min, max]] of Object.entries(RISK_THRESHOLDS)) {
    if (rounded >= min && rounded <= max) {
      return level;
    }
  }
  // Fallback: if score exceeds all ranges, pick closest
  return rounded >= 80 ? 'low' : 'critical';
}

/**
 * Compute the weighted average score of completed scenarios.
 * @param {Array<{score: number, passed: boolean}>} results
 * @returns {number} 0-100
 */
function computeScenarioScore(results) {
  if (!results || results.length === 0) return 0;
  const total = results.reduce((sum, r) => sum + (r.score ?? 0), 0);
  return clamp(total / results.length);
}

/**
 * Score reaction time across phishing attempts.
 * Faster reactions (below an ideal threshold) score higher.
 * A reaction under 5 s is perfect (100). Over 60 s scores 0.
 * @param {Array<{reactionTimeMs: number}>} attempts
 * @returns {number} 0-100
 */
function computeReactionTimeScore(attempts) {
  if (!attempts || attempts.length === 0) return 50; // neutral when no data

  const IDEAL_MS = 5000;   // 5 seconds — perfect score
  const WORST_MS = 60000;  // 60 seconds — zero score

  const scores = attempts.map((a) => {
    const t = a.reactionTimeMs ?? WORST_MS;
    if (t <= IDEAL_MS) return 100;
    if (t >= WORST_MS) return 0;
    return clamp(100 - ((t - IDEAL_MS) / (WORST_MS - IDEAL_MS)) * 100);
  });

  return scores.reduce((s, v) => s + v, 0) / scores.length;
}

/**
 * Score phishing detection ability.
 * Correctly detected +10, reported to IT bonus +5, clicked link –15.
 * Normalized to 0-100.
 * @param {Array<{detected: boolean, clickedLink: boolean, reportedToIT: boolean}>} attempts
 * @returns {number} 0-100
 */
function computePhishingScore(attempts) {
  if (!attempts || attempts.length === 0) return 50; // neutral

  let points = 0;
  const maxPerAttempt = 15; // detected (10) + reportedToIT (5)

  for (const a of attempts) {
    if (a.detected) points += 10;
    if (a.reportedToIT) points += 5;
    if (a.clickedLink) points -= 15;
  }

  const maxPoints = attempts.length * maxPerAttempt;
  // Shift so that zero raw points maps to ~33 rather than 0 — avoids overly harsh scoring
  const normalized = ((points + attempts.length * 15) / (maxPoints + attempts.length * 15)) * 100;
  return clamp(normalized);
}

/**
 * Score training recency.  100 if trained today, decays with a 90-day half-life.
 * @param {string|null} lastTrainingDate — ISO date string
 * @returns {number} 0-100
 */
function computeRecencyScore(lastTrainingDate) {
  if (!lastTrainingDate) return 0;

  const daysSince = (Date.now() - new Date(lastTrainingDate).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince <= 0) return 100;

  // Exponential decay: half-life of 90 days
  const HALF_LIFE_DAYS = 90;
  const score = 100 * Math.pow(0.5, daysSince / HALF_LIFE_DAYS);
  return clamp(score);
}

/**
 * Score based on historical incident count.
 * 0 incidents → 100.  Each incident subtracts 20 points, floor at 0.
 * @param {number} incidentCount
 * @returns {number} 0-100
 */
function computeIncidentScore(incidentCount) {
  if (typeof incidentCount !== 'number' || incidentCount <= 0) return 100;
  return clamp(100 - incidentCount * 20);
}

/**
 * Score scenario completion rate.
 * @param {number} completed
 * @param {number} assigned
 * @returns {number} 0-100
 */
function computeCompletionScore(completed, assigned) {
  if (!assigned || assigned <= 0) return 100; // nothing assigned, no penalty
  return clamp((completed / assigned) * 100);
}

/**
 * Determine trend by comparing current score to the most recent previous score.
 * @param {number} currentScore
 * @param {number|null} previousScore
 * @returns {'improving'|'stable'|'declining'}
 */
function determineTrend(currentScore, previousScore) {
  if (previousScore == null) return 'stable';
  const delta = currentScore - previousScore;
  if (delta > 3) return 'improving';
  if (delta < -3) return 'declining';
  return 'stable';
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Calculate the behavioral risk score for a single employee.
 *
 * @param {Object} employeeData
 * @param {Array<{scenarioId: string, score: number, completionTimeMs: number, maxTimeMs: number, passed: boolean}>} employeeData.scenarioResults
 * @param {Array<{id: string, detected: boolean, clickedLink: boolean, reportedToIT: boolean, reactionTimeMs: number}>} employeeData.phishingAttempts
 * @param {string|null} employeeData.lastTrainingDate — ISO 8601 string
 * @param {number} employeeData.incidentCount
 * @param {number} employeeData.assignedScenarios
 * @param {number} employeeData.completedScenarios
 * @param {number} [employeeData.previousScore] — optional, for trend calculation
 * @returns {{
 *   overallScore: number,
 *   riskLevel: 'low'|'medium'|'high'|'critical',
 *   breakdown: {scenarioScore: number, reactionTimeScore: number, phishingScore: number, recencyScore: number, incidentScore: number, completionScore: number},
 *   trend: 'improving'|'stable'|'declining',
 *   recommendations: string[]
 * }}
 */
export function calculateEmployeeRiskScore(employeeData) {
  const {
    scenarioResults = [],
    phishingAttempts = [],
    lastTrainingDate = null,
    incidentCount = 0,
    assignedScenarios = 0,
    completedScenarios = 0,
    previousScore = null
  } = employeeData ?? {};

  const scenarioScore = computeScenarioScore(scenarioResults);
  const reactionTimeScore = computeReactionTimeScore(phishingAttempts);
  const phishingScore = computePhishingScore(phishingAttempts);
  const recencyScore = computeRecencyScore(lastTrainingDate);
  const incidentScore = computeIncidentScore(incidentCount);
  const completionScore = computeCompletionScore(completedScenarios, assignedScenarios);

  const breakdown = {
    scenarioScore: Math.round(scenarioScore * 100) / 100,
    reactionTimeScore: Math.round(reactionTimeScore * 100) / 100,
    phishingScore: Math.round(phishingScore * 100) / 100,
    recencyScore: Math.round(recencyScore * 100) / 100,
    incidentScore: Math.round(incidentScore * 100) / 100,
    completionScore: Math.round(completionScore * 100) / 100
  };

  const overallScore = clamp(
    breakdown.scenarioScore * RISK_WEIGHTS.scenarioScore +
    breakdown.reactionTimeScore * RISK_WEIGHTS.reactionTime +
    breakdown.phishingScore * RISK_WEIGHTS.phishingDetection +
    breakdown.recencyScore * RISK_WEIGHTS.trainingRecency +
    breakdown.incidentScore * RISK_WEIGHTS.incidentHistory +
    breakdown.completionScore * RISK_WEIGHTS.completionRate
  );

  const roundedOverall = Math.round(overallScore * 100) / 100;
  const riskLevel = getRiskLevel(roundedOverall);
  const trend = determineTrend(roundedOverall, previousScore);

  const riskProfile = { breakdown, overallScore: roundedOverall, riskLevel };
  const recommendations = getRecommendations(riskProfile);

  return {
    overallScore: roundedOverall,
    riskLevel,
    breakdown,
    trend,
    recommendations
  };
}

/**
 * Aggregate individual employee risk scores into a department-level assessment.
 *
 * @param {Array<Object>} employees — array of employeeData objects (same shape as calculateEmployeeRiskScore input)
 * @returns {{
 *   avgScore: number,
 *   minScore: number,
 *   maxScore: number,
 *   riskDistribution: {low: number, medium: number, high: number, critical: number},
 *   weakestAreas: string[],
 *   departmentRiskLevel: 'low'|'medium'|'high'|'critical'
 * }}
 */
export function calculateDepartmentRiskScore(employees) {
  if (!employees || employees.length === 0) {
    return {
      avgScore: 0,
      minScore: 0,
      maxScore: 0,
      riskDistribution: { low: 0, medium: 0, high: 0, critical: 0 },
      weakestAreas: [],
      departmentRiskLevel: 'critical'
    };
  }

  const results = employees.map((e) => calculateEmployeeRiskScore(e));

  const scores = results.map((r) => r.overallScore);
  const avgScore = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100;
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);

  const riskDistribution = { low: 0, medium: 0, high: 0, critical: 0 };
  for (const r of results) {
    riskDistribution[r.riskLevel]++;
  }

  // Identify the three weakest areas across all employees
  const areaKeys = [
    'scenarioScore',
    'reactionTimeScore',
    'phishingScore',
    'recencyScore',
    'incidentScore',
    'completionScore'
  ];

  const areaAverages = {};
  for (const key of areaKeys) {
    const sum = results.reduce((s, r) => s + r.breakdown[key], 0);
    areaAverages[key] = sum / results.length;
  }

  const weakestAreas = Object.entries(areaAverages)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map(([key]) => key);

  const departmentRiskLevel = getRiskLevel(avgScore);

  return {
    avgScore,
    minScore,
    maxScore,
    riskDistribution,
    weakestAreas,
    departmentRiskLevel
  };
}

/**
 * Top-level organization risk aggregation for the RSSI / CISO dashboard.
 *
 * @param {Array<{name: string, employees: Array<Object>}>} departments
 *   Each department has a name and an array of employeeData objects.
 * @returns {{
 *   organizationScore: number,
 *   organizationRiskLevel: 'low'|'medium'|'high'|'critical',
 *   departmentSummaries: Array<{name: string, avgScore: number, riskLevel: string, weakestAreas: string[]}>,
 *   riskDistribution: {low: number, medium: number, high: number, critical: number},
 *   globalWeakestAreas: string[],
 *   totalEmployees: number
 * }}
 */
export function calculateOrganizationRiskScore(departments) {
  if (!departments || departments.length === 0) {
    return {
      organizationScore: 0,
      organizationRiskLevel: 'critical',
      departmentSummaries: [],
      riskDistribution: { low: 0, medium: 0, high: 0, critical: 0 },
      globalWeakestAreas: [],
      totalEmployees: 0
    };
  }

  const departmentSummaries = [];
  const allScores = [];
  const globalRiskDist = { low: 0, medium: 0, high: 0, critical: 0 };
  const areaTotals = {};
  let totalEmployees = 0;

  for (const dept of departments) {
    const deptResult = calculateDepartmentRiskScore(dept.employees ?? []);
    departmentSummaries.push({
      name: dept.name,
      avgScore: deptResult.avgScore,
      riskLevel: deptResult.departmentRiskLevel,
      weakestAreas: deptResult.weakestAreas
    });

    allScores.push(deptResult.avgScore);
    totalEmployees += (dept.employees ?? []).length;

    for (const [level, count] of Object.entries(deptResult.riskDistribution)) {
      globalRiskDist[level] += count;
    }

    // Accumulate per-area averages across departments
    const deptEmployeeResults = (dept.employees ?? []).map((e) => calculateEmployeeRiskScore(e));
    for (const r of deptEmployeeResults) {
      for (const [key, val] of Object.entries(r.breakdown)) {
        areaTotals[key] = (areaTotals[key] ?? 0) + val;
      }
    }
  }

  const organizationScore =
    allScores.length > 0
      ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 100) / 100
      : 0;

  // Global weakest areas
  const globalWeakestAreas = totalEmployees > 0
    ? Object.entries(areaTotals)
        .map(([key, sum]) => [key, sum / totalEmployees])
        .sort((a, b) => a[1] - b[1])
        .slice(0, 3)
        .map(([key]) => key)
    : [];

  return {
    organizationScore,
    organizationRiskLevel: getRiskLevel(organizationScore),
    departmentSummaries,
    riskDistribution: globalRiskDist,
    globalWeakestAreas,
    totalEmployees
  };
}

/**
 * Analyze a historical series of scores and return trend metadata.
 *
 * @param {Array<{date: string, score: number}>} historicalScores — chronologically ordered
 * @returns {{
 *   direction: 'improving'|'stable'|'declining',
 *   velocity: number,
 *   averageScore: number,
 *   minScore: number,
 *   maxScore: number,
 *   dataPoints: number,
 *   forecast: {next30Days: number, next90Days: number}
 * }}
 */
export function generateRiskTrend(historicalScores) {
  if (!historicalScores || historicalScores.length === 0) {
    return {
      direction: 'stable',
      velocity: 0,
      averageScore: 0,
      minScore: 0,
      maxScore: 0,
      dataPoints: 0,
      forecast: { next30Days: 0, next90Days: 0 }
    };
  }

  const sorted = [...historicalScores].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const scores = sorted.map((s) => s.score);
  const n = scores.length;
  const averageScore = Math.round((scores.reduce((a, b) => a + b, 0) / n) * 100) / 100;
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);

  // Simple linear regression: y = a + b*x  where x is the index
  const xMean = (n - 1) / 2;
  const yMean = averageScore;
  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (scores[i] - yMean);
    denominator += (i - xMean) * (i - xMean);
  }

  const slope = denominator !== 0 ? numerator / denominator : 0;

  // Velocity: slope normalized to points-per-data-point
  const velocity = Math.round(slope * 100) / 100;

  let direction = 'stable';
  if (velocity > 0.5) direction = 'improving';
  else if (velocity < -0.5) direction = 'declining';

  // Forecast: estimate how many data points correspond to 30 / 90 days
  // Use average spacing between data points
  let avgSpacingDays = 30; // default assumption
  if (n >= 2) {
    const firstDate = new Date(sorted[0].date).getTime();
    const lastDate = new Date(sorted[n - 1].date).getTime();
    const totalDays = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
    avgSpacingDays = totalDays / (n - 1) || 30;
  }

  const lastScore = scores[n - 1];
  const stepsFor30 = 30 / avgSpacingDays;
  const stepsFor90 = 90 / avgSpacingDays;

  const forecast = {
    next30Days: clamp(Math.round((lastScore + slope * stepsFor30) * 100) / 100),
    next90Days: clamp(Math.round((lastScore + slope * stepsFor90) * 100) / 100)
  };

  return {
    direction,
    velocity,
    averageScore,
    minScore,
    maxScore,
    dataPoints: n,
    forecast
  };
}

/**
 * Return prioritized remediation recommendations in French based on the weakest
 * scoring areas of a risk profile.
 *
 * @param {{
 *   breakdown: {scenarioScore: number, reactionTimeScore: number, phishingScore: number, recencyScore: number, incidentScore: number, completionScore: number},
 *   overallScore: number,
 *   riskLevel: string
 * }} riskProfile
 * @returns {string[]} — list of recommendations in French, ordered by priority
 */
export function getRecommendations(riskProfile) {
  if (!riskProfile || !riskProfile.breakdown) return [];

  const { breakdown, riskLevel } = riskProfile;

  /** @type {Array<{area: string, score: number, recommendations: string[]}>} */
  const areaRecommendations = [
    {
      area: 'scenarioScore',
      score: breakdown.scenarioScore,
      recommendations: [
        'Planifier des sessions de formation immersive supplémentaires sur les scénarios échoués.',
        'Réaffecter les scénarios à difficulté progressive pour renforcer les compétences de base.',
        'Mettre en place un accompagnement personnalisé avec un mentor cybersécurité.'
      ]
    },
    {
      area: 'reactionTimeScore',
      score: breakdown.reactionTimeScore,
      recommendations: [
        'Organiser des exercices chronométrés de détection de menaces pour améliorer la réactivité.',
        'Intégrer des simulations en temps réel avec des contraintes de temps.',
        'Encourager l\'utilisation d\'outils de signalement rapide (bouton d\'alerte phishing).'
      ]
    },
    {
      area: 'phishingScore',
      score: breakdown.phishingScore,
      recommendations: [
        'Lancer une campagne de simulation de phishing ciblée avec difficulté croissante.',
        'Diffuser des exemples concrets de courriels de phishing récents dans l\'entreprise.',
        'Former les employés aux techniques d\'ingénierie sociale les plus courantes.',
        'Mettre en place un programme de récompenses pour le signalement de tentatives de phishing.'
      ]
    },
    {
      area: 'recencyScore',
      score: breakdown.recencyScore,
      recommendations: [
        'Programmer une session de formation de recyclage dans les 7 prochains jours.',
        'Activer les rappels automatiques de formation trimestrielle.',
        'Proposer des micro-formations hebdomadaires de 5 minutes sur les bonnes pratiques.'
      ]
    },
    {
      area: 'incidentScore',
      score: breakdown.incidentScore,
      recommendations: [
        'Effectuer une analyse post-incident détaillée pour identifier les causes racines.',
        'Renforcer les contrôles d\'accès et les politiques de sécurité pour cet employé.',
        'Planifier un entretien individuel pour sensibiliser aux conséquences des incidents.',
        'Envisager une restriction temporaire des privilèges d\'accès aux données sensibles.'
      ]
    },
    {
      area: 'completionScore',
      score: breakdown.completionScore,
      recommendations: [
        'Envoyer des rappels automatiques pour les scénarios non complétés.',
        'Intégrer les formations dans le planning professionnel avec un temps dédié.',
        'Mettre en place un suivi managérial du taux de complétion des formations.'
      ]
    }
  ];

  // Sort areas by score ascending (worst first)
  areaRecommendations.sort((a, b) => a.score - b.score);

  const results = [];

  // Urgent preamble for critical / high risk
  if (riskLevel === 'critical') {
    results.push(
      '⚠️ NIVEAU CRITIQUE — Action immédiate requise : cet employé représente un risque majeur pour la sécurité de l\'organisation.'
    );
  } else if (riskLevel === 'high') {
    results.push(
      '🔶 NIVEAU ÉLEVÉ — Un plan de remédiation prioritaire doit être mis en place rapidement.'
    );
  }

  // For each weak area (below 70), include top recommendation(s)
  for (const area of areaRecommendations) {
    if (area.score < 70) {
      // Include first recommendation for moderately weak areas, more for very weak
      const count = area.score < 40 ? 2 : 1;
      for (let i = 0; i < count && i < area.recommendations.length; i++) {
        results.push(area.recommendations[i]);
      }
    }
  }

  // If nothing is weak, give a positive message
  if (results.length === 0) {
    results.push(
      'Excellent profil de sécurité. Continuer les formations régulières pour maintenir ce niveau.'
    );
  }

  return results;
}
