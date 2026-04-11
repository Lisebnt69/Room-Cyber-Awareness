-- ROOMCA — Schéma PostgreSQL
-- Compatible local + OVHcloud

CREATE TABLE IF NOT EXISTS companies (
  id        SERIAL PRIMARY KEY,
  name      TEXT NOT NULL,
  email     TEXT,
  plan      TEXT DEFAULT 'Starter',
  sector    TEXT,
  users     INTEGER DEFAULT 0,
  active    INTEGER DEFAULT 0,
  scenarios INTEGER DEFAULT 0,
  licenses  INTEGER DEFAULT 25,
  expire    TEXT,
  status    TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS departments (
  id         SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS players (
  id            SERIAL PRIMARY KEY,
  company_id    INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
  email         TEXT NOT NULL,
  name          TEXT NOT NULL,
  status        TEXT DEFAULT 'active',
  license       BOOLEAN DEFAULT TRUE,
  score         REAL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scenarios (
  id          SERIAL PRIMARY KEY,
  title_fr    TEXT NOT NULL,
  title_en    TEXT,
  category    TEXT DEFAULT 'Phishing',
  difficulty  TEXT DEFAULT 'intermediate',
  duration    TEXT DEFAULT '15',
  description TEXT,
  status      TEXT DEFAULT 'draft',
  plays       INTEGER DEFAULT 0,
  score       REAL DEFAULT 0,
  visual_id   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scenario_blocks (
  id          SERIAL PRIMARY KEY,
  scenario_id INTEGER NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  position    INTEGER DEFAULT 0,
  data        JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS hotspots (
  id          SERIAL PRIMARY KEY,
  block_id    INTEGER NOT NULL REFERENCES scenario_blocks(id) ON DELETE CASCADE,
  x           REAL DEFAULT 50,
  y           REAL DEFAULT 50,
  w           REAL DEFAULT 10,
  h           REAL DEFAULT 10,
  label       TEXT DEFAULT 'Zone',
  description TEXT
);

CREATE TABLE IF NOT EXISTS company_scenarios (
  id          SERIAL PRIMARY KEY,
  company_id  INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  scenario_id INTEGER NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, scenario_id)
);

CREATE TABLE IF NOT EXISTS department_scenarios (
  id            SERIAL PRIMARY KEY,
  department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  scenario_id   INTEGER NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  assigned_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(department_id, scenario_id)
);

CREATE TABLE IF NOT EXISTS player_assignments (
  id            SERIAL PRIMARY KEY,
  company_id    INTEGER NOT NULL,
  player_id     INTEGER REFERENCES players(id) ON DELETE CASCADE,
  player_email  TEXT,
  player_name   TEXT,
  department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
  scenario_id   INTEGER NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  status        TEXT DEFAULT 'pending',
  score         REAL,
  assigned_at   TIMESTAMPTZ DEFAULT NOW(),
  completed_at  TIMESTAMPTZ
);
