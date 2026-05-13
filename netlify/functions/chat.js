const NTFY = 'https://ntfy.sh';

export const handler = async (event) => {
  const path = event.path || '';

  if (event.httpMethod === 'POST' && path.includes('send')) {
    let body;
    try { body = JSON.parse(event.body); } catch { return { statusCode: 400, body: JSON.stringify({ error: 'bad json' }) }; }
    const { channel, user, text } = body;
    if (!channel || !user || !text) return { statusCode: 400, body: JSON.stringify({ error: 'channel, user, text required' }) };
    const msg = JSON.stringify({ user, text, ts: Date.now() });
    await fetch(`${NTFY}/${channel}`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain', 'X-Title': user },
      body: msg,
    });
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
