import express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import multer from "multer";

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));
const app  = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());

// ── Games ────────────────────────────────
const GAMES_JSON = join(__dirname, "public/games/games.json");
const GAMES_DIR  = join(__dirname, "public/games");
const UPLOAD_TMP = join(__dirname, ".upload-tmp");
mkdirSync(UPLOAD_TMP, { recursive: true });
if (!existsSync(GAMES_JSON)) writeFileSync(GAMES_JSON, "[]");

function readGames() {
  try { return JSON.parse(readFileSync(GAMES_JSON, "utf8")); } catch { return []; }
}
function writeGames(data) { writeFileSync(GAMES_JSON, JSON.stringify(data, null, 2)); }

const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, UPLOAD_TMP),
    filename:    (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  limits: { fileSize: 512 * 1024 * 1024 },
});

// ── Users ────────────────────────────────
const DEFAULT_USERS = [
  { user: "Ryder",   role: "owner",       code: process.env.CODE_RYDER   || "82047" },
  { user: "Logan",   role: "slave owner", code: process.env.CODE_LOGAN   || "63914" },
  { user: "Beckham", role: "slave",       code: process.env.CODE_BECKHAM || "39571" },
  { user: "Kolby",   role: "slave",       code: process.env.CODE_KOLBY   || "74286" },
  { user: "Levi",    role: "slave",       code: process.env.CODE_LEVI    || "51839" },
  { user: "Liam",    role: "slave",       code: process.env.CODE_LIAM    || "26473" },
  { user: "Gibson",  role: "slave",       code: process.env.CODE_GIBSON  || "98132" },
];

globalThis.__codeOverrides = globalThis.__codeOverrides || {};
function getUsers() {
  const o = globalThis.__codeOverrides || {};
  return DEFAULT_USERS.map(u => ({ ...u, code: String(o[u.user] || u.code) }));
}

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Expose-Headers":"*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,HEAD",
};

app.options("*", (req, res) => res.set(CORS).status(200).end());

// ── Bare v3 proxy ────────────────────────
app.all("/bare/*", async (req, res) => {
  res.set(CORS);
  const xBareUrl = req.headers["x-bare-url"];

  if ((req.method === "GET" || req.method === "HEAD") && !xBareUrl) {
    return res.json({ versions: ["v3"], language: "JavaScript", memoryUsage: 0,
      maintainer: {}, project: { name: "uwu-gaming", version: "2.0.0" } });
  }
  if (!xBareUrl) return res.status(400).json({ code: "MISSING_BARE_URL", id: "err", message: "X-Bare-Url required" });

  let reqHeaders = {};
  try { reqHeaders = JSON.parse(req.headers["x-bare-headers"] || "{}"); } catch {}
  const fwdHdrs    = JSON.parse(req.headers["x-bare-forward-headers"] || "[]");
  const passHdrs   = JSON.parse(req.headers["x-bare-pass-headers"]    || "[]");
  const passStatus = JSON.parse(req.headers["x-bare-pass-status"]     || "[]");
  for (const h of fwdHdrs) { const v = req.headers[h.toLowerCase()]; if (v) reqHeaders[h] = v; }

  try {
    const fetchOpts = { method: req.method, headers: reqHeaders, redirect: "manual" };
    if (!["GET", "HEAD"].includes(req.method)) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      fetchOpts.body = Buffer.concat(chunks);
    }
    const upstream = await fetch(xBareUrl, fetchOpts);
    const resHdrs  = {};
    upstream.headers.forEach((v, k) => { resHdrs[k] = v; });
    for (const h of passHdrs) { const v = upstream.headers.get(h); if (v != null) res.setHeader(h, v); }
    res.setHeader("x-bare-status",      String(upstream.status));
    res.setHeader("x-bare-status-text", upstream.statusText || "OK");
    res.setHeader("x-bare-headers",     JSON.stringify(resHdrs));
    res.setHeader("content-type",       "application/octet-stream");
    const status = passStatus.includes(upstream.status) ? upstream.status : 200;
    return res.status(status).send(Buffer.from(await upstream.arrayBuffer()));
  } catch (err) {
    return res.status(500).json({ code: "UNKNOWN", id: "err", message: err.message });
  }
});

