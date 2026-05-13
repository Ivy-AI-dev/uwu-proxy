const NTFY = 'https://ntfy.sh';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  let body;
  try { body = JSON.parse(event.body); } catch { return { statusCode: 400, body: JSON.stringify({ error: 'bad json' }) }; }
  const { channel, user, status } = body;
  if (!channel || !user) return { statusCode: 400, body: JSON.stringify({ error: 'channel and user required' }) };
  const msg = JSON.stringify({ user, status: status || 'online', ts: Date.now(), type: 'presence' });
  await fetch(`${NTFY}/${channel}-presence`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: msg,
  });
  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
