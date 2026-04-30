/* uwu proxy — main.js */

/* globals loaded via <script> tags: Ultraviolet, __uv$config */
const VERSION = "1.0.0";

// ── Data ────────────────────────────────
const GAMES = [
  { name: "Slope",          url: "https://slope-game.github.io/",                    tag: "action",  category: "action",  desc: "Roll a ball down an endless slope"    },
  { name: "Retro Bowl",     url: "https://retrobowl.io/",                            tag: "casual",  category: "casual",  desc: "Lead your team to victory"            },
  { name: "Cookie Clicker", url: "https://orteil.dashnet.org/cookieclicker/",        tag: "casual",  category: "casual",  desc: "Click cookies, build an empire"       },
  { name: "2048",           url: "https://play2048.co/",                             tag: "puzzle",  category: "puzzle",  desc: "Slide tiles to reach 2048"            },
  { name: "Wordle",         url: "https://www.nytimes.com/games/wordle/index.html",  tag: "puzzle",  category: "puzzle",  desc: "Guess the 5-letter word"              },
  { name: "Minecraft",      url: "https://classic.minecraft.net/",                  tag: "classic", category: "classic", desc: "Classic Minecraft in your browser"    },
  { name: "Shell Shockers", url: "https://shellshock.io/",                          tag: "action",  category: "action",  desc: "Egg-based FPS battle royale"          },
  { name: "Krunker",        url: "https://krunker.io/",                             tag: "action",  category: "action",  desc: "Fast-paced browser FPS"               },
  { name: "Slither.io",     url: "https://slither.io/",                             tag: "io",      category: "io",      desc: "Grow your snake, eat everything"      },
  { name: "Agar.io",        url: "https://agar.io/",                                tag: "io",      category: "io",      desc: "Eat cells, grow massive"              },
  { name: "Paper.io",       url: "https://paper-io.com/",                           tag: "io",      category: "io",      desc: "Claim territory on the map"           },
  { name: "Skribbl.io",     url: "https://skribbl.io/",                             tag: "io",      category: "io",      desc: "Draw and guess with friends"          },
  { name: "Chess.com",      url: "https://chess.com/",                              tag: "classic", category: "classic", desc: "Play chess online"                    },
  { name: "Tetris",         url: "https://tetris.com/play-tetris",                  tag: "classic", category: "classic", desc: "The original block stacker"           },
  { name: "GeoGuessr",      url: "https://www.geoguessr.com/",                      tag: "casual",  category: "casual",  desc: "Guess where you are in the world"     },
  { name: "Blooket",        url: "https://blooket.com/",                            tag: "puzzle",  category: "puzzle",  desc: "Study games and quizzes"              },
  { name: "Kahoot",         url: "https://kahoot.com/",                             tag: "puzzle",  category: "puzzle",  desc: "Live quiz games"                      },
  { name: "1v1.LOL",        url: "https://1v1.lol/",                               tag: "action",  category: "action",  desc: "Build and battle in real-time"        },
  { name: "Little Alchemy",  url: "https://littlealchemy2.com/",                   tag: "puzzle",  category: "puzzle",  desc: "Combine elements to make new things"  },
  { name: "Among Us",       url: "https://www.innersloth.com/games/among-us/",      tag: "casual",  category: "casual",  desc: "Find the impostor"                    },
];

