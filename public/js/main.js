/* Uwu Gaming — main.js v2.6 */

const VERSION = "2.6";

// ── Apps data ────────────────────────────
const APPS = [
  { name: "YouTube",     url: "https://youtube.com/",         tag: "media",        desc: "Watch & stream videos",      bg: "#ff0000" },
  { name: "Netflix",     url: "https://netflix.com/",         tag: "media",        desc: "Movies & TV shows",          bg: "#e50914" },
  { name: "Spotify",     url: "https://open.spotify.com/",    tag: "media",        desc: "Stream music & podcasts",    bg: "#1db954" },
  { name: "Discord",     url: "https://discord.com/app",      tag: "social",       desc: "Chat with your server",      bg: "#5865f2" },
  { name: "Instagram",   url: "https://instagram.com/",       tag: "social",       desc: "Photos & reels",             bg: "#e1306c" },
  { name: "Twitter / X", url: "https://x.com/",               tag: "social",       desc: "What's happening",           bg: "#000000" },
  { name: "Reddit",      url: "https://reddit.com/",          tag: "social",       desc: "Front page of the internet", bg: "#ff4500" },
  { name: "TikTok",      url: "https://www.tiktok.com/",      tag: "social",       desc: "Short-form video",           bg: "#010101" },
  { name: "ChatGPT",     url: "https://chatgpt.com/",         tag: "ai",           desc: "AI by OpenAI",               bg: "#10a37f" },
  { name: "Claude",      url: "https://claude.ai/",           tag: "ai",           desc: "AI by Anthropic",            bg: "#d97706" },
  { name: "Gemini",      url: "https://gemini.google.com/",   tag: "ai",           desc: "AI by Google",               bg: "#4285f4" },
  { name: "Google",      url: "https://google.com/",          tag: "productivity", desc: "Search the web",             bg: "#4285f4" },
  { name: "Gmail",       url: "https://mail.google.com/",     tag: "productivity", desc: "Email by Google",            bg: "#ea4335" },
  { name: "Google Docs", url: "https://docs.google.com/",     tag: "productivity", desc: "Write & collaborate",        bg: "#4285f4" },
  { name: "Notion",      url: "https://notion.so/",           tag: "productivity", desc: "Notes, docs & wikis",        bg: "#ffffff" },
  { name: "GitHub",      url: "https://github.com/",          tag: "dev",          desc: "Code & collaborate",         bg: "#24292f" },
];

let GAMES = [];
const QUICK_APPS  = APPS.slice(0, 6);

let proxyReady = false;

// ── Games ────────────────────────────────
async function loadGames() {
  try {
    const res = await fetch("/games/games.json");
    if (!res.ok) return;
    const data = await res.json();
    if (!Array.isArray(data)) return;
    GAMES = data.map(g => ({
      name:     String(g.name || ""),
      url:      String(g.url  || `/games/${g.slug}/index.html`),
      icon:     g.icon  || "",
      color:    g.color || "",
      tag:      g.category || g.tag || "casual",
      category: g.category || g.tag || "casual",
      desc:     String(g.desc || ""),
    }));
  } catch (e) {
    console.warn("loadGames:", e);
  }
  renderGames();
  renderQuickGames();
}

// ── Proxy ────────────────────────────────
async function initProxy() {
  proxyReady = true;
  setProxyStatus("active", "proxy active");
  document.getElementById("search-btn")?.removeAttribute("disabled");
  try { navigator.serviceWorker.register("/uv/sw.js", { scope: "/service/" }).catch(() => {}); } catch {}
}

function setProxyStatus(state, text) {
  const el  = document.getElementById("proxy-status");
  const txt = document.getElementById("proxy-status-text");
  if (!el || !txt) return;
  el.className    = "proxy-badge " + state;
  txt.textContent = text;
}

