import express from 'express'
import cors from 'cors'
import db from './db.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '20mb' }))

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const getBlocks = (scenarioId) => {
  const blocks = db.prepare('SELECT * FROM scenario_blocks WHERE scenario_id = ? ORDER BY position').all(scenarioId)
  return blocks.map(b => {
    const data = JSON.parse(b.data || '{}')
    if (b.type === 'photo') {
      data.hotspots = db.prepare('SELECT * FROM hotspots WHERE block_id = ? ORDER BY id').all(b.id)
    }
    return { id: b.id, type: b.type, position: b.position, ...data }
  })
}

const saveBlocks = (scenarioId, blocks) => {
  db.prepare('DELETE FROM scenario_blocks WHERE scenario_id = ?').run(scenarioId)
  const insBlock = db.prepare('INSERT INTO scenario_blocks (scenario_id, type, position, data) VALUES (?, ?, ?, ?)')
  const insHotspot = db.prepare('INSERT INTO hotspots (block_id, x, y, label) VALUES (?, ?, ?, ?)')
  for (let i = 0; i < blocks.length; i++) {
    const { type, hotspots, ...rest } = blocks[i]
    const info = insBlock.run(scenarioId, type, i, JSON.stringify(rest))
    if (type === 'photo' && Array.isArray(hotspots)) {
      for (const h of hotspots) insHotspot.run(info.lastInsertRowid, h.x ?? 50, h.y ?? 50, h.label ?? 'Zone')
    }
  }
}

// ─── SCENARIOS ────────────────────────────────────────────────────────────────
app.get('/api/scenarios', (_req, res) => {
  const rows = db.prepare('SELECT * FROM scenarios ORDER BY id').all()
  res.json(rows.map(s => ({ ...s, blocks: getBlocks(s.id) })))
})

app.get('/api/scenarios/:id', (req, res) => {
  const s = db.prepare('SELECT * FROM scenarios WHERE id = ?').get(req.params.id)
  if (!s) return res.status(404).json({ error: 'Not found' })
  res.json({ ...s, blocks: getBlocks(s.id) })
})

