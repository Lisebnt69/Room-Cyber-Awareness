import express from 'express'
import cors from 'cors'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import 'dotenv/config'
import pool from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(cors())
app.use(express.json({ limit: '20mb' }))

// ─── INIT SCHEMA ──────────────────────────────────────────────────────────────
async function initSchema() {
  const sql = readFileSync(join(__dirname, 'schema.sql'), 'utf8')
  await pool.query(sql)
  console.log('  ✓ Schema ready')
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
async function getBlocks(scenarioId) {
  const { rows: blocks } = await pool.query(
    'SELECT * FROM scenario_blocks WHERE scenario_id = $1 ORDER BY position', [scenarioId]
  )
  return Promise.all(blocks.map(async b => {
    const data = typeof b.data === 'object' ? b.data : JSON.parse(b.data || '{}')
    if (b.type === 'photo') {
      const { rows: hs } = await pool.query('SELECT * FROM hotspots WHERE block_id = $1 ORDER BY id', [b.id])
      data.hotspots = hs
    }
    return { id: b.id, type: b.type, position: b.position, ...data }
  }))
}

async function saveBlocks(client, scenarioId, blocks) {
  await client.query('DELETE FROM scenario_blocks WHERE scenario_id = $1', [scenarioId])
  for (let i = 0; i < blocks.length; i++) {
    const { type, hotspots, id: _id, ...rest } = blocks[i]
    const { rows: [blk] } = await client.query(
      'INSERT INTO scenario_blocks (scenario_id, type, position, data) VALUES ($1,$2,$3,$4) RETURNING id',
      [scenarioId, type, i, JSON.stringify(rest)]
    )
    if (type === 'photo' && Array.isArray(hotspots)) {
      for (const h of hotspots) {
        await client.query(
          'INSERT INTO hotspots (block_id,x,y,w,h,label,description) VALUES ($1,$2,$3,$4,$5,$6,$7)',
          [blk.id, h.x ?? 50, h.y ?? 50, h.w ?? 10, h.h ?? 10, h.label ?? 'Zone', h.description ?? '']
        )
      }
    }
  }
}

const wrap = fn => (req, res) => fn(req, res).catch(e => res.status(500).json({ error: e.message }))

// ─── SCENARIOS ────────────────────────────────────────────────────────────────
app.get('/api/scenarios', wrap(async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM scenarios ORDER BY id')
  const scenarios = await Promise.all(rows.map(async s => ({ ...s, blocks: await getBlocks(s.id) })))
  res.json(scenarios)
}))

app.get('/api/scenarios/:id', wrap(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM scenarios WHERE id = $1', [req.params.id])
  if (!rows[0]) return res.status(404).json({ error: 'Not found' })
  res.json({ ...rows[0], blocks: await getBlocks(rows[0].id) })
}))

app.post('/api/scenarios', wrap(async (req, res) => {
  const { title_fr, title_en, category, difficulty, duration, description, status, blocks } = req.body
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { rows: [s] } = await client.query(
      'INSERT INTO scenarios (title_fr,title_en,category,difficulty,duration,description,status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [title_fr, title_en || title_fr, category, difficulty, duration, description, status || 'draft']
    )
    if (Array.isArray(blocks)) await saveBlocks(client, s.id, blocks)
    await client.query('COMMIT')
    res.status(201).json({ ...s, blocks: await getBlocks(s.id) })
  } catch(e) { await client.query('ROLLBACK'); throw e }
  finally { client.release() }
}))

app.put('/api/scenarios/:id', wrap(async (req, res) => {
  const { title_fr, title_en, category, difficulty, duration, description, status, blocks } = req.body
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { rows: [s] } = await client.query(
      'UPDATE scenarios SET title_fr=$1,title_en=$2,category=$3,difficulty=$4,duration=$5,description=$6,status=$7 WHERE id=$8 RETURNING *',
      [title_fr, title_en || title_fr, category, difficulty, duration, description, status, req.params.id]
    )
    if (Array.isArray(blocks)) await saveBlocks(client, Number(req.params.id), blocks)
    await client.query('COMMIT')
    res.json({ ...s, blocks: await getBlocks(s.id) })
  } catch(e) { await client.query('ROLLBACK'); throw e }
  finally { client.release() }
}))

app.delete('/api/scenarios/:id', wrap(async (req, res) => {
  await pool.query('DELETE FROM scenarios WHERE id = $1', [req.params.id])
  res.json({ ok: true })
}))

// ─── HOTSPOTS ─────────────────────────────────────────────────────────────────
app.put('/api/hotspots/:id', wrap(async (req, res) => {
  const { x, y, w, h, label, description } = req.body
  const { rows: [hs] } = await pool.query(
    'UPDATE hotspots SET x=$1,y=$2,w=$3,h=$4,label=$5,description=$6 WHERE id=$7 RETURNING *',
    [x, y, w ?? 10, h ?? 10, label, description ?? '', req.params.id]
  )
  res.json(hs)
}))

