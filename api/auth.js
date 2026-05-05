const USERS = {
  [process.env.CODE_RYDER   || "82047"]: { user: "Ryder",   role: "owner"       },
  [process.env.CODE_LOGAN   || "63914"]: { user: "Logan",   role: "slave owner" },
  [process.env.CODE_BECKHAM || "39571"]: { user: "Beckham", role: "slave"       },
  [process.env.CODE_KOLBY   || "74286"]: { user: "Kolby",   role: "slave"       },
  [process.env.CODE_LEVI    || "51839"]: { user: "Levi",    role: "slave"       },
  [process.env.CODE_LIAM    || "26473"]: { user: "Liam",    role: "slave"       },
  [process.env.CODE_GIBSON  || "98132"]: { user: "Gibson",  role: "slave"       },
};

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "method not allowed" });

  const code = String(req.body?.code || "");
  if (!code) return res.status(400).json({ error: "missing code" });

  const match = USERS[code];
  if (!match) return res.status(401).json({ error: "wrong code" });

  return res.status(200).json({ ...match, channel: `uwuprx-${code}` });
};
