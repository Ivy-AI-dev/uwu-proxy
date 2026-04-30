import { createServer } from "http";
import { createBareServer } from "@tomphttp/bare-server-node";
import express from "express";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const bareServer = createBareServer("/bare/");

const PORT       = process.env.PORT        || 8080;
const ADMIN_KEY  = process.env.ADMIN_KEY   || "uwuadmin";
const VERSION    = "1.0.0";
const START_TIME = Date.now();

let proxyRequests = 0;

app.use(express.json());

// UV service worker entry — needs expanded scope header
app.get("/uv/sw.js", (req, res) => {
  res.setHeader("Service-Worker-Allowed", "/");
  res.sendFile(join(__dirname, "public/uv/sw.js"));
});

// Version endpoint (public)
app.get("/api/version", (req, res) => {
  res.json({ version: VERSION });
});

// Admin auth middleware
function requireAdmin(req, res, next) {
  const key = req.query.key || req.headers["x-admin-key"];
  if (key === ADMIN_KEY) return next();
  res.status(401).json({ error: "unauthorized" });
}

// Admin stats API
app.get("/admin/api/stats", requireAdmin, (req, res) => {
  const uptimeMs = Date.now() - START_TIME;
  const uptimeSec = Math.floor(uptimeMs / 1000);
  const h = Math.floor(uptimeSec / 3600);
  const m = Math.floor((uptimeSec % 3600) / 60);
  const s = uptimeSec % 60;
  res.json({
    version:       VERSION,
    uptime:        `${h}h ${m}m ${s}s`,
    uptimeMs,
    proxyRequests,
    nodeVersion:   process.version,
    platform:      process.platform,
    memUsageMb:    Math.round(process.memoryUsage().rss / 1024 / 1024),
    port:          PORT,
  });
});

// Admin panel HTML
app.get("/admin", requireAdmin, (req, res) => {
  const key = req.query.key;
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Admin — uwu proxy v${VERSION}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Comfortaa:wght@600;700&display=swap" rel="stylesheet"/>
  <style>
    :root{--bg:#050510;--bg2:#0c0c1e;--bg3:#13132b;--border:rgba(255,255,255,0.07);--pink:#ff79c6;--purple:#bd93f9;--mint:#50fa7b;--red:#ff5555;--yellow:#f1fa8c;--text:#f8f8f2;--dim:#6272a4;--r:12px;}
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:var(--bg);color:var(--text);font-family:'JetBrains Mono',monospace;font-size:13px;line-height:1.6;min-height:100vh;}
    .header{padding:24px 32px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
    .logo{font-family:'Comfortaa',sans-serif;font-size:1.1rem;font-weight:700;}
    .badge{padding:4px 10px;border-radius:20px;background:rgba(255,121,198,0.12);border:1px solid rgba(255,121,198,0.25);color:var(--pink);font-size:0.72rem;font-family:'JetBrains Mono',monospace;}
    .main{max-width:900px;margin:0 auto;padding:32px 24px;}
    h2{font-family:'Comfortaa',sans-serif;font-size:1rem;font-weight:700;color:var(--dim);text-transform:uppercase;letter-spacing:.08em;margin-bottom:16px;}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-bottom:36px;}
    .stat{background:var(--bg2);border:1px solid var(--border);border-radius:var(--r);padding:16px 18px;}
    .stat-label{font-size:.72rem;color:var(--dim);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;}
    .stat-value{font-size:1.3rem;font-weight:600;color:var(--text);}
    .stat-value.green{color:var(--mint);}
    .stat-value.pink{color:var(--pink);}
    .stat-value.purple{color:var(--purple);}
    .actions{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:36px;}
    .btn{padding:9px 18px;border-radius:8px;font-family:'JetBrains Mono',monospace;font-size:.8rem;font-weight:500;cursor:pointer;border:1px solid var(--border);background:var(--bg2);color:var(--text);transition:background .2s,border-color .2s;}
    .btn:hover{background:var(--bg3);border-color:rgba(255,255,255,.15);}
    .btn.danger{border-color:rgba(255,85,85,.3);color:var(--red);}
    .btn.danger:hover{background:rgba(255,85,85,.08);}
    .log{background:var(--bg2);border:1px solid var(--border);border-radius:var(--r);padding:16px;font-size:.78rem;color:var(--dim);min-height:80px;white-space:pre;}
    .dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--mint);margin-right:8px;animation:pulse 2s ease-in-out infinite;}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
    .footer{padding:20px 32px;border-top:1px solid var(--border);color:var(--dim);font-size:.75rem;}
    a{color:var(--pink);text-decoration:none;}
    a:hover{text-decoration:underline;}
  </style>
