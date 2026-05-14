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

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  let body;
  try { body = JSON.parse(event.body); } catch { return { statusCode: 400, body: JSON.stringify({ error: 'bad json' }) }; }
  const { code } = body;

  let user;
  try {
    const db = await getDb();
    const { rows } = await db.query('SELECT username, code, role FROM users');
    const all = [
      ...DEFAULTS.map(d => {
        const f = rows.find(r => r.username === d.user);
        return f ? { user: f.username, code: f.code, role: f.role } : d;
      }),
      ...rows.filter(r => !DEFAULTS.find(d => d.user === r.username)).map(r => ({ user: r.username, code: r.code, role: r.role })),
    ];
    user = all.find(u => u.code === String(code));
  } catch {
    user = DEFAULTS.find(u => u.code === String(code));
  }

  if (!user) return { statusCode: 401, body: JSON.stringify({ error: 'invalid code' }) };
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: user.user, role: user.role, channel: `uwugaming-${user.code}` }),
  };
};
