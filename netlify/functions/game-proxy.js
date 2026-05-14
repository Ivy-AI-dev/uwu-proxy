// Serves gn-math game HTML files with correct content-type (raw.githubusercontent.com sends text/plain)
const ALLOWED = /^\d+[a-z0-9_-]*\.(html?)$/i;

export const handler = async (event) => {
  const file = (event.queryStringParameters?.file || '').trim();
  if (!ALLOWED.test(file)) return { statusCode: 400, body: 'invalid file' };

  const url = `https://raw.githubusercontent.com/gn-math/html/main/${file}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'uwu-gaming-proxy/1.0' } });
    if (!res.ok) return { statusCode: res.status, body: 'not found' };
    let html = await res.text();
    // strip sidebar ad divs and obfuscated ad scripts
    html = html.replace(/<div id="sidebarad\d+"[\s\S]*?<\/div>\s*<\/div>/gi, '');
    html = html.replace(/<script[^>]*>[\s\S]{300,}eval[\s\S]*?<\/script>/gi, '');
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
        'X-Frame-Options': 'SAMEORIGIN',
      },
      body: html,
    };
  } catch (e) {
    return { statusCode: 502, body: 'fetch error: ' + e.message };
  }
};
