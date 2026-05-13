const USERS = [
  { user: 'Ryder',   code: '82047', role: 'owner' },
  { user: 'Logan',   code: '63914', role: 'slave owner' },
  { user: 'Beckham', code: '11111', role: 'slave' },
  { user: 'Kolby',   code: '22222', role: 'slave' },
  { user: 'Levi',    code: '33333', role: 'slave' },
  { user: 'Liam',    code: '44444', role: 'slave' },
  { user: 'Gibson',  code: '55555', role: 'slave' },
];

if (!globalThis.__codeOverrides) globalThis.__codeOverrides = {};

export const handler = async (event) => {
  const overrides = globalThis.__codeOverrides;

  if (event.httpMethod === 'GET') {
    const users = USERS.map(u => ({ user: u.user, role: u.role, code: overrides[u.user] || u.code }));
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ users }) };
  }

  if (event.httpMethod === 'POST') {
    let body;
    try { body = JSON.parse(event.body); } catch { return { statusCode: 400, body: JSON.stringify({ error: 'bad json' }) }; }
    const { actorCode, user, code } = body;
    const actor = USERS.find(u => (overrides[u.user] || u.code) === String(actorCode));
    if (!actor || actor.role !== 'owner') return { statusCode: 403, body: JSON.stringify({ error: 'owner only' }) };
    if (!/^\d{5}$/.test(code)) return { statusCode: 400, body: JSON.stringify({ error: 'code must be 5 digits' }) };
    if (!USERS.find(u => u.user === user)) return { statusCode: 404, body: JSON.stringify({ error: 'user not found' }) };
    overrides[user] = code;
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
