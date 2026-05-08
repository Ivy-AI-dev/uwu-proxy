const { getEffectiveUsers } = require("./_lib/state");

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" };

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: CORS, body: "" };
  if (event.httpMethod !== "POST")   return { statusCode: 405, headers: { ...CORS, "content-type": "application/json" }, body: JSON.stringify({ error: "method not allowed" }) };

  let code = "";
  try { code = String(JSON.parse(event.body || "{}").code || ""); } catch {}

  const match = (await getEffectiveUsers({ event, env: process.env })).find(u => u.code === code);
  if (!match) return { statusCode: 401, headers: { ...CORS, "content-type": "application/json" }, body: JSON.stringify({ error: "wrong code" }) };
  return { statusCode: 200, headers: { ...CORS, "content-type": "application/json" }, body: JSON.stringify({ user: match.user, role: match.role, channel: `uwuprx-${code}` }) };
};
