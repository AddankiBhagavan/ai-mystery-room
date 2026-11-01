# AI Mystery Room

A fictional detective investigation game. The React/Vite client talks to an Express API; Gemini creates each case on the server, and MongoDB stores cases and sessions. The server reveals the stored solution only after the final accusation.

## Local development

Requirements: Node.js 20+ and a MongoDB database (local or Atlas). Copy `.env.example` to `.env` and set `MONGODB_URI` and `GEMINI_API_KEY`. `GEMINI_MODEL` defaults to `gemini-3.8-flash`.

```sh
npm install
npm run dev
```

Vite runs at `http://localhost:5173`; it proxies `/api` to Express on port 5000. For the production shape:

```sh
npm run build
npm start
```

The server listens on `PORT` (default 5000). `/api/health` reports API and database readiness. Generation requires both a reachable MongoDB and a valid Gemini key. The key is server-only.

## Environment variables

| Name | Required | Description |
|---|---|---|
| `NODE_ENV` | no | Set `production` in hosting. |
| `PORT` | no | HTTP port supplied by the host. |
| `MONGODB_URI` | yes for gameplay | MongoDB connection string. |
| `GEMINI_API_KEY` | yes for generation | Google AI Studio API key; never use a `VITE_` name. |
| `GEMINI_MODEL` | no | Gemini model; default `gemini-3.8-flash`. |
| `GEMINI_FALLBACK_MODEL` | no | Used only after a temporary primary-model timeout, 429, or 503; default `gemini-3.5-flash-lite`. |
| `RATE_LIMIT_MAX_REQUESTS` | no | Requests per IP per minute (default 10). |

## API

- `GET /api/health` — process and database status.
- `POST /api/mysteries` — create a case/session. Body: `{ "scenario": "...", "difficulty": "medium", "crimeType": "murder" }`.
- `GET /api/sessions/:id` — restore public case and session state; completed sessions include results.
- `POST /api/sessions/:id/evidence/:evidenceId/review` — record viewed evidence.
- `POST /api/sessions/:id/accusation` — body `{ "suspectId": "..." }`; final and one-time.

Generation uses one structured Gemini call. Invalid output and inconsistent references are rejected before persistence. Cases and sessions use MongoDB TTL cleanup for old sessions. There is no account system; a session ID is the recovery token stored in the browser.

## Deploy on Render

1. Push this repository to GitHub and create a Render **Web Service** from it.
2. Render reads `render.yaml`: build `npm install && npm run build`, start `npm start`.
3. Create a MongoDB Atlas cluster and database user. In Atlas Network Access, allow Render outbound access (or temporarily allow `0.0.0.0/0`, with a strong database password).
4. In Render service environment, set `MONGODB_URI` to the Atlas URI and `GEMINI_API_KEY` to the server secret. Keep `GEMINI_MODEL` at the configured default or choose an available model.
5. Deploy and check `https://<service>.onrender.com/api/health`; database should report `connected`. Open the service root to play.

Render's public URL is assigned after the service deploys. Set spend/usage limits for Gemini in the provider console as appropriate. The MVP has per-IP rate limiting but no user accounts or CAPTCHA.

## Current MVP limits

- No login or cross-device case library; the browser keeps one active session.
- Generated timelines are visible during the investigation, so generation must avoid placing explicit culprit/reveal statements there.
- Atlas, Gemini credentials, and a live deployment are account-owned setup steps and are not included in the repository.
