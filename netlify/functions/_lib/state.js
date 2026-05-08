const DEFAULT_USERS = [
  { user: "Ryder", role: "owner", code: "82047", envKey: "CODE_RYDER" },
  { user: "Logan", role: "slave owner", code: "63914", envKey: "CODE_LOGAN" },
  { user: "Beckham", role: "slave", code: "39571", envKey: "CODE_BECKHAM" },
  { user: "Kolby", role: "slave", code: "74286", envKey: "CODE_KOLBY" },
  { user: "Levi", role: "slave", code: "51839", envKey: "CODE_LEVI" },
  { user: "Liam", role: "slave", code: "26473", envKey: "CODE_LIAM" },
  { user: "Gibson", role: "slave", code: "98132", envKey: "CODE_GIBSON" },
];

const STORE_NAME = "uwu-proxy";
const MAX_GAME_HTML_SIZE_BYTES = 500_000; // 500KB
const KEYS = {
  codeOverrides: "auth-code-overrides",
  gameIndex: "custom-games-index",
  gamePrefix: "custom-game-html:",
};

const FALLBACK = {
  overrides: Object.create(null),
  gameIndex: [],
  gameHtml: Object.create(null),
};

async function getBlobStore(event) {
  try {
    const blobs = await import("@netlify/blobs");
    if (typeof blobs.connectLambda === "function" && event) {
      blobs.connectLambda(event);
    }
    return blobs.getStore(STORE_NAME);
  } catch {
    // Fallback is intentional so local/dev still works without Netlify Blobs context.
    return null;
  }
}

async function readJSON(store, key, fallback) {
  if (!store) return fallback;
  try {
    const data = await store.get(key, { type: "json" });
    return data == null ? fallback : data;
  } catch {
    return fallback;
  }
}

async function writeJSON(store, key, value) {
  if (!store) return;
  await store.setJSON(key, value);
}

function envCode(env, user) {
  return String(env?.[user.envKey] || user.code);
}

function normalizeCodeOverrides(raw) {
  if (!raw || typeof raw !== "object") return Object.create(null);
  const out = Object.create(null);
  for (const user of DEFAULT_USERS) {
    const value = raw[user.user];
    if (typeof value === "string" && /^\d{5}$/.test(value)) {
      out[user.user] = value;
    }
  }
  return out;
}

function cleanSlug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

function cleanCategory(value) {
  const raw = String(value || "").toLowerCase();
  if (["action", "io", "puzzle", "classic", "casual"].includes(raw)) return raw;
  return "casual";
}

function cleanGameMeta(meta) {
  return {
    slug: cleanSlug(meta?.slug),
    name: String(meta?.name || "").trim().slice(0, 80),
    desc: String(meta?.desc || "").trim().slice(0, 180),
    category: cleanCategory(meta?.category),
    createdBy: String(meta?.createdBy || "").trim().slice(0, 50),
    updatedAt: Number(meta?.updatedAt || Date.now()),
  };
}

async function getCodeOverrides({ event }) {
  const store = await getBlobStore(event);
  if (!store) return FALLBACK.overrides;
  const raw = await readJSON(store, KEYS.codeOverrides, FALLBACK.overrides);
  return normalizeCodeOverrides(raw);
}

async function setCodeOverrides({ event, overrides }) {
  const store = await getBlobStore(event);
  const clean = normalizeCodeOverrides(overrides);
  if (!store) {
    FALLBACK.overrides = clean;
    return;
  }
  await writeJSON(store, KEYS.codeOverrides, clean);
}

async function getEffectiveUsers({ event, env }) {
  const overrides = await getCodeOverrides({ event });
  return DEFAULT_USERS.map((u) => ({
    user: u.user,
    role: u.role,
    code: String(overrides[u.user] || envCode(env, u)),
  }));
}