// ── Frame overlay ────────────────────────
function initOverlay() {
  if (document.getElementById("game-overlay")) {
    // already in HTML — just ensure closeGameOverlay is global
    if (typeof window.openGameOverlay !== "function") registerOverlayFns();
    return;
  }
  const div = document.createElement("div");
  div.id = "game-overlay";
  div.style.cssText = "display:none;position:fixed;inset:0;z-index:9999;flex-direction:column;background:#000";
  div.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;padding:8px 16px;background:#0d0d1a;border-bottom:1px solid #1e1e3a;flex-shrink:0">
      <button onclick="closeGameOverlay()" style="background:rgba(255,255,255,.08);border:none;color:#fff;padding:6px 16px;border-radius:8px;cursor:pointer;font-family:sans-serif;font-size:13px">← back</button>
      <span id="go-title" style="flex:1;color:#c4c9e8;font-family:sans-serif;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></span>
      <button onclick="document.getElementById('go-frame').requestFullscreen()" style="background:rgba(255,255,255,.08);border:none;color:#fff;padding:6px 14px;border-radius:8px;cursor:pointer;font-size:13px">⛶</button>
    </div>
    <iframe id="go-frame" style="flex:1;border:none;width:100%;height:100%;display:block" allowfullscreen allow="fullscreen;autoplay;gamepad;clipboard-write" sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-downloads allow-modals allow-top-navigation-by-user-activation"></iframe>`;
  document.body.appendChild(div);
  registerOverlayFns();
  window.addEventListener("popstate", () => {
    const o = document.getElementById("game-overlay");
    if (o && o.style.display !== "none") closeGameOverlay();
  });
}

function registerOverlayFns() {
  window.openGameOverlay = function(url, name) {
    const o = document.getElementById("game-overlay");
    if (!o) { location.href = url; return; }
    document.getElementById("go-title").textContent = name || "";
    document.getElementById("go-frame").src = url;
    o.style.display = "flex";
    document.body.style.overflow = "hidden";
    history.pushState({ gameOverlay: true }, "", location.href);
  };
  window.closeGameOverlay = function() {
    const o = document.getElementById("game-overlay");
    if (!o) return;
    document.getElementById("go-frame").src = "";
    o.style.display = "none";
    document.body.style.overflow = "";
  };
}

// ── Navigation ───────────────────────────
function navigate(url) {
  if (!url) return;
  if (url.startsWith("/")) { location.href = url; return; }
  if (!proxyReady) { toast("proxy not ready yet", "error"); return; }
  addRecent(url);
  // open inside overlay so tab/URL never change
  if (typeof window.openGameOverlay === "function") {
    let hostname = url;
    try { hostname = new URL(url.startsWith("http") ? url : "https://" + url).hostname.replace(/^www\./, ""); } catch {}
    window.openGameOverlay(`/proxy.html?url=${encodeURIComponent(url)}`, hostname);
  } else {
    location.href = `/proxy.html?url=${encodeURIComponent(url)}`;
  }
}

function handleSearch() {
  const val = (document.getElementById("search-input")?.value || "").trim();
  if (!val) return;
  const looksLikeUrl = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(val);
  navigate(looksLikeUrl ? val : `https://duckduckgo.com/?q=${encodeURIComponent(val)}`);
}

