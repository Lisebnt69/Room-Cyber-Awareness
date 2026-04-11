import { calculateLevel, pointsToNextLevel, getLevelPercentage, BADGES } from '../data/gamificationData'

export default function GamificationWidget({ userStats = {} }) {
  const {
    points = 0,
    badges = [],
    currentStreak = 0,
    scenariosCompleted = 0,
  } = userStats

  const currentLevel = calculateLevel(points)
  const nextLevelPoints = pointsToNextLevel(points)
  const levelProgress = getLevelPercentage(points)

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '20px', borderRadius: '4px' }}>
      {/* Level & Progress */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '18px', fontWeight: 700 }}>
              Level <span style={{ color: currentLevel.color }}>{currentLevel.level}</span> — {currentLevel.name.fr}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{points.toLocaleString()} / {currentLevel.maxPoints.toLocaleString()} pts</div>
          </div>
          <div style={{ fontSize: '32px' }}>⭐</div>
        </div>

        {/* Progress Bar */}
        <div style={{ background: 'rgba(0,0,0,0.5)', height: '8px', borderRadius: '2px', overflow: 'hidden' }}>
          <div
            style={{
              background: currentLevel.color,
              height: '100%',
              width: `${levelProgress}%`,
              transition: 'width 0.3s ease'
            }}
          />
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
          {nextLevelPoints} pts jusqu'au prochain niveau
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: 'rgba(235,40,40,0.1)', padding: '12px', borderRadius: '2px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--red)' }}>{scenariosCompleted}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>Scénarios</div>
        </div>
        <div style={{ background: 'rgba(34,197,94,0.1)', padding: '12px', borderRadius: '2px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#22c55e' }}>{currentStreak}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>🔥 Jours</div>
        </div>
        <div style={{ background: 'rgba(245,158,11,0.1)', padding: '12px', borderRadius: '2px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#f59e0b' }}>{badges.length}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>Badges</div>
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '12px' }}>BADGES ({badges.length})</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {badges.map(badgeId => {
              const badge = BADGES[badgeId] || BADGES.FIRST_SCENARIO
              return (
                <div
                  key={badgeId}
                  title={badge.desc.fr}
                  style={{
                    background: 'rgba(235,40,40,0.1)',
                    border: '1px solid rgba(235,40,40,0.3)',
                    padding: '8px 12px',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px'
                  }}
                >
                  <span>{badge.icon}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{badge.name.fr}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
