import pg from 'pg';
const { Pool } = pg;

// Port 6543 = Supabase pgBouncer pooler — required for serverless (5432 direct times out)
const CONNECTION = 'postgresql://postgres:RyderBobbitt121@db.wyydvzdntrtfwgiejzuz.supabase.co:6543/postgres?pgbouncer=true';

let pool;

export async function getDb() {
  if (!pool) {
    pool = new Pool({
      connectionString: CONNECTION,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
      max: 2,
    });
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        code     TEXT NOT NULL,
        role     TEXT NOT NULL DEFAULT 'slave'
      )
    `);
  }
  return pool;
}
