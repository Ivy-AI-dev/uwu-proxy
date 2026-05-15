import { getStore } from '@netlify/blobs';
import { getRows } from './lib/store.js';

const HDR = { 'Content-Type': 'application/json' };

const DEFAULTS = [
  { user: 'Ryder',   code: '82047', role: 'owner' },
  { user: 'Logan',   code: '63914', role: 'slave owner' },
  { user: 'Beckham', code: '11111', role: 'slave' },
  { user: 'Kolby',   code: '22222', role: 'slave' },
  { user: 'Levi',    code: '33333', role: 'slave' },
  { user: 'Liam',    code: '44444', role: 'slave' },
  { user: 'Gibson',  code: '55555', role: 'slave' },
];

function announceStore() { return getStore('uwu-announce'); }

async function resolveActor(actorCode) {
  try {
    const rows = await getRows();
    const all = [
      ...DEFAULTS.map(d => {
        const ov = rows[d.user];
        return (ov && ov.role !== 'deleted') ? { user: d.user, code: ov.code, role: ov.role } : d;
      }),
      ...Object.entries(rows)
        .filter(([k, v]) => v.role !== 'deleted' && !DEFAULTS.find(d => d.user === k))
        .map(([k, v]) => ({ user: k, code: v.code, role: v.role })),
    ];
    return all.find(u => u.code === String(actorCode)) || null;
  } catch {
    return DEFAULTS.find(u => u.code === String(actorCode)) || null;
  }
}

export const handler = async (event) => {
  const path = event.path || '';
  const isSnapshot = path.includes('snapshot');

  // ── GET /api/announce — clients poll for active announcement ──
  if (event.httpMethod === 'GET' && !isSnapshot) {
    try {
      const data = await announceStore().get('current', { type: 'json' });
      return { statusCode: 200, headers: HDR, body: JSON.stringify({ announcement: data || null }) };
    } catch {
      return { statusCode: 200, headers: HDR, body: JSON.stringify({ announcement: null }) };
    }
  }

  // ── GET /api/announce/snapshot — admin fetches latest cam snapshot ──
  if (event.httpMethod === 'GET' && isSnapshot) {
    try {
      const data = await announceStore().get('snapshot', { type: 'json' });
      return { statusCode: 200, headers: HDR, body: JSON.stringify(data || null) };
    } catch {
      return { statusCode: 200, headers: HDR, body: JSON.stringify(null) };
    }
  }

  // ── POST /api/announce/snapshot — client uploads a cam frame ──
  if (event.httpMethod === 'POST' && isSnapshot) {
    let body;
    try { body = JSON.parse(event.body); } catch { return { statusCode: 400, headers: HDR, body: JSON.stringify({ error: 'bad json' }) }; }
    const { user, imageData } = body;
    if (!user || !imageData) return { statusCode: 400, headers: HDR, body: JSON.stringify({ error: 'missing fields' }) };
    try {
      await announceStore().set('snapshot', JSON.stringify({ user, imageData, ts: Date.now() }));
      return { statusCode: 200, headers: HDR, body: JSON.stringify({ ok: true }) };
    } catch (e) {
      return { statusCode: 500, headers: HDR, body: JSON.stringify({ error: e.message }) };
    }
  }

  // ── POST /api/announce — admin sends or clears announcement ──
  if (event.httpMethod === 'POST' && !isSnapshot) {
    let body;
    try { body = JSON.parse(event.body); } catch { return { statusCode: 400, headers: HDR, body: JSON.stringify({ error: 'bad json' }) }; }
    const { actorCode, text, sound, cam, clear } = body;

    const actor = await resolveActor(actorCode);
    if (!actor || actor.role !== 'owner') return { statusCode: 403, headers: HDR, body: JSON.stringify({ error: 'owner only' }) };

    try {
      if (clear) {
        await announceStore().delete('current');
        await announceStore().delete('snapshot');
      } else {
        if (!text && !sound && !cam) return { statusCode: 400, headers: HDR, body: JSON.stringify({ error: 'nothing to send' }) };
        await announceStore().set('current', JSON.stringify({ text: text || '', sound: !!sound, cam: !!cam, ts: Date.now() }));
      }
      return { statusCode: 200, headers: HDR, body: JSON.stringify({ ok: true }) };
    } catch (e) {
      return { statusCode: 500, headers: HDR, body: JSON.stringify({ error: e.message }) };
    }
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
