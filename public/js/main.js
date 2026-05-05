/* uwu proxy — main.js */

/* globals loaded via <script> tags: Ultraviolet, __uv$config */
const VERSION = "1.0.0";

// ── Data ────────────────────────────────
const GAMES = [
  // Verified safe sources only
  { name: "Retro Bowl",         url: "https://game316009.konggames.com/gamez/0031/6009/live/index.html", tag: "casual",  category: "casual",  desc: "Lead your team to the championship" },
  { name: "Slope",              url: "https://poki.com/en/g/slope",                                      tag: "action",  category: "action",  desc: "Roll a ball down an endless slope"  },
  { name: "1v1 LOL",            url: "https://1v1.lol/",                                                  tag: "action",  category: "action",  desc: "Build and battle in real-time"      },
  { name: "Run 3",              url: "https://poki.com/en/g/run-3",                                       tag: "action",  category: "action",  desc: "Run through the tunnel in space"    },
  { name: "Stickman Hook",      url: "https://poki.com/en/g/stickman-hook",                               tag: "action",  category: "action",  desc: "Swing through levels"               },
  { name: "Krunker",            url: "https://krunker.io/",                                               tag: "action",  category: "action",  desc: "Fast-paced browser FPS"             },
  { name: "Shell Shockers",     url: "https://shellshock.io/",                                            tag: "action",  category: "action",  desc: "Egg-based FPS battle royale"        },
  { name: "Subway Surfers",     url: "https://poki.com/en/g/subway-surfers",                              tag: "action",  category: "action",  desc: "Endless runner"                     },
  { name: "Temple Run 2",       url: "https://poki.com/en/g/temple-run-2",                                tag: "action",  category: "action",  desc: "Classic endless runner"             },
  { name: "Crossy Road",        url: "https://poki.com/en/g/crossy-road",                                 tag: "casual",  category: "casual",  desc: "Cross the road, don't get hit"      },
  { name: "Geometry Dash",      url: "https://poki.com/en/g/geometry-dash-lite",                          tag: "action",  category: "action",  desc: "Rhythm-based platformer"            },
  { name: "Flappy Bird",        url: "https://poki.com/en/g/flappy-bird",                                 tag: "casual",  category: "casual",  desc: "Tap to fly through pipes"           },
  { name: "Doomz.io",           url: "https://doomz.io/",                                                 tag: "io",      category: "io",      desc: "Multiplayer doom-style shooter"     },
  { name: "JustFall.lol",       url: "https://justfall.lol/",                                             tag: "io",      category: "io",      desc: "Fall and survive"                   },
  { name: "LOLBeans",           url: "https://lolbeans.io/",                                              tag: "io",      category: "io",      desc: "Bean battle royale"                 },
  { name: "Slither.io",         url: "https://slither.io/",                                               tag: "io",      category: "io",      desc: "Grow your snake, eat everything"    },
  { name: "Agar.io",            url: "https://agar.io/",                                                  tag: "io",      category: "io",      desc: "Eat cells, grow massive"            },
  { name: "Skribbl.io",         url: "https://skribbl.io/",                                               tag: "io",      category: "io",      desc: "Draw and guess with friends"        },
  { name: "Paper.io 2",         url: "https://poki.com/en/g/paper-io-2",                                  tag: "io",      category: "io",      desc: "Claim territory on the map"         },
  { name: "Minecraft Classic",  url: "https://classic.minecraft.net/",                                    tag: "classic", category: "classic", desc: "Classic Minecraft in browser"       },
  { name: "Minecraft",          url: "https://g.eags.us/eaglercraft/",                                    tag: "classic", category: "classic", desc: "Minecraft browser edition"          },
  { name: "Lichess",            url: "https://lichess.org/",                                              tag: "classic", category: "classic", desc: "Free open-source chess"             },
  { name: "Tetris",             url: "https://poki.com/en/g/tetris",                                      tag: "classic", category: "classic", desc: "The original block stacker"         },
  { name: "2048",               url: "https://play2048.co/",                                              tag: "puzzle",  category: "puzzle",  desc: "Slide tiles to reach 2048"          },
  { name: "Connect Four",       url: "https://papergames.io/en/connect4",                                 tag: "puzzle",  category: "puzzle",  desc: "Classic connect four"               },
  { name: "Blooket",            url: "https://blooket.com/",                                              tag: "puzzle",  category: "puzzle",  desc: "Study games and quizzes"            },
  { name: "Kahoot",             url: "https://kahoot.com/",                                               tag: "puzzle",  category: "puzzle",  desc: "Live quiz games"                    },
  { name: "Little Alchemy 2",   url: "https://littlealchemy2.com/",                                       tag: "puzzle",  category: "puzzle",  desc: "Combine elements to make new things"},
  { name: "Cookie Clicker",     url: "https://orteil.dashnet.org/cookieclicker/",                         tag: "casual",  category: "casual",  desc: "Click cookies, build an empire"     },
  { name: "Gartic Phone",       url: "https://garticphone.com/",                                          tag: "casual",  category: "casual",  desc: "Telephone with drawings"            },
  { name: "GeoGuessr",          url: "https://www.geoguessr.com/",                                        tag: "casual",  category: "casual",  desc: "Guess where you are in the world"   },
  { name: "Monkeytype",         url: "https://monkeytype.com/",                                           tag: "casual",  category: "casual",  desc: "Clean typing speed test"            },
  { name: "FNAF",               url: "https://scratch.mit.edu/projects/636308429/embed",                  tag: "action",  category: "action",  desc: "Five Nights at Freddy's"            },
  { name: "FNAF 2",             url: "https://scratch.mit.edu/projects/583538210/embed",                  tag: "action",  category: "action",  desc: "Five Nights at Freddy's 2"          },
  { name: "Friday Night Funkin",url: "https://scratch.mit.edu/projects/496383972/embed",                  tag: "casual",  category: "casual",  desc: "Rhythm battle game"                 },
  { name: "Among Us",           url: "https://scratch.mit.edu/projects/452959335/embed",                  tag: "casual",  category: "casual",  desc: "Find the impostor"                  },
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
  // Navigation goes to proxy.html which handles all proxy setup
  // Just pre-register the SW so it's ready when proxy.html opens
  proxyReady = true;
  setProxyStatus("active", "proxy active");
  document.getElementById("search-btn")?.removeAttribute("disabled");
  try {
    navigator.serviceWorker.register("/sw.js", { scope: "/", type: "module" }).catch(() => {});
  } catch {}
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
  addRecent(url);
  // Everything opens in the embedded proxy viewer — keeps nav/back/forward inside the site
  window.location.href = `/proxy.html?url=${encodeURIComponent(url)}`;
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

  // Inject owner-only red theme toggle
  const _sess = JSON.parse(localStorage.getItem("uwu_session") || "{}");
  if (_sess.role === "owner") {
    const modalBody = document.querySelector("#settings-modal .modal-body");
    if (modalBody) {
      const grp = document.createElement("div");
      grp.className = "setting-group";
      grp.innerHTML = `
        <div class="setting-label">Appearance <span style="color:var(--yellow);font-size:0.6rem;margin-left:4px">owner only</span></div>
        <button class="btn-theme-red" id="theme-toggle-btn"></button>`;
      modalBody.appendChild(grp);
      function updateThemeBtn() {
        const btn = document.getElementById("theme-toggle-btn");
        if (!btn) return;
        const isRed = localStorage.getItem("uwu_theme") === "red";
        btn.textContent = isRed ? "🔴 Red Theme — click to reset" : "🔴 Enable Red Theme";
        btn.style.background = isRed ? "rgba(239,68,68,0.18)" : "rgba(239,68,68,0.07)";
      }
      updateThemeBtn();
      document.getElementById("theme-toggle-btn")?.addEventListener("click", () => {
        const isRed = localStorage.getItem("uwu_theme") === "red";
        applyTheme(isRed ? "default" : "red");
        updateThemeBtn();
        toast(isRed ? "default theme restored" : "red theme activated 🔴", "success");
      });
    }
  }
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

// ── Particles + Starfield ─────────────────
function initStars() {
  const canvas = document.getElementById("stars-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener("resize", resize);

  // Static twinkling stars
  const stars = Array.from({ length: 80 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.2 + 0.2,
    a: Math.random(), da: (Math.random() - 0.5) * 0.003,
    drift: (Math.random() - 0.5) * 0.00005,
  }));

  // Falling particles
  const COLORS = ["255,121,198", "189,147,249", "139,233,253", "80,250,123", "248,248,242"];
  const particles = Array.from({ length: 22 }, () => spawnParticle(true));

  function spawnParticle(randomY = false) {
    return {
      x: Math.random() * canvas.width,
      y: randomY ? Math.random() * canvas.height : -10,
      r: Math.random() * 2.5 + 0.8,
      speed: Math.random() * 0.4 + 0.15,
      drift: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.35 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      spin: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.02,
      type: Math.random() > 0.6 ? "star" : "dot",
    };
  }

  function drawStar(x, y, r, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * r * 2.5, Math.sin(angle) * r * 2.5);
    }
    ctx.stroke();
    ctx.restore();
  }

  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Twinkling stars
    for (const s of stars) {
      s.a += s.da; s.x += s.drift;
      if (s.a < 0) s.da = Math.abs(s.da);
      if (s.a > 1) s.da = -Math.abs(s.da);
      if (s.x < 0) s.x = 1; if (s.x > 1) s.x = 0;
      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(248,248,242,${s.a * 0.4})`;
      ctx.fill();
    }

    // Falling particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y += p.speed;
      p.x += p.drift;
      p.spin += p.spinSpeed;

      if (p.y > canvas.height + 20) {
        particles[i] = spawnParticle(false);
        continue;
      }

      ctx.globalAlpha = p.a;
      if (p.type === "star") {
        ctx.strokeStyle = `rgba(${p.color},${p.a})`;
        ctx.lineWidth = 0.8;
        drawStar(p.x, p.y, p.r, p.spin);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.a})`;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
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

// ── Theme ────────────────────────────────
function applyTheme(theme) {
  const r = document.documentElement;
  if (theme === "red") {
    r.style.setProperty("--pink",     "#ef4444");
    r.style.setProperty("--purple",   "#dc2626");
    r.style.setProperty("--border-h", "rgba(239,68,68,0.35)");
    document.body.classList.add("theme-red");
  } else {
    r.style.removeProperty("--pink");
    r.style.removeProperty("--purple");
    r.style.removeProperty("--border-h");
    document.body.classList.remove("theme-red");
  }
  localStorage.setItem("uwu_theme", theme || "default");
}

function loadTheme() {
  const t = localStorage.getItem("uwu_theme");
  if (t && t !== "default") applyTheme(t);
}

// ── Whip system ──────────────────────────
function initWhipListener() {
  const session = JSON.parse(localStorage.getItem("uwu_session") || "{}");
  if (!session.user || !session.channel) return;

  const es = new EventSource(`https://ntfy.sh/${session.channel}/sse`);

  es.addEventListener("message", e => {
    try {
      const data = JSON.parse(e.data);
      if (data.event === "message") showWhipped(data.title || "someone");
    } catch {}
  });
}

function showWhipped(by) {
  // Flash + overlay
  const overlay = document.createElement("div");
  overlay.style.cssText = `position:fixed;inset:0;z-index:99999;background:rgba(220,20,60,0.15);display:flex;flex-direction:column;align-items:center;justify-content:center;backdrop-filter:blur(2px);animation:whipIn .2s ease;`;
  overlay.innerHTML = `
    <style>@keyframes whipIn{from{opacity:0;transform:scale(1.05)}to{opacity:1;transform:scale(1)}}
    @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}</style>
    <div style="background:#0c0c1e;border:2px solid rgba(255,45,85,0.6);border-radius:20px;padding:40px 48px;text-align:center;max-width:380px;animation:shake .4s ease .1s;box-shadow:0 0 60px rgba(255,45,85,0.3)">
      <div style="font-size:3rem;margin-bottom:12px">😵</div>
      <div style="font-family:'Space Grotesk',sans-serif;font-size:1.6rem;font-weight:700;color:#ff2d55;margin-bottom:6px">YOU GOT WHIPPED</div>
      <div style="color:#6272a4;font-size:.9rem;margin-bottom:24px">by <strong style="color:#f8f8f2">${escHtml(by)}</strong></div>
      <button onclick="this.closest('div[style]').remove()" style="padding:10px 28px;background:#ff2d55;border:none;border-radius:10px;color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:.9rem;cursor:pointer;">ow ok</button>
    </div>`;
  document.body.appendChild(overlay);
  playWhipSound();
  setTimeout(() => overlay.remove(), 8000);
}

function playWhipSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // whip crack: noise burst
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  } catch {}
}

