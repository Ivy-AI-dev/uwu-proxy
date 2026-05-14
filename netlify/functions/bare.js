const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, HEAD",
  "Access-Control-Expose-Headers": "x-bare-status, x-bare-status-text, x-bare-headers",
};

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS, body: "" };
  }

  const host     = event.headers["x-bare-host"];
  const port     = event.headers["x-bare-port"];
  const protocol = event.headers["x-bare-protocol"];
  const path     = event.headers["x-bare-path"];

  if (!host) {
    return {
      statusCode: 200,
      headers: { ...CORS, "content-type": "application/json" },
      body: JSON.stringify({ versions: ["v1", "v2"], language: "JavaScript", memoryUsage: 0, maintainer: {}, project: { name: "uwu-gaming", version: "2.0.0" } }),
    };
  }

  const portSuffix = port ? `:${port}` : "";
  const targetUrl  = `${protocol}//${host}${portSuffix}${path}`;

  let reqHeaders = {};
  try { reqHeaders = JSON.parse(event.headers["x-bare-headers"] || "{}"); } catch {}
  const fwdHdrs    = JSON.parse(event.headers["x-bare-forward-headers"] || "[]");
  const passHdrs   = JSON.parse(event.headers["x-bare-pass-headers"]    || "[]");
  const passStatus = JSON.parse(event.headers["x-bare-pass-status"]     || "[]");

  for (const h of fwdHdrs) {
    const v = event.headers[h.toLowerCase()];
    if (v) reqHeaders[h] = v;
  }

  try {
    const fetchOpts = { method: event.httpMethod, headers: reqHeaders, redirect: "manual" };
    if (!["GET", "HEAD"].includes(event.httpMethod) && event.body) {
      fetchOpts.body = event.isBase64Encoded ? Buffer.from(event.body, "base64") : event.body;
    }

    const upstream = await fetch(targetUrl, fetchOpts);
    const resHdrs  = {};
    upstream.headers.forEach((v, k) => { resHdrs[k] = v; });

    const resHeaders = {
      ...CORS,
      "x-bare-status":      String(upstream.status),
      "x-bare-status-text": upstream.statusText || "OK",
      "x-bare-headers":     JSON.stringify(resHdrs),
      "content-type":       "application/octet-stream",
    };
    for (const h of passHdrs) {
      const v = upstream.headers.get(h);
      if (v != null) resHeaders[h.toLowerCase()] = v;
    }

    const status = passStatus.includes(upstream.status) ? upstream.status : 200;
    const buf    = Buffer.from(await upstream.arrayBuffer());
    return {
      statusCode: status,
      headers: resHeaders,
      body: buf.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (err) {
    return { statusCode: 500, headers: { ...CORS, "content-type": "application/json" }, body: JSON.stringify({ code: "UNKNOWN", id: "err", message: err.message }) };
  }
};
