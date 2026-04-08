import { calculateLevel } from '../data/gamificationData'
import { useLang } from '../context/LangContext'

export default function Leaderboard({ users = [], type = 'global', title = 'Leaderboard' }) {
  const { t, lang } = useLang()

  const sortedUsers = [...users].sort((a, b) => (b.points || 0) - (a.points || 0))
  const topUsers = sortedUsers.slice(0, 10)

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `${rank}️⃣`
  }

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
        <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '18px', fontWeight: 700, margin: 0 }}>
          {title}
        </h3>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
          {type === 'global' ? 'Top 10 Globalement' : 'Top 10 de votre Département'}
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }} role="table" aria-label={title}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)' }}>
            <th style={{ padding: '12px 24px', textAlign: 'left', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 400 }} role="columnheader">#</th>
            <th style={{ padding: '12px 24px', textAlign: 'left', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 400 }} role="columnheader">Utilisateur</th>
            <th style={{ padding: '12px 24px', textAlign: 'left', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 400 }} role="columnheader">Niveau</th>
            <th style={{ padding: '12px 24px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 400 }} role="columnheader">Points</th>
            <th style={{ padding: '12px 24px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 400 }} role="columnheader">Badges</th>
          </tr>
        </thead>
        <tbody>
          {topUsers.map((user, idx) => {
            const level = calculateLevel(user.points || 0)
            const rank = idx + 1
            return (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px 24px', fontSize: '14px', fontWeight: 700, color: level.color }}>
                  {getMedalEmoji(rank)}
                </td>
                <td style={{ padding: '12px 24px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{user.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{user.dept}</div>
                </td>
                <td style={{ padding: '12px 24px' }}>
                  <div style={{ fontSize: '12px', color: level.color, fontWeight: 600 }}>
                    {level.name.fr}
                  </div>
                </td>
                <td style={{ padding: '12px 24px', textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>{(user.points || 0).toLocaleString()}</div>
                </td>
                <td style={{ padding: '12px 24px', textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b' }}>
                    {(user.badges || []).length} 🏅
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {topUsers.length === 0 && (
        <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Pas de données disponibles
        </div>
      )}
    </div>
  )
}