// ── Global Chat ──────────────────────────
const CHAT_CHANNEL             = "uwuprx-chat";
const ANNOUNCE_CHANNEL         = "uwuprx-announce";
const MAX_CHAT_MESSAGE_LENGTH  = 200;
const ANNOUNCEMENT_AUTO_HIDE_MS = 30000;

function initChat() {
  if (window.location.pathname === "/proxy.html") return;
  const session = JSON.parse(localStorage.getItem("uwu_session") || "{}");
  if (!session.user) return;

  const widget = document.createElement("div");
  widget.id = "uwu-chat";
  widget.className = "chat-widget";
  widget.innerHTML = `
    <button class="chat-fab" id="chat-fab" title="Global Chat">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span class="chat-notif" id="chat-notif">0</span>
    </button>
    <div class="chat-panel" id="chat-panel">
      <div class="chat-panel-hd">
        <div>
          <div class="chat-panel-title">global chat</div>
          <div class="chat-panel-sub">everyone can see this</div>
        </div>
        <button class="chat-panel-x" id="chat-panel-x">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="chat-msgs" id="chat-msgs">
        <div class="chat-msgs-empty">no messages yet — say hi 👋</div>
      </div>
      <form class="chat-form" id="chat-form">
        <input class="chat-inp" id="chat-inp" placeholder="say something..." autocomplete="off" maxlength="${MAX_CHAT_MESSAGE_LENGTH}"/>
        <button class="chat-submit" type="submit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </form>
    </div>`;
  document.body.appendChild(widget);

  let unread = 0;
  let chatOpen = false;
  const fab   = document.getElementById("chat-fab");
  const panel = document.getElementById("chat-panel");
  const notif = document.getElementById("chat-notif");
  const msgs  = document.getElementById("chat-msgs");
  const form  = document.getElementById("chat-form");
  const inp   = document.getElementById("chat-inp");

  function toggleChat() {
    chatOpen = !chatOpen;
    panel.classList.toggle("open", chatOpen);
    fab.classList.toggle("open", chatOpen);
    if (chatOpen) { unread = 0; notif.style.display = "none"; inp.focus(); }
  }

  fab.addEventListener("click", toggleChat);
  document.getElementById("chat-panel-x").addEventListener("click", toggleChat);

  function addChatMsg(from, text) {
    const isMe = from === session.user;
    const empty = msgs.querySelector(".chat-msgs-empty");
    if (empty) empty.remove();
    const el = document.createElement("div");
    el.className = "chat-msg" + (isMe ? " chat-msg-me" : "");
    el.innerHTML = `<div class="chat-msg-name">${escHtml(from)}</div><div class="chat-msg-bubble">${escHtml(text)}</div>`;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    if (!chatOpen) {
      unread++;
      notif.textContent = unread > 9 ? "9+" : unread;
      notif.style.display = "flex";
    }
  }

  // Subscribe via SSE
  const es = new EventSource(`https://ntfy.sh/${CHAT_CHANNEL}/sse`);
  es.addEventListener("message", e => {
    try {
      const data = JSON.parse(e.data);
      if (data.event === "message") addChatMsg(data.title || "?", data.message || "");
    } catch {}
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const text = inp.value.trim();
    if (!text) return;
    inp.value = "";
    try {
      await fetch(`https://ntfy.sh/${CHAT_CHANNEL}`, {
        method: "POST",
        headers: { "Title": session.user },
        body: text,
      });
    } catch { toast("couldn't send message", "error"); }
  });
}

