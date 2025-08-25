# NPCChatter (clean scaffold)

This repo is a minimal scaffold for NPCChatter: a D&D-focused app.

Backend: Flask
Frontend: Vite + React

Local dev (backend):

1. python -m venv .venv
2. source .venv/bin/activate
3. pip install -r backend/requirements.txt
4. Initialize DB (SQLite for local dev):

```bash
source .venv/bin/activate
PYTHONPATH=backend python3 - <<'PY'
from app import create_app
app = create_app()
with app.app_context():
	from models import db
	db.create_all()
	print('db created')
PY
```

5. Run the backend (development):

```bash
source .venv/bin/activate
PYTHONPATH=backend FLASK_APP=backend.app:app flask run --port 5000
```

Local dev (frontend):

1. cd frontend
2. npm install
3. npm run dev

Database and production notes:

- This scaffold defaults to SQLite locally. For production we recommend Postgres. Set `DATABASE_URL` env var to a Postgres URL.
- Alembic is included for migrations (`alembic.ini` and `migrations/`).
- Frontend is suited for Vercel; backend can be deployed to Fly using the provided `backend/Dockerfile` and `backend/fly.toml`.

Auth:

- For this simple app the scaffold uses JWTs stored in localStorage. For higher security switch to http-only cookies and CSRF protections.