// Service workers need scope "/"
const SW_FILES = { "/sw.js": join(__dirname, "public/sw.js"), "/uv/sw.js": join(__dirname, "public/uv/sw.js") };
app.get(Object.keys(SW_FILES), (req, res) => {
  res.setHeader("Service-Worker-Allowed", "/");
  res.sendFile(SW_FILES[req.path]);
});

// ── Auth ─────────────────────────────────
app.post("/api/auth", (req, res) => {
  res.set(CORS);
  const code  = String(req.body?.code || "");
  const match = getUsers().find(u => u.code === code);
  if (!match) return res.status(401).json({ error: "wrong code" });
  return res.json({ user: match.user, role: match.role, channel: `uwugaming-${code}` });
});

app.get("/api/auth-codes", (req, res) => res.set(CORS).json({ users: getUsers() }));

app.post("/api/auth-codes", (req, res) => {
  res.set(CORS);
  const actorCode = String(req.body?.actorCode || "");
  const user = String(req.body?.user || "");
  const code = String(req.body?.code || "").trim();
  if (!actorCode || !user || !/^\d{5}$/.test(code)) return res.status(400).json({ error: "invalid payload" });
  const users = getUsers();
  const actor = users.find(u => u.code === actorCode);
  if (!actor || actor.role !== "owner") return res.status(403).json({ error: "owner only" });
  const target = users.find(u => u.user === user);
  if (!target) return res.status(404).json({ error: "user not found" });
  if (users.some(u => u.user !== user && u.code === code)) return res.status(409).json({ error: "code in use" });
  const defaults = Object.fromEntries(DEFAULT_USERS.map(u => [u.user, u.code]));
  if (code === defaults[user]) delete globalThis.__codeOverrides[user];
  else globalThis.__codeOverrides[user] = code;
  return res.json({ ok: true, users: getUsers() });
});

// ── AI ───────────────────────────────────
app.post("/api/ai", async (req, res) => {
  res.set(CORS);
  const key = process.env.GROQ_API_KEY;
  if (!key) return res.status(503).json({ error: "GROQ_API_KEY not set" });
  const messages = req.body?.messages;
  if (!Array.isArray(messages)) return res.status(400).json({ error: "messages must be an array" });
  try {
    const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: "You are a chill helpful AI on Uwu Gaming. Be concise and friendly." }, ...messages],
        max_tokens: 1024, temperature: 0.75,
      }),
    });
    return res.status(upstream.status).json(await upstream.json());
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// ── Chat / Presence ──────────────────────
const CHAT_CHANNEL     = "uwugaming-chat";
const PRESENCE_CHANNEL = "uwugaming-presence";

