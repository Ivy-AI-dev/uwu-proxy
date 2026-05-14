import { getDb } from './lib/db.js';

const DEFAULTS = [
  { user: 'Ryder',   code: '82047', role: 'owner' },
  { user: 'Logan',   code: '63914', role: 'slave owner' },
  { user: 'Beckham', code: '11111', role: 'slave' },
  { user: 'Kolby',   code: '22222', role: 'slave' },
  { user: 'Levi',    code: '33333', role: 'slave' },
  { user: 'Liam',    code: '44444', role: 'slave' },
  { user: 'Gibson',  code: '55555', role: 'slave' },
];

const HDR = { 'Content-Type': 'application/json' };

async function mergedUsers(db) {
  const { rows } = await db.query('SELECT username, code, role FROM users');
  return DEFAULTS.map(d => {
    const found = rows.find(r => r.username === d.user);
    return found ? { user: found.username, code: found.code, role: found.role } : d;
  }).concat(rows.filter(r => !DEFAULTS.find(d => d.user === r.username))
               .map(r => ({ user: r.username, code: r.code, role: r.role })));
}

export const handler = async (event) => {
  let db;
  try { db = await getDb(); } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'db connect failed' }) };
  }

  if (event.httpMethod === 'GET') {
    const users = await mergedUsers(db);
    return { statusCode: 200, headers: HDR, body: JSON.stringify({ users }) };
  }

  if (event.httpMethod === 'POST') {
    let body;
    try { body = JSON.parse(event.body); } catch { return { statusCode: 400, body: JSON.stringify({ error: 'bad json' }) }; }
    const { actorCode, user, code, role, action } = body;

    const all = await mergedUsers(db);
    const actor = all.find(u => u.code === String(actorCode));
    if (!actor || actor.role !== 'owner') return { statusCode: 403, body: JSON.stringify({ error: 'owner only' }) };

    if (action === 'delete') {
      await db.query('DELETE FROM users WHERE username = $1', [user]);
      return { statusCode: 200, headers: HDR, body: JSON.stringify({ ok: true }) };
    }

    if (!/^\d{5}$/.test(code)) return { statusCode: 400, body: JSON.stringify({ error: 'code must be 5 digits' }) };
    await db.query(
      'INSERT INTO users (username, code, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO UPDATE SET code = $2, role = $3',
      [user, String(code), role || 'slave']
    );
    return { statusCode: 200, headers: HDR, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
