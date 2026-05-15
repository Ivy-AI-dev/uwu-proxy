import { getStore } from '@netlify/blobs';

const HDR = { 'Content-Type': 'application/json' };
const MAX_MESSAGES = 100;

function store() {
  return getStore('uwu-chat');
}

async function getMessages() {
  return (await store().get('messages', { type: 'json' })) || [];
}

async function appendMessage(user, text) {
  const msgs = await getMessages();
  msgs.push({ user, text, ts: Date.now() });
  if (msgs.length > MAX_MESSAGES) msgs.splice(0, msgs.length - MAX_MESSAGES);
  await store().set('messages', JSON.stringify(msgs));
}

export const handler = async (event) => {
  const path = event.path || '';

  if (event.httpMethod === 'GET' && path.includes('messages')) {
    try {
      const since = parseInt(event.queryStringParameters?.since || '0', 10);
      const msgs = await getMessages();
      const result = since ? msgs.filter(m => m.ts > since) : msgs;
      return { statusCode: 200, headers: HDR, body: JSON.stringify({ messages: result }) };
    } catch (e) {
      return { statusCode: 500, headers: HDR, body: JSON.stringify({ error: e.message }) };
    }
  }

  if (event.httpMethod === 'POST' && path.includes('send')) {
    let body;
    try { body = JSON.parse(event.body); } catch { return { statusCode: 400, headers: HDR, body: JSON.stringify({ error: 'bad json' }) }; }
    const { user, text } = body;
    if (!user || !text) return { statusCode: 400, headers: HDR, body: JSON.stringify({ error: 'user and text required' }) };
    if (text.length > 500) return { statusCode: 400, headers: HDR, body: JSON.stringify({ error: 'message too long' }) };
    try {
      await appendMessage(String(user).trim(), String(text).trim());
      return { statusCode: 200, headers: HDR, body: JSON.stringify({ ok: true }) };
    } catch (e) {
      return { statusCode: 500, headers: HDR, body: JSON.stringify({ error: e.message }) };
    }
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
