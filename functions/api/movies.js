const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS });
}

export async function onRequest({ request, env }) {
  const key = env.TMDB_API_KEY;
  if (!key) return new Response(JSON.stringify({ error: "TMDB_API_KEY not set in Cloudflare dashboard" }), { status: 503, headers: CORS });

  const url    = new URL(request.url);
  const path   = url.searchParams.get("path") || "/movie/popular";
  url.searchParams.delete("path");
  url.searchParams.set("api_key", key);
  url.searchParams.set("language", "en-US");

  try {
    const res  = await fetch(`https://api.themoviedb.org/3${path}?${url.searchParams}`);
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status, headers: CORS });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: CORS });
  }
}
