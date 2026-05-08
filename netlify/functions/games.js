const {
  getEffectiveUsers,
  getCustomGames,
  saveCustomGame,
  deleteCustomGame,
} = require("./_lib/state");

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Content-Type": "application/json",
};

async function requireOwner(event, actorCode) {
  const users = await getEffectiveUsers({ event, env: process.env });
  const actor = users.find((u) => u.code === String(actorCode || ""));
  if (!actor || actor.role !== "owner") return null;
  return actor;
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: CORS, body: "" };

  if (event.httpMethod === "GET") {
    const games = await getCustomGames({ event });
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ games }) };
  }

  let body = {};
  try { body = JSON.parse(event.body || "{}"); } catch {}
  const owner = await requireOwner(event, body?.actorCode);
  if (!owner) return { statusCode: 403, headers: CORS, body: JSON.stringify({ error: "owner access required" }) };

  if (event.httpMethod === "POST") {
    const result = await saveCustomGame({
      event,
      actor: owner.user,
      payload: {
        slug: body.slug,
        name: body.name,
        desc: body.desc,
        category: body.category,
        html: body.html,
      },
    });
    if (!result.ok) {
      return { statusCode: result.status, headers: CORS, body: JSON.stringify({ error: result.error }) };
    }
    const games = await getCustomGames({ event });
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, slug: result.slug, games }) };
  }

  if (event.httpMethod === "DELETE") {
    const result = await deleteCustomGame({ event, slug: body.slug });
    if (!result.ok) {
      return { statusCode: result.status, headers: CORS, body: JSON.stringify({ error: result.error }) };
    }
    const games = await getCustomGames({ event });
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, games }) };
  }

  return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: "method not allowed" }) };
};
