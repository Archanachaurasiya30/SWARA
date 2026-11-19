# SWARA AI backend

A small Express server that calls Google Gemini for SWARA's AI features:
the chat assistant, crime-report suggestions and safety recommendations.
It has **no database** and **does not store chats or complaints**.

## Setup

```bash
cd ai-backend
npm install
cp .env.example .env      # on Windows: copy .env.example .env
```

Open `.env` and set:

- `GEMINI_API_KEY` – create a key at https://aistudio.google.com/apikey
- `GEMINI_MODEL` – default `gemini-3.5-flash-lite` (the older `gemini-2.5-flash` is retired on 1 Dec 2026)
- `ALLOWED_ORIGINS` – the address of your React app (default `http://localhost:5173`)

Run it:

```bash
npm run dev     # http://localhost:5001
```

Check it: open http://localhost:5001/api/health. It should show `"aiConfigured": true`.

## Frontend

In `frontend/`, copy `.env.example` to `.env` (it points to `http://localhost:5001`), then run your usual `npm run dev`.
Run both servers at the same time (two terminals).

## Endpoints (all POST, JSON)

| Path | Needs | Returns |
|------|-------|---------|
| `/api/ai/chat` | `messages`, `consent: true` | `reply`, `emergency` |
| `/api/ai/categorize-report` | `complaint`, `consent: true` | `category`, `summary`, `keywords`, `urgency`, `immediateDanger` |
| `/api/ai/recommendations` | `scenario`, `language` | `summary`, `recommendations`, `emergencyNote` |

Limits: 20 requests per minute per visitor, 20 KB request size, 1000 characters per chat message, 3000 per complaint.

## Mounting into an existing Express server (optional)

If your project already has an Express server, you can skip `server.js` and add the router there:

```js
import aiRouter from "./ai-backend/src/routes/ai.js";
app.use("/api/ai", aiRouter);   // also keep express.json() and a rate limiter
```