const APPS = [
  { name: "YouTube",     url: "https://youtube.com/",           tag: "media",        category: "media",       desc: "Watch & stream videos",       bg: "#ff0000" },
  { name: "Netflix",     url: "https://netflix.com/",           tag: "media",        category: "media",       desc: "Movies & TV shows",           bg: "#e50914" },
  { name: "Spotify",     url: "https://open.spotify.com/",      tag: "media",        category: "media",       desc: "Stream music & podcasts",     bg: "#1db954" },
  { name: "Discord",     url: "https://discord.com/app",        tag: "social",       category: "social",      desc: "Chat with your server",       bg: "#5865f2" },
  { name: "Instagram",   url: "https://instagram.com/",         tag: "social",       category: "social",      desc: "Photos & reels",              bg: "#e1306c" },
  { name: "Twitter / X", url: "https://x.com/",                 tag: "social",       category: "social",      desc: "What's happening",            bg: "#000000" },
  { name: "Reddit",      url: "https://reddit.com/",            tag: "social",       category: "social",      desc: "Front page of the internet",  bg: "#ff4500" },
  { name: "TikTok",      url: "https://www.tiktok.com/",        tag: "social",       category: "social",      desc: "Short-form video",            bg: "#010101" },
  { name: "ChatGPT",     url: "https://chatgpt.com/",           tag: "ai",           category: "ai",          desc: "AI assistant by OpenAI",      bg: "#10a37f" },
  { name: "Claude",      url: "https://claude.ai/",             tag: "ai",           category: "ai",          desc: "AI by Anthropic",             bg: "#d97706" },
  { name: "Gemini",      url: "https://gemini.google.com/",     tag: "ai",           category: "ai",          desc: "AI by Google",                bg: "#4285f4" },
  { name: "Perplexity",  url: "https://perplexity.ai/",         tag: "ai",           category: "ai",          desc: "AI-powered search",           bg: "#20b2aa" },
  { name: "Google",      url: "https://google.com/",            tag: "productivity", category: "productivity", desc: "Search the web",             bg: "#4285f4" },
  { name: "Gmail",       url: "https://mail.google.com/",       tag: "productivity", category: "productivity", desc: "Email by Google",            bg: "#ea4335" },
  { name: "Google Docs", url: "https://docs.google.com/",       tag: "productivity", category: "productivity", desc: "Write & collaborate",        bg: "#4285f4" },
  { name: "Notion",      url: "https://notion.so/",             tag: "productivity", category: "productivity", desc: "Notes, docs & wikis",        bg: "#ffffff" },
  { name: "Canva",       url: "https://canva.com/",             tag: "productivity", category: "productivity", desc: "Design anything",            bg: "#00c4cc" },
  { name: "GitHub",      url: "https://github.com/",            tag: "dev",          category: "dev",          desc: "Code & collaborate",         bg: "#24292f" },
  { name: "Replit",      url: "https://replit.com/",            tag: "dev",          category: "dev",          desc: "Code in the browser",        bg: "#f26207" },
  { name: "CodePen",     url: "https://codepen.io/",            tag: "dev",          category: "dev",          desc: "Front-end playground",       bg: "#1e1f26" },
];

const QUICK_GAMES = GAMES.slice(0, 6);
const QUICK_APPS  = APPS.slice(0, 6);

let proxyReady = false;

// ── Proxy init ───────────────────────────
async function initProxy() {
  if (!("serviceWorker" in navigator)) { setProxyStatus("error", "unsupported"); return; }
  try {
    const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });

    // Wait for SW to reach activated or redundant (failed)
    const sw = reg.installing || reg.waiting || reg.active;
    if (sw && sw.state !== "activated") {
      await new Promise((resolve, reject) => {
        sw.addEventListener("statechange", function h() {
          if (this.state === "activated") { this.removeEventListener("statechange", h); resolve(); }
          if (this.state === "redundant")  { this.removeEventListener("statechange", h); reject(new Error("SW install failed")); }
        });
        setTimeout(resolve, 5000); // fallback
      });
    }

    // Wait for page to be controlled
    if (!navigator.serviceWorker.controller) {
      await Promise.race([
        new Promise(resolve => navigator.serviceWorker.addEventListener("controllerchange", resolve, { once: true })),
        new Promise(resolve => setTimeout(resolve, 3000)),
      ]);
    }

    const swState = reg.active?.state || "unknown";
    if (swState !== "activated") {
      toast("SW state: " + swState + " — proxy may not work", "error");
    }

    proxyReady = true;
    setProxyStatus("active", "proxy active");
    document.getElementById("search-btn")?.removeAttribute("disabled");
  } catch (err) {
    console.error("proxy init failed:", err);
    setProxyStatus("error", err.message || "proxy error");
    toast(err.message || "proxy failed to load", "error");
  }
}

function setProxyStatus(state, text) {
  const el  = document.getElementById("proxy-status");
  const txt = document.getElementById("proxy-status-text");
  if (!el || !txt) return;
  el.className    = "proxy-badge " + state;
  txt.textContent = text;
}

// ── Navigation ───────────────────────────
function navigate(rawUrl) {
  if (!rawUrl.trim()) return;
  let url = rawUrl.trim();
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  try { new URL(url); } catch {
    url = `https://www.google.com/search?q=${encodeURIComponent(rawUrl)}`;
  }
  if (!proxyReady) { toast("proxy still loading.", "error"); return; }
  if (!window.__uv$config) { toast("UV config missing — reload page", "error"); return; }
  addRecent(url);
  try {
    window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
  } catch (e) {
    toast("nav error: " + e.message, "error");
  }
}

function handleSearch(raw) {
  const input = raw.trim();
  if (!input) return;
  const looksLikeUrl = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(input);
  navigate(looksLikeUrl ? input : `https://www.google.com/search?q=${encodeURIComponent(input)}`);
}

