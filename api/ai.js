module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "method not allowed" });

  const key = process.env.GROQ_API_KEY;
  if (!key) return res.status(503).json({ error: "AI not configured — add GROQ_API_KEY to Vercel env vars" });

  const body = typeof req.body === "object" ? req.body : JSON.parse(await rawBody(req));
  const { messages } = body;
  if (!Array.isArray(messages)) return res.status(400).json({ error: "messages must be an array" });

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a chill, helpful AI assistant on uwu proxy. Be concise and friendly." },
        ...messages,
      ],
      max_tokens: 1024,
      temperature: 0.75,
    }),
  });

  const data = await groqRes.json();
  return res.status(groqRes.status).json(data);
};

function rawBody(req) {
  return new Promise((resolve, reject) => {
    let d = "";
    req.on("data", c => d += c);
    req.on("end", () => resolve(d));
    req.on("error", reject);
  });
}