app.post("/api/chat/send", async (req, res) => {
  res.set(CORS);
  const user   = req.headers["x-chat-user"] || "anon";
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString();
  if (!body.trim()) return res.status(400).json({ error: "empty message" });
  try {
    const r = await fetch(`https://ntfy.sh/${CHAT_CHANNEL}`, {
      method: "POST", headers: { "Title": user, "Content-Type": "text/plain" }, body,
    });
    return res.status(r.ok ? 200 : 502).end();
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

app.get("/api/chat/stream", async (req, res) => {
  res.set({ ...CORS, "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "X-Accel-Buffering": "no" });
  try {
    const r = await fetch(`https://ntfy.sh/${CHAT_CHANNEL}/sse`);
    for await (const chunk of r.body) res.write(chunk);
    res.end();
  } catch { res.end(); }
});

app.post("/api/presence", async (req, res) => {
  res.set(CORS);
  const code  = String(req.body?.code || "");
  const match = getUsers().find(u => u.code === code);
  if (!match) return res.status(401).json({ error: "unauthorized" });
  try {
    await fetch(`https://ntfy.sh/${PRESENCE_CHANNEL}`, {
      method: "POST", headers: { "Title": match.user, "Content-Type": "text/plain" }, body: "online",
    });
    return res.status(200).end();
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

app.get("/api/presence/stream", async (req, res) => {
  res.set({ ...CORS, "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "X-Accel-Buffering": "no" });
  try {
    const r = await fetch(`https://ntfy.sh/${PRESENCE_CHANNEL}/sse`);
    for await (const chunk of r.body) res.write(chunk);
    res.end();
  } catch { res.end(); }
});

// ── Games API ────────────────────────────
app.get("/api/games/list", (req, res) => res.set(CORS).json(readGames()));

app.post("/api/games/upload", upload.single("zip"), async (req, res) => {
  res.set(CORS);
  const actorCode = String(req.body?.adminCode || "");
  const users = getUsers();
  const actor = users.find(u => u.code === actorCode);
  if (!actor || actor.role !== "owner") {
    if (req.file) rmSync(req.file.path, { force: true });
    return res.status(403).json({ error: "owner only" });
  }
  const name = String(req.body?.name || "").trim().slice(0, 60);
  const slug = String(req.body?.slug || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").slice(0, 40);
  const cat  = String(req.body?.category || "action").trim();
  const desc = String(req.body?.desc || "").trim().slice(0, 120);
  if (!name || !slug || !req.file) {
    if (req.file) rmSync(req.file.path, { force: true });
    return res.status(400).json({ error: "name, slug, and zip required" });
  }
  const destDir = join(GAMES_DIR, slug);
  try {
    mkdirSync(destDir, { recursive: true });
    await execAsync(`unzip -o "${req.file.path}" -d "${destDir}"`);
    rmSync(req.file.path, { force: true });
    const { stdout } = await execAsync(`ls "${destDir}"`);
    const entries = stdout.trim().split("\n").filter(Boolean);
    if (entries.length === 1) {
      const inner = join(destDir, entries[0]);
      const stat  = await execAsync(`test -d "${inner}" && echo dir || echo file`);
      if (stat.stdout.trim() === "dir") {
        await execAsync(`mv "${inner}"/* "${destDir}/" 2>/dev/null || true`);
        await execAsync(`rmdir "${inner}" 2>/dev/null || true`);
      }
    }
    if (!existsSync(join(destDir, "index.html"))) {
      rmSync(destDir, { recursive: true, force: true });
      return res.status(400).json({ error: "zip must contain index.html at root" });
    }
    const games = readGames().filter(g => g.slug !== slug);
    games.push({ name, slug, category: cat, tag: cat, desc, url: `/games/${slug}/index.html`, uploaded: true });
    writeGames(games);
    return res.json({ ok: true, slug, url: `/games/${slug}/index.html` });
  } catch (e) {
    rmSync(destDir, { recursive: true, force: true });
    if (req.file) rmSync(req.file.path, { force: true });
    return res.status(500).json({ error: e.message });
  }
});

app.post("/api/games/delete", async (req, res) => {
  res.set(CORS);
  const actorCode = String(req.body?.adminCode || "");
  const actor = getUsers().find(u => u.code === actorCode);
  if (!actor || actor.role !== "owner") return res.status(403).json({ error: "owner only" });
  const slug = String(req.body?.slug || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (!slug) return res.status(400).json({ error: "slug required" });
  const games = readGames();
  const game  = games.find(g => g.slug === slug && g.uploaded);
  if (!game) return res.status(404).json({ error: "game not found" });
  const destDir = join(GAMES_DIR, slug);
  if (existsSync(destDir)) rmSync(destDir, { recursive: true, force: true });
  writeGames(games.filter(g => g.slug !== slug));
  return res.json({ ok: true });
});

app.use(express.static(join(__dirname, "public")));
app.listen(PORT, () => console.log(`Uwu Gaming v2.0.0 — http://localhost:${PORT}`));