async function updateUserCode({ event, env, actorCode, user, code }) {
  if (!actorCode || !user || !/^\d{5}$/.test(code || "")) {
    return { ok: false, status: 400, error: "invalid payload" };
  }

  const users = await getEffectiveUsers({ event, env });
  const actor = users.find((u) => u.code === String(actorCode));
  if (!actor || actor.role !== "owner") {
    return { ok: false, status: 403, error: "owner access required" };
  }

  const target = users.find((u) => u.user === user);
  if (!target) return { ok: false, status: 404, error: "user not found" };
  if (users.some((u) => u.user !== user && u.code === code)) {
    return { ok: false, status: 409, error: "code already in use" };
  }

  const defaults = Object.fromEntries(DEFAULT_USERS.map((u) => [u.user, envCode(env, u)]));
  const overrides = await getCodeOverrides({ event });
  if (code === defaults[user]) delete overrides[user];
  else overrides[user] = code;

  await setCodeOverrides({ event, overrides });
  return { ok: true, status: 200, users: await getEffectiveUsers({ event, env }) };
}

async function getGameIndex({ event }) {
  const store = await getBlobStore(event);
  if (!store) return FALLBACK.gameIndex;
  const raw = await readJSON(store, KEYS.gameIndex, []);
  if (!Array.isArray(raw)) return [];
  return raw.map(cleanGameMeta).filter((g) => g.slug && g.name);
}

async function setGameIndex({ event, index }) {
  const clean = Array.isArray(index) ? index.map(cleanGameMeta).filter((g) => g.slug && g.name) : [];
  const store = await getBlobStore(event);
  if (!store) {
    FALLBACK.gameIndex = clean;
    return;
  }
  await writeJSON(store, KEYS.gameIndex, clean);
}

async function getCustomGames({ event }) {
  const list = await getGameIndex({ event });
  return list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

async function getCustomGameHtml({ event, slug }) {
  const clean = cleanSlug(slug);
  if (!clean) return null;
  const store = await getBlobStore(event);
  if (!store) return FALLBACK.gameHtml[clean] || null;
  return store.get(KEYS.gamePrefix + clean, { type: "text" });
}

async function saveCustomGame({ event, actor, payload }) {
  const slug = cleanSlug(payload?.slug || payload?.name);
  const name = String(payload?.name || "").trim().slice(0, 80);
  const desc = String(payload?.desc || "").trim().slice(0, 180);
  const category = cleanCategory(payload?.category);
  const html = String(payload?.html || "");

  if (!slug || !name || !html.trim()) {
    return { ok: false, status: 400, error: "slug, name, and html are required" };
  }
  const htmlBytes = Buffer.byteLength(html, "utf8");
  if (htmlBytes > MAX_GAME_HTML_SIZE_BYTES) {
    return { ok: false, status: 413, error: "html too large (max 500KB)" };
  }

  const store = await getBlobStore(event);
  const now = Date.now();
  const list = await getGameIndex({ event });
  const existing = list.find((g) => g.slug === slug);
  const next = list.filter((g) => g.slug !== slug);
  next.push({
    slug,
    name,
    desc,
    category,
    createdBy: existing?.createdBy || actor || "owner",
    updatedAt: now,
  });

  if (!store) {
    FALLBACK.gameHtml[slug] = html;
  } else {
    await store.set(KEYS.gamePrefix + slug, html);
  }
  await setGameIndex({ event, index: next });
  return { ok: true, status: 200, slug };
}

async function deleteCustomGame({ event, slug }) {
  const clean = cleanSlug(slug);
  if (!clean) return { ok: false, status: 400, error: "invalid slug" };

  const store = await getBlobStore(event);
  const list = await getGameIndex({ event });
  const next = list.filter((g) => g.slug !== clean);
  if (next.length === list.length) return { ok: false, status: 404, error: "game not found" };

  if (!store) {
    delete FALLBACK.gameHtml[clean];
  } else {
    await store.delete(KEYS.gamePrefix + clean);
  }
  await setGameIndex({ event, index: next });
  return { ok: true, status: 200 };
}

module.exports = {
  DEFAULT_USERS,
  cleanSlug,
  getEffectiveUsers,
  updateUserCode,
  getCustomGames,
  getCustomGameHtml,
  saveCustomGame,
  deleteCustomGame,
};
