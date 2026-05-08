const PRESENCE_CHANNEL = "uwuprx-presence";
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" };
const { getEffectiveUsers } = require("./_lib/state");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: CORS, body: "" };
  if (event.httpMethod !== "POST")    return { statusCode: 405, headers: { ...CORS, "content-type": "application/json" }, body: JSON.stringify({ error: "method not allowed" }) };

  let code = "";
  try { code = String(JSON.parse(event.body || "{}").code || ""); } catch {}

  const match = (await getEffectiveUsers({ event, env: process.env })).find((u) => u.code === code);
  if (!match) return { statusCode: 401, headers: { ...CORS, "content-type": "application/json" }, body: JSON.stringify({ error: "unauthorized" }) };

  try {
    await fetch(`https://ntfy.sh/${PRESENCE_CHANNEL}`, {
      method: "POST",
      headers: { "Title": match.user, "Content-Type": "text/plain" },
      body: "online",
    });
    return { statusCode: 200, headers: CORS, body: "" };
  } catch (e) {
    return { statusCode: 500, headers: { ...CORS, "content-type": "application/json" }, body: JSON.stringify({ error: e.message }) };
  }
};
