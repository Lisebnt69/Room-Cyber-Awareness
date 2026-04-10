import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://roomca:roomca@localhost:5432/roomca',
  ssl: process.env.DATABASE_URL?.includes('ovh') || process.env.DATABASE_SSL === 'true'
    ? { rejectUnauthorized: false }
    : false,
})

export default pool
