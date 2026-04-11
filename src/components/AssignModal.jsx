import { useEffect, useMemo, useState } from 'react'
import Modal from './Modal'
import { useAuth, ROLES } from '../context/AuthContext'

const ADMIN_COMPANY_ID = 1

export default function AssignModal({ isOpen, onClose, scenario, onSuccess }) {
  const { user } = useAuth()
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN
  const mode = isSuperAdmin ? 'companies' : 'groups'

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selected, setSelected] = useState(() => new Set())
  const [filter, setFilter] = useState('')
  const [err, setErr] = useState(null)

  useEffect(() => {
    if (!isOpen) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelected(new Set())
    setFilter('')
    setErr(null)
    setLoading(true)
    const url = mode === 'companies' ? '/api/companies' : `/api/companies/${ADMIN_COMPANY_ID}/groups`
    fetch(url)
      .then(r => r.ok ? r.json() : Promise.reject('fetch failed'))
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(() => setErr('Impossible de charger la liste'))
      .finally(() => setLoading(false))
  }, [isOpen, mode])

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return items
    return items.filter(it => (it.name || '').toLowerCase().includes(q))
  }, [items, filter])

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const selectAll = () => setSelected(new Set(filtered.map(it => it.id)))
  const clearAll = () => setSelected(new Set())

  const handleSubmit = async () => {
    if (selected.size === 0 || !scenario?.id) return
    setSubmitting(true)
    setErr(null)
    const ids = Array.from(selected)
    const endpoint = (id) => mode === 'companies'
      ? `/api/companies/${id}/scenarios`
      : `/api/groups/${id}/scenarios`

    const results = await Promise.all(
      ids.map(id => fetch(endpoint(id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_id: Number(scenario.id) }),
      }).then(r => r.ok).catch(() => false))
    )
    setSubmitting(false)
    const ok = results.filter(Boolean).length
    if (ok === 0) {
      setErr('Aucune assignation n\'a réussi.')
      return
    }
    onSuccess?.({ count: ok, total: ids.length, mode })
    onClose()
  }

  const label = mode === 'companies' ? 'ENTREPRISE' : 'GROUPE'
  const title = `Assigner « ${scenario?.title_fr || scenario?.title?.fr || scenario?.title || 'scénario'} »`

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.14em' }}>
          CIBLE : {label}{mode === 'groups' ? 'S' : 'S'} — sélection multiple
        </div>

        <input
          type="search"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder={mode === 'companies' ? 'Rechercher une entreprise…' : 'Rechercher un groupe…'}
          className="input-dark"
          style={{ padding: '10px 12px', fontFamily: 'var(--font-body)', fontSize: '13px' }}
        />

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
            {selected.size} / {filtered.length} sélectionné{selected.size > 1 ? 's' : ''}
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button type="button" onClick={selectAll}
              style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '5px 10px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.08em', borderRadius: '3px' }}>
              TOUT
            </button>
            <button type="button" onClick={clearAll}
              style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '5px 10px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.08em', borderRadius: '3px' }}>
              AUCUN
            </button>
          </div>
        </div>

        <div style={{
          maxHeight: '340px', overflowY: 'auto',
          border: '1px solid var(--border)', borderRadius: '4px',
          background: 'var(--bg)',
        }}>
          {loading && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: '12px' }}>
              Chargement…
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: '12px' }}>
              {items.length === 0
                ? (mode === 'companies' ? 'Aucune entreprise.' : 'Aucun groupe. Créez-en dans l\'onglet Groupes.')
                : 'Aucun résultat.'}
            </div>
          )}
          {!loading && filtered.map(it => {
            const checked = selected.has(it.id)
            return (
              <label
                key={it.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px',
                  borderBottom: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  background: checked ? 'rgba(235,40,40,0.08)' : 'transparent',
                  transition: 'background 0.12s',
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(it.id)}
                  style={{ width: '16px', height: '16px', accentColor: '#eb2828', cursor: 'pointer' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text)', fontWeight: 500 }}>
                    {it.name}
                  </div>
                  {mode === 'companies' && (it.sector || it.plan) && (
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', letterSpacing: '0.06em' }}>
                      {[it.sector, it.plan].filter(Boolean).join(' · ')}
                    </div>
                  )}
                  {mode === 'groups' && (
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', letterSpacing: '0.06em' }}>
                      {(it.member_count ?? 0)} membre{(it.member_count ?? 0) > 1 ? 's' : ''}
                      {it.scenario_count != null && ` · ${it.scenario_count} scénario${it.scenario_count > 1 ? 's' : ''}`}
                    </div>
                  )}
                </div>
              </label>
            )
          })}
        </div>

        {err && (
          <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#eb2828', background: 'rgba(235,40,40,0.08)', border: '1px solid rgba(235,40,40,0.3)', padding: '8px 12px', borderRadius: '3px' }}>
            {err}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
          <button type="button" onClick={onClose} className="btn-secondary" style={{ padding: '10px 20px' }}>
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || selected.size === 0}
            className="btn-primary"
            style={{ padding: '10px 22px', opacity: (submitting || selected.size === 0) ? 0.5 : 1 }}
          >
            {submitting ? 'Assignation…' : `✓ Assigner${selected.size > 0 ? ` (${selected.size})` : ''}`}
          </button>
        </div>
      </div>
    </Modal>
  )
}
