const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Expose-Headers":"*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,HEAD",
};

function cors(body, status = 200, extra = {}) {
  return new Response(body, { status, headers: { ...CORS, ...extra } });
}

function json(data, status = 200) {
  return cors(JSON.stringify(data), status, { "content-type": "application/json" });
}

// ── Auth ─────────────────────────────────────
async function handleAuth(request, env) {
  if (request.method === "OPTIONS") return cors(null);
  if (request.method !== "POST") return json({ error: "method not allowed" }, 405);

  const USERS = {
    [env.CODE_RYDER   || "47291"]: { user: "Ryder",   role: "admin"  },
    [env.CODE_BECKHAM || "83650"]: { user: "Beckham", role: "member" },
    [env.CODE_KOLLBY  || "29174"]: { user: "Kollby",  role: "member" },
    [env.CODE_LEVI    || "61837"]: { user: "Levi",    role: "member" },
    [env.CODE_LIAM    || "94523"]: { user: "Liam",    role: "member" },
    [env.CODE_LOGAN   || "35817"]: { user: "Logan",   role: "member" },
  };

  try {
    const { code } = await request.json();
    const match = USERS[String(code || "")];
    if (!match) return json({ error: "wrong code" }, 401);
    return json(match);
  } catch {
    return json({ error: "bad request" }, 400);
  }
}

// ── AI ───────────────────────────────────────
async function handleAI(request, env) {
  if (request.method === "OPTIONS") return cors(null);
  if (request.method !== "POST") return json({ error: "method not allowed" }, 405);

  const key = env.GROQ_API_KEY;
  if (!key) return json({ error: "AI not configured — add GROQ_API_KEY in Cloudflare dashboard" }, 503);

  try {
    const { messages } = await request.json();
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a chill, helpful AI assistant on uwu proxy. Be concise and friendly." },
          ...messages,
        ],
        max_tokens: 1024,
        temperature: 0.75,
      }),
    });
    const data = await res.json();
    return json(data, res.status);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

// ── Movies ───────────────────────────────────
async function handleMovies(request, env) {
  if (request.method === "OPTIONS") return cors(null);
  const key = env.TMDB_API_KEY;
  if (!key) return json({ error: "TMDB_API_KEY not set" }, 503);

  const url  = new URL(request.url);
  const path = url.searchParams.get("path") || "/movie/popular";
  url.searchParams.delete("path");
  url.searchParams.set("api_key", key);
  url.searchParams.set("language", "en-US");

  try {
    const res  = await fetch(`https://api.themoviedb.org/3${path}?${url.searchParams}`);
    const data = await res.json();
    return json(data, res.status);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

// ── Bare server (v3) ─────────────────────────
async function handleBare(request) {
  if (request.method === "OPTIONS") return cors(null);

  const xBareUrl = request.headers.get("x-bare-url");

  if ((request.method === "GET" || request.method === "HEAD") && !xBareUrl) {
    return json({ versions: ["v3"], language: "JavaScript", memoryUsage: 0, maintainer: {}, project: { name: "uwu-proxy", version: "1.0.0" } });
  }

  if (!xBareUrl) return json({ code: "MISSING_BARE_URL", message: "X-Bare-Url required" }, 400);

  let reqHeaders = {};
  try { reqHeaders = JSON.parse(request.headers.get("x-bare-headers") || "{}"); } catch {}

  const fwdHdrs    = JSON.parse(request.headers.get("x-bare-forward-headers") || "[]");
  const passHdrs   = JSON.parse(request.headers.get("x-bare-pass-headers")    || "[]");
  const passStatus = JSON.parse(request.headers.get("x-bare-pass-status")     || "[]");

  for (const h of fwdHdrs) { const v = request.headers.get(h); if (v) reqHeaders[h] = v; }

  try {
    // Strip headers that cause Cloudflare to block the request
    delete reqHeaders["host"];
    delete reqHeaders["cf-connecting-ip"];
    delete reqHeaders["cf-ipcountry"];
    delete reqHeaders["cf-ray"];
    delete reqHeaders["cf-visitor"];
    delete reqHeaders["x-forwarded-for"];
    delete reqHeaders["x-real-ip"];

    const fetchOpts = { method: request.method, headers: reqHeaders, redirect: "manual" };
    if (!["GET", "HEAD"].includes(request.method)) fetchOpts.body = request.body;

    const upstream = await fetch(xBareUrl, fetchOpts);
    const resHdrs  = {};
    upstream.headers.forEach((v, k) => { resHdrs[k] = v; });

    const outHeaders = new Headers(CORS);
    for (const h of passHdrs) { const v = upstream.headers.get(h); if (v) outHeaders.set(h, v); }
    outHeaders.set("x-bare-status",      String(upstream.status));
    outHeaders.set("x-bare-status-text", upstream.statusText || "OK");
    outHeaders.set("x-bare-headers",     JSON.stringify(resHdrs));
    outHeaders.set("content-type",       "application/octet-stream");

    const status = passStatus.includes(upstream.status) ? upstream.status : 200;
    return new Response(upstream.body, { status, headers: outHeaders });
  } catch (e) {
    return json({ code: "UNKNOWN", message: e.message }, 500);
  }
}

// ── Main router ──────────────────────────────
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p   = url.pathname;

    if (p === "/api/auth")          return handleAuth(request, env);
    if (p === "/api/ai")            return handleAI(request, env);
    if (p === "/api/movies")        return handleMovies(request, env);
    if (p.startsWith("/bare/"))     return handleBare(request, env);
    if (p === "/bare")              return handleBare(request, env);

    // Serve sw.js with correct scope header
    if (p === "/sw.js") {
      const res = await env.ASSETS.fetch(request);
      const headers = new Headers(res.headers);
      headers.set("Service-Worker-Allowed", "/");
      return new Response(res.body, { status: res.status, headers });
    }

    // Everything else → static assets
    return env.ASSETS.fetch(request);
  },
};
