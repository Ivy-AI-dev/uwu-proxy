import { getStore } from '@netlify/blobs';

function store() {
  return getStore('uwu-users');
}

// Returns { [username]: { code, role } } for all DB-tracked users.
// Default users not in here fall back to DEFAULTS in the caller.
export async function getRows() {
  const data = await store().get('users', { type: 'json' });
  return data || {};
}

export async function upsertRow(username, code, role) {
  const users = await getRows();
  users[username] = { code, role };
  await store().set('users', JSON.stringify(users));
}

export async function deleteRow(username) {
  const users = await getRows();
  delete users[username];
  await store().set('users', JSON.stringify(users));
}