app.post('/api/scenarios', (req, res) => {
  const { title_fr, title_en, category, difficulty, duration, description, status, blocks } = req.body
  const info = db.prepare(
    'INSERT INTO scenarios (title_fr, title_en, category, difficulty, duration, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(title_fr, title_en || title_fr, category, difficulty, duration, description, status || 'draft')
  if (Array.isArray(blocks)) saveBlocks(info.lastInsertRowid, blocks)
  const created = db.prepare('SELECT * FROM scenarios WHERE id = ?').get(info.lastInsertRowid)
  res.status(201).json({ ...created, blocks: getBlocks(created.id) })
})

app.put('/api/scenarios/:id', (req, res) => {
  const { title_fr, title_en, category, difficulty, duration, description, status, blocks } = req.body
  db.prepare(
    'UPDATE scenarios SET title_fr=?, title_en=?, category=?, difficulty=?, duration=?, description=?, status=? WHERE id=?'
  ).run(title_fr, title_en || title_fr, category, difficulty, duration, description, status, req.params.id)
  if (Array.isArray(blocks)) saveBlocks(Number(req.params.id), blocks)
  const updated = db.prepare('SELECT * FROM scenarios WHERE id = ?').get(req.params.id)
  res.json({ ...updated, blocks: getBlocks(updated.id) })
})

app.delete('/api/scenarios/:id', (req, res) => {
  db.prepare('DELETE FROM scenarios WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

// ─── COMPANIES ────────────────────────────────────────────────────────────────
app.get('/api/companies', (_req, res) => {
  res.json(db.prepare('SELECT * FROM companies ORDER BY id').all())
})

app.post('/api/companies', (req, res) => {
  const { name, email, plan, sector, licenses, expire } = req.body
  const info = db.prepare(
    'INSERT INTO companies (name, email, plan, sector, licenses, expire) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, email, plan, sector, licenses || 25, expire || '31/12/2026')
  res.status(201).json(db.prepare('SELECT * FROM companies WHERE id = ?').get(info.lastInsertRowid))
})

app.put('/api/companies/:id', (req, res) => {
  const { name, email, plan, sector, users, active, licenses, expire, status } = req.body
  db.prepare(
    'UPDATE companies SET name=?, email=?, plan=?, sector=?, users=?, active=?, licenses=?, expire=?, status=? WHERE id=?'
  ).run(name, email, plan, sector, users, active, licenses, expire, status, req.params.id)
  res.json(db.prepare('SELECT * FROM companies WHERE id = ?').get(req.params.id))
})

app.delete('/api/companies/:id', (req, res) => {
  db.prepare('DELETE FROM companies WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

// ─── HOTSPOTS (direct edit) ───────────────────────────────────────────────────
app.put('/api/hotspots/:id', (req, res) => {
  const { x, y, label } = req.body
  db.prepare('UPDATE hotspots SET x=?, y=?, label=? WHERE id=?').run(x, y, label, req.params.id)
  res.json(db.prepare('SELECT * FROM hotspots WHERE id = ?').get(req.params.id))
})

app.patch('/api/hotspots/:id', (req, res) => {
  const { x, y, label } = req.body
  if (x !== undefined) db.prepare('UPDATE hotspots SET x=? WHERE id=?').run(x, req.params.id)
  if (y !== undefined) db.prepare('UPDATE hotspots SET y=? WHERE id=?').run(y, req.params.id)
  if (label !== undefined) db.prepare('UPDATE hotspots SET label=? WHERE id=?').run(label, req.params.id)
  res.json(db.prepare('SELECT * FROM hotspots WHERE id=?').get(req.params.id))
})

app.delete('/api/hotspots/:id', (req, res) => {
  db.prepare('DELETE FROM hotspots WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

// ─── COMPANY SCENARIO ASSIGNMENTS ─────────────────────────────────────────────
app.get('/api/companies/:id/scenarios', (req, res) => {
  const rows = db.prepare(`
    SELECT s.* FROM scenarios s
    JOIN company_scenarios cs ON cs.scenario_id = s.id
    WHERE cs.company_id = ?
    ORDER BY s.id
  `).all(req.params.id)
  res.json(rows.map(s => ({ ...s, blocks: getBlocks(s.id) })))
})

app.post('/api/companies/:id/scenarios', (req, res) => {
  const { scenario_id } = req.body
  try {
    db.prepare('INSERT OR IGNORE INTO company_scenarios (company_id, scenario_id) VALUES (?, ?)').run(req.params.id, scenario_id)
    res.json({ ok: true })
  } catch(e) { res.status(400).json({ error: e.message }) }
})

app.delete('/api/companies/:id/scenarios/:sid', (req, res) => {
  db.prepare('DELETE FROM company_scenarios WHERE company_id=? AND scenario_id=?').run(req.params.id, req.params.sid)
  res.json({ ok: true })
})

// ─── PLAYER ASSIGNMENTS ────────────────────────────────────────────────────────
app.get('/api/companies/:id/assignments', (req, res) => {
  const rows = db.prepare(`
    SELECT pa.*, s.title_fr, s.title_en, s.category, s.difficulty, s.duration
    FROM player_assignments pa
    JOIN scenarios s ON s.id = pa.scenario_id
    WHERE pa.company_id = ?
    ORDER BY pa.assigned_at DESC
  `).all(req.params.id)
  res.json(rows)
})

app.post('/api/companies/:id/assignments', (req, res) => {
  const { player_email, player_name, scenario_id } = req.body
  const info = db.prepare(
    'INSERT INTO player_assignments (company_id, player_email, player_name, scenario_id) VALUES (?, ?, ?, ?)'
  ).run(req.params.id, player_email, player_name || player_email, scenario_id)
  res.status(201).json(db.prepare('SELECT * FROM player_assignments WHERE id=?').get(info.lastInsertRowid))
})

app.delete('/api/assignments/:id', (req, res) => {
  db.prepare('DELETE FROM player_assignments WHERE id=?').run(req.params.id)
  res.json({ ok: true })
})

app.get('/api/players/:email/scenarios', (req, res) => {
  const rows = db.prepare(`
    SELECT pa.id as assignment_id, pa.status, pa.score,
           s.id, s.title_fr, s.title_en, s.category, s.difficulty, s.duration, s.description
    FROM player_assignments pa
    JOIN scenarios s ON s.id = pa.scenario_id
    WHERE pa.player_email = ?
    ORDER BY pa.assigned_at DESC
  `).all(req.params.email)
  res.json(rows)
})

// ─── START ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`\n  ROOMCA API  →  http://localhost:${PORT}\n`)
})