// ── Favicon helper ───────────────────────
function faviconUrl(siteUrl) {
  try { return `https://www.google.com/s2/favicons?domain=${new URL(siteUrl).hostname}&sz=64`; }
  catch { return ""; }
}

// ── Recent sites ─────────────────────────
const RECENT_KEY = "uwu_recent";
function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
}
function addRecent(url) {
  const list = getRecent().filter(r => r.url !== url);
  list.unshift({ url, domain: new URL(url).hostname.replace(/^www\./, ""), ts: Date.now() });
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 8)));
  renderRecent();
}
function clearRecent() { localStorage.removeItem(RECENT_KEY); renderRecent(); toast("history cleared", "success"); }

function renderRecent() {
  const grid = document.getElementById("recent-grid");
  if (!grid) return;
  const list = getRecent();
  if (!list.length) { grid.innerHTML = '<div class="recent-empty">nothing yet — browse something.</div>'; return; }
  grid.innerHTML = list.map(r => `
    <div class="recent-card" data-url="${escHtml(r.url)}" title="${escHtml(r.url)}">
      <div class="recent-favicon"><img src="${escHtml(faviconUrl(r.url))}" alt="" loading="lazy" onerror="this.style.opacity=0"/></div>
      <div class="recent-domain">${escHtml(r.domain)}</div>
    </div>`).join("");
  grid.querySelectorAll(".recent-card").forEach(c => c.addEventListener("click", () => navigate(c.dataset.url)));
}

// ── Card renderers ───────────────────────
function quickCard(item) {
  return `<div class="card" data-url="${escHtml(item.url)}">
    <div class="card-favicon"><img src="${escHtml(faviconUrl(item.url))}" alt="${escHtml(item.name)}" loading="lazy" onerror="this.style.opacity=0"/></div>
    <div class="card-name">${escHtml(item.name)}</div>
    <div class="card-desc">${escHtml(item.desc)}</div>
    <div class="card-tag tag-${item.tag}">${item.tag}</div>
  </div>`;
}

function renderQuickGames() {
  const el = document.getElementById("quick-games");
  if (!el) return;
  el.innerHTML = QUICK_GAMES.map(quickCard).join("");
  el.querySelectorAll(".card").forEach(c => c.addEventListener("click", () => navigate(c.dataset.url)));
}

function renderQuickApps() {
  const el = document.getElementById("quick-apps");
  if (!el) return;
  el.innerHTML = QUICK_APPS.map(quickCard).join("");
  el.querySelectorAll(".card").forEach(c => c.addEventListener("click", () => navigate(c.dataset.url)));
}

function renderGames(filter = "all") {
  const grid = document.getElementById("games-grid");
  if (!grid) return;
  const list = filter === "all" ? GAMES : GAMES.filter(g => g.category === filter);
  grid.innerHTML = list.map(g => `
    <div class="game-card" data-url="${escHtml(g.url)}">
      <div class="game-thumb"><img src="${escHtml(faviconUrl(g.url))}" alt="${escHtml(g.name)}" loading="lazy" onerror="this.style.opacity=0"/></div>
      <div class="game-info">
        <div class="game-name">${escHtml(g.name)}</div>
        <div class="game-desc">${escHtml(g.desc)}</div>
        <div class="game-footer">
          <div class="card-tag tag-${g.tag}">${g.tag}</div>
          <button class="play-btn" ${proxyReady ? "" : "disabled"}>play</button>
        </div>
      </div>
    </div>`).join("");
  grid.querySelectorAll(".game-card").forEach(card => {
    card.querySelector(".play-btn")?.addEventListener("click", e => { e.stopPropagation(); navigate(card.dataset.url); });
    card.addEventListener("click", () => navigate(card.dataset.url));
  });
}

function renderApps(filter = "all") {
  const grid = document.getElementById("apps-grid");
  if (!grid) return;
  const list = filter === "all" ? APPS : APPS.filter(a => a.category === filter);
  grid.innerHTML = list.map(a => `
    <div class="app-card" data-url="${escHtml(a.url)}">
      <div class="app-icon" style="background:${a.bg}18;border:1px solid ${a.bg}35">
        <img src="${escHtml(faviconUrl(a.url))}" alt="${escHtml(a.name)}" loading="lazy" onerror="this.style.opacity=0"/>
      </div>
      <div class="app-name">${escHtml(a.name)}</div>
      <div class="app-desc">${escHtml(a.desc)}</div>
      <div class="card-tag tag-${a.tag}">${a.tag}</div>
    </div>`).join("");
  grid.querySelectorAll(".app-card").forEach(c => c.addEventListener("click", () => navigate(c.dataset.url)));
}

