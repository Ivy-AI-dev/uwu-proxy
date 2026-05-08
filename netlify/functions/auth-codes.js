const { getEffectiveUsers, updateUserCode } = require("./_lib/state");

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" };

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: CORS, body: "" };

  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers: { ...CORS, "content-type": "application/json" },
      body: JSON.stringify({ users: await getEffectiveUsers({ event, env: process.env }) }),
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: { ...CORS, "content-type": "application/json" }, body: JSON.stringify({ error: "method not allowed" }) };
  }

  let body = {};
  try { body = JSON.parse(event.body || "{}"); } catch {}

  const actorCode = String(body.actorCode || "");
  const user = String(body.user || "");
  const code = String(body.code || "").trim();
  if (!actorCode || !user || !/^\d{5}$/.test(code)) {
    return { statusCode: 400, headers: { ...CORS, "content-type": "application/json" }, body: JSON.stringify({ error: "invalid payload" }) };
  }

  const result = await updateUserCode({
    event,
    env: process.env,
    actorCode,
    user,
    code,
  });
  if (!result.ok) {
    return {
      statusCode: result.status,
      headers: { ...CORS, "content-type": "application/json" },
      body: JSON.stringify({ error: result.error }),
    };
  }

  return {
    statusCode: result.status,
    headers: { ...CORS, "content-type": "application/json" },
    body: JSON.stringify({ ok: true, users: result.users }),
  };
};
