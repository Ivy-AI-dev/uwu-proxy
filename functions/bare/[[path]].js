const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Expose-Headers":"*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,HEAD",
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS });
}

export async function onRequest({ request }) {
  const xBareUrl = request.headers.get("x-bare-url");

  // Server info
  if ((request.method === "GET" || request.method === "HEAD") && !xBareUrl) {
    return new Response(JSON.stringify({
      versions: ["v3"], language: "JavaScript", memoryUsage: 0,
      maintainer: {}, project: { name: "uwu-proxy", version: "1.0.0" },
    }), { headers: { ...CORS, "Content-Type": "application/json" } });
  }

  if (!xBareUrl) {
    return new Response(JSON.stringify({ code: "MISSING_BARE_URL", message: "X-Bare-Url required" }), { status: 400, headers: { ...CORS, "Content-Type": "application/json" } });
  }

  let reqHeaders = {};
  try { reqHeaders = JSON.parse(request.headers.get("x-bare-headers") || "{}"); } catch {}
  const fwdHdrs    = JSON.parse(request.headers.get("x-bare-forward-headers") || "[]");
  const passHdrs   = JSON.parse(request.headers.get("x-bare-pass-headers")    || "[]");
  const passStatus = JSON.parse(request.headers.get("x-bare-pass-status")     || "[]");

  for (const h of fwdHdrs) {
    const v = request.headers.get(h);
    if (v) reqHeaders[h] = v;
  }

  try {
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
    return new Response(JSON.stringify({ code: "UNKNOWN", message: e.message }), { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
  }
}
