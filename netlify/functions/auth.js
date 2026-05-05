const USERS = {
  [process.env.CODE_RYDER   || "82047"]: { user: "Ryder",   role: "owner"       },
  [process.env.CODE_LOGAN   || "63914"]: { user: "Logan",   role: "slave owner" },
  [process.env.CODE_BECKHAM || "39571"]: { user: "Beckham", role: "slave"       },
  [process.env.CODE_KOLBY   || "74286"]: { user: "Kolby",   role: "slave"       },
  [process.env.CODE_LEVI    || "51839"]: { user: "Levi",    role: "slave"       },
  [process.env.CODE_LIAM    || "26473"]: { user: "Liam",    role: "slave"       },
  [process.env.CODE_GIBSON  || "98132"]: { user: "Gibson",  role: "slave"       },
};

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" };

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: CORS, body: "" };
  if (event.httpMethod !== "POST")   return { statusCode: 405, headers: { ...CORS, "content-type": "application/json" }, body: JSON.stringify({ error: "method not allowed" }) };

  let code = "";
  try { code = String(JSON.parse(event.body || "{}").code || ""); } catch {}

  const match = USERS[code];
  if (!match) return { statusCode: 401, headers: { ...CORS, "content-type": "application/json" }, body: JSON.stringify({ error: "wrong code" }) };
  return { statusCode: 200, headers: { ...CORS, "content-type": "application/json" }, body: JSON.stringify({ ...match, channel: `uwuprx-${code}` }) };
};
