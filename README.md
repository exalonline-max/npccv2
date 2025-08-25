# NPCChatter (clean scaffold)

This repo is a minimal scaffold for NPCChatter: a D&D-focused app.

Backend: Flask
Frontend: Vite + React

Local dev (backend):

1. python -m venv .venv
2. source .venv/bin/activate
3. pip install -r backend/requirements.txt
4. cd backend && python -c "from app import db, app; import os; with app.app_context(): db.create_all(); print('db created')"
5. FLASK_APP=backend/app.py FLASK_ENV=development flask run

Local dev (frontend):

1. cd frontend
2. npm install
3. npm run dev

This scaffold uses JWTs stored in localStorage for auth. For production, switch to secure cookies and proper secrets.
