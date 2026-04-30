// Bare server v3 — matches what @tomphttp/bare-client v2 expects
const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Expose-Headers": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, HEAD",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS, body: "" };
  }

  // Server info — any GET without x-bare-url
  if ((event.httpMethod === "GET" || event.httpMethod === "HEAD") &&
      !event.headers["x-bare-url"]) {
    return {
      statusCode: 200,
      headers: { ...CORS, "content-type": "application/json" },
      body: JSON.stringify({
        versions: ["v3"],
        language: "JavaScript",
        memoryUsage: 0,
        maintainer: {},
        project: { name: "uwu-proxy", version: "1.0.0" },
      }),
    };
  }

  // V3 proxy — x-bare-url is the full target URL
  const targetUrl  = event.headers["x-bare-url"];
  const passHdrs   = JSON.parse(event.headers["x-bare-pass-headers"]   || "[]");
  const passStatus = JSON.parse(event.headers["x-bare-pass-status"]    || "[]");
  const fwdHdrs    = JSON.parse(event.headers["x-bare-forward-headers"]|| "[]");

  if (!targetUrl) {
    return {
      statusCode: 400,
      headers: { ...CORS, "content-type": "application/json" },
      body: JSON.stringify({ code: "MISSING_BARE_URL", id: "err", message: "X-Bare-Url required" }),
    };
  }

  let reqHeaders = {};
  try { reqHeaders = JSON.parse(event.headers["x-bare-headers"] || "{}"); } catch {}

  for (const h of fwdHdrs) {
    const v = event.headers[h.toLowerCase()];
    if (v) reqHeaders[h] = v;
  }

  try {
    const fetchOpts = { method: event.httpMethod, headers: reqHeaders, redirect: "manual" };

    if (["POST", "PUT", "PATCH"].includes(event.httpMethod) && event.body) {
      fetchOpts.body = event.isBase64Encoded
        ? Buffer.from(event.body, "base64")
        : event.body;
    }

    const res = await fetch(targetUrl, fetchOpts);

    const resHdrs = {};
    res.headers.forEach((v, k) => { resHdrs[k] = v; });

    const outHeaders = { ...CORS };

    // Pass through any headers the client requested
    for (const h of passHdrs) {
      const v = res.headers.get(h);
      if (v != null) outHeaders[h] = v;
    }

    outHeaders["x-bare-status"]      = String(res.status);
    outHeaders["x-bare-status-text"] = res.statusText || "OK";
    outHeaders["x-bare-headers"]     = JSON.stringify(resHdrs);
    outHeaders["content-type"]       = "application/octet-stream";

    // Use passStatus if applicable, otherwise 200 (we wrap the real status in x-bare-status)
    const statusCode = passStatus.includes(res.status) ? res.status : 200;

    const body = Buffer.from(await res.arrayBuffer());

    return {
      statusCode,
      headers: outHeaders,
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
