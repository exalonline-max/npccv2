Development workflows

Quick: run frontend dev locally

cd frontend
npm install
npm run dev

Docker-based dev (uses docker-compose.override.yml)

This repo includes a `docker-compose.override.yml` that provides `frontend-dev` and `backend-dev` services. They mount the source and run live-reload servers so you don't need to rebuild images on every change.

Bring up the dev stack (db + dev services):

docker compose up -d db
docker compose up --build -d backend-dev frontend-dev

- `frontend-dev` runs Vite on port 5173 and reflects changes instantly (HMR).
- `backend-dev` runs Flask in development mode on port 5001 with auto-reload.

Notes
- You can still run the production-like stack (nginx static build) with `docker compose up -d frontend backend db` and then rebuild the frontend image when you want to publish a new static build.
- If you see older assets served, it's likely because nginx is using a previously built image; rebuild the frontend image to update static files or use the dev service.