app.patch('/api/hotspots/:id', wrap(async (req, res) => {
  const fields = ['x','y','w','h','label','description'].filter(f => req.body[f] !== undefined)
  if (!fields.length) return res.json({})
  const sets = fields.map((f, i) => `${f}=$${i+1}`).join(',')
  const vals = fields.map(f => req.body[f])
  const { rows: [hs] } = await pool.query(
    `UPDATE hotspots SET ${sets} WHERE id=$${fields.length+1} RETURNING *`,
    [...vals, req.params.id]
  )
  res.json(hs)
}))

app.delete('/api/hotspots/:id', wrap(async (req, res) => {
  await pool.query('DELETE FROM hotspots WHERE id = $1', [req.params.id])
  res.json({ ok: true })
}))

// ─── COMPANIES ────────────────────────────────────────────────────────────────
app.get('/api/companies', wrap(async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM companies ORDER BY id')
  res.json(rows)
}))

app.post('/api/companies', wrap(async (req, res) => {
  const { name, email, plan, sector, licenses, expire } = req.body
  const { rows: [c] } = await pool.query(
    'INSERT INTO companies (name,email,plan,sector,licenses,expire) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [name, email, plan, sector, licenses || 25, expire || '31/12/2026']
  )
  res.status(201).json(c)
}))

app.put('/api/companies/:id', wrap(async (req, res) => {
  const { name, email, plan, sector, users, active, licenses, expire, status } = req.body
  const { rows: [c] } = await pool.query(
    'UPDATE companies SET name=$1,email=$2,plan=$3,sector=$4,users=$5,active=$6,licenses=$7,expire=$8,status=$9 WHERE id=$10 RETURNING *',
    [name, email, plan, sector, users, active, licenses, expire, status, req.params.id]
  )
  res.json(c)
}))

app.delete('/api/companies/:id', wrap(async (req, res) => {
  await pool.query('DELETE FROM companies WHERE id = $1', [req.params.id])
  res.json({ ok: true })
}))

// ─── COMPANY SCENARIOS ────────────────────────────────────────────────────────
app.get('/api/companies/:id/scenarios', wrap(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT s.* FROM scenarios s
     JOIN company_scenarios cs ON cs.scenario_id = s.id
     WHERE cs.company_id = $1 ORDER BY s.id`, [req.params.id]
  )
  const scenarios = await Promise.all(rows.map(async s => ({ ...s, blocks: await getBlocks(s.id) })))
  res.json(scenarios)
}))

app.post('/api/companies/:id/scenarios', wrap(async (req, res) => {
  const { scenario_id } = req.body
  await pool.query(
    'INSERT INTO company_scenarios (company_id,scenario_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
    [req.params.id, scenario_id]
  )
  res.json({ ok: true })
}))

app.delete('/api/companies/:id/scenarios/:sid', wrap(async (req, res) => {
  await pool.query('DELETE FROM company_scenarios WHERE company_id=$1 AND scenario_id=$2', [req.params.id, req.params.sid])
  res.json({ ok: true })
}))

// ─── DEPARTMENTS ──────────────────────────────────────────────────────────────
app.get('/api/companies/:id/departments', wrap(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM departments WHERE company_id=$1 ORDER BY name', [req.params.id])
  const depts = await Promise.all(rows.map(async d => {
    const { rows: [pc] } = await pool.query('SELECT COUNT(*) as n FROM players WHERE department_id=$1', [d.id])
    const { rows: [sc] } = await pool.query('SELECT COUNT(*) as n FROM department_scenarios WHERE department_id=$1', [d.id])
    return { ...d, playerCount: Number(pc.n), scenarioCount: Number(sc.n) }
  }))
  res.json(depts)
}))

app.post('/api/companies/:id/departments', wrap(async (req, res) => {
  const { name } = req.body
  const { rows: [d] } = await pool.query(
    'INSERT INTO departments (company_id,name) VALUES ($1,$2) RETURNING *',
    [req.params.id, name]
  )
  res.status(201).json({ ...d, playerCount: 0, scenarioCount: 0 })
}))

app.delete('/api/departments/:id', wrap(async (req, res) => {
  await pool.query('DELETE FROM departments WHERE id=$1', [req.params.id])
  res.json({ ok: true })
}))

// ─── DEPARTMENT SCENARIOS ─────────────────────────────────────────────────────
app.get('/api/departments/:id/scenarios', wrap(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT s.* FROM scenarios s
     JOIN department_scenarios ds ON ds.scenario_id = s.id
     WHERE ds.department_id = $1 ORDER BY s.id`, [req.params.id]
  )
  res.json(rows)
}))

