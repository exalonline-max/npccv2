#!/usr/bin/env bash
# Helper to run migrations and seeds inside the app environment.
# Usage (local): ./scripts/run_migrations.sh
# Usage (fly): flyctl ssh console -a npccv2-backend -- /app/scripts/run_migrations.sh
set -euo pipefail

echo "Running database migrations and seeds..."
# Ensure virtualenv/venv activation is not required when running in container/fly machine
# Run flask db upgrade if flask-migrate is available
if command -v flask >/dev/null 2>&1; then
  echo "Running: flask db upgrade"
  flask db upgrade
else
  echo "flask CLI not found in PATH, attempting to run via python -m flask"
  python -m flask db upgrade
fi

# Run seeds
if [ -f "/app/backend/seeds.py" ]; then
  echo "Running seeds.py"
  python /app/backend/seeds.py
elif [ -f "./backend/seeds.py" ]; then
  echo "Running ./backend/seeds.py"
  python ./backend/seeds.py
else
  echo "No seeds.py found, skipping."
fi

echo "Migrations and seeds complete."
 
