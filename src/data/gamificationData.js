// Gamification System Data

export const BADGES = {
  FIRST_SCENARIO: { id: 'first', name: { fr: 'Première Mission', en: 'First Mission' }, icon: '🎮', desc: { fr: 'Complétez votre premier scénario', en: 'Complete your first scenario' } },
  PERFECT_SCORE: { id: 'perfect', name: { fr: 'Score Parfait', en: 'Perfect Score' }, icon: '💯', desc: { fr: 'Obtenez 1000/1000 points', en: 'Get 1000/1000 points' } },
  SPEEDRUNNER: { id: 'speed', name: { fr: 'Coureur Rapide', en: 'Speedrunner' }, icon: '⚡', desc: { fr: 'Complétez en moins de 5 minutes', en: 'Complete in under 5 minutes' } },
  PHISHING_EXPERT: { id: 'phish', name: { fr: 'Expert en Phishing', en: 'Phishing Expert' }, icon: '🎣', desc: { fr: 'Identifiez 100% des phishing', en: 'Identify 100% of phishing' } },
  WEEK_STREAK: { id: 'streak7', name: { fr: 'Semaine Dorée', en: 'Golden Week' }, icon: '🔥', desc: { fr: '7 jours consécutifs', en: '7 consecutive days' } },
  MONTH_STREAK: { id: 'streak30', name: { fr: 'Mois Parfait', en: 'Perfect Month' }, icon: '🏆', desc: { fr: '30 jours consécutifs', en: '30 consecutive days' } },
  TEAM_CHAMPION: { id: 'champ', name: { fr: 'Champion d\'équipe', en: 'Team Champion' }, icon: '👑', desc: { fr: 'Meilleur score du département', en: 'Best score in department' } },
  MENTOR: { id: 'mentor', name: { fr: 'Mentor', en: 'Mentor' }, icon: '🧠', desc: { fr: 'Aidez 5 collègues', en: 'Help 5 colleagues' } },
}

export const LEVELS = [
  { level: 1, name: { fr: 'Novice', en: 'Novice' }, minPoints: 0, maxPoints: 500, color: '#828080' },
  { level: 2, name: { fr: 'Apprenti', en: 'Apprentice' }, minPoints: 500, maxPoints: 1500, color: '#3b82f6' },
  { level: 3, name: { fr: 'Professionnel', en: 'Professional' }, minPoints: 1500, maxPoints: 3500, color: '#22c55e' },
  { level: 4, name: { fr: 'Expert', en: 'Expert' }, minPoints: 3500, maxPoints: 7000, color: '#f59e0b' },
  { level: 5, name: { fr: 'Master', en: 'Master' }, minPoints: 7000, maxPoints: 12000, color: '#eb2828' },
  { level: 6, name: { fr: 'Légende', en: 'Legend' }, minPoints: 12000, maxPoints: Infinity, color: '#fbbf24' },
]

export const POINTS_RULES = {
  SCENARIO_COMPLETE: 100,
  PERFECT_SCORE: 500,
  SPEEDRUN: 200,
  PHISHING_DETECTED: 50,
  DAILY_LOGIN: 10,
  BADGE_EARNED: 50,
  DEPARTMENT_FIRST: 250,
}

export function calculateLevel(points) {
  return LEVELS.find(l => points >= l.minPoints && points < l.maxPoints) || LEVELS[LEVELS.length - 1]
}

export function getNextLevel(currentLevel) {
  return LEVELS[currentLevel.level] || null
}

export function pointsToNextLevel(currentPoints) {
  const level = calculateLevel(currentPoints)
  return level.maxPoints - currentPoints
}

export function getLevelPercentage(points) {
  const level = calculateLevel(points)
  const levelStart = level.minPoints
  const levelEnd = level.maxPoints
  const progress = points - levelStart
  const total = levelEnd - levelStart
  return (progress / total) * 100
}

export const ACHIEVEMENT_CONDITIONS = {
  FIRST_SCENARIO: (user) => user.scenariosCompleted >= 1,
  PERFECT_SCORE: (user) => user.perfectScores >= 1,
  SPEEDRUNNER: (user) => user.fastCompletion >= 1,
  PHISHING_EXPERT: (user) => user.phishingAccuracy === 100,
  WEEK_STREAK: (user) => user.currentStreak >= 7,
  MONTH_STREAK: (user) => user.currentStreak >= 30,
  TEAM_CHAMPION: (user) => user.isDepartmentLeader,
  MENTOR: (user) => user.helpfulVotes >= 5,
}
