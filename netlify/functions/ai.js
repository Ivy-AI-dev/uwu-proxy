const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "*",
  "content-type": "application/json",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: CORS, body: "" };
  if (event.httpMethod !== "POST")    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: "method not allowed" }) };

  const key = process.env.GROQ_API_KEY;
  if (!key) return { statusCode: 503, headers: CORS, body: JSON.stringify({ error: "AI not configured — add GROQ_API_KEY to Netlify env vars" }) };

  let messages;
  try {
    messages = JSON.parse(event.body).messages;
    if (!Array.isArray(messages)) throw new Error();
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "bad request" }) };
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a chill, helpful AI assistant on uwu proxy. Be concise and friendly. No need to be overly formal." },
        ...messages,
      ],
      max_tokens: 1024,
      temperature: 0.75,
    }),
  });

  const data = await res.json();
  return { statusCode: res.status, headers: CORS, body: JSON.stringify(data) };
};
