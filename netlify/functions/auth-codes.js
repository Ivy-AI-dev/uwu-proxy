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
  const deleted = new Set(rows.filter(r => r.role === 'deleted').map(r => r.username));
  return DEFAULTS
    .filter(d => !deleted.has(d.user))
    .map(d => {
      const found = rows.find(r => r.username === d.user && r.role !== 'deleted');
      return found ? { user: found.username, code: found.code, role: found.role } : d;
    })
    .concat(rows.filter(r => r.role !== 'deleted' && !DEFAULTS.find(d => d.user === r.username))
               .map(r => ({ user: r.username, code: r.code, role: r.role })));
}

export const handler = async (event) => {
  let db = null;
  try { db = await getDb(); } catch (e) { /* fall back to in-memory */ }

  if (event.httpMethod === 'GET') {
    try {
      const users = db ? await mergedUsers(db) : DEFAULTS.map(d => {
        const ov = globalThis.__codeOverrides?.[d.user];
        return ov ? { ...d, code: ov } : d;
      });
      return { statusCode: 200, headers: HDR, body: JSON.stringify({ users }) };
    } catch (e) {
      return { statusCode: 200, headers: HDR, body: JSON.stringify({ users: DEFAULTS }) };
    }
  }

  if (event.httpMethod === 'POST') {
    let body;
    try { body = JSON.parse(event.body); } catch { return { statusCode: 400, body: JSON.stringify({ error: 'bad json' }) }; }
    const { actorCode, user, code, role, action } = body;

    let all;
    try { all = db ? await mergedUsers(db) : DEFAULTS; } catch { all = DEFAULTS; }
    const actor = all.find(u => u.code === String(actorCode));
    if (!actor || actor.role !== 'owner') return { statusCode: 403, body: JSON.stringify({ error: 'owner only' }) };

    if (action === 'delete') {
      try {
        if (db) {
          const isDefault = DEFAULTS.find(d => d.user === user);
          if (isDefault) {
            await db.query(
              'INSERT INTO users (username, code, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO UPDATE SET role = $3',
              [user, isDefault.code, 'deleted']
            );
          } else {
            await db.query('DELETE FROM users WHERE username = $1', [user]);
          }
        } else {
          if (!globalThis.__deletedUsers) globalThis.__deletedUsers = new Set();
          globalThis.__deletedUsers.add(user);
        }
      } catch (e) {
        return { statusCode: 500, headers: HDR, body: JSON.stringify({ error: 'db error: ' + e.message }) };
      }
      return { statusCode: 200, headers: HDR, body: JSON.stringify({ ok: true }) };
    }

    if (!/^\d{5}$/.test(code)) return { statusCode: 400, body: JSON.stringify({ error: 'code must be 5 digits' }) };
    try {
      if (db) {
        await db.query(
          'INSERT INTO users (username, code, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO UPDATE SET code = $2, role = $3',
          [user, String(code), role || 'slave']
        );
      } else {
        if (!globalThis.__codeOverrides) globalThis.__codeOverrides = {};
        globalThis.__codeOverrides[user] = code;
      }
    } catch (e) {
      return { statusCode: 500, headers: HDR, body: JSON.stringify({ error: 'db error: ' + e.message }) };
    }
    return { statusCode: 200, headers: HDR, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
