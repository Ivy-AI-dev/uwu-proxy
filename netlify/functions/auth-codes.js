import { getRows, upsertRow, deleteRow } from './lib/store.js';

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

async function mergedUsers() {
  const rows = await getRows();
  const deleted = new Set(
    Object.entries(rows).filter(([, v]) => v.role === 'deleted').map(([k]) => k)
  );
  return DEFAULTS
    .filter(d => !deleted.has(d.user))
    .map(d => {
      const ov = rows[d.user];
      return (ov && ov.role !== 'deleted') ? { user: d.user, code: ov.code, role: ov.role } : d;
    })
    .concat(
      Object.entries(rows)
        .filter(([k, v]) => v.role !== 'deleted' && !DEFAULTS.find(d => d.user === k))
        .map(([k, v]) => ({ user: k, code: v.code, role: v.role }))
    );
}

export const handler = async (event) => {
  if (event.httpMethod === 'GET') {
    try {
      const users = await mergedUsers();
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
    try { all = await mergedUsers(); } catch { all = DEFAULTS; }
    const actor = all.find(u => u.code === String(actorCode));
    if (!actor || actor.role !== 'owner') return { statusCode: 403, body: JSON.stringify({ error: 'owner only' }) };

    if (action === 'delete') {
      try {
        const isDefault = DEFAULTS.find(d => d.user === user);
        if (isDefault) {
          await upsertRow(user, isDefault.code, 'deleted');
        } else {
          await deleteRow(user);
        }
      } catch (e) {
        return { statusCode: 500, headers: HDR, body: JSON.stringify({ error: 'store error: ' + e.message }) };
      }
      return { statusCode: 200, headers: HDR, body: JSON.stringify({ ok: true }) };
    }

    if (!/^\d{5}$/.test(code)) return { statusCode: 400, body: JSON.stringify({ error: 'code must be 5 digits' }) };
    try {
      await upsertRow(user, String(code), role || 'slave');
    } catch (e) {
      return { statusCode: 500, headers: HDR, body: JSON.stringify({ error: 'store error: ' + e.message }) };
    }
    return { statusCode: 200, headers: HDR, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