// ── Announcement listener ────────────────
function initAnnounceListener() {
  const es = new EventSource(`https://ntfy.sh/${ANNOUNCE_CHANNEL}/sse`);
  es.addEventListener("message", e => {
    try {
      const data = JSON.parse(e.data);
      if (data.event === "message") showAnnouncement(data.message || "", data.title || "");
    } catch {}
  });
}

function showAnnouncement(text, from) {
  const old = document.getElementById("uwu-announce-banner");
  if (old) old.remove();
  const banner = document.createElement("div");
  banner.id = "uwu-announce-banner";
  banner.className = "announce-banner";
  banner.innerHTML = `
    <span class="announce-icon">📣</span>
    <span class="announce-text">${escHtml(text)}<span class="announce-by">— ${escHtml(from)}</span></span>
    <button class="announce-close" title="dismiss">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>`;
  banner.querySelector(".announce-close").addEventListener("click", () => banner.remove());
  document.body.insertBefore(banner, document.body.firstChild);
  setTimeout(() => banner?.remove(), ANNOUNCEMENT_AUTO_HIDE_MS);
}

// ── Boot ─────────────────────────────────
(async () => {
  loadTheme();
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
  renderGames(document.querySelector("#game-filters .filter-btn.active")?.dataset.filter || "all");
  initWhipListener();
  initChat();
  initAnnounceListener();
})();
