import pg from 'pg';
const { Pool } = pg;

const CONNECTION = 'postgresql://postgres:Ryderbobbitt1212@db.jorrltrnvvtmehslnxst.supabase.co:5432/postgres';

let pool;

export async function getDb() {
  if (!pool) {
    pool = new Pool({ connectionString: CONNECTION, ssl: { rejectUnauthorized: false } });
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
