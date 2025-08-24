# Frontend (NPC Chatter)

This folder contains the Vite + React frontend for NPC Chatter. The repo is a monorepo, and Vercel is configured to build the `frontend` folder as the static site.

## Required Vercel environment variables
- `VITE_API_URL` — the base URL for the backend (no trailing `/api`). Example:

  VITE_API_URL=https://npccv2-backend.fly.dev

Set this in the Vercel project settings (Production environment) so the frontend points to the deployed Fly backend.

## Local development
- Start the dev server (supports HTTPS if certificates are mounted at `/certs`):

```bash
cd frontend
npm ci
npm run dev
```

## Production build (locally)

```bash
cd frontend
npm ci
npm run build
# the static output will be in `dist/`
```

## CI / Vercel
- The repository contains a root `vercel.json` that points the platform to `frontend/package.json` and configures the static build output as `dist`.
- The GitHub Actions workflow (`.github/workflows/deploy-frontend-vercel.yml`) now runs `npm ci` and `npm run build` inside `frontend` before invoking the Vercel CLI to deploy.

## Verify after deploy
- Visit https://<your-vercel-host>/ and confirm the landing page loads.
- Open browser devtools and confirm API calls go to the value of `VITE_API_URL` (for production this should be the Fly backend).
