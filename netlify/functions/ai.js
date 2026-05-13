export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  let body;
  try { body = JSON.parse(event.body); } catch { return { statusCode: 400, body: JSON.stringify({ error: 'bad json' }) }; }
  const { messages } = body;
  if (!messages || !Array.isArray(messages)) return { statusCode: 400, body: JSON.stringify({ error: 'messages required' }) };

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return { statusCode: 503, body: JSON.stringify({ error: 'AI not configured' }) };

  try {
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant on Uwu Gaming, a gaming site. Be friendly and casual.' },
          ...messages,
        ],
        max_tokens: 1024,
      }),
    });
    const data = await resp.json();
    if (!resp.ok) return { statusCode: 502, body: JSON.stringify({ error: data.error?.message || 'AI error' }) };
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: data.choices[0].message.content }),
    };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ error: e.message }) };
  }
};