// ── Sidebar ──────────────────────────────
const SIDEBAR_LINKS = [
  { path: "/",              title: "Home",    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>` },
  { path: "/browser.html",  title: "Browser", icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>` },
  { path: "/games.html",    title: "Games",   icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4m-2-2v4"/><circle cx="17" cy="11" r="1" fill="currentColor"/><circle cx="15" cy="13" r="1" fill="currentColor"/></svg>` },
  { path: "/apps.html",     title: "Apps",    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>` },
  { path: "/chat.html",     title: "Chat",    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>` },
  { path: "/ai.html",       title: "AI",      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M22 2 12 12"/><path d="m17 7 5-5"/></svg>` },
  { path: "/cheats.html",   title: "Cheats",  icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` },
];

function buildSidebar() {
  const nav = document.getElementById("sidebar");
  if (!nav) return;
  const cur = location.pathname === "/index.html" ? "/" : location.pathname;
  const session = JSON.parse(localStorage.getItem("uwu_session") || "{}");

  nav.innerHTML = `
    <a href="/" class="sb-logo" title="Uwu Gaming">
      <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#e8196e"/>
        <path d="M14 13 L14 27 Q14 35 24 35 Q34 35 34 27 L34 13" stroke="white" stroke-width="5" stroke-linecap="round" fill="none"/>
      </svg>
    </a>
    ${SIDEBAR_LINKS.map(l => `<a href="${l.path}" class="sb-btn${cur === l.path ? " active" : ""}" title="${l.title}">${l.icon}</a>`).join("")}
    ${session.role === "owner" ? `<a href="/admin.html" class="sb-btn${cur === "/admin.html" ? " active" : ""}" title="Admin"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></a>` : ""}
    <div class="sb-spacer"></div>
    <button class="sb-btn sb-settings-btn" id="settings-btn" title="Settings"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 1 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button>
    <div class="sb-user" id="sb-user">${session.user ? session.user.charAt(0).toUpperCase() : "?"}</div>
    <button class="sb-logout" id="logout-btn" title="Logout"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></button>
  `;

  document.getElementById("logout-btn")?.addEventListener("click", () => {
    localStorage.removeItem("uwu_session");
    location.replace("/login.html");
  });
}

// ── Favicon helper ───────────────────────
function faviconUrl(siteUrl) {
  if (typeof siteUrl === "string" && siteUrl.startsWith("/")) return "/img/game-icon.svg";
  try { return `https://www.google.com/s2/favicons?domain=${new URL(siteUrl).hostname}&sz=64`; }
  catch { return ""; }
}

// ── Game thumbnail ────────────────────────
const CATEGORY_GRAD = {
  action:  "linear-gradient(135deg,#e8196e,#ff5e35)",
  classic: "linear-gradient(135deg,#7c3aed,#db2777)",
  casual:  "linear-gradient(135deg,#0ea5e9,#6366f1)",
  io:      "linear-gradient(135deg,#059669,#0ea5e9)",
  puzzle:  "linear-gradient(135deg,#d97706,#dc2626)",
};
const THUMB_GRADIENTS = CATEGORY_GRAD;
function gameThumbHtml(game) {
  const grad   = game.color || CATEGORY_GRAD[game.category] || CATEGORY_GRAD.casual;
  const letter = (game.name || "?").charAt(0).toUpperCase();
  const fallback = `<div class="game-thumb-inner" style="background:${grad};display:none"><span class="game-thumb-letter">${escHtml(letter)}</span></div>`;
  const iconUrl  = game.icon || (!game.url?.startsWith("/") ? faviconUrl(game.url) : "");
  if (!iconUrl) return `<div class="game-thumb-inner" style="background:${grad}"><span class="game-thumb-letter">${escHtml(letter)}</span></div>`;
  return `<img src="${escHtml(iconUrl)}" alt="" loading="lazy" class="game-thumb-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />${fallback}`;
}

// ── Escape HTML ──────────────────────────
function escHtml(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// ── Renderers ────────────────────────────
function renderQuickGames() {
  const el = document.getElementById("quick-games");
  if (!el) return;
  const items = GAMES.slice(0, 6);
  if (!items.length) { el.innerHTML = '<div style="color:var(--text3);font-size:14px">no games yet — upload some in admin</div>'; return; }
  el.innerHTML = items.map(g => {
    const grad   = g.color || CATEGORY_GRAD[g.category] || CATEGORY_GRAD.casual;
    const letter = (g.name||"?").charAt(0).toUpperCase();
    const iconUrl = g.icon || (!g.url?.startsWith("/") ? faviconUrl(g.url) : "");
    const iconHtml = iconUrl
      ? `<img src="${escHtml(iconUrl)}" alt="" loading="lazy" style="width:32px;height:32px;border-radius:8px;object-fit:cover" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div style="display:none;width:32px;height:32px;border-radius:8px;background:${grad};align-items:center;justify-content:center;font-size:16px;font-weight:900;color:rgba(255,255,255,.6)">${escHtml(letter)}</div>`
      : `<div style="width:32px;height:32px;border-radius:8px;background:${grad};display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:rgba(255,255,255,.6)">${escHtml(letter)}</div>`;
    return `
    <div class="card" data-url="${escHtml(g.url)}" data-name="${escHtml(g.name)}" style="cursor:pointer">
      <div class="card-favicon">${iconHtml}</div>
      <div class="card-name">${escHtml(g.name)}</div>
      <div class="card-desc">${escHtml(g.desc)}</div>
      <div class="card-tag tag-${g.tag}">${g.tag}</div>
    </div>`;
  }).join("");
  el.querySelectorAll(".card").forEach(c => c.addEventListener("click", () => openGame(c.dataset.url, c.dataset.name)));
}

function renderQuickApps() {
  const el = document.getElementById("quick-apps");
  if (!el) return;
  el.innerHTML = QUICK_APPS.map(a => `
    <div class="card" data-url="${escHtml(a.url)}" style="cursor:pointer">
      <div class="card-favicon"><img src="${escHtml(faviconUrl(a.url))}" alt="" loading="lazy" onerror="this.style.opacity=0" /></div>
      <div class="card-name">${escHtml(a.name)}</div>
      <div class="card-desc">${escHtml(a.desc)}</div>
      <div class="card-tag tag-${a.tag}">${a.tag}</div>
    </div>`).join("");
  el.querySelectorAll(".card").forEach(c => c.addEventListener("click", () => navigate(c.dataset.url)));
}

function renderGames(filter = "all") {
  const grid = document.getElementById("games-grid");
  if (!grid) return;
  const list = filter === "all" ? GAMES : GAMES.filter(g => g.category === filter);
  if (!list.length) {
    grid.innerHTML = `<div class="games-empty"><p>${filter === "all" ? "No games uploaded yet." : "No " + filter + " games."}</p><p style="font-size:13px">Ask the owner to upload some in the admin panel.</p></div>`;
    return;
  }
  grid.innerHTML = list.map(g => `
    <div class="game-card" data-url="${escHtml(g.url)}" data-name="${escHtml(g.name)}">
      <div class="game-thumb">${gameThumbHtml(g)}</div>
      <div class="game-info">
        <div class="game-name">${escHtml(g.name)}</div>
        <div class="game-desc">${escHtml(g.desc)}</div>
        <div class="game-footer">
          <div class="card-tag tag-${g.tag}">${g.tag}</div>
          <button class="play-btn">Play</button>
        </div>
      </div>
    </div>`).join("");
  grid.querySelectorAll(".game-card").forEach(card => {
    const play = () => openGame(card.dataset.url, card.dataset.name);
    card.addEventListener("click", play);
    card.querySelector(".play-btn")?.addEventListener("click", e => { e.stopPropagation(); play(); });
  });
}

function renderApps(filter = "all") {
  const grid = document.getElementById("apps-grid");
  if (!grid) return;
  const list = filter === "all" ? APPS : APPS.filter(a => a.tag === filter);
  grid.innerHTML = list.map(a => `
    <div class="app-card" data-url="${escHtml(a.url)}">
      <div class="app-icon" style="background:${a.bg}22;border:1px solid ${a.bg}44">
        <img src="${escHtml(faviconUrl(a.url))}" alt="${escHtml(a.name)}" loading="lazy" onerror="this.style.opacity=0" />
      </div>
      <div class="app-name">${escHtml(a.name)}</div>
      <div class="app-desc">${escHtml(a.desc)}</div>
      <div class="card-tag tag-${a.tag}">${a.tag}</div>
    </div>`).join("");
  grid.querySelectorAll(".app-card").forEach(c => c.addEventListener("click", () => navigate(c.dataset.url)));
}

// ── Open game ────────────────────────────
function openGame(url, name) {
  if (!url) return;
  if (typeof openGameOverlay === "function") { openGameOverlay(url, name); return; }
  location.href = url;
}

// ── Filters ──────────────────────────────
function initFilters(id, renderFn) {
  document.getElementById(id)?.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(`#${id} .filter-btn`).forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderFn(btn.dataset.filter);
    });
  });
}

