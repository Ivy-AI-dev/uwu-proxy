import express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app  = express();
const PORT = process.env.PORT || 8080;

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Expose-Headers":"*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,HEAD",
};

// Bare v3 proxy endpoint — required by UV/bare-mux
app.options("/bare/*", (req, res) => {
  res.set(CORS).status(200).end();
});

app.all("/bare/*", async (req, res) => {
  res.set(CORS);

  const xBareUrl = req.headers["x-bare-url"];

  if ((req.method === "GET" || req.method === "HEAD") && !xBareUrl) {
    return res.json({
      versions: ["v3"], language: "JavaScript", memoryUsage: 0,
      maintainer: {}, project: { name: "uwu-proxy", version: "1.0.0" },
    });
  }

  if (!xBareUrl) {
    return res.status(400).json({ code: "MISSING_BARE_URL", id: "err", message: "X-Bare-Url required" });
  }

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
    const buf = Buffer.from(await upstream.arrayBuffer());
    return res.status(status).send(buf);
  } catch (err) {
    return res.status(500).json({ code: "UNKNOWN", id: "err", message: err.message });
  }
});

// SW at root needs scope "/" — serve with the required header
app.get("/sw.js", (req, res) => {
  res.setHeader("Service-Worker-Allowed", "/");
  res.sendFile(join(__dirname, "public/sw.js"));
});

app.use(express.static(join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`uwu proxy v1.0.0 — http://localhost:${PORT}`);
});
