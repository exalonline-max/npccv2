This repository includes helper files to deploy the backend to Fly.io and the frontend to Vercel.

Backend (Fly.io)

1. Install flyctl (macOS):

   brew install superfly/tap/flyctl

2. From this repo run:

   cd backend
   flyctl launch --name npccv2-backend --region iad --now

3. Set secrets:

   flyctl secrets set DATABASE_URL='postgres://user:pass@host:5432/db' JWT_SECRET_KEY='your_jwt_secret'

4. Deploy manually (if needed):

   ./deploy_fly.sh

Frontend (Vercel)

1. Using the Vercel dashboard: Import the repository, choose the `frontend/` directory as the root, and deploy.

2. Or use the Vercel CLI:

   npm i -g vercel
   cd frontend
   vercel login
   vercel --prod

Notes
- Ensure secrets and CORS origins are set properly. The backend expects environment variables for DB and JWT.
- For production DBs, use a managed Postgres (Supabase, Render, Fly Postgres, etc.).

CI / Automation

This repo includes GitHub Actions workflows to deploy the backend to Fly and the frontend to Vercel on pushes to `main`. To enable them add the following repository secrets in GitHub:

- `FLY_API_TOKEN` — a Fly personal API token (create via `flyctl auth token` or the Fly dashboard).
- `VERCEL_TOKEN` — Vercel personal token if you want Actions to trigger Vercel deploys.
- `DATABASE_URL` — connection string for your production Postgres (if not using Fly Postgres).
- `JWT_SECRET_KEY` — long random secret for your JWT signing.

Once those are added, pushes to `main` will deploy automatically.

Creating a fresh Fly app and token locally

If you want a fresh Fly environment (new app + deploy token) run these from your machine after `flyctl auth login`:

1. Create the app and populate `backend/fly.toml`:

   ./scripts/create_fly_app.sh npccv2-backend iad

2. Create a deploy token and print it (copy value into GitHub Secrets as `FLY_API_TOKEN`):

   ./scripts/create_fly_deploy_token.sh npccv2-backend

3. Deploy the backend from `backend/`:

   cd backend
   flyctl deploy

This repository includes helper files to deploy the backend to Fly.io and the frontend to Vercel.

Backend (Fly.io)

1. Install flyctl (macOS):

   brew install superfly/tap/flyctl

2. From this repo run:

   cd backend
   flyctl launch --name npccv2-backend --region iad --now

3. Set secrets:

   flyctl secrets set DATABASE_URL='postgres://user:pass@host:5432/db' JWT_SECRET_KEY='your_jwt_secret'

4. Deploy manually (if needed):

   ./deploy_fly.sh

Frontend (Vercel)

1. Using the Vercel dashboard: Import the repository, choose the `frontend/` directory as the root, and deploy.

2. Or use the Vercel CLI:

   npm i -g vercel
   cd frontend
   vercel login
   vercel --prod

Notes
- Ensure secrets and CORS origins are set properly. The backend expects environment variables for DB and JWT.
- For production DBs, use a managed Postgres (Supabase, Render, Fly Postgres, etc.).
