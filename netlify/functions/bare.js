// Bare server v1 — proxies HTTP requests on behalf of the UV service worker
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Expose-Headers": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, HEAD",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS, body: "" };
  }

  // Server info
  if (event.httpMethod === "GET" || event.httpMethod === "HEAD") {
    return {
      statusCode: 200,
      headers: { ...CORS, "content-type": "application/json" },
      body: JSON.stringify({
        versions: ["v1", "v2"],
        language: "JavaScript",
        memoryUsage: 0,
        maintainer: {},
        project: { name: "uwu-proxy", version: "1.0.0" },
      }),
    };
  }

  // Proxy request
  const host     = event.headers["x-bare-host"];
  const port     = event.headers["x-bare-port"];
  const protocol = event.headers["x-bare-protocol"] || "https:";
  const path     = event.headers["x-bare-path"]     || "/";
  const fwdHdrs  = JSON.parse(event.headers["x-bare-forward-headers"] || "[]");

  let reqHeaders = {};
  try { reqHeaders = JSON.parse(event.headers["x-bare-headers"] || "{}"); } catch {}

  if (!host) {
    return {
      statusCode: 400,
      headers: { ...CORS, "content-type": "application/json" },
      body: JSON.stringify({ code: "MISSING_BARE_HOST", id: "err", message: "X-Bare-Host is required" }),
    };
  }

  // Forward any headers the client asked us to pass through
  for (const h of fwdHdrs) {
    const val = event.headers[h.toLowerCase()];
    if (val) reqHeaders[h] = val;
  }

  const portStr = port && port !== "443" && port !== "80" ? `:${port}` : "";
  const targetUrl = `${protocol}//${host}${portStr}${path}`;

  try {
    const fetchOpts = {
      method: event.httpMethod,
      headers: reqHeaders,
      redirect: "manual",
    };

    if (["POST", "PUT", "PATCH"].includes(event.httpMethod) && event.body) {
      fetchOpts.body = event.isBase64Encoded
        ? Buffer.from(event.body, "base64")
        : event.body;
    }

    const res     = await fetch(targetUrl, fetchOpts);
    const resHdrs = {};
    res.headers.forEach((v, k) => { resHdrs[k] = v; });

    const body = Buffer.from(await res.arrayBuffer());

    return {
      statusCode: 200,
      headers: {
        ...CORS,
        "x-bare-status":      String(res.status),
        "x-bare-status-text": res.statusText || "OK",
        "x-bare-headers":     JSON.stringify(resHdrs),
        "content-type":       "application/octet-stream",
      },
      body: body.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...CORS, "content-type": "application/json" },
      body: JSON.stringify({ code: "UNKNOWN", id: "err", message: err.message }),
    };
  }
};