// ── Recent ───────────────────────────────
const RECENT_KEY = "uwug_recent";
function getRecent() { try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; } }
window.__addRecent = function(url) { addRecent(url); };
function addRecent(url) {
  const list = getRecent().filter(r => r.url !== url);
  try {
    list.unshift({ url, domain: new URL(url).hostname.replace(/^www\./, ""), ts: Date.now() });
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 8)));
    renderRecent();
  } catch {}
}
function clearRecent() { localStorage.removeItem(RECENT_KEY); renderRecent(); toast("history cleared", "success"); }

function renderRecent() {
  const grid = document.getElementById("recent-grid");
  if (!grid) return;
  const list = getRecent();
  if (!list.length) { grid.innerHTML = '<div class="recent-empty">nothing yet — browse something.</div>'; return; }
  grid.innerHTML = list.map(r => `
    <div class="recent-card" data-url="${escHtml(r.url)}" title="${escHtml(r.url)}">
      <div class="recent-favicon"><img src="${escHtml(faviconUrl(r.url))}" alt="" loading="lazy" onerror="this.style.opacity=0" /></div>
      <div class="recent-domain">${escHtml(r.domain)}</div>
    </div>`).join("");
  grid.querySelectorAll(".recent-card").forEach(c => c.addEventListener("click", () => navigate(c.dataset.url)));
}