app.post('/api/departments/:id/scenarios', wrap(async (req, res) => {
  const { scenario_id } = req.body
  await pool.query(
    'INSERT INTO department_scenarios (department_id,scenario_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
    [req.params.id, scenario_id]
  )
  // Auto-assign to all players in this department
  const { rows: dept } = await pool.query('SELECT * FROM departments WHERE id=$1', [req.params.id])
  const { rows: players } = await pool.query('SELECT * FROM players WHERE department_id=$1', [req.params.id])
  for (const p of players) {
    await pool.query(
      `INSERT INTO player_assignments (company_id,player_id,player_email,player_name,department_id,scenario_id,status)
       VALUES ($1,$2,$3,$4,$5,$6,'pending') ON CONFLICT DO NOTHING`,
      [dept[0]?.company_id, p.id, p.email, p.name, req.params.id, scenario_id]
    )
  }
  res.json({ ok: true })
}))

app.delete('/api/departments/:id/scenarios/:sid', wrap(async (req, res) => {
  await pool.query('DELETE FROM department_scenarios WHERE department_id=$1 AND scenario_id=$2', [req.params.id, req.params.sid])
  res.json({ ok: true })
}))

// ─── PLAYERS ──────────────────────────────────────────────────────────────────
app.get('/api/companies/:id/players', wrap(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT p.*, d.name as department_name FROM players p
     LEFT JOIN departments d ON d.id = p.department_id
     WHERE p.company_id = $1 ORDER BY p.name`, [req.params.id]
  )
  res.json(rows)
}))

app.post('/api/companies/:id/players', wrap(async (req, res) => {
  const { email, name, department_id, department_name, license } = req.body
  let deptId = department_id || null

  // Auto-create department if only name given
  if (!deptId && department_name) {
    const { rows: existing } = await pool.query(
      'SELECT id FROM departments WHERE company_id=$1 AND name=$2', [req.params.id, department_name]
    )
    if (existing[0]) {
      deptId = existing[0].id
    } else {
      const { rows: [nd] } = await pool.query(
        'INSERT INTO departments (company_id,name) VALUES ($1,$2) RETURNING id', [req.params.id, department_name]
      )
      deptId = nd.id
    }
  }

  const { rows: [p] } = await pool.query(
    'INSERT INTO players (company_id,department_id,email,name,license) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [req.params.id, deptId, email, name, license !== false]
  )

  // Auto-assign department scenarios to new player
  if (deptId) {
    const { rows: deptScenarios } = await pool.query('SELECT scenario_id FROM department_scenarios WHERE department_id=$1', [deptId])
    for (const ds of deptScenarios) {
      await pool.query(
        `INSERT INTO player_assignments (company_id,player_id,player_email,player_name,department_id,scenario_id,status)
         VALUES ($1,$2,$3,$4,$5,$6,'pending') ON CONFLICT DO NOTHING`,
        [req.params.id, p.id, email, name, deptId, ds.scenario_id]
      )
    }
  }

  const { rows: [full] } = await pool.query(
    `SELECT p.*, d.name as department_name FROM players p
     LEFT JOIN departments d ON d.id=p.department_id WHERE p.id=$1`, [p.id]
  )
  res.status(201).json(full)
}))

app.put('/api/players/:id', wrap(async (req, res) => {
  const { email, name, department_id, license, status } = req.body
  const { rows: [p] } = await pool.query(
    'UPDATE players SET email=$1,name=$2,department_id=$3,license=$4,status=$5 WHERE id=$6 RETURNING *',
    [email, name, department_id, license, status, req.params.id]
  )
  res.json(p)
}))

app.delete('/api/players/:id', wrap(async (req, res) => {
  await pool.query('DELETE FROM players WHERE id=$1', [req.params.id])
  res.json({ ok: true })
}))

app.get('/api/players/:email/scenarios', wrap(async (req, res) => {
  const { rows: [player] } = await pool.query('SELECT * FROM players WHERE email=$1', [req.params.email])
  if (!player) return res.json([])
  const { rows } = await pool.query(
    `SELECT pa.id as assignment_id, pa.status, pa.score, pa.assigned_at,
            s.id, s.title_fr, s.title_en, s.category, s.difficulty, s.duration, s.description, s.visual_id
     FROM player_assignments pa
     JOIN scenarios s ON s.id = pa.scenario_id
     WHERE pa.player_id = $1
     ORDER BY pa.assigned_at DESC`, [player.id]
  )
  res.json(rows)
}))

// ─── PLAYER ASSIGNMENTS (company-level) ───────────────────────────────────────
app.get('/api/companies/:id/assignments', wrap(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT pa.*, s.title_fr, s.title_en, s.category, s.difficulty, s.duration
     FROM player_assignments pa
     JOIN scenarios s ON s.id = pa.scenario_id
     WHERE pa.company_id = $1
     ORDER BY pa.assigned_at DESC`, [req.params.id]
  )
  res.json(rows)
}))

app.delete('/api/assignments/:id', wrap(async (req, res) => {
  await pool.query('DELETE FROM player_assignments WHERE id=$1', [req.params.id])
  res.json({ ok: true })
}))

// ─── START ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001
app.listen(PORT, async () => {
  await initSchema()
  console.log(`\n  ROOMCA API  →  http://localhost:${PORT}\n`)
})
