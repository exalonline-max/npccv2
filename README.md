# NPC Chatter (scaffold)

This scaffold provides a Flask backend and Vite + React frontend with multi-tenant subdomain support for dev using lvh.me.

Run steps (development):

1. Start Postgres

```bash
docker-compose up -d
```

2. Copy envs

```bash
cp .env.example backend/.env
```

3. Backend

```bash
# backend
cd backend
python -m pip install -r requirements.txt
# set the flask app for CLI (module-level `app` exposed in app.py)
export FLASK_APP=app:app
# initialize migrations (first time)
flask db init
# create an initial migration
flask db migrate -m "initial schema (users, accounts, memberships, refresh_tokens)"
# apply migrations
flask db upgrade
# seed test data
python seeds.py
# run backend
flask run --host=0.0.0.0 --port=5000
```

To preview SQL that Alembic will execute for the upgrade without applying it:

```bash
flask db upgrade --sql > ../upgrade.sql
cat ../upgrade.sql
```

To list generated migration files:

```bash
ls -la migrations/versions || true
```

Notes:
- The environment used to scaffold these files didn't have Python available to run migrations here. Run the commands above locally to generate Alembic migration files and SQL.
- After running migrations, re-run `python seeds.py` to populate users/accounts/memberships.

4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Dev domains: use lvh.me. Examples:

- Frontend: http://admintest1.lvh.me:5173
- API: http://api.lvh.me:5000
