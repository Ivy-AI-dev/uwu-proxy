const { cleanSlug, getCustomGameHtml } = require("./_lib/state");

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=60",
  "Content-Type": "text/html; charset=utf-8",
};

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" }, body: "" };
  }
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, headers: HEADERS, body: "<h1>method not allowed</h1>" };
  }

  const slugFromQuery = event.queryStringParameters?.slug;
  const slugFromPath = String(event.path || "").split("/").filter(Boolean).pop();
  const slug = cleanSlug(slugFromQuery || slugFromPath);
  if (!slug) {
    return { statusCode: 400, headers: HEADERS, body: "<h1>invalid game slug</h1>" };
  }

  const html = await getCustomGameHtml({ event, slug });
  if (!html) {
    return {
      statusCode: 404,
      headers: HEADERS,
      body: `<!doctype html><html><body style="background:#040404;color:#f0f0f0;font-family:sans-serif;padding:24px"><h1>Game not found</h1><p>No saved game file for <code>${escapeHtml(slug)}</code>.</p></body></html>`,
    };
  }

  return { statusCode: 200, headers: HEADERS, body: html };
};