</head>
<body>
<div class="header">
  <span class="logo">uwu proxy <span style="color:var(--dim);font-size:.85rem;font-weight:400">admin</span></span>
  <span class="badge">v${VERSION}</span>
</div>
<div class="main">
  <h2>Server Status</h2>
  <div class="grid" id="stats-grid">
    <div class="stat"><div class="stat-label">Status</div><div class="stat-value green"><span class="dot"></span>online</div></div>
    <div class="stat"><div class="stat-label">Version</div><div class="stat-value pink" id="s-version">—</div></div>
    <div class="stat"><div class="stat-label">Uptime</div><div class="stat-value" id="s-uptime">—</div></div>
    <div class="stat"><div class="stat-label">Proxy Requests</div><div class="stat-value purple" id="s-requests">—</div></div>
    <div class="stat"><div class="stat-label">Memory</div><div class="stat-value" id="s-mem">—</div></div>
    <div class="stat"><div class="stat-label">Node.js</div><div class="stat-value" id="s-node">—</div></div>
    <div class="stat"><div class="stat-label">Platform</div><div class="stat-value" id="s-platform">—</div></div>
    <div class="stat"><div class="stat-label">Port</div><div class="stat-value" id="s-port">—</div></div>
  </div>

  <h2>Actions</h2>
  <div class="actions">
    <button class="btn" onclick="refresh()">Refresh Stats</button>
    <button class="btn" onclick="resetCounter()">Reset Request Counter</button>
    <a href="/?key=${key}" class="btn" style="display:inline-flex;align-items:center;">Back to Site</a>
  </div>

  <h2>Info</h2>
  <div class="log" id="info-log">Loading…</div>
</div>
<div class="footer">uwu proxy v${VERSION} — admin panel — <a href="/">home</a></div>
<script>
  const KEY = new URLSearchParams(location.search).get('key');
  async function loadStats() {
    const r = await fetch('/admin/api/stats?key=' + KEY);
    const d = await r.json();
    document.getElementById('s-version').textContent   = 'v' + d.version;
    document.getElementById('s-uptime').textContent    = d.uptime;
    document.getElementById('s-requests').textContent  = d.proxyRequests.toLocaleString();
    document.getElementById('s-mem').textContent       = d.memUsageMb + ' MB';
    document.getElementById('s-node').textContent      = d.nodeVersion;
    document.getElementById('s-platform').textContent  = d.platform;
    document.getElementById('s-port').textContent      = d.port;
    document.getElementById('info-log').textContent    =
      'version:         ' + d.version + '\\n' +
      'uptime:          ' + d.uptime + '\\n' +
      'proxy_requests:  ' + d.proxyRequests + '\\n' +
      'memory_rss:      ' + d.memUsageMb + ' MB\\n' +
      'node:            ' + d.nodeVersion + '\\n' +
      'platform:        ' + d.platform + '\\n' +
      'port:            ' + d.port;
  }
  async function resetCounter() {
    await fetch('/admin/api/reset?key=' + KEY, { method: 'POST' });
    loadStats();
  }
  function refresh() { loadStats(); }
  loadStats();
  setInterval(loadStats, 10000);
</script>
</body>
</html>`);
});

// Admin reset counter
app.post("/admin/api/reset", requireAdmin, (req, res) => {
  proxyRequests = 0;
  res.json({ ok: true });
});

app.use(express.static(join(__dirname, "public")));

const server = createServer();

server.on("request", (req, res) => {
  if (bareServer.shouldRoute(req)) {
    proxyRequests++;
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.destroy();
  }
});

server.listen(PORT, () => {
  console.log(`\nuwu proxy v${VERSION} running at http://localhost:${PORT}`);
  console.log(`admin panel: http://localhost:${PORT}/admin?key=${ADMIN_KEY}\n`);
});