// ── Filters ──────────────────────────────
function initFilters(filterId, renderFn) {
  document.getElementById(filterId)?.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(`#${filterId} .filter-btn`).forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderFn(btn.dataset.filter);
    });
  });
}

// ── Settings modal ───────────────────────
function initSettings() {
  const overlay = document.getElementById("settings-modal");
  document.getElementById("settings-btn")?.addEventListener("click",    () => overlay?.classList.add("open"));
  document.getElementById("modal-close-btn")?.addEventListener("click", () => overlay?.classList.remove("open"));
  overlay?.addEventListener("click", e => { if (e.target === overlay) overlay.classList.remove("open"); });

  document.querySelectorAll(".cloak-preset").forEach(btn => {
    btn.addEventListener("click", () => {
      const { title, icon } = btn.dataset;
      if (document.getElementById("cloak-title")) document.getElementById("cloak-title").value = title;
      if (document.getElementById("cloak-icon"))  document.getElementById("cloak-icon").value  = icon;
      applyCloak(title, icon);
      toast(`cloaked as "${title}"`, "success");
    });
  });

  document.getElementById("apply-cloak-btn")?.addEventListener("click", () => {
    applyCloak(
      document.getElementById("cloak-title")?.value || "New Tab",
      document.getElementById("cloak-icon")?.value  || ""
    );
    toast("cloak applied", "success");
  });

  document.getElementById("clear-history-btn")?.addEventListener("click", clearRecent);
  document.getElementById("clear-recent-btn")?.addEventListener("click",  clearRecent);
}

function applyCloak(title, iconUrl) {
  document.title = title;
  let link = document.querySelector('link[rel="icon"]');
  if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
  link.href = iconUrl || "data:,";
  localStorage.setItem("uwu_cloak", JSON.stringify({ title, iconUrl }));
}

function loadCloak() {
  try { const c = JSON.parse(localStorage.getItem("uwu_cloak") || "null"); if (c) applyCloak(c.title, c.iconUrl); } catch {}
}

// ── Keyboard shortcuts ───────────────────
function initKeyboard() {
  document.addEventListener("keydown", e => {
    if (e.altKey && e.key === "p") { e.preventDefault(); window.location.href = "https://google.com"; }
    if (e.altKey && e.key === "s") { e.preventDefault(); document.getElementById("settings-modal")?.classList.toggle("open"); }
    if (e.altKey && e.key === "f") { e.preventDefault(); document.getElementById("search-input")?.focus(); }
  });
}

// ── Search form ──────────────────────────
function initSearch() {
  const form  = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  if (!form || !input) return;
  form.addEventListener("submit", e => { e.preventDefault(); handleSearch(input.value); });
}

// ── Version ──────────────────────────────
function showVersion() {
  document.querySelectorAll("#version-tag, #footer-version").forEach(el => { el.textContent = `v${VERSION}`; });
}

// ── Starfield ────────────────────────────
function initStars() {
  const canvas = document.getElementById("stars-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const stars = Array.from({ length: 100 }, () => ({
    x: Math.random(), y: Math.random(), r: Math.random() * 1.4 + 0.3,
    a: Math.random(), da: (Math.random() - 0.5) * 0.004, drift: (Math.random() - 0.5) * 0.00007,
  }));
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener("resize", resize);
  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      s.a += s.da; s.x += s.drift;
      if (s.a < 0) s.da = Math.abs(s.da);
      if (s.a > 1) s.da = -Math.abs(s.da);
      if (s.x < 0) s.x = 1; if (s.x > 1) s.x = 0;
      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(248,248,242,${s.a * 0.55})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  })();
}

// ── Toast ────────────────────────────────
function toast(msg, type = "info") {
  const c = document.getElementById("toast-container");
  if (!c) return;
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${{ success: "✓", error: "✕", info: "·" }[type]}</span><span>${escHtml(msg)}</span>`;
  c.appendChild(el);
  setTimeout(() => { el.style.animation = "toastOut .3s ease forwards"; setTimeout(() => el.remove(), 300); }, 3000);
}

function escHtml(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// ── Boot ─────────────────────────────────
(async () => {
  loadCloak();
  showVersion();
  initStars();
  initKeyboard();
  initSearch();
  initSettings();
  renderRecent();
  renderQuickGames();
  renderQuickApps();
  renderGames();
  renderApps();
  initFilters("game-filters", renderGames);
  initFilters("app-filters",  renderApps);
  await initProxy();
  // Re-render game play buttons now that proxy is ready
  renderGames(document.querySelector("#game-filters .filter-btn.active")?.dataset.filter || "all");
})();
