const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "*",
  "Content-Type": "application/json",
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS });
}

export async function onRequestPost({ request, env }) {
  const key = env.GROQ_API_KEY;
  if (!key) return new Response(JSON.stringify({ error: "AI not configured — add GROQ_API_KEY in Cloudflare dashboard" }), { status: 503, headers: CORS });

  try {
    const { messages } = await request.json();
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status, headers: CORS });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: CORS });
  }
}