// ── Toast ────────────────────────────────
function toast(msg, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}
window.toast = toast;

// ── Settings / Cloak ─────────────────────
function loadCloak() {
  const title = localStorage.getItem("uwug_cloak_title");
  const icon  = localStorage.getItem("uwug_cloak_icon");
  if (title) document.title = title;
  if (icon) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = icon;
  }
}

const CLOAK_PRESETS = [
  { label: "Google",       title: "Google",                              icon: "https://www.google.com/favicon.ico" },
  { label: "Docs",         title: "Untitled document - Google Docs",     icon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico" },
  { label: "Classroom",    title: "Google Classroom",                    icon: "https://www.gstatic.com/classroom/favicon.png" },
  { label: "Canvas",       title: "Dashboard - Canvas",                  icon: "https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico" },
  { label: "Khan",         title: "Khan Academy",                        icon: "https://cdn.kastatic.org/images/favicon.ico" },
  { label: "Kahoot",       title: "Kahoot!",                             icon: "https://kahoot.com/favicon.ico" },
  { label: "Quizlet",      title: "Quizlet",                             icon: "https://quizlet.com/favicon.ico" },
  { label: "Desmos",       title: "Desmos | Graphing Calculator",        icon: "https://www.desmos.com/favicon.ico" },
  { label: "Schoology",    title: "Schoology",                           icon: "https://asset-cdn.schoology.com/sites/all/themes/schoology_theme/favicon.ico" },
  { label: "Blank",        title: "",                                    icon: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" },
  { label: "Reset",        title: "Uwu Gaming",                          icon: "" },
];

function initSettings() {
  // create modal if not already in HTML
  if (!document.getElementById("settings-modal")) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.id = "settings-modal";
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Settings</div>
          <button class="modal-close" id="modal-close-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
        </div>
        <div class="modal-body">
          <div class="setting-group">
            <div class="setting-label">Tab Cloak</div>
            <div class="cloak-presets" id="cloak-presets-grid"></div>
            <div class="setting-row"><input class="setting-input" id="cloak-title" placeholder="custom tab title" /></div>
            <div class="setting-row"><input class="setting-input" id="cloak-icon" placeholder="custom favicon url" /></div>
            <button class="btn-primary" id="apply-cloak-btn">Apply Cloak</button>
          </div>
          <div class="setting-group">
            <div class="setting-label">Data</div>
            <button class="btn-danger" id="clear-history-btn">Clear All History</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  // populate presets
  const grid = document.getElementById("cloak-presets-grid");
  if (grid && !grid.children.length) {
    grid.innerHTML = CLOAK_PRESETS.map(p =>
      `<button class="cloak-preset" data-title="${escHtml(p.title)}" data-icon="${escHtml(p.icon)}"><span>${escHtml(p.label)}</span></button>`
    ).join("");
  }

  const overlay = document.getElementById("settings-modal");
  if (!overlay) return;

  // open via sidebar button (added by buildSidebar) and any legacy statusbar button
  document.addEventListener("click", e => {
    if (e.target.closest("#settings-btn")) overlay.classList.add("open");
  });
  document.getElementById("modal-close-btn")?.addEventListener("click", () => overlay.classList.remove("open"));
  overlay.addEventListener("click", e => { if (e.target === overlay) overlay.classList.remove("open"); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && overlay.classList.contains("open")) overlay.classList.remove("open"); });

  overlay.querySelectorAll(".cloak-preset").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById("cloak-title").value = btn.dataset.title || "";
      document.getElementById("cloak-icon").value  = btn.dataset.icon  || "";
    });
  });

  document.getElementById("apply-cloak-btn")?.addEventListener("click", () => {
    const title = document.getElementById("cloak-title").value.trim();
    const icon  = document.getElementById("cloak-icon").value.trim();
    localStorage.setItem("uwug_cloak_title", title);
    localStorage.setItem("uwug_cloak_icon", icon);
    document.title = title || "Uwu Gaming";
    let link = document.querySelector("link[rel~='icon']");
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = icon || "/favicon.ico";
    overlay.classList.remove("open");
    toast("cloak applied", "success");
  });

  document.getElementById("clear-history-btn")?.addEventListener("click", clearRecent);
}

