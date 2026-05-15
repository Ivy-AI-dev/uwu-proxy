import { getRows } from './lib/store.js';

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
    const rows = await getRows();
    const deleted = new Set(
      Object.entries(rows).filter(([, v]) => v.role === 'deleted').map(([k]) => k)
    );
    const all = [
      ...DEFAULTS
        .filter(d => !deleted.has(d.user))
        .map(d => {
          const ov = rows[d.user];
          return (ov && ov.role !== 'deleted') ? { user: d.user, code: ov.code, role: ov.role } : d;
        }),
      ...Object.entries(rows)
        .filter(([k, v]) => v.role !== 'deleted' && !DEFAULTS.find(d => d.user === k))
        .map(([k, v]) => ({ user: k, code: v.code, role: v.role })),
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
