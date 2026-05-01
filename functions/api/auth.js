const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "*",
  "Content-Type": "application/json",
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS });
}

export async function onRequestPost({ request, env }) {
  const USERS = {
    [env.CODE_RYDER   || "47291"]: { user: "Ryder",   role: "admin"  },
    [env.CODE_BECKHAM || "83650"]: { user: "Beckham", role: "member" },
    [env.CODE_KOLLBY  || "29174"]: { user: "Kollby",  role: "member" },
    [env.CODE_LEVI    || "61837"]: { user: "Levi",    role: "member" },
    [env.CODE_LIAM    || "94523"]: { user: "Liam",    role: "member" },
    [env.CODE_LOGAN   || "35817"]: { user: "Logan",   role: "member" },
  };

  try {
    const { code } = await request.json();
    const match = USERS[String(code || "")];
    if (!match) return new Response(JSON.stringify({ error: "wrong code" }), { status: 401, headers: CORS });
    return new Response(JSON.stringify(match), { status: 200, headers: CORS });
  } catch {
    return new Response(JSON.stringify({ error: "bad request" }), { status: 400, headers: CORS });
  }
}