// ── Stars ────────────────────────────────
function initStars() {
  const canvas = document.getElementById("stars-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let stars = [];
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  function makeStars() {
    stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + .3, a: Math.random(),
      s: (Math.random() - .5) * .003,
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.a = Math.max(.1, Math.min(1, s.a + s.s));
      if (s.a <= .1 || s.a >= 1) s.s *= -1;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,120,180,${s.a.toFixed(2)})`; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  resize(); makeStars(); draw();
  window.addEventListener("resize", () => { resize(); makeStars(); });
}

// ── Version ──────────────────────────────
function showVersion() {
  const el = document.getElementById("footer-version");
  if (el) el.textContent = `v${VERSION}`;
}

// ── Chat ─────────────────────────────────
function initChat() {
  const input = document.getElementById("chat-input");
  const send  = document.getElementById("chat-send");
  const msgs  = document.getElementById("chat-messages");
  if (!input || !msgs) return;

  const session = JSON.parse(localStorage.getItem("uwu_session") || "{}");
  const user    = session.user || "anon";

  function addMsg(name, body, ts) {
    const el = document.createElement("div");
    el.className = "chat-msg";
    const time = ts ? new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
    el.innerHTML = `<div class="chat-msg-meta"><strong>${escHtml(name)}</strong>${time}</div><div class="chat-msg-body">${escHtml(body)}</div>`;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
  }

  // SSE stream
  const es = new EventSource("/api/chat/stream");
  es.addEventListener("message", e => {
    try {
      const d = JSON.parse(e.data);
      if (d.title && d.message) addMsg(d.title, d.message, d.time ? d.time * 1000 : Date.now());
    } catch {}
  });
  es.onerror = () => {
    const el = msgs.querySelector("div");
    if (el) el.textContent = "chat connection lost — refresh to reconnect";
  };
  msgs.innerHTML = "";

  async function sendMsg() {
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    try {
      await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "text/plain", "X-Chat-User": user },
        body: text,
      });
    } catch (e) { toast("send failed", "error"); }
  }

  send?.addEventListener("click", sendMsg);
  input.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } });
}

// ── AI ───────────────────────────────────
function initAI() {
  const input   = document.getElementById("ai-input");
  const send    = document.getElementById("ai-send");
  const msgs    = document.getElementById("ai-messages");
  if (!input || !msgs) return;

  const history = [];

  function addMsg(role, text) {
    const el = document.createElement("div");
    el.className = `ai-msg ${role}`;
    el.innerHTML = `<div class="ai-msg-role">${role}</div><div class="ai-msg-body">${escHtml(text)}</div>`;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
  }

  async function doSend() {
    const text = input.value.trim();
    if (!text) return;
    input.value = ""; send.disabled = true;
    history.push({ role: "user", content: text });
    addMsg("user", text);
    try {
      const res  = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history }) });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || data.error || "no response";
      history.push({ role: "assistant", content: reply });
      addMsg("assistant", reply);
    } catch (e) {
      addMsg("assistant", "error: " + e.message);
    } finally { send.disabled = false; }
  }

  send?.addEventListener("click", doSend);
  input.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); doSend(); } });
}

// ── Search ───────────────────────────────
function initSearch() {
  const btn   = document.getElementById("search-btn");
  const input = document.getElementById("search-input");
  if (!btn || !input) return;
  btn.addEventListener("click", handleSearch);
  input.addEventListener("keydown", e => { if (e.key === "Enter") handleSearch(); });
}

// ── Presence ─────────────────────────────
function initPresence() {
  const session = JSON.parse(localStorage.getItem("uwu_session") || "{}");
  if (!session.code && !session.channel) return;
  const code = session.channel?.replace("uwugaming-", "") || "";
  if (!code) return;
  async function ping() {
    try { await fetch("/api/presence", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) }); } catch {}
  }
  ping(); setInterval(ping, 60000);
}

// ── Boot ─────────────────────────────────
(async () => {
  buildSidebar();
  loadCloak();
  showVersion();
  initOverlay();
  initStars();
  initSearch();
  initSettings();
  renderRecent();
  renderQuickGames();
  renderQuickApps();
  renderApps();
  renderGames();
  initFilters("game-filters", renderGames);
  initFilters("app-filters",  renderApps);
  initChat();
  initAI();
  await loadGames();
  await initProxy();
  initPresence();
})();
