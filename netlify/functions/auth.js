const USERS = [
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
  const overrides = globalThis.__codeOverrides || {};
  const user = USERS.find(u => (overrides[u.user] || u.code) === String(code));
  if (!user) return { statusCode: 401, body: JSON.stringify({ error: 'invalid code' }) };
  const channel = `uwugaming-${overrides[user.user] || user.code}`;
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: user.user, role: user.role, channel }),
  };
};
