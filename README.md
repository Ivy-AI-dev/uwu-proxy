# Uwu Gaming

School proxy and gaming site hosted on Netlify.

## Features

- **Games** — 808+ games via gn-math library, searchable by category
- **Proxy** — Ultraviolet-powered web proxy with tab cloaking
- **Chat** — Real-time chat via ntfy.sh
- **AI** — LLaMA AI chat via Groq
- **Cheats** — Blooket bot tools
- **Admin** — Manage user codes and access levels

## Stack

- **Hosting**: Netlify (static + Functions)
- **Database**: Supabase PostgreSQL (via pgBouncer pooler on port 6543)
- **Proxy**: Ultraviolet 1.0.7 + Bare Server v1/v2
- **Chat/Presence**: ntfy.sh

## Pages

| Path | Description |
|------|-------------|
| `/` | Home — search, quick games, quick apps |
| `/games.html` | Full games grid with category filter |
| `/apps.html` | App shortcuts |
| `/chat.html` | Real-time group chat |
| `/ai.html` | AI chat (Groq/LLaMA) |
| `/cheats.html` | Blooket bot tools |
| `/proxy.html` | UV proxy handler |
| `/admin.html` | User code management (owner only) |
| `/login.html` | Code-based login |

## Local Dev

```bash
npm install
node server.js
```

Open `http://localhost:3000`.

## Deployment

Push to `master` — Netlify auto-deploys.
